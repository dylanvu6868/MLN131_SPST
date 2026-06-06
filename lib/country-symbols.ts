import symbolProfiles from "@/data/country-symbol-profiles.json";
import type { CountrySymbolProfile } from "@/lib/types";
import { CountrySymbolProfilesSchema } from "@/lib/validation/country";

const parsedProfiles = CountrySymbolProfilesSchema.parse(symbolProfiles) as CountrySymbolProfile[];

export function getAllCountrySymbolProfiles() {
  return parsedProfiles;
}

export function getCountrySymbolProfile(iso3: string) {
  const normalized = iso3.trim().toUpperCase();
  return parsedProfiles.find((profile) => profile.iso3 === normalized);
}

export function getCountrySymbolProfilesByIso3() {
  return new Map(parsedProfiles.map((profile) => [profile.iso3, profile]));
}
