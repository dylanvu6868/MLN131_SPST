import { resolveCommonsDirectUrl } from "@/lib/wikimedia-media";
import type { CountryLeaderEntry } from "@/lib/types";

const USER_AGENT = "WorldIdeologyAtlas/1.0 (educational)";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function wikipediaFetch(url: string, retries = 4) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });

    if (response.status === 429 || response.status === 503) {
      await sleep(1200 * (attempt + 1));
      continue;
    }

    return response;
  }

  return null;
}

export type WikipediaInfoboxLeader = {
  order: number;
  title: string;
  name: string;
};

type WikipediaSummary = {
  title?: string;
  description?: string;
  extract?: string;
  thumbnail?: { source: string };
  originalimage?: { source: string };
  content_urls?: { desktop?: { page?: string } };
};

const COUNTRY_PAGE_ALIASES: Record<string, string> = {
  USA: "United States",
  GBR: "United Kingdom",
  KOR: "South Korea",
  PRK: "North Korea",
  RUS: "Russia",
  LAO: "Laos",
  CZE: "Czech Republic",
  MKD: "North Macedonia",
  COD: "Democratic Republic of the Congo",
  COG: "Republic of the Congo",
  TZA: "Tanzania",
  VNM: "Vietnam",
  TUR: "Turkey",
  IRN: "Iran",
  SYR: "Syria",
  VEN: "Venezuela",
  BOL: "Bolivia",
  MDA: "Moldova",
  PSE: "State of Palestine",
  TWN: "Taiwan"
};

const TITLE_VI_PHRASES: [string, string][] = [
  ["Party General Secretary and President", "Tổng Bí thư Đảng và Chủ tịch nước"],
  ["General Secretary of the Communist Party of Vietnam and President", "Tổng Bí thư Đảng và Chủ tịch nước"],
  ["Party General Secretary", "Tổng Bí thư Đảng"],
  ["Federal Chancellor", "Thủ tướng Liên bang"],
  ["Federal President", "Tổng thống Liên bang"],
  ["President of the Government", "Thủ tướng Chính phủ"],
  ["National Assembly Chairman", "Chủ tịch Quốc hội"],
  ["Chairman of the National Assembly", "Chủ tịch Quốc hội"],
  ["Speaker of the United States House of Representatives", "Chủ tịch Hạ viện Hoa Kỳ"],
  ["Speaker of the House", "Chủ tịch Hạ viện"],
  ["Chief Justice of the United States", "Chánh án Tòa án Tối cao Hoa Kỳ"],
  ["Vice President of the United States", "Phó Tổng thống Hoa Kỳ"],
  ["President of the United States", "Tổng thống Hoa Kỳ"],
  ["Prime Minister of Vietnam", "Thủ tướng Chính phủ Việt Nam"],
  ["Prime Minister of the Socialist Republic of Vietnam", "Thủ tướng Chính phủ Việt Nam"],
  ["Chancellor of Germany", "Thủ tướng Đức"],
  ["President of Germany", "Tổng thống Đức"],
  ["Prime Minister", "Thủ tướng"],
  ["Vice President", "Phó Tổng thống"],
  ["Chief Justice", "Chánh án Tòa án Tối cao"],
  ["Governor-General", "Toàn quyền"],
  ["Supreme Leader", "Lãnh tụ Tối cao"],
  ["General Secretary", "Tổng Bí thư"],
  ["President", "Tổng thống"],
  ["Chancellor", "Thủ tướng"],
  ["Premier", "Thủ tướng"],
  ["Monarch", "Quân chủ"],
  ["King", "Vua"],
  ["Queen", "Nữ hoàng"],
  ["Emperor", "Hoàng đế"]
];

export function getWikipediaCountryPage(countryNameEn: string, iso3?: string) {
  if (iso3 && COUNTRY_PAGE_ALIASES[iso3]) {
    return COUNTRY_PAGE_ALIASES[iso3];
  }
  return countryNameEn;
}

export function cleanWikitextValue(raw: string) {
  return raw
    .replace(/\{\{efn[^}]*\}\}/g, "")
    .replace(/\{\{nowrap\|([^}]+)\}\}/g, "$1")
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "")
    .replace(/<ref[^/]*\/>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/''+/g, "")
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractInfoboxField(wikitext: string, field: string) {
  const match = wikitext.match(new RegExp(`\\|\\s*${field}\\s*=\\s*([\\s\\S]*?)(?=\\n\\|)`, "i"));
  return match ? cleanWikitextValue(match[1]) : "";
}

export function parseInfoboxLeaders(wikitext: string): WikipediaInfoboxLeader[] {
  const leaders: WikipediaInfoboxLeader[] = [];

  for (let index = 1; index <= 6; index++) {
    const title = extractInfoboxField(wikitext, `leader_title${index}`);
    const name = extractInfoboxField(wikitext, `leader_name${index}`);

    if (!title || !name) continue;
    if (title.includes("=") || name.includes("=")) continue;
    if (/^\|/.test(title) || /^\|/.test(name)) continue;
    if (name.toLowerCase().includes("legislature")) continue;
    if (title.toLowerCase().includes("legislature")) continue;

    leaders.push({ order: index, title, name });
  }

  if (!leaders.length) {
    const monarch = extractInfoboxField(wikitext, "monarch");
    const president = extractInfoboxField(wikitext, "president");
    const primeMinister = extractInfoboxField(wikitext, "prime_minister");

    if (monarch) leaders.push({ order: 1, title: "Monarch", name: monarch });
    if (president) leaders.push({ order: leaders.length + 1, title: "President", name: president });
    if (primeMinister) {
      leaders.push({ order: leaders.length + 1, title: "Prime Minister", name: primeMinister });
    }
  }

  return leaders;
}

function inferRole(title: string): CountryLeaderEntry["role"] {
  const normalized = title.toLowerCase();

  if (
    normalized.includes("prime minister") ||
    normalized.includes("premier") ||
    normalized.includes("chancellor") ||
    normalized.includes("head of government") ||
    normalized.includes("president of the government")
  ) {
    return "headOfGovernment";
  }

  if (
    normalized.includes("president") ||
    normalized.includes("monarch") ||
    normalized.includes("king") ||
    normalized.includes("queen") ||
    normalized.includes("emperor") ||
    normalized.includes("supreme leader") ||
    normalized.includes("general secretary") ||
    normalized.includes("governor-general")
  ) {
    return "headOfState";
  }

  return "other";
}

const COUNTRY_TITLE_OVERRIDES: Record<string, Record<string, string>> = {
  VNM: {
    "Thủ tướng": "Thủ tướng Chính phủ"
  }
};

function localizeTitle(title: string, iso3?: string) {
  let localized = title;

  for (const [en, vi] of TITLE_VI_PHRASES) {
    localized = localized.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), vi);
  }

  if (iso3 && COUNTRY_TITLE_OVERRIDES[iso3]?.[localized]) {
    localized = COUNTRY_TITLE_OVERRIDES[iso3][localized];
  }

  return localized;
}

async function fetchWikipediaWikitext(pageTitle: string, language = "en") {
  const params = new URLSearchParams({
    action: "parse",
    page: pageTitle,
    prop: "wikitext",
    formatversion: "2",
    format: "json"
  });

  const response = await wikipediaFetch(`https://${language}.wikipedia.org/w/api.php?${params}`);

  if (!response?.ok) return null;

  const data = (await response.json()) as { parse?: { wikitext?: string } };
  return data.parse?.wikitext ?? null;
}

async function fetchWikipediaSummary(pageTitle: string, language = "en"): Promise<WikipediaSummary | null> {
  const slug = pageTitle.replace(/ /g, "_");
  const response = await wikipediaFetch(
    `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`
  );

  if (!response?.ok) return null;
  return (await response.json()) as WikipediaSummary;
}

function parseAssumedOfficeYear(wikitext: string) {
  const match = wikitext.match(/\|\s*assumed\s*office\d*\s*=\s*([^\n|]+)/i);
  if (!match) return undefined;

  const cleaned = cleanWikitextValue(match[1]);
  const yearMatch = cleaned.match(/\b(19|20)\d{2}\b/);
  return yearMatch?.[0];
}

export async function fetchLeaderPersonDetails(personName: string) {
  const summary = await fetchWikipediaSummary(personName);
  if (!summary) {
    return { imageUrl: undefined, sourceUrl: undefined, since: undefined };
  }

  const wikitext = await fetchWikipediaWikitext(personName);
  const imageCandidate = summary.originalimage?.source ?? summary.thumbnail?.source;
  const imageUrl = imageCandidate ? await resolveCommonsDirectUrl(imageCandidate) : undefined;

  return {
    imageUrl: imageUrl ?? imageCandidate,
    sourceUrl: summary.content_urls?.desktop?.page,
    since: wikitext ? parseAssumedOfficeYear(wikitext) : undefined
  };
}

export async function fetchCountryLeadersFromWikipedia(countryNameEn: string, iso3?: string) {
  const pageTitle = getWikipediaCountryPage(countryNameEn, iso3);
  const wikitext = await fetchWikipediaWikitext(pageTitle);

  if (!wikitext) {
    return { pageTitle, leaders: [] as CountryLeaderEntry[], sourceUrl: undefined };
  }

  const infoboxLeaders = parseInfoboxLeaders(wikitext);
  const countrySummary = await fetchWikipediaSummary(pageTitle);
  const countrySourceUrl = countrySummary?.content_urls?.desktop?.page;

  const leaders: CountryLeaderEntry[] = [];

  const personDetails = await Promise.all(
    infoboxLeaders.map(async (leader) => {
      const details = await fetchLeaderPersonDetails(leader.name);
      await sleep(80);
      return details;
    })
  );

  for (let index = 0; index < infoboxLeaders.length; index++) {
    const leader = infoboxLeaders[index];
    const person = personDetails[index];
    const role = inferRole(leader.title);

    leaders.push({
      role,
      title: localizeTitle(leader.title, iso3),
      titleEn: leader.title,
      name: leader.name,
      imageUrl: person.imageUrl,
      sourceUrl: person.sourceUrl ?? countrySourceUrl,
      since: person.since,
      order: leader.order
    });
  }

  return {
    pageTitle,
    leaders,
    sourceUrl: countrySourceUrl
  };
}
