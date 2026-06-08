import fs from "node:fs";

import { searchCommonsImage, resolveCommonsDirectUrl, toCommonsFilePathUrl } from "../lib/wikimedia-media";
import type { CountrySymbolProfile, CountrySymbolSection } from "../lib/types";

const profilesPath = "./data/country-symbol-profiles.json";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isBadImage(url?: string) {
  return !url || url.includes("picsum.photos") || url.includes("placeholder") || url.includes("example.com");
}

async function firstImage(queries: string[]) {
  for (const query of queries) {
    const url = await searchCommonsImage(query);
    if (url) return url;
    await sleep(90);
  }
  return undefined;
}

async function resolveOrSearch(section: CountrySymbolSection, queries: string[]) {
  if (!isBadImage(section.imageUrl)) {
    const direct = await resolveCommonsDirectUrl(section.imageUrl!);
    section.imageUrl = direct ?? section.imageUrl;
    return false;
  }

  const found = await firstImage(queries);
  if (!found) return false;

  section.imageUrl = found;
  section.sourceUrl ??= toCommonsFilePathUrl(found.split("/").pop() ?? "");
  return true;
}

function cultureQueries(profile: CountrySymbolProfile) {
  return [
    `${profile.countryNameEn} culture`,
    `${profile.countryNameEn} traditional dance`,
    `${profile.countryNameEn} traditional costume`,
    `${profile.countryNameEn} festival`,
    `${profile.countryNameEn} people culture`,
    `${profile.countryNameEn} UNESCO heritage`,
    `${profile.countryNameEn} landmark`
  ];
}

function historyQueries(profile: CountrySymbolProfile) {
  return [
    `${profile.countryNameEn} historical monument`,
    `${profile.countryNameEn} ancient ruins`,
    `${profile.countryNameEn} old city`,
    `${profile.countryNameEn} archaeological site`,
    `${profile.countryNameEn} historic architecture`,
    `${profile.countryNameEn} UNESCO heritage`,
    `${profile.countryNameEn} museum history`
  ];
}

function residenceQueries(profile: CountrySymbolProfile) {
  const residence = profile.sections.headResidence;
  const official = residence.officialName?.split("/").pop()?.trim() || residence.officialName;
  return [
    official ? `${official} ${profile.countryNameEn}` : "",
    profile.sections.headResidence.city ? `${profile.sections.headResidence.city} presidential palace` : "",
    `${profile.countryNameEn} presidential palace`,
    `${profile.countryNameEn} government house`,
    `${profile.countryNameEn} state house`,
    `${profile.countryNameEn} parliament building`,
    `${profile.countryNameEn} capital city government building`
  ].filter(Boolean);
}

function emblemQueries(profile: CountrySymbolProfile) {
  return [
    `Coat of arms of ${profile.countryNameEn}`,
    `Emblem of ${profile.countryNameEn}`,
    `Flag of ${profile.countryNameEn}`,
    `${profile.countryNameEn} flag`
  ];
}

async function main() {
  const profiles = JSON.parse(fs.readFileSync(profilesPath, "utf8")) as CountrySymbolProfile[];

  let emblem = 0;
  let residence = 0;
  let culture = 0;
  let history = 0;

  for (let index = 0; index < profiles.length; index++) {
    const profile = profiles[index];

    if (await resolveOrSearch(profile.sections.emblem, emblemQueries(profile))) emblem++;
    if (await resolveOrSearch(profile.sections.headResidence, residenceQueries(profile))) residence++;
    if (await resolveOrSearch(profile.sections.cultureIdentity, cultureQueries(profile))) culture++;
    if (await resolveOrSearch(profile.sections.historyDepth, historyQueries(profile))) history++;

    // Make sure the anthem/seal still have meaningful fallback images instead of being blank.
    if (isBadImage(profile.sections.anthem.imageUrl)) {
      const anthemFallback = !isBadImage(profile.sections.emblem.imageUrl)
        ? profile.sections.emblem.imageUrl
        : await firstImage([`Flag of ${profile.countryNameEn}`, `${profile.countryNameEn} flag`]);
      if (anthemFallback) profile.sections.anthem.imageUrl = anthemFallback;
    }

    if (isBadImage(profile.sections.seal.imageUrl)) {
      profile.sections.seal.imageUrl = profile.sections.emblem.imageUrl;
    }

    profile.updatedAt = new Date().toISOString().split("T")[0];
    profile.verificationLevel = profile.verificationLevel === "Cần kiểm chứng thêm" ? "Trung bình" : profile.verificationLevel;

    if ((index + 1) % 25 === 0) {
      fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
      console.log(`Processed ${index + 1}/${profiles.length} — culture ${culture}, history ${history}, residence ${residence}, emblem ${emblem}`);
      await sleep(400);
    }
  }

  fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));
  console.log(`Updated images — emblem: ${emblem}, residence: ${residence}, culture: ${culture}, history: ${history}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
