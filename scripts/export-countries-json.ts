/**
 * Exports all country profiles from SQLite to data/countries.all.json.
 * Run before `next build` so the deployment bundle includes the full dataset
 * without a runtime SQLite dependency.
 *
 * Usage:  tsx scripts/export-countries-json.ts
 * Auto-runs via the "prebuild" npm script.
 */
import fs from "node:fs";
import path from "node:path";

import { readCountryProfilesFromDb } from "@/lib/db";

const outPath = path.resolve(process.cwd(), "data/countries.all.json");

const profiles = readCountryProfilesFromDb();

if (profiles.length === 0) {
  console.error("ERROR: No country profiles found in the database. Aborting export.");
  process.exit(1);
}

fs.writeFileSync(outPath, JSON.stringify(profiles));
console.log(`Exported ${profiles.length} country profiles → ${outPath}`);
