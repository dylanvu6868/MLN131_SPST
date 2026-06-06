import { getAllCountries } from "@/lib/countries";
import type { CountryPoliticalProfile, GlobalStats } from "@/lib/types";

const trackedMissingFields: (keyof CountryPoliticalProfile)[] = [
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

export function getGlobalStats(groupBy: keyof CountryPoliticalProfile = "regimeCategory"): GlobalStats {
  const countries = getAllCountries();
  const groupedStats = countries.reduce<Record<string, number>>((acc, country) => {
    const key = String(country[groupBy] ?? "Unknown");
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const topRegions = countries.reduce<Record<string, number>>((acc, country) => {
    acc[country.region] = (acc[country.region] ?? 0) + 1;
    return acc;
  }, {});

  const regimeCounts = countries.reduce<Record<string, number>>((acc, country) => {
    const key = country.regimeCategory ?? "Unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const missingDataCount = countries.reduce((sum, country) => {
    const missing = trackedMissingFields.filter((field) => {
      const value = country[field];
      return !value || value === "Needs verification" || value === "Data unavailable";
    });
    return sum + missing.length;
  }, 0);

  const dataUpdatedAt = countries
    .map((country) => country.dataUpdatedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return {
    totalCountries: countries.length,
    groupedStats,
    missingDataCount,
    topRegions,
    regimeCounts,
    dataUpdatedAt
  };
}

