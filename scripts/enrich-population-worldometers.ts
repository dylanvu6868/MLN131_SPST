/**
 * Syncs live population and yearly-change rate from Worldometers
 * (https://www.worldometers.info/world-population/population-by-country/) into
 * the SQLite dataset. Run the JSON export afterwards (npm run sync:population
 * and npm run sync:live do both).
 *
 * Usage:  tsx scripts/enrich-population-worldometers.ts
 */
import { syncWorldometersPopulationToDatabase } from "@/lib/data-sync/worldometers";

async function main() {
  console.log("Đang tải dân số realtime từ Worldometers...");
  const result = await syncWorldometersPopulationToDatabase();

  console.log(
    `Dân số: ${result.totalRows} dòng, khớp ${result.matchedCountries} quốc gia (cập nhật ${result.retrievedAt.slice(0, 10)}).`
  );
  console.log(`Tổng dân số thế giới: ${result.worldPopulation.toLocaleString("en-US")} người.`);
  if (result.unmatchedRows.length) {
    console.log(`Không khớp ${result.unmatchedRows.length} dòng: ${result.unmatchedRows.join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
