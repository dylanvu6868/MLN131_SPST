import { readCountryProfilesFromDb, upsertCountryProfiles } from "@/lib/db";
import type { CountryPoliticalProfile, DataSource } from "@/lib/types";

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";
const USER_AGENT = "WorldIdeologyAtlas/1.0 (educational; country political data refresh)";

type BindingValue = { value: string };

type PoliticalBinding = {
  iso3: BindingValue;
  headOfStateLabel?: BindingValue;
  headOfGovernmentLabel?: BindingValue;
  legislatureLabel?: BindingValue;
  basicFormLabel?: BindingValue;
  capitalLabel?: BindingValue;
  population?: BindingValue;
  area?: BindingValue;
  gdp?: BindingValue;
  gdpPerCapita?: BindingValue;
};

type WikidataResponse = {
  results: {
    bindings: PoliticalBinding[];
  };
};

type PoliticalEnrichment = Partial<CountryPoliticalProfile> & {
  basicFormLabel?: string;
};

async function queryWikidata(sparql: string): Promise<WikidataResponse> {
  const params = new URLSearchParams({
    query: sparql,
    format: "json"
  });

  const response = await fetch(`${WIKIDATA_ENDPOINT}?${params}`, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": USER_AGENT
    }
  });

  if (!response.ok) {
    throw new Error(`Wikidata query failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as WikidataResponse;
}

async function fetchPoliticalIndex() {
  const sparql = `
    SELECT ?iso3 ?headOfStateLabel ?headOfGovernmentLabel ?legislatureLabel ?basicFormLabel ?capitalLabel ?population ?area ?gdp ?gdpPerCapita WHERE {
      ?country wdt:P298 ?iso3 .
      OPTIONAL { ?country wdt:P35 ?headOfState . }
      OPTIONAL { ?country wdt:P6 ?headOfGovernment . }
      OPTIONAL { ?country wdt:P194 ?legislature . }
      OPTIONAL { ?country wdt:P122 ?basicForm . }
      OPTIONAL { ?country wdt:P36 ?capital . }
      OPTIONAL { ?country wdt:P1082 ?population . }
      OPTIONAL { ?country wdt:P2046 ?area . }
      OPTIONAL { ?country wdt:P2131 ?gdp . }
      OPTIONAL { ?country wdt:P2132 ?gdpPerCapita . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "vi,en". }
    }
  `;

  const data = await queryWikidata(sparql);
  const index: Record<string, PoliticalEnrichment> = {};

  for (const row of data.results.bindings) {
    const iso3 = row.iso3.value.toUpperCase();
    const current = index[iso3] ?? {};

    index[iso3] = {
      ...current,
      headOfState: firstUseful(current.headOfState, row.headOfStateLabel?.value),
      headOfGovernment: firstUseful(current.headOfGovernment, row.headOfGovernmentLabel?.value),
      legislature: firstUseful(current.legislature, row.legislatureLabel?.value),
      capital: firstUseful(current.capital, row.capitalLabel?.value),
      population: parseNumber(current.population, row.population?.value),
      areaKm2: parseNumber(current.areaKm2, row.area?.value),
      gdp: parseNumber(current.gdp, row.gdp?.value),
      gdpPerCapita: parseNumber(current.gdpPerCapita, row.gdpPerCapita?.value),
      basicFormLabel: firstUseful(current.basicFormLabel, row.basicFormLabel?.value)
    };
  }

  return index;
}

function firstUseful<T extends string | undefined>(existing: T, candidate?: string): T | string | undefined {
  if (existing && existing !== "Needs verification" && existing !== "Unknown" && existing !== "Data unavailable") {
    return existing;
  }
  return candidate?.trim() || existing;
}

function parseNumber(existing?: number, candidate?: string) {
  if (typeof existing === "number" && Number.isFinite(existing) && existing > 0) {
    return existing;
  }
  if (!candidate) return existing;
  const value = Number(candidate);
  return Number.isFinite(value) ? value : existing;
}

function isMissing(value?: string | null) {
  return !value || value === "Needs verification" || value === "Unknown" || value === "Data unavailable";
}

function applyBasicForm(profile: CountryPoliticalProfile, basicForm?: string) {
  const form = (basicForm ?? "").toLowerCase();

  if (!form) return profile;

  const isMonarchy = /monarchy|kingdom|emirate|sultanate|principality|quân chủ|vương quốc|tiểu vương|công quốc/.test(form);
  const isRepublic = /republic|cộng hòa/.test(form);
  const isFederal = /federal|federation|liên bang/.test(form);

  return {
    ...profile,
    isMonarchy: profile.isMonarchy ?? isMonarchy,
    isRepublic: profile.isRepublic ?? (isRepublic || (!isMonarchy ? profile.isRepublic : false)),
    isFederal: profile.isFederal ?? isFederal,
    isUnitary: profile.isUnitary ?? (isFederal ? false : profile.isUnitary),
    stateForm: isMissing(profile.stateForm)
      ? translateBasicForm(basicForm)
      : profile.stateForm,
    governmentSystem: isMissing(profile.governmentSystem)
      ? translateBasicForm(basicForm)
      : profile.governmentSystem
  };
}

function translateBasicForm(value: string) {
  const lower = value.toLowerCase();
  if (lower.includes("federal") && lower.includes("republic")) return "Cộng hòa liên bang";
  if (lower.includes("republic")) return "Cộng hòa";
  if (lower.includes("constitutional monarchy")) return "Quân chủ lập hiến";
  if (lower.includes("absolute monarchy")) return "Quân chủ chuyên chế";
  if (lower.includes("monarchy")) return "Quân chủ";
  return value;
}

function economicModel(profile: CountryPoliticalProfile) {
  if (!isMissing(profile.economicModel)) return profile.economicModel;
  if (profile.gdp || profile.gdpPerCapita) {
    return "Kinh tế hỗn hợp; số liệu GDP được tham chiếu từ Wikidata và cần đối chiếu với World Bank/IMF khi phân tích chuyên sâu";
  }
  return "Kinh tế hỗn hợp; cần đối chiếu thêm nguồn World Bank/IMF/CIA World Factbook";
}

function source(retrievedAt: string, field: string): DataSource {
  return {
    name: "Wikidata",
    url: "https://www.wikidata.org/",
    field,
    retrievedAt
  };
}

function dedupeSources(sources: DataSource[]) {
  const seen = new Set<string>();
  return sources.filter((item) => {
    const key = `${item.name}:${item.url ?? ""}:${item.field ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  const retrievedAt = new Date().toISOString();
  const profiles = readCountryProfilesFromDb();
  if (!profiles.length) {
    throw new Error("Không tìm thấy country_profiles trong SQLite. Hãy chạy npm run init:db và npm run sync:countries trước.");
  }

  console.log(`Đang lấy dữ liệu Wikidata cho ${profiles.length} hồ sơ...`);
  const index = await fetchPoliticalIndex();

  let updated = 0;
  const enriched = profiles.map((profile) => {
    const wd = index[profile.iso3];
    if (!wd) return profile;

    let next: CountryPoliticalProfile = {
      ...profile,
      headOfState: firstUseful(profile.headOfState, wd.headOfState) as string | undefined,
      headOfGovernment: firstUseful(profile.headOfGovernment, wd.headOfGovernment) as string | undefined,
      legislature: firstUseful(profile.legislature, wd.legislature) as string | undefined,
      capital: firstUseful(profile.capital, wd.capital) as string | undefined,
      population: parseNumber(profile.population, String(wd.population ?? "")),
      areaKm2: parseNumber(profile.areaKm2, String(wd.areaKm2 ?? "")),
      gdp: parseNumber(profile.gdp, String(wd.gdp ?? "")),
      gdpPerCapita: parseNumber(profile.gdpPerCapita, String(wd.gdpPerCapita ?? "")),
      headOfStateTitle: isMissing(profile.headOfState) && wd.headOfState ? "Nguyên thủ quốc gia" : profile.headOfStateTitle,
      headOfGovernmentTitle: isMissing(profile.headOfGovernment) && wd.headOfGovernment ? "Người đứng đầu chính phủ" : profile.headOfGovernmentTitle,
      economicModel: profile.economicModel,
      confidenceLevel: profile.confidenceLevel === "unknown" ? "medium" : profile.confidenceLevel,
      dataUpdatedAt: retrievedAt.slice(0, 10),
      sources: dedupeSources([
        ...profile.sources,
        source(retrievedAt, "headOfState"),
        source(retrievedAt, "headOfGovernment"),
        source(retrievedAt, "legislature"),
        source(retrievedAt, "governmentSystem"),
        source(retrievedAt, "gdp"),
        source(retrievedAt, "gdpPerCapita")
      ])
    };

    next = applyBasicForm(next, wd.basicFormLabel);
    next.economicModel = economicModel(next);

    if (wd.headOfState || wd.headOfGovernment || wd.legislature || wd.gdp || wd.gdpPerCapita || wd.basicFormLabel) {
      updated++;
    }

    return next;
  });

  upsertCountryProfiles(enriched);
  console.log(`Đã cập nhật ${updated}/${profiles.length} hồ sơ quốc gia từ Wikidata.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
