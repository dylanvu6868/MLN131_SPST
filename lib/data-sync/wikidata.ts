import type { CountryPoliticalProfile, DataSource } from "@/lib/types";

type WikidataBinding = {
  iso3?: { value: string };
  headOfStateLabel?: { value: string };
  headOfGovernmentLabel?: { value: string };
  legislatureLabel?: { value: string };
};

type WikidataSparqlResponse = {
  results: {
    bindings: WikidataBinding[];
  };
};

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";

export async function queryWikidata(sparql: string) {
  const url = new URL(WIKIDATA_ENDPOINT);
  url.searchParams.set("query", sparql);
  url.searchParams.set("format", "json");

  const response = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "WorldIdeologyAtlas/0.1 (educational data project)"
    }
  });

  if (!response.ok) {
    throw new Error(`Wikidata query failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as WikidataSparqlResponse;
}

export async function fetchWikidataPoliticalIndex() {
  const retrievedAt = new Date().toISOString();
  const source: DataSource = {
    name: "Wikidata",
    url: "https://www.wikidata.org/",
    retrievedAt
  };

  const sparql = `
    SELECT ?iso3 ?headOfStateLabel ?headOfGovernmentLabel ?legislatureLabel WHERE {
      ?country wdt:P31/wdt:P279* wd:Q3624078;
               wdt:P298 ?iso3.
      OPTIONAL { ?country wdt:P35 ?headOfState. }
      OPTIONAL { ?country wdt:P6 ?headOfGovernment. }
      OPTIONAL { ?country wdt:P194 ?legislature. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
  `;

  const data = await queryWikidata(sparql);
  const index: Record<string, Partial<CountryPoliticalProfile>> = {};

  for (const binding of data.results.bindings) {
    const iso3 = binding.iso3?.value;
    if (!iso3) {
      continue;
    }

    index[iso3] = {
      headOfState: binding.headOfStateLabel?.value,
      headOfGovernment: binding.headOfGovernmentLabel?.value,
      legislature: binding.legislatureLabel?.value,
      sources: [
        { ...source, field: "headOfState" },
        { ...source, field: "headOfGovernment" },
        { ...source, field: "legislature" }
      ]
    };
  }

  return index;
}

