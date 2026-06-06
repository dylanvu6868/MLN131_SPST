import { syncCountriesToDatabase } from "@/lib/data-sync/restcountries";

const includeWikidata = !process.argv.includes("--no-wikidata");

syncCountriesToDatabase({ includeWikidata })
  .then((result) => {
    console.log(`Synced ${result.total} country profiles into ${result.dbPath}`);
    console.log(`Missing data report: ${result.missingDataReport}`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

