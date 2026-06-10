/**
 * Researches each country's political model via Google search (SerpAPI, with a
 * Firecrawl fallback) grounded into Gemini, and stores the result on the
 * profile: politicalModel (English) + politicalModelVi (Vietnamese, the answer
 * to "Mô hình chính trị của <nước> là gì?"). Re-exports data/countries.all.json.
 *
 * Resumable: countries that already have politicalModelVi are skipped unless
 * --force. Safe to re-run after a quota/rate-limit interruption.
 *
 * Usage:
 *   tsx scripts/enrich-political-model.ts [--force] [--only=VNM,USA] [--limit=N] [--delay=ms]
 *   npm run enrich:political-model
 */
import fs from "node:fs";
import path from "node:path";

import { researchPoliticalModel } from "@/lib/data-sync/political-model";
import { readCountryProfilesFromDb, upsertCountryProfiles } from "@/lib/db";
import type { CountryPoliticalProfile, DataSource } from "@/lib/types";

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = readArg("--only")?.toUpperCase().split(",").map((value) => value.trim()).filter(Boolean);
const limit = Number(readArg("--limit") ?? "0") || 0;
const delayMs = Number(readArg("--delay") ?? "4500") || 4500;

function readArg(name: string) {
  const hit = args.find((arg) => arg.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : undefined;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function dedupeSources(sources: DataSource[]) {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.name}:${source.url ?? ""}:${source.field ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function exportJson(profiles: CountryPoliticalProfile[]) {
  const outPath = path.resolve(process.cwd(), "data/countries.all.json");
  fs.writeFileSync(outPath, JSON.stringify(profiles));
}

async function main() {
  process.loadEnvFile(".env.local");
  const profiles = readCountryProfilesFromDb();
  if (!profiles.length) throw new Error("Không có dữ liệu quốc gia trong SQLite.");

  const targets = profiles.filter((profile) => {
    if (only && !only.includes(profile.iso3)) return false;
    if (!force && profile.politicalModelVi) return false;
    return true;
  });

  const queue = limit > 0 ? targets.slice(0, limit) : targets;
  console.log(
    `Cần nghiên cứu ${queue.length}/${profiles.length} quốc gia (đã có ${profiles.filter((p) => p.politicalModelVi).length}). Delay ${delayMs}ms.`
  );

  const retrievedAt = new Date().toISOString();
  let done = 0;
  let failed = 0;

  for (let index = 0; index < queue.length; index++) {
    const profile = queue[index];
    try {
      const result = await researchPoliticalModel(profile);
      if (result) {
        profile.politicalModel = result.en;
        profile.politicalModelVi = result.vi;
        profile.sources = dedupeSources([
          ...profile.sources,
          { name: "Nghiên cứu web (Google)", url: result.sources[0], field: "politicalModel", retrievedAt }
        ]);
        done++;
        console.log(`[${index + 1}/${queue.length}] ${profile.iso3} → ${result.vi} (${result.confidence})`);
      } else {
        failed++;
        console.log(`[${index + 1}/${queue.length}] ${profile.iso3} → (không có kết quả)`);
      }
    } catch (error) {
      failed++;
      console.log(`[${index + 1}/${queue.length}] ${profile.iso3} LỖI: ${(error as Error).message.slice(0, 120)}`);
    }

    // Checkpoint every 10 successes so progress survives interruptions.
    if (done > 0 && done % 10 === 0) {
      upsertCountryProfiles(profiles);
      exportJson(profiles);
      console.log(`  …checkpoint: đã lưu ${done} kết quả.`);
    }

    if (index < queue.length - 1) {
      await sleep(delayMs);
    }
  }

  upsertCountryProfiles(profiles);
  exportJson(profiles);
  console.log(`Hoàn tất: ${done} cập nhật, ${failed} lỗi. Tổng đã có: ${profiles.filter((p) => p.politicalModelVi).length}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
