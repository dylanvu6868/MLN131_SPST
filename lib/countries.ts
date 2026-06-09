import allCountriesData from "@/data/countries.all.json";
import sampleCountries from "@/data/countries.sample.json";
import { enrichPoliticalDefaults } from "@/lib/regime-classification";
import type {
  CountryPoliticalProfile,
  CountrySearchFilters,
  CountrySearchResult,
  DataSource
} from "@/lib/types";
import { CountryPoliticalProfilesSchema } from "@/lib/validation/country";

const booleanFilterKeys = [
  "hasCommunistRulingParty",
  "hasMilitaryGovernment",
  "isMonarchy",
  "isRepublic",
  "isFederal",
  "isUnitary"
] as const;

let countryCache: {
  profiles: CountryPoliticalProfile[];
  cachedAt: number;
} | null = null;

const COUNTRY_CACHE_MS = 10_000;

export function getFallbackCountries() {
  return CountryPoliticalProfilesSchema.parse(sampleCountries);
}

export function getAllCountries(): CountryPoliticalProfile[] {
  if (countryCache && Date.now() - countryCache.cachedAt < COUNTRY_CACHE_MS) {
    return countryCache.profiles;
  }

  try {
    const profiles = CountryPoliticalProfilesSchema.parse(allCountriesData).map(enrichPoliticalDefaults);
    countryCache = { profiles, cachedAt: Date.now() };
    return profiles;
  } catch (error) {
    console.warn("Falling back to sample countries because countries.all.json failed to parse:", error);
  }

  const profiles = getFallbackCountries().map(enrichPoliticalDefaults);
  countryCache = { profiles, cachedAt: Date.now() };
  return profiles;
}

export function clearCountryCache() {
  countryCache = null;
}

export function findCountry(query: string, countries = getAllCountries()) {
  const needle = normalize(query);
  if (!needle) {
    return null;
  }

  return (
    countries.find((country) => {
      const names = [
        country.iso2,
        country.iso3,
        country.countryName,
        country.officialName,
        country.englishName,
        country.nativeName
      ]
        .filter(Boolean)
        .map((value) => normalize(String(value)));

      return names.includes(needle);
    }) ??
    countries.find((country) => {
      const haystack = normalize(`${country.countryName} ${country.officialName} ${country.englishName}`);
      return haystack.includes(needle);
    }) ??
    null
  );
}

export function searchCountries(filters: CountrySearchFilters = {}): CountrySearchResult {
  const page = Math.max(1, Number(filters.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(filters.limit ?? 24)));
  let results = [...getAllCountries()];

  if (filters.search) {
    const needle = normalize(filters.search);
    results = results.filter((country) =>
      normalize(
        `${country.countryName} ${country.officialName} ${country.englishName} ${country.iso2} ${country.iso3}`
      ).includes(needle)
    );
  }

  for (const key of ["region", "subregion", "regimeCategory", "officialIdeology", "governmentSystem", "stateForm"] as const) {
    const value = filters[key];
    if (value) {
      results = results.filter((country) => normalize(String(country[key] ?? "")) === normalize(value));
    }
  }

  for (const key of booleanFilterKeys) {
    if (typeof filters[key] === "boolean") {
      results = results.filter((country) => country[key] === filters[key]);
    }
  }

  results.sort(getSorter(filters.sort));

  const total = results.length;
  const start = (page - 1) * limit;

  return {
    data: results.slice(start, start + limit),
    total,
    page,
    limit
  };
}

export function compareCountries(countryQueries: string[], fields?: string[]) {
  const countries = countryQueries
    .slice(0, 4)
    .map((query) => findCountry(query))
    .filter((country): country is CountryPoliticalProfile => Boolean(country));

  const defaultFields = [
    "countryName",
    "region",
    "stateForm",
    "governmentSystem",
    "officialIdeology",
    "regimeCategory",
    "rulingParty",
    "headOfState",
    "headOfGovernment",
    "legislature",
    "economicModel",
    "confidenceLevel"
  ];

  const selectedFields = fields?.length ? fields : defaultFields;

  return {
    comparisonTable: countries.map((country) => {
      const row: Record<string, unknown> = {
        iso3: country.iso3,
        flagEmoji: country.flagEmoji
      };
      for (const field of selectedFields) {
        row[field] = country[field as keyof CountryPoliticalProfile] ?? "Chưa có dữ liệu";
      }
      return row;
    }),
    notes: [
      "Phân loại chính trị có thể khác nhau tùy nguồn.",
      "Các dòng đánh dấu cần xác minh nên được kiểm tra với nguồn chính thống hoặc nguồn thiết chế hiện hành."
    ],
    sources: collectSources(countries)
  };
}

export function getSourcesForField(countryQuery: string, field: string) {
  const country = findCountry(countryQuery);
  if (!country) {
    return null;
  }

  return {
    country: country.countryName,
    field,
    value: country[field as keyof CountryPoliticalProfile] ?? "Chưa có dữ liệu",
    sources: country.sources.filter((source) => !source.field || source.field === field),
    dataUpdatedAt: country.dataUpdatedAt,
    confidenceLevel: country.confidenceLevel
  };
}

function collectSources(countries: CountryPoliticalProfile[]): DataSource[] {
  const seen = new Set<string>();
  const sources: DataSource[] = [];

  for (const country of countries) {
    for (const source of country.sources) {
      const key = `${source.name}:${source.url ?? ""}:${source.field ?? ""}`;
      if (!seen.has(key)) {
        seen.add(key);
        sources.push(source);
      }
    }
  }

  return sources;
}

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getSorter(sort?: string) {
  return (a: CountryPoliticalProfile, b: CountryPoliticalProfile) => {
    switch (sort) {
      case "population":
        return (b.population ?? 0) - (a.population ?? 0);
      case "democracyScore":
        return (b.democracyScore ?? -1) - (a.democracyScore ?? -1);
      case "gdp":
        return (b.gdp ?? 0) - (a.gdp ?? 0);
      case "name-desc":
        return b.countryName.localeCompare(a.countryName);
      case "name":
      default:
        return a.countryName.localeCompare(b.countryName);
    }
  };
}
