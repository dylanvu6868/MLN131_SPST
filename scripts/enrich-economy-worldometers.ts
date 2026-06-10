/**
 * Syncs nominal GDP, GDP growth and GDP per capita from Worldometers
 * (https://www.worldometers.info/gdp/gdp-by-country/) into the SQLite dataset.
 * Run the JSON export afterwards (npm run sync:gdp does both).
 *
 * Usage:  tsx scripts/enrich-economy-worldometers.ts
 */
import { syncWorldometersGdpToDatabase } from "@/lib/data-sync/worldometers";

async function main() {
  console.log("Đang tải GDP realtime từ Worldometers...");
  const result = await syncWorldometersGdpToDatabase();

  console.log(
    `GDP: ${result.totalRows} dòng, khớp ${result.matchedCountries} quốc gia (cập nhật ${result.retrievedAt.slice(0, 10)}).`
  );
  console.log(`Tổng GDP thế giới: ${result.worldGdp.toLocaleString("en-US")} USD.`);
  if (result.unmatchedRows.length) {
    console.log(`Không khớp ${result.unmatchedRows.length} dòng: ${result.unmatchedRows.join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
