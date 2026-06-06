import fs from "node:fs";

import { resolveCommonsDirectUrl, searchCommonsAudio, toCommonsFilePathUrl } from "../lib/wikimedia-media";
import type { CountrySymbolProfile } from "../lib/types";

const profilesPath = "./data/country-symbol-profiles.json";
const USER_AGENT = "WorldIdeologyAtlas/1.0 (educational)";

type WikidataRow = {
  iso: string;
  coat?: string;
  flag?: string;
  label?: string;
};

async function fetchWikidataMedia(): Promise<Map<string, WikidataRow>> {
  const query = `
    SELECT ?iso ?coat ?flag ?countryLabel WHERE {
      ?country wdt:P31 wd:Q6256 ;
               wdt:P297 ?iso .
      OPTIONAL { ?country wdt:P94 ?coat . }
      OPTIONAL { ?country wdt:P41 ?flag . }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;

  const response = await fetch(`https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}`, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": USER_AGENT
    }
  });

  if (!response.ok) {
    throw new Error(`Wikidata query failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    results: {
      bindings: Array<{
        iso: { value: string };
        coat?: { value: string };
        flag?: { value: string };
        countryLabel?: { value: string };
      }>;
    };
  };

  const map = new Map<string, WikidataRow>();
  for (const row of data.results.bindings) {
    map.set(row.iso.value.toUpperCase(), {
      iso: row.iso.value.toUpperCase(),
      coat: row.coat?.value,
      flag: row.flag?.value,
      label: row.countryLabel?.value
    });
  }

  return map;
}

async function resolveWithFallback(...candidates: Array<string | undefined>): Promise<string | undefined> {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const direct = await resolveCommonsDirectUrl(candidate);
    if (direct) return direct;
  }
  return undefined;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const profiles = JSON.parse(fs.readFileSync(profilesPath, "utf8")) as CountrySymbolProfile[];
  const wikidata = await fetchWikidataMedia();

  let emblemUpdated = 0;
  let sealUpdated = 0;
  let anthemImageUpdated = 0;
  let anthemAudioUpdated = 0;

  for (let index = 0; index < profiles.length; index++) {
    const profile = profiles[index];
    const wd = wikidata.get(profile.iso2.toUpperCase());

    if (!wd) {
      const flagFallback = await resolveWithFallback(
        toCommonsFilePathUrl(`Flag of ${profile.countryNameEn}.svg`),
        profile.sections.emblem.imageUrl,
        profile.sections.anthem.imageUrl
      );

      if (flagFallback) {
        profile.sections.emblem.imageUrl ??= flagFallback;
        profile.sections.seal.imageUrl ??= flagFallback;
        profile.sections.anthem.imageUrl ??= flagFallback;
        emblemUpdated++;
      }

      console.warn(`No Wikidata match for ${profile.iso2} (${profile.countryNameVi})`);
      continue;
    }

    const emblemUrl = await resolveWithFallback(wd.coat, wd.flag, profile.sections.emblem.imageUrl);
    if (emblemUrl) {
      profile.sections.emblem.imageUrl = emblemUrl;
      profile.sections.emblem.sourceUrl =
        profile.sections.emblem.sourceUrl ?? wd.coat ?? `https://www.wikidata.org/wiki/Special:EntityByTitle?title=${encodeURIComponent(wd.label ?? profile.countryNameEn)}`;
      emblemUpdated++;
    }

    const sealUrl = await resolveWithFallback(wd.coat, profile.sections.seal.imageUrl, wd.flag);
    if (sealUrl) {
      profile.sections.seal.imageUrl = sealUrl;
      sealUpdated++;
    }

    const anthemImageUrl = await resolveWithFallback(wd.flag, profile.sections.anthem.imageUrl);
    if (anthemImageUrl) {
      profile.sections.anthem.imageUrl = anthemImageUrl;
      anthemImageUpdated++;
    }

    if (!profile.sections.anthem.audioUrl) {
      const queries = [
        `National anthem of ${profile.countryNameEn}`,
        `${profile.countryNameEn} national anthem`,
        `Anthem of ${profile.countryNameEn}`
      ];

      for (const query of queries) {
        const audioUrl = await searchCommonsAudio(query);
        if (audioUrl) {
          profile.sections.anthem.audioUrl = audioUrl;
          profile.sections.anthem.sourceUrl =
            profile.sections.anthem.sourceUrl ?? toCommonsFilePathUrl(audioUrl.split("/").pop() ?? "");
          anthemAudioUpdated++;
          break;
        }
        await sleep(120);
      }
    }

    if ((index + 1) % 25 === 0) {
      console.log(`Processed ${index + 1}/${profiles.length}...`);
      await sleep(300);
    } else {
      await sleep(80);
    }
  }

  fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));

  console.log(`Enriched ${profiles.length} profiles.`);
  console.log(`Emblem images: ${emblemUpdated}`);
  console.log(`Seal images: ${sealUpdated}`);
  console.log(`Anthem images: ${anthemImageUpdated}`);
  console.log(`Anthem audio: ${anthemAudioUpdated}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
