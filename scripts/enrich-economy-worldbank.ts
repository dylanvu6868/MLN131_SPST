import { readCountryProfilesFromDb, upsertCountryProfiles } from "@/lib/db";
import type { CountryPoliticalProfile, DataSource } from "@/lib/types";

const indicators = {
  gdp: "NY.GDP.MKTP.CD",
  gdpPerCapita: "NY.GDP.PCAP.CD"
} as const;

type IndicatorKey = keyof typeof indicators;

type WorldBankRow = {
  countryiso3code?: string;
  date?: string;
  value?: number | null;
};

function source(field: string): DataSource {
  return {
    name: "World Bank DataBank",
    url: "https://data.worldbank.org/",
    field,
    retrievedAt: new Date().toISOString()
  };
}

function isMissingNumber(value?: number) {
  return typeof value !== "number" || !Number.isFinite(value) || value <= 0;
}

async function fetchIndicator(indicator: string) {
  const values = new Map<string, { value: number; year: string }>();
  let page = 1;
  let pages = 1;

  do {
    const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&per_page=20000&page=${page}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) {
      throw new Error(`World Bank fetch failed ${indicator}: ${response.status}`);
    }

    const payload = (await response.json()) as [
      { pages?: number },
      WorldBankRow[]
    ];
    pages = payload[0]?.pages ?? 1;

    for (const row of payload[1] ?? []) {
      const iso3 = row.countryiso3code?.trim().toUpperCase();
      if (!iso3 || iso3.length !== 3 || row.value === null || row.value === undefined || !row.date) continue;
      const existing = values.get(iso3);
      if (!existing || Number(row.date) > Number(existing.year)) {
        values.set(iso3, { value: row.value, year: row.date });
      }
    }

    page++;
  } while (page <= pages);

  return values;
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
  const profiles = readCountryProfilesFromDb();
  if (!profiles.length) throw new Error("Không có dữ liệu quốc gia trong SQLite.");

  console.log("Đang tải GDP và GDP/người từ World Bank...");
  const gdp = await fetchIndicator(indicators.gdp);
  const gdpPerCapita = await fetchIndicator(indicators.gdpPerCapita);

  let updatedGdp = 0;
  let updatedGdppc = 0;

  const next = profiles.map((profile): CountryPoliticalProfile => {
    const p = { ...profile };
    const wbGdp = gdp.get(p.iso3);
    const wbGdppc = gdpPerCapita.get(p.iso3);

    if (wbGdp && (isMissingNumber(p.gdp) || wbGdp.value !== p.gdp)) {
      p.gdp = Math.round(wbGdp.value);
      updatedGdp++;
    }

    if (wbGdppc && (isMissingNumber(p.gdpPerCapita) || Math.abs(wbGdppc.value - (p.gdpPerCapita ?? 0)) > 1)) {
      p.gdpPerCapita = Math.round(wbGdppc.value * 100) / 100;
      updatedGdppc++;
    } else if (isMissingNumber(p.gdpPerCapita) && typeof p.gdp === "number" && typeof p.population === "number" && p.population > 0) {
      p.gdpPerCapita = Math.round((p.gdp / p.population) * 100) / 100;
      updatedGdppc++;
    }

    p.sources = dedupeSources([...p.sources, source("gdp"), source("gdpPerCapita")]);
    p.dataUpdatedAt = new Date().toISOString().slice(0, 10);
    return p;
  });

  upsertCountryProfiles(next);
  console.log(`World Bank updated GDP: ${updatedGdp}, GDP/người: ${updatedGdppc}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
