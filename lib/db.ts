import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import type { CountryPoliticalProfile, CountrySymbolProfile } from "@/lib/types";

type CountryRow = {
  profile_json: string;
};

type CountrySymbolRow = {
  profile_json: string;
};

const DEFAULT_DB_PATH = "./data/world-ideology-atlas.db";

export function getDatabasePath() {
  return path.resolve(process.cwd(), process.env.ATLAS_DB_PATH ?? DEFAULT_DB_PATH);
}

export function getDatabase(options: { readOnly?: boolean } = {}) {
  const dbPath = getDatabasePath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new DatabaseSync(dbPath, options.readOnly ? { readOnly: true, timeout: 5000 } : { timeout: 5000 });
  if (!options.readOnly) {
    db.exec("PRAGMA journal_mode = WAL");
    db.exec("PRAGMA foreign_keys = ON");
  }
  return db;
}

export function initializeDatabase() {
  const db = getDatabase();
  createSchema(db);
  db.close();
}

function getInitializedDatabase() {
  const db = getDatabase();
  createSchema(db);
  return db;
}

function createSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS country_profiles (
      iso3 TEXT PRIMARY KEY,
      iso2 TEXT NOT NULL,
      country_name TEXT NOT NULL,
      official_name TEXT NOT NULL,
      region TEXT NOT NULL,
      subregion TEXT,
      profile_json TEXT NOT NULL,
      data_updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_country_profiles_name
      ON country_profiles(country_name);

    CREATE INDEX IF NOT EXISTS idx_country_profiles_region
      ON country_profiles(region);

    CREATE TABLE IF NOT EXISTS sync_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      status TEXT NOT NULL,
      total_rows INTEGER DEFAULT 0,
      message TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS country_symbol_profiles (
      iso3 TEXT PRIMARY KEY,
      iso2 TEXT NOT NULL,
      country_name_vi TEXT NOT NULL,
      country_name_en TEXT NOT NULL,
      region_vi TEXT NOT NULL,
      verification_level TEXT NOT NULL,
      profile_json TEXT NOT NULL,
      data_updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_country_symbol_profiles_name_vi
      ON country_symbol_profiles(country_name_vi);

    CREATE INDEX IF NOT EXISTS idx_country_symbol_profiles_verification
      ON country_symbol_profiles(verification_level);
  `);
}

export function upsertCountryProfiles(profiles: CountryPoliticalProfile[]) {
  const db = getInitializedDatabase();
  const insert = db.prepare(`
    INSERT INTO country_profiles (
      iso3,
      iso2,
      country_name,
      official_name,
      region,
      subregion,
      profile_json,
      data_updated_at
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )
    ON CONFLICT(iso3) DO UPDATE SET
      iso2 = excluded.iso2,
      country_name = excluded.country_name,
      official_name = excluded.official_name,
      region = excluded.region,
      subregion = excluded.subregion,
      profile_json = excluded.profile_json,
      data_updated_at = excluded.data_updated_at
  `);

  db.exec("BEGIN IMMEDIATE TRANSACTION");
  try {
    for (const profile of profiles) {
      insert.run(
        profile.iso3,
        profile.iso2,
        profile.countryName,
        profile.officialName,
        profile.region,
        profile.subregion ?? null,
        JSON.stringify(profile),
        profile.dataUpdatedAt
      );
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  } finally {
    db.close();
  }

  logSyncRun("country_profiles", "success", profiles.length, "Upserted country profiles");
}

export function readCountryProfilesFromDb(): CountryPoliticalProfile[] {
  const dbPath = getDatabasePath();
  if (!fs.existsSync(dbPath)) {
    return [];
  }

  const db = getDatabase({ readOnly: true });
  try {
    const rows = db
      .prepare("SELECT profile_json FROM country_profiles ORDER BY country_name ASC")
      .all() as CountryRow[];

    return rows.map((row) => JSON.parse(row.profile_json) as CountryPoliticalProfile);
  } finally {
    db.close();
  }
}

export function upsertCountrySymbolProfiles(profiles: CountrySymbolProfile[]) {
  const db = getInitializedDatabase();
  const insert = db.prepare(`
    INSERT INTO country_symbol_profiles (
      iso3,
      iso2,
      country_name_vi,
      country_name_en,
      region_vi,
      verification_level,
      profile_json,
      data_updated_at
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )
    ON CONFLICT(iso3) DO UPDATE SET
      iso2 = excluded.iso2,
      country_name_vi = excluded.country_name_vi,
      country_name_en = excluded.country_name_en,
      region_vi = excluded.region_vi,
      verification_level = excluded.verification_level,
      profile_json = excluded.profile_json,
      data_updated_at = excluded.data_updated_at
  `);

  db.exec("BEGIN IMMEDIATE TRANSACTION");
  try {
    for (const profile of profiles) {
      insert.run(
        profile.iso3,
        profile.iso2,
        profile.countryNameVi,
        profile.countryNameEn,
        profile.regionVi,
        profile.verificationLevel,
        JSON.stringify(profile),
        profile.updatedAt
      );
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  } finally {
    db.close();
  }

  logSyncRun("country_symbol_profiles", "success", profiles.length, "Upserted country symbol profiles");
}

export function readCountrySymbolProfilesFromDb(): CountrySymbolProfile[] {
  const dbPath = getDatabasePath();
  if (!fs.existsSync(dbPath)) {
    return [];
  }

  const db = getDatabase({ readOnly: true });
  try {
    const rows = db
      .prepare("SELECT profile_json FROM country_symbol_profiles ORDER BY country_name_vi ASC")
      .all() as CountrySymbolRow[];

    return rows.map((row) => JSON.parse(row.profile_json) as CountrySymbolProfile);
  } finally {
    db.close();
  }
}

export function logSyncRun(source: string, status: "success" | "error", totalRows: number, message?: string) {
  const db = getInitializedDatabase();
  db.prepare(
    `INSERT INTO sync_runs (source, status, total_rows, message, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(source, status, totalRows, message ?? null, new Date().toISOString());
  db.close();
}
