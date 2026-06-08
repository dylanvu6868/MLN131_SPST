import symbolProfiles from "@/data/country-symbol-profiles.json";
import { upsertCountrySymbolProfiles } from "@/lib/db";
import { CountrySymbolProfilesSchema } from "@/lib/validation/country";

const parsed = CountrySymbolProfilesSchema.parse(symbolProfiles);
upsertCountrySymbolProfiles(parsed);
console.log(`Synced ${parsed.length} country symbol profiles into SQLite.`);
