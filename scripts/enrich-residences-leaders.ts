import fs from "node:fs";

import { resolveCommonsDirectUrl, searchCommonsImage } from "../lib/wikimedia-media";
import type { CountrySymbolProfile } from "../lib/types";

const profilesPath = "./data/country-symbol-profiles.json";
const USER_AGENT = "WorldIdeologyAtlas/1.0 (educational)";

type WikidataLeaderRow = {
  iso: string;
  headLabel?: string;
  headImage?: string;
  hogLabel?: string;
  hogImage?: string;
  residenceLabel?: string;
  residenceImage?: string;
  lat?: number;
  lon?: number;
};

type WikipediaSummary = {
  extract?: string;
  thumbnail?: { source: string };
  originalimage?: { source: string };
  coordinates?: { lat: number; lon: number };
  content_urls?: { desktop?: { page?: string } };
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function residenceSearchTitles(profile: CountrySymbolProfile) {
  const residence = profile.sections.headResidence;
  const englishBuilding = residence.officialName?.split("/").pop()?.trim();
  const rawNames = [
    englishBuilding,
    residence.officialName?.split("/")[0]?.trim(),
    residence.officialName,
    englishBuilding ? `${englishBuilding}, ${residence.city}` : undefined,
    residence.city ? `${englishBuilding} ${residence.city}` : undefined,
    `Presidential Palace of ${profile.countryNameEn}`,
    `${profile.countryNameEn} presidential palace`,
    `Official residence of the ${profile.countryNameEn} head of state`
  ].filter((value): value is string => Boolean(value));

  return [...new Set(rawNames)];
}

async function fetchWikipediaSummary(title: string): Promise<WikipediaSummary | null> {
  const slug = title.replace(/ /g, "_");
  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`, {
    headers: { "User-Agent": USER_AGENT }
  });

  if (!response.ok) return null;
  return (await response.json()) as WikipediaSummary;
}

async function searchWikipediaPage(query: string): Promise<WikipediaSummary | null> {
  const searchParams = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    format: "json",
    origin: "*",
    srlimit: "5"
  });

  const searchResponse = await fetch(`https://en.wikipedia.org/w/api.php?${searchParams}`, {
    headers: { "User-Agent": USER_AGENT }
  });

  if (!searchResponse.ok) return null;

  const searchData = (await searchResponse.json()) as {
    query?: { search?: { title: string }[] };
  };

  for (const item of searchData.query?.search ?? []) {
    const summary = await fetchWikipediaSummary(item.title);
    if (summary?.thumbnail?.source || summary?.originalimage?.source) {
      return summary;
    }
  }

  return null;
}

async function enrichResidenceFromWikipedia(profile: CountrySymbolProfile) {
  const residence = profile.sections.headResidence;
  const queries = residenceSearchTitles(profile);

  for (const title of queries) {
    const summary = (await fetchWikipediaSummary(title)) ?? (await searchWikipediaPage(title));
    if (!summary) continue;

    const imageCandidate = summary.originalimage?.source ?? summary.thumbnail?.source;
    const imageUrl = imageCandidate ? await resolveCommonsDirectUrl(imageCandidate) : undefined;

    if (imageUrl) {
      residence.imageUrl = imageUrl;
    }

    if (summary.coordinates) {
      residence.coordinates = {
        lat: summary.coordinates.lat,
        lng: summary.coordinates.lon
      };
    }

    if (summary.content_urls?.desktop?.page) {
      residence.sourceUrl = summary.content_urls.desktop.page;
    }

    if (summary.extract) {
      const current = residence.description?.trim() ?? "";
      if (current.length < 180 || current.includes("sinh tự động") || current.includes("placeholder")) {
        residence.description = summary.extract;
      } else if (!current.includes(summary.extract.slice(0, 60))) {
        residence.description = `${current} ${summary.extract}`;
      }
    }

    if (imageUrl || summary.coordinates) {
      return true;
    }
  }

  const commonsQueries = [
    `${profile.sections.headResidence.officialName?.split("/").pop()?.trim()} ${profile.countryNameEn}`,
    `Presidential Palace ${profile.countryNameEn}`,
    `${profile.countryNameEn} official residence`
  ].filter((value): value is string => Boolean(value));

  for (const query of commonsQueries) {
    const imageUrl = await searchCommonsImage(query);
    if (imageUrl) {
      residence.imageUrl = imageUrl;
      return true;
    }
    await sleep(80);
  }

  return false;
}

async function fetchWikidataLeaders(): Promise<Map<string, WikidataLeaderRow>> {
  const query = `
    SELECT ?iso ?headLabel ?headImage ?hogLabel ?hogImage ?residenceLabel ?residenceImage ?lat ?lon WHERE {
      ?country wdt:P31 wd:Q6256 ;
               wdt:P297 ?iso .
      OPTIONAL {
        ?country wdt:P35 ?head .
        ?head rdfs:label ?headLabel . FILTER(LANG(?headLabel) = "en")
        OPTIONAL { ?head wdt:P18 ?headImage . }
        OPTIONAL {
          ?head wdt:P937 ?residence .
          ?residence rdfs:label ?residenceLabel . FILTER(LANG(?residenceLabel) = "en")
          OPTIONAL { ?residence wdt:P18 ?residenceImage . }
          OPTIONAL {
            ?residence wdt:P625 ?coord .
            BIND(geof:latitude(?coord) AS ?lat)
            BIND(geof:longitude(?coord) AS ?lon)
          }
        }
      }
      OPTIONAL {
        ?country wdt:P6 ?hog .
        ?hog rdfs:label ?hogLabel . FILTER(LANG(?hogLabel) = "en")
        OPTIONAL { ?hog wdt:P18 ?hogImage . }
      }
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
        headLabel?: { value: string };
        headImage?: { value: string };
        hogLabel?: { value: string };
        hogImage?: { value: string };
        residenceLabel?: { value: string };
        residenceImage?: { value: string };
        lat?: { value: string };
        lon?: { value: string };
      }>;
    };
  };

  const map = new Map<string, WikidataLeaderRow>();
  for (const row of data.results.bindings) {
    const iso = row.iso.value.toUpperCase();
    const existing = map.get(iso) ?? { iso };

    if (row.headLabel?.value) existing.headLabel = row.headLabel.value;
    if (row.headImage?.value) existing.headImage = row.headImage.value;
    if (row.hogLabel?.value) existing.hogLabel = row.hogLabel.value;
    if (row.hogImage?.value) existing.hogImage = row.hogImage.value;

    if (row.residenceImage?.value && !existing.residenceImage) {
      existing.residenceLabel = row.residenceLabel?.value;
      existing.residenceImage = row.residenceImage.value;
      if (row.lat?.value && row.lon?.value) {
        existing.lat = Number(row.lat.value);
        existing.lon = Number(row.lon.value);
      }
    }

    map.set(iso, existing);
  }

  return map;
}

async function applyWikidataResidenceFallback(profile: CountrySymbolProfile, wikidata?: WikidataLeaderRow) {
  if (!wikidata?.residenceImage) return;

  const residence = profile.sections.headResidence;
  if (!residence.imageUrl) {
    const imageUrl = await resolveCommonsDirectUrl(wikidata.residenceImage);
    if (imageUrl) residence.imageUrl = imageUrl;
  }

  if (!residence.coordinates && wikidata.lat !== undefined && wikidata.lon !== undefined) {
    residence.coordinates = { lat: wikidata.lat, lng: wikidata.lon };
  }

  if (!residence.officialName && wikidata.residenceLabel) {
    residence.officialName = wikidata.residenceLabel;
  }
}

async function main() {
  const profiles = JSON.parse(fs.readFileSync(profilesPath, "utf8")) as CountrySymbolProfile[];
  const wikidataRows = await fetchWikidataLeaders();

  let residenceUpdated = 0;

  for (let index = 0; index < profiles.length; index++) {
    const profile = profiles[index];
    const wikidata = wikidataRows.get(profile.iso2.toUpperCase());

    const wikiUpdated = await enrichResidenceFromWikipedia(profile);
    await applyWikidataResidenceFallback(profile, wikidata);

    if (profile.sections.headResidence.imageUrl) {
      profile.sections.headResidence.imageUrl = await resolveCommonsDirectUrl(profile.sections.headResidence.imageUrl) ?? profile.sections.headResidence.imageUrl;
    }

    if (wikiUpdated || profile.sections.headResidence.coordinates) {
      residenceUpdated++;
    }

    if ((index + 1) % 25 === 0) {
      console.log(`Processed ${index + 1}/${profiles.length}...`);
    }

    await sleep(120);
  }

  fs.writeFileSync(profilesPath, JSON.stringify(profiles, null, 2));

  console.log(`Updated residences: ${residenceUpdated}/${profiles.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
