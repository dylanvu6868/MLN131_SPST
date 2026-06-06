import sampleCountries from "@/data/countries.sample.json";
import symbolProfiles from "@/data/country-symbol-profiles.json";
import { initializeDatabase, upsertCountryProfiles, upsertCountrySymbolProfiles } from "@/lib/db";
import { CountryPoliticalProfilesSchema, CountrySymbolProfilesSchema } from "@/lib/validation/country";

const parsed = CountryPoliticalProfilesSchema.parse(sampleCountries);
const parsedSymbolProfiles = CountrySymbolProfilesSchema.parse(symbolProfiles);
initializeDatabase();
upsertCountryProfiles(parsed);
upsertCountrySymbolProfiles(parsedSymbolProfiles);

console.log(`Initialized SQLite database with ${parsed.length} sample profiles.`);
console.log(`Initialized SQLite database with ${parsedSymbolProfiles.length} country symbol profiles.`);
