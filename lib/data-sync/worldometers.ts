import path from "node:path";

import { clearCountryCache, getAllCountries } from "@/lib/countries";
import { readCountryProfilesFromDb, upsertCountryProfiles } from "@/lib/db";
import type { CountryPoliticalProfile, DataSource } from "@/lib/types";

export const WORLDOMETERS_GDP_URL = "https://www.worldometers.info/gdp/gdp-by-country/";
export const WORLDOMETERS_POPULATION_URL = "https://www.worldometers.info/world-population/population-by-country/";

// Worldometers row slug → ISO3 for rows whose displayed name does not normalize
// to one of our dataset names. Keeps coverage at 100% of each table.
const GDP_SLUG_TO_ISO3: Record<string, string> = {
  czechia: "CZE",
  "cote-d-ivoire": "CIV",
  "china-macao-sar": "MAC",
  congo: "COG",
  "united-states-virgin-islands": "VIR",
  "faeroe-islands": "FRO",
  "cabo-verde": "CPV",
  "turks-and-caicos-islands": "TCA",
  "saint-vincent-and-the-grenadines": "VCT",
  "sao-tome-and-principe": "STP",
  "saint-kitts-and-nevis": "KNA"
};

const POPULATION_SLUG_TO_ISO3: Record<string, string> = {
  ...GDP_SLUG_TO_ISO3,
  "wallis-and-futuna-islands": "WLF",
  "saint-pierre-and-miquelon": "SPM",
  "saint-helena": "SHN",
  "holy-see": "VAT"
};

export type WorldometersGdpRow = {
  slug: string;
  name: string;
  gdp: number; // nominal GDP in USD (full value)
  gdpGrowthRate?: number; // annual growth, percent (e.g. 2.32)
  gdpPerCapita?: number; // USD per person
};

export type WorldometersPopulationRow = {
  slug: string;
  name: string;
  population: number;
  populationGrowthRate?: number; // yearly change, percent (e.g. 0.87)
};

type RawTableRow = { slug: string; name: string; orders: (number | undefined)[] };

// ---------------------------------------------------------------------------
// Fetch + parse
// ---------------------------------------------------------------------------

async function fetchWorldometersHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; WorldIdeologyAtlas/1.0; +https://www.worldometers.info/)",
      Accept: "text/html"
    },
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`Worldometers fetch failed (${url}): ${response.status} ${response.statusText}`);
  }
  return response.text();
}

/** Low-level: parses the first datatable's <tbody> into rows of `data-order` ints. */
export function parseWorldometersTable(html: string): RawTableRow[] {
  const start = html.indexOf("<tbody>");
  const end = html.indexOf("</tbody>", start);
  if (start === -1 || end === -1) {
    throw new Error("Worldometers data table not found in HTML.");
  }

  const body = html.slice(start, end);
  const rows: RawTableRow[] = [];

  for (const rowMatch of body.matchAll(/<tr id="([^"]*)">([\s\S]*?)<\/tr>/g)) {
    const cells = [...rowMatch[2].matchAll(/<td([^>]*)>([\s\S]*?)<\/td>/g)];
    if (cells.length < 2) {
      continue;
    }
    rows.push({
      slug: rowMatch[1],
      name: stripTags(cells[1][2]),
      orders: cells.map((cell) => orderOf(cell[1]))
    });
  }

  if (!rows.length) {
    throw new Error("Worldometers data table parsed to zero rows.");
  }
  return rows;
}

export function parseWorldometersGdp(html: string): WorldometersGdpRow[] {
  // Columns: # | Country | GDP | GDP (full value) | GDP growth | GDP per capita
  const rows: WorldometersGdpRow[] = [];
  for (const row of parseWorldometersTable(html)) {
    const gdp = scale(row.orders[3], 10_000); // data-order = USD * 10,000
    const growth = scale(row.orders[4], 100); // data-order = percent * 100
    const perCapita = scale(row.orders[5], 10_000);
    if (!row.name || !Number.isFinite(gdp ?? NaN) || (gdp ?? 0) <= 0) {
      continue;
    }
    rows.push({
      slug: row.slug,
      name: row.name,
      gdp: Math.round(gdp as number),
      gdpGrowthRate: round2(growth),
      gdpPerCapita: (perCapita ?? 0) > 0 ? round2(perCapita) : undefined
    });
  }
  return rows;
}

export function parseWorldometersPopulation(html: string): WorldometersPopulationRow[] {
  // Columns: # | Country | Population | Yearly Change | Net Change | ...
  const rows: WorldometersPopulationRow[] = [];
  for (const row of parseWorldometersTable(html)) {
    const population = scale(row.orders[2], 10_000); // data-order = people * 10,000
    const growth = scale(row.orders[3], 100); // data-order = percent * 100
    if (!row.name || !Number.isFinite(population ?? NaN) || (population ?? 0) <= 0) {
      continue;
    }
    rows.push({
      slug: row.slug,
      name: row.name,
      population: Math.round(population as number),
      populationGrowthRate: round2(growth)
    });
  }
  return rows;
}

export async function fetchWorldometersGdp(): Promise<WorldometersGdpRow[]> {
  return parseWorldometersGdp(await fetchWorldometersHtml(WORLDOMETERS_GDP_URL));
}

export async function fetchWorldometersPopulation(): Promise<WorldometersPopulationRow[]> {
  return parseWorldometersPopulation(await fetchWorldometersHtml(WORLDOMETERS_POPULATION_URL));
}

// ---------------------------------------------------------------------------
// Matching to our ISO3 dataset
// ---------------------------------------------------------------------------

export function mapRowsToIso3<T extends { slug: string; name: string }>(
  rows: T[],
  profiles: CountryPoliticalProfile[],
  slugAliases: Record<string, string>
): Map<string, T> {
  const nameToIso3 = new Map<string, string>();
  for (const profile of profiles) {
    for (const candidate of [profile.countryName, profile.englishName, profile.officialName]) {
      if (!candidate) {
        continue;
      }
      const key = normalizeName(candidate);
      if (!nameToIso3.has(key)) {
        nameToIso3.set(key, profile.iso3);
      }
    }
  }

  const result = new Map<string, T>();
  for (const row of rows) {
    const iso3 = slugAliases[row.slug] ?? nameToIso3.get(normalizeName(row.name));
    if (iso3 && !result.has(iso3)) {
      result.set(iso3, row);
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Database sync
// ---------------------------------------------------------------------------

export type WorldometersSyncResult = {
  source: string;
  retrievedAt: string;
  totalRows: number;
  matchedCountries: number;
  unmatchedRows: string[];
  dbPath: string;
};

export async function syncWorldometersGdpToDatabase(): Promise<WorldometersSyncResult & { worldGdp: number }> {
  const retrievedAt = new Date().toISOString();
  const rows = await fetchWorldometersGdp();
  const profiles = requireProfiles();
  const index = mapRowsToIso3(rows, profiles, GDP_SLUG_TO_ISO3);

  const next = profiles.map((profile) => applyGdpRow(profile, index.get(profile.iso3), retrievedAt));
  upsertCountryProfiles(next);
  clearCountryCache();

  return {
    ...summarize(rows, index, retrievedAt, WORLDOMETERS_GDP_URL),
    worldGdp: rows.reduce((sum, row) => sum + row.gdp, 0)
  };
}

export async function syncWorldometersPopulationToDatabase(): Promise<WorldometersSyncResult & { worldPopulation: number }> {
  const retrievedAt = new Date().toISOString();
  const rows = await fetchWorldometersPopulation();
  const profiles = requireProfiles();
  const index = mapRowsToIso3(rows, profiles, POPULATION_SLUG_TO_ISO3);

  const next = profiles.map((profile) => applyPopulationRow(profile, index.get(profile.iso3), retrievedAt));
  upsertCountryProfiles(next);
  clearCountryCache();

  return {
    ...summarize(rows, index, retrievedAt, WORLDOMETERS_POPULATION_URL),
    worldPopulation: rows.reduce((sum, row) => sum + row.population, 0)
  };
}

export function applyGdpRow(
  profile: CountryPoliticalProfile,
  row: WorldometersGdpRow | undefined,
  retrievedAt: string
): CountryPoliticalProfile {
  if (!row) {
    return profile;
  }
  const next: CountryPoliticalProfile = { ...profile, gdp: row.gdp, gdpUpdatedAt: retrievedAt };
  if (typeof row.gdpPerCapita === "number") {
    next.gdpPerCapita = row.gdpPerCapita;
  } else if (typeof profile.population === "number" && profile.population > 0) {
    next.gdpPerCapita = round2(row.gdp / profile.population);
  }
  if (typeof row.gdpGrowthRate === "number") {
    next.gdpGrowthRate = row.gdpGrowthRate;
  }
  next.sources = dedupeSources([...profile.sources, worldometersSource(retrievedAt, "gdp", WORLDOMETERS_GDP_URL)]);
  next.dataUpdatedAt = retrievedAt.slice(0, 10);
  return next;
}

export function applyPopulationRow(
  profile: CountryPoliticalProfile,
  row: WorldometersPopulationRow | undefined,
  retrievedAt: string
): CountryPoliticalProfile {
  if (!row) {
    return profile;
  }
  const next: CountryPoliticalProfile = {
    ...profile,
    population: row.population,
    populationUpdatedAt: retrievedAt
  };
  if (typeof row.populationGrowthRate === "number") {
    next.populationGrowthRate = row.populationGrowthRate;
  }
  next.sources = dedupeSources([
    ...profile.sources,
    worldometersSource(retrievedAt, "population", WORLDOMETERS_POPULATION_URL)
  ]);
  next.dataUpdatedAt = retrievedAt.slice(0, 10);
  return next;
}

// ---------------------------------------------------------------------------
// Live snapshot (no DB writes) — powers the realtime frontend counters
// ---------------------------------------------------------------------------

export type WorldometersLiveCountry = {
  gdp?: number;
  gdpPerCapita?: number;
  gdpGrowthRate?: number;
  population?: number;
  populationGrowthRate?: number;
};

export async function getWorldometersLiveSnapshot() {
  const profiles = getAllCountries();
  const [gdpRows, populationRows] = await Promise.all([
    fetchWorldometersGdp().catch(() => [] as WorldometersGdpRow[]),
    fetchWorldometersPopulation().catch(() => [] as WorldometersPopulationRow[])
  ]);

  const gdpIndex = mapRowsToIso3(gdpRows, profiles, GDP_SLUG_TO_ISO3);
  const populationIndex = mapRowsToIso3(populationRows, profiles, POPULATION_SLUG_TO_ISO3);

  const countries: Record<string, WorldometersLiveCountry> = {};
  for (const [iso3, row] of gdpIndex) {
    countries[iso3] = {
      gdp: row.gdp,
      gdpPerCapita: row.gdpPerCapita,
      gdpGrowthRate: row.gdpGrowthRate
    };
  }
  for (const [iso3, row] of populationIndex) {
    countries[iso3] = {
      ...countries[iso3],
      population: row.population,
      populationGrowthRate: row.populationGrowthRate
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    sources: { gdp: WORLDOMETERS_GDP_URL, population: WORLDOMETERS_POPULATION_URL },
    world: {
      gdp: gdpRows.reduce((sum, row) => sum + row.gdp, 0),
      population: populationRows.reduce((sum, row) => sum + row.population, 0)
    },
    countries
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function requireProfiles(): CountryPoliticalProfile[] {
  const profiles = readCountryProfilesFromDb();
  if (!profiles.length) {
    throw new Error("Không có dữ liệu quốc gia trong SQLite.");
  }
  return profiles;
}

function summarize(
  rows: Array<{ slug: string; name: string }>,
  index: Map<string, { slug: string; name: string }>,
  retrievedAt: string,
  source: string
): WorldometersSyncResult {
  const mapped = new Set(index.values());
  return {
    source,
    retrievedAt,
    totalRows: rows.length,
    matchedCountries: index.size,
    unmatchedRows: rows.filter((row) => !mapped.has(row)).map((row) => row.name),
    dbPath: path.resolve(process.cwd(), process.env.ATLAS_DB_PATH ?? "./data/world-ideology-atlas.db")
  };
}

function worldometersSource(retrievedAt: string, field: string, url: string): DataSource {
  return { name: "Worldometers", url, field, retrievedAt };
}

function orderOf(attrs: string): number | undefined {
  const match = attrs.match(/data-order="(-?[\d.]+)"/);
  if (!match) {
    return undefined;
  }
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : undefined;
}

function scale(order: number | undefined, divisor: number): number | undefined {
  return typeof order === "number" ? order / divisor : undefined;
}

function round2(value: number | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value * 100) / 100 : undefined;
}

function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function stripTags(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeSources(sources: DataSource[]): DataSource[] {
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
