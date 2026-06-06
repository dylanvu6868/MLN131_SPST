import fs from "node:fs";
import path from "node:path";

import politicalOverrides from "@/data/political-overrides.json";
import { clearCountryCache } from "@/lib/countries";
import { upsertCountryProfiles } from "@/lib/db";
import { fetchWikidataPoliticalIndex } from "@/lib/data-sync/wikidata";
import type { CountryPoliticalProfile, DataSource, Region } from "@/lib/types";
import { CountryPoliticalProfilesSchema } from "@/lib/validation/country";

type RestCountry = {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official?: string; common?: string }>;
  };
  cca2: string;
  cca3: string;
  ccn3?: string;
  capital?: string[];
  population?: number;
  region?: string;
  subregion?: string;
  area?: number;
  latlng?: [number, number];
  languages?: Record<string, string>;
  currencies?: Record<string, { name?: string; symbol?: string }>;
  flags?: {
    svg?: string;
    png?: string;
    alt?: string;
  };
  flag?: string;
};

type SyncOptions = {
  includeWikidata?: boolean;
};

type PoliticalOverrides = Record<string, Partial<CountryPoliticalProfile>>;

const REST_COUNTRIES_BASE_URL =
  "https://restcountries.com/v3.1/all?fields=name,cca2,cca3,ccn3,capital,population,region,subregion,area,latlng";
const REST_COUNTRIES_EXTRA_URL = "https://restcountries.com/v3.1/all?fields=cca3,languages,currencies,flags,flag";

const basePoliticalDefaults: Partial<CountryPoliticalProfile> = {
  stateForm: "Needs verification",
  governmentSystem: "Needs verification",
  constitutionalIdentity: "Needs verification",
  officialIdeology: "Needs verification",
  ideologyFamily: ["Needs verification"],
  politicalRegime: "Needs verification",
  regimeCategory: "Unknown",
  powerStructure: "Needs verification",
  rulingParty: "Needs verification",
  partySystem: "Needs verification",
  headOfStateTitle: "Needs verification",
  headOfState: "Needs verification",
  headOfGovernmentTitle: "Needs verification",
  headOfGovernment: "Needs verification",
  legislature: "Needs verification",
  legislatureStructure: "Unknown",
  judiciary: "Needs verification",
  constitution: "Needs verification",
  economicModel: "Needs verification",
  hasCommunistRulingParty: false,
  hasMilitaryGovernment: false,
  isMonarchy: undefined,
  isRepublic: undefined,
  isFederal: undefined,
  isUnitary: undefined,
  notes: [
    "Political fields are initialized conservatively and require source review.",
    "Classifications may differ across datasets and should not be reduced to a single label."
  ],
  confidenceLevel: "unknown"
};

export async function fetchRestCountriesData(): Promise<RestCountry[]> {
  const [baseCountries, extraCountries] = await Promise.all([
    fetchRestCountriesPage(REST_COUNTRIES_BASE_URL),
    fetchRestCountriesPage(REST_COUNTRIES_EXTRA_URL)
  ]);

  const extrasByIso3 = new Map(extraCountries.map((country) => [country.cca3, country]));
  return baseCountries.map((country) => ({
    ...country,
    ...(extrasByIso3.get(country.cca3) ?? {})
  }));
}

async function fetchRestCountriesPage(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`REST Countries fetch failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as RestCountry[];
}

export async function syncCountriesToDatabase(options: SyncOptions = {}) {
  const retrievedAt = new Date().toISOString();
  const restCountries = await fetchRestCountriesData();
  const wikidataIndex = options.includeWikidata ? await safeFetchWikidataIndex() : {};
  const overrides = politicalOverrides as PoliticalOverrides;

  const profiles = restCountries
    .filter((country) => country.cca2 && country.cca3)
    .map((country) => normalizeRestCountry(country, retrievedAt))
    .map((profile) => mergeProfile(profile, overrides[profile.iso3]))
    .map((profile) => mergeProfile(profile, wikidataIndex[profile.iso3]))
    .sort((a, b) => a.countryName.localeCompare(b.countryName));

  const parsed = CountryPoliticalProfilesSchema.parse(profiles);
  upsertCountryProfiles(parsed);
  clearCountryCache();
  writeMissingDataReport(parsed);

  return {
    total: parsed.length,
    dbPath: path.resolve(process.cwd(), process.env.ATLAS_DB_PATH ?? "./data/world-ideology-atlas.db"),
    missingDataReport: "./data/missing-data-report.json",
    retrievedAt
  };
}

function normalizeRestCountry(country: RestCountry, retrievedAt: string): CountryPoliticalProfile {
  const iso2 = country.cca2.toUpperCase();
  const iso3 = country.cca3.toUpperCase();
  const nativeName = Object.values(country.name.nativeName ?? {})[0]?.common;
  const sources: DataSource[] = [
    {
      name: "REST Countries",
      url: "https://restcountries.com/",
      retrievedAt
    }
  ];

  return {
    ...basePoliticalDefaults,
    id: iso2.toLowerCase(),
    iso2,
    iso3,
    numericCode: country.ccn3,
    countryName: country.name.common,
    officialName: country.name.official,
    nativeName,
    englishName: country.name.common,
    flagEmoji: country.flag ?? countryCodeToEmoji(iso2),
    flagSvgUrl: country.flags?.svg,
    region: normalizeRegion(country.region),
    subregion: country.subregion,
    capital: country.capital?.[0],
    population: country.population,
    areaKm2: country.area,
    coordinates: Array.isArray(country.latlng)
      ? {
          lat: country.latlng[0],
          lng: country.latlng[1]
        }
      : undefined,
    languages: Object.values(country.languages ?? {}),
    currencies: Object.values(country.currencies ?? {})
      .map((currency) => currency.name)
      .filter((value): value is string => Boolean(value)),
    sources,
    dataUpdatedAt: retrievedAt.slice(0, 10),
    confidenceLevel: "unknown"
  };
}

function mergeProfile(
  profile: CountryPoliticalProfile,
  overlay?: Partial<CountryPoliticalProfile>
): CountryPoliticalProfile {
  if (!overlay) {
    return profile;
  }

  const sources = dedupeSources([...(profile.sources ?? []), ...(overlay.sources ?? [])]);
  const notes = dedupeStrings([...(profile.notes ?? []), ...(overlay.notes ?? [])]);
  const ideologyFamily = dedupeStrings([...(profile.ideologyFamily ?? []), ...(overlay.ideologyFamily ?? [])]).filter(
    (value) => value !== "Needs verification" || !overlay.ideologyFamily?.length
  );

  return {
    ...profile,
    ...overlay,
    sources,
    notes,
    ideologyFamily,
    dataUpdatedAt: overlay.dataUpdatedAt ?? profile.dataUpdatedAt,
    confidenceLevel: overlay.confidenceLevel ?? profile.confidenceLevel
  };
}

async function safeFetchWikidataIndex() {
  try {
    return await fetchWikidataPoliticalIndex();
  } catch (error) {
    console.warn("Wikidata enrichment skipped:", error);
    return {};
  }
}

function writeMissingDataReport(profiles: CountryPoliticalProfile[]) {
  const fields: (keyof CountryPoliticalProfile)[] = [
    "officialIdeology",
    "governmentSystem",
    "stateForm",
    "politicalRegime",
    "rulingParty",
    "headOfState",
    "headOfGovernment",
    "legislature",
    "economicModel"
  ];

  const report = {
    generatedAt: new Date().toISOString(),
    missingFields: profiles
      .map((country) => ({
        country: country.countryName,
        iso3: country.iso3,
        fields: fields.filter((field) => {
          const value = country[field];
          return !value || value === "Needs verification" || value === "Data unavailable";
        })
      }))
      .filter((entry) => entry.fields.length > 0)
  };

  const reportPath = path.resolve(process.cwd(), "data/missing-data-report.json");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

function normalizeRegion(region?: string): Region {
  if (!region) {
    return "Unknown";
  }

  if (region === "Americas") {
    return "Americas";
  }

  if (["Africa", "Asia", "Europe", "Oceania", "Antarctic"].includes(region)) {
    return region as Region;
  }

  return "Unknown";
}

function countryCodeToEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function dedupeSources(sources: DataSource[]) {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.name}:${source.url ?? ""}:${source.field ?? ""}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function dedupeStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}
