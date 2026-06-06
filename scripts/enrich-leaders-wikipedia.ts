import fs from "node:fs";

import { fetchCountryLeadersFromWikipedia } from "../lib/wikipedia-leaders";
import type { CountrySymbolProfile } from "../lib/types";

const profilesPath = "./data/country-symbol-profiles.json";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasWikipediaLeaders(profile: CountrySymbolProfile) {
  return profile.leaders?.some(
    (leader) => leader.titleEn && leader.sourceUrl?.includes("wikipedia.org/wiki/")
  );
}

function applyLeaders(
  profile: CountrySymbolProfile,
  result: Awaited<ReturnType<typeof fetchCountryLeadersFromWikipedia>>
) {
  profile.leaders = result.leaders;
  profile.updatedAt = new Date().toISOString().split("T")[0];

  if (!profile.mainSources.some((source) => source.name === "Wikipedia")) {
    profile.mainSources.unshift({
      name: "Wikipedia",
      url: result.sourceUrl ?? `https://en.wikipedia.org/wiki/${result.pageTitle.replace(/ /g, "_")}`,
      retrievedAt: profile.updatedAt
    });
  }
}

function saveProfiles(profiles: CountrySymbolProfile[]) {
  fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
}

async function enrichProfile(profile: CountrySymbolProfile) {
  const result = await fetchCountryLeadersFromWikipedia(profile.countryNameEn, profile.iso3);
  if (!result.leaders.length) return false;

  applyLeaders(profile, result);
  return true;
}

async function main() {
  const onlyMissing = process.argv.includes("--only-missing");
  const iso3Filter = process.argv.find((arg) => arg.startsWith("--iso3="))?.split("=")[1]?.toUpperCase();

  const profiles = JSON.parse(fs.readFileSync(profilesPath, "utf8")) as CountrySymbolProfile[];
  const targets = profiles.filter((profile) => {
    if (iso3Filter && profile.iso3 !== iso3Filter) return false;
    if (onlyMissing && hasWikipediaLeaders(profile)) return false;
    return true;
  });

  let updated = 0;
  let withImages = 0;

  console.log(
    `Enriching ${targets.length}/${profiles.length} countries${onlyMissing ? " (only missing Wikipedia data)" : ""}...`
  );

  for (let index = 0; index < targets.length; index++) {
    const profile = targets[index];

    try {
      if (await enrichProfile(profile)) {
        updated++;
        if (profile.leaders?.some((leader) => leader.imageUrl)) {
          withImages++;
        }
      }
    } catch (error) {
      console.warn(`Failed ${profile.iso3}:`, error);
    }

    if ((index + 1) % 10 === 0) {
      saveProfiles(profiles);
      console.log(`Processed ${index + 1}/${targets.length} — saved checkpoint`);
    }

    await sleep(220);
  }

  const failedIso3 = profiles
    .filter((profile) => !hasWikipediaLeaders(profile))
    .map((profile) => profile.iso3);

  if (failedIso3.length) {
    console.log(`Retrying ${failedIso3.length} countries without full Wikipedia leader data...`);
    await sleep(3000);

    for (const iso3 of failedIso3) {
      const profile = profiles.find((entry) => entry.iso3 === iso3);
      if (!profile) continue;

      try {
        if (await enrichProfile(profile)) {
          updated++;
        }
      } catch (error) {
        console.warn(`Retry failed ${iso3}:`, error);
      }

      if (updated % 10 === 0) {
        saveProfiles(profiles);
      }

      await sleep(400);
    }
  }

  saveProfiles(profiles);

  const wikipediaSourced = profiles.filter((profile) => hasWikipediaLeaders(profile)).length;

  console.log(`Wikipedia leaders updated for ${updated}/${targets.length} processed countries.`);
  console.log(`Profiles with Wikipedia-sourced leaders: ${wikipediaSourced}/${profiles.length}`);
  console.log(`Countries with leader photos in this run: ${withImages}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
