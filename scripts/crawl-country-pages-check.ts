import { readCountryProfilesFromDb } from "@/lib/db";

const baseUrl = process.argv.find((arg) => arg.startsWith("--base="))?.split("=")[1] ?? "http://localhost:3002";
const banned = ["Cần xác minh", "Chưa xác định", "Needs verification", "Unknown", "Data unavailable"];

async function main() {
  const countries = readCountryProfilesFromDb();
  let bad = 0;
  let failed = 0;

  for (let index = 0; index < countries.length; index++) {
    const country = countries[index];
    const url = `${baseUrl}/countries/${country.iso3}`;
    try {
      const response = await fetch(url);
      const html = await response.text();
      const hits = banned.filter((term) => html.includes(term));
      if (!response.ok || hits.length) {
        bad++;
        console.log(`${country.iso3} HTTP ${response.status} ${hits.join("|")}`);
      }
    } catch (error) {
      failed++;
      console.log(`${country.iso3} FAILED ${error instanceof Error ? error.message : String(error)}`);
    }

    if ((index + 1) % 25 === 0) {
      console.log(`Checked ${index + 1}/${countries.length}`);
    }
  }

  console.log(`Done. Bad pages: ${bad}. Failed requests: ${failed}. Total: ${countries.length}.`);
  if (bad || failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
