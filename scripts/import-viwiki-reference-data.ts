import fs from "node:fs";
import { readCountryProfilesFromDb, upsertCountryProfiles } from "@/lib/db";
import type { CountryPoliticalProfile, CountrySymbolProfile, DataSource } from "@/lib/types";

const USER_AGENT = "WorldIdeologyAtlas/1.0 (Vietnamese Wikipedia reference import)";
const symbolPath = "./data/country-symbol-profiles.json";

const pages = {
  residence: "Trụ sở chính quyền và nguyên thủ quốc gia",
  headOfState: "Nguyên thủ quốc gia",
  asiaEmblems: "Danh sách quốc huy và biểu tượng các quốc gia ở Châu Á"
};

type WikiPage = keyof typeof pages;

type ResidenceRow = {
  iso3?: string;
  countryText: string;
  countryLink?: string;
  buildingText?: string;
  buildingLink?: string;
  imageFile?: string;
};

type EmblemRow = {
  iso3?: string;
  countryText: string;
  countryLink?: string;
  imageFile?: string;
  motto?: string;
  articleLink?: string;
};


const flagTemplateToIso3: Record<string, string> = {
  ALG: "DZA", ANG: "AGO", BAN: "BGD", BEN: "BEN", BOT: "BWA", BUL: "BGR", CRC: "CRI", CRO: "HRV",
  DPRK: "PRK", ELS: "SLV", ETM: "TLS", GAM: "GMB", GBS: "GNB", GUA: "GTM", GUI: "GIN", HON: "HND",
  LAT: "LVA", LIT: "LTU", MAD: "MDG", MRI: "MUS", MYA: "MMR", NEP: "NPL", NGR: "NER", PAR: "PRY",
  POR: "PRT", PRC: "CHN", ROC: "TWN", ROK: "KOR", ROM: "ROU", RSA: "ZAF", SIN: "SGP", SLO: "SVN",
  SRI: "LKA", SUD: "SDN", SUI: "CHE", TAN: "TZA", TRI: "TTO", UAE: "ARE", URU: "URY", VIE: "VNM",
  ZAM: "ZMB", ZIM: "ZWE",
  AFG: "AFG", ALB: "ALB", ARG: "ARG", ARM: "ARM", AUT: "AUT", AZE: "AZE", BIH: "BIH", BLR: "BLR",
  BOL: "BOL", BRA: "BRA", CGO: "COG", CHL: "CHL", CMR: "CMR", COD: "COD", COL: "COL", CPV: "CPV",
  CUB: "CUB", CYP: "CYP", CZE: "CZE", DEU: "DEU", DJI: "DJI", DMA: "DMA", DOM: "DOM", ECU: "ECU",
  EGY: "EGY", EQG: "GNQ", ERI: "ERI", EST: "EST", ETH: "ETH", FIN: "FIN", FJI: "FJI", FRA: "FRA",
  GAB: "GAB", GEO: "GEO", GHA: "GHA", GRC: "GRC", GUY: "GUY", HTI: "HTI", HUN: "HUN", IDN: "IDN",
  IND: "IND", IRL: "IRL", IRN: "IRN", IRQ: "IRQ", ISL: "ISL", ISR: "ISR", ITA: "ITA", KAZ: "KAZ",
  KEN: "KEN", KGZ: "KGZ", LAO: "LAO", LBN: "LBN", LBR: "LBR", MDV: "MDV", MEX: "MEX", MKD: "MKD",
  MLI: "MLI", MLT: "MLT", MNE: "MNE", MNG: "MNG", MOZ: "MOZ", MRT: "MRT", MWI: "MWI", NAM: "NAM",
  NIC: "NIC", PAK: "PAK", PAN: "PAN", PER: "PER", PHL: "PHL", POL: "POL", RUS: "RUS", RWA: "RWA",
  SEN: "SEN", SEY: "SYC", SLE: "SLE", SOM: "SOM", SRB: "SRB", SSD: "SSD", STP: "STP", SUR: "SUR",
  SVK: "SVK", SYR: "SYR", TGO: "TGO", TJK: "TJK", TKM: "TKM", TUN: "TUN", TUR: "TUR", UGA: "UGA",
  UKR: "UKR", USA: "USA", UZB: "UZB", VEN: "VEN", YEM: "YEM"
};

const viNameAliases: Record<string, string> = {
  "Việt Nam": "VNM",
  "Trung Quốc": "CHN",
  "Nhật Bản": "JPN",
  "Hàn Quốc": "KOR",
  "Triều Tiên": "PRK",
  "CHDCND Triều Tiên": "PRK",
  "Đài Loan": "TWN",
  "Hồng Kông": "HKG",
  "Ma Cao": "MAC",
  "Ấn Độ": "IND",
  "Indonesia": "IDN",
  "Inđônêxia": "IDN",
  "Malaysia": "MYS",
  "Malaixia": "MYS",
  "Singapore": "SGP",
  "Philippines": "PHL",
  "Philíppin": "PHL",
  "Thái Lan": "THA",
  "Lào": "LAO",
  "Campuchia": "KHM",
  "Myanmar": "MMR",
  "Miến Điện": "MMR",
  "Brunei": "BRN",
  "Đông Timor": "TLS",
  "Timor-Leste": "TLS",
  "Mông Cổ": "MNG",
  "Kazakhstan": "KAZ",
  "Kyrgyzstan": "KGZ",
  "Kirgizstan": "KGZ",
  "Tajikistan": "TJK",
  "Tadjikistan": "TJK",
  "Turkmenistan": "TKM",
  "Uzbekistan": "UZB",
  "Afghanistan": "AFG",
  "Pakistan": "PAK",
  "Bangladesh": "BGD",
  "Sri Lanka": "LKA",
  "Nepal": "NPL",
  "Bhutan": "BTN",
  "Maldives": "MDV",
  "Iran": "IRN",
  "Iraq": "IRQ",
  "Ả Rập Xê Út": "SAU",
  "Ả Rập Saudi": "SAU",
  "Yemen": "YEM",
  "Oman": "OMN",
  "Các Tiểu vương quốc Ả Rập Thống nhất": "ARE",
  "UAE": "ARE",
  "Qatar": "QAT",
  "Kuwait": "KWT",
  "Bahrain": "BHR",
  "Jordan": "JOR",
  "Syria": "SYR",
  "Liban": "LBN",
  "Lebanon": "LBN",
  "Israel": "ISR",
  "Palestine": "PSE",
  "Thổ Nhĩ Kỳ": "TUR",
  "Armenia": "ARM",
  "Azerbaijan": "AZE",
  "Gruzia": "GEO",
  "Georgia": "GEO",
  "Síp": "CYP",
  "Nga": "RUS"
};

async function fetchWikitext(title: string) {
  const params = new URLSearchParams({
    action: "parse",
    format: "json",
    prop: "wikitext",
    page: title
  });
  const response = await fetch(`https://vi.wikipedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": USER_AGENT }
  });
  if (!response.ok) throw new Error(`Không tải được Wikipedia: ${title} ${response.status}`);
  const json = await response.json() as { parse?: { wikitext?: { "*"?: string } } };
  return json.parse?.wikitext?.["*"] ?? "";
}

function source(page: WikiPage, field: string): DataSource {
  const title = pages[page];
  return {
    name: `Wikipedia tiếng Việt — ${title}`,
    url: `https://vi.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
    field,
    retrievedAt: new Date().toISOString()
  };
}

function normalizeText(value = "") {
  return value
    .replace(/<br\s*\/?\s*>/gi, " / ")
    .replace(/<[^>]+>/g, "")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/''+/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirstLink(cell: string) {
  const match = cell.match(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/);
  if (!match) return undefined;
  return {
    link: normalizeText(match[1]),
    text: normalizeText(match[2] ?? match[1])
  };
}

function extractFile(cell: string) {
  const match = cell.match(/\[\[(?:Tập tin|File):([^\]|]+)(?:\|[^\]]*)?\]\]/i);
  return match?.[1]?.trim();
}

function extractFlagTemplateIso(cell: string) {
  const flagWithName = cell.match(/\{\{\s*Flag\s*\|\s*([^}|]+)[^}]*\}\}/i);
  if (flagWithName?.[1]) {
    return isoFromViName(flagWithName[1]);
  }

  const template = cell.match(/\{\{\s*([A-Z][A-Z0-9]{2,4})\s*(?:\|[^}]*)?\}\}/);
  return template?.[1] ? flagTemplateToIso3[template[1]] : undefined;
}

function stripWikiMarkup(cell: string) {
  return normalizeText(
    cell.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?\|([^\]]+)\]\]/g, "$2")
      .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?\]\]/g, "$1")
      .replace(/\[\[(?:Tập tin|File):[^\]]+\]\]/gi, "")
      .replace(/\{\{\s*Flag\s*\|\s*([^}|]+)[^}]*\}\}/gi, "$1")
      .replace(/\{\{\s*([A-Z][A-Z0-9]{2,4})\s*(?:\|[^}]*)?\}\}/g, "$1")
  );
}

function parseTables(wikitext: string) {
  const tables: string[] = [];
  const regex = /\{\|[\s\S]*?\n\|\}/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(wikitext))) tables.push(match[0]);
  return tables;
}

function parseRows(table: string) {
  return table
    .split(/\n\|-/)
    .slice(1)
    .map((row) => row.replace(/\n\|\}$/, ""))
    .map((row) => {
      const cleaned = row.trim().replace(/^\|/, "");
      return cleaned.split(/\n\||\|\|/).map((cell) => cell.trim()).filter(Boolean);
    })
    .filter((cells) => cells.length >= 2);
}

function parseResidenceRows(wikitext: string): ResidenceRow[] {
  const rows: ResidenceRow[] = [];
  for (const table of parseTables(wikitext)) {
    for (const cells of parseRows(table)) {
      const countryCell = cells[0] ?? "";
      const buildingCell = cells.find((cell, index) => index > 0 && /\[\[/.test(cell)) ?? cells[1] ?? "";
      const countryLink = extractFirstLink(countryCell);
      const templateIso = extractFlagTemplateIso(countryCell);
      const buildingLink = extractFirstLink(buildingCell);
      const imageFile = cells.map(extractFile).find(Boolean);
      const countryText = countryLink?.text ?? stripWikiMarkup(countryCell);
      if (!countryText || /^quốc gia/i.test(countryText)) continue;
      rows.push({
        iso3: templateIso,
        countryText,
        countryLink: countryLink?.link,
        buildingText: buildingLink?.text ?? stripWikiMarkup(buildingCell),
        buildingLink: buildingLink?.link,
        imageFile
      });
    }
  }
  return rows;
}

function parseAsiaEmblemRows(wikitext: string): EmblemRow[] {
  const rows: EmblemRow[] = [];
  for (const table of parseTables(wikitext)) {
    if (!/Quốc huy|Khẩu hiệu|Tiêu ngữ/i.test(table)) continue;
    for (const cells of parseRows(table)) {
      const countryLink = extractFirstLink(cells[0] ?? "");
      const templateIso = extractFlagTemplateIso(cells[0] ?? "");
      const countryText = countryLink?.text ?? stripWikiMarkup(cells[0] ?? "");
      if (!countryText || /^quốc gia/i.test(countryText)) continue;
      const article = extractFirstLink(cells[3] ?? cells[2] ?? "");
      rows.push({
        iso3: templateIso,
        countryText,
        countryLink: countryLink?.link,
        imageFile: extractFile(cells[1] ?? ""),
        motto: stripWikiMarkup(cells[2] ?? ""),
        articleLink: article?.link
      });
    }
  }
  return rows;
}

function isoFromViName(name?: string, countryByNames?: Map<string, CountryPoliticalProfile>) {
  if (!name) return undefined;
  const clean = normalizeText(name).replace(/^Cộng hòa\s+/i, "").replace(/^Vương quốc\s+/i, "");
  return viNameAliases[clean] ?? countryByNames?.get(clean.toLowerCase())?.iso3;
}

function wikiPageUrl(title?: string) {
  if (!title) return undefined;
  return `https://vi.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
}

function commonsFileUrl(file?: string) {
  if (!file) return undefined;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;
}

function dedupeSources(sources: DataSource[]) {
  const seen = new Set<string>();
  return sources.filter((item) => {
    const key = `${item.name}:${item.url ?? ""}:${item.field ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function appendNote(notes: string[] | undefined, note: string) {
  return Array.from(new Set([...(notes ?? []), note]));
}

async function main() {
  console.log("Đang tải 3 trang Wikipedia tiếng Việt...");
  const [residenceText, headText, asiaText] = await Promise.all([
    fetchWikitext(pages.residence),
    fetchWikitext(pages.headOfState),
    fetchWikitext(pages.asiaEmblems)
  ]);

  fs.mkdirSync("./data/viwiki-cache", { recursive: true });
  fs.writeFileSync("./data/viwiki-cache/tru-so-chinh-quyen-va-nguyen-thu.txt", residenceText);
  fs.writeFileSync("./data/viwiki-cache/nguyen-thu-quoc-gia.txt", headText);
  fs.writeFileSync("./data/viwiki-cache/quoc-huy-chau-a.txt", asiaText);

  const residenceRows = parseResidenceRows(residenceText);
  const emblemRows = parseAsiaEmblemRows(asiaText);
  console.log(`Đọc được ${residenceRows.length} dòng trụ sở/nguyên thủ và ${emblemRows.length} dòng quốc huy châu Á.`);

  const profiles = readCountryProfilesFromDb();
  const countryByNames = new Map<string, CountryPoliticalProfile>();
  for (const profile of profiles) {
    [profile.countryName, profile.officialName, profile.englishName, profile.nativeName].filter(Boolean).forEach((name) => {
      countryByNames.set(String(name).toLowerCase(), profile);
    });
  }

  const residenceByIso = new Map<string, ResidenceRow>();
  for (const row of residenceRows) {
    const iso = row.iso3 ?? isoFromViName(row.countryText, countryByNames) ?? isoFromViName(row.countryLink, countryByNames);
    if (iso && !residenceByIso.has(iso)) residenceByIso.set(iso, row);
  }

  const emblemByIso = new Map<string, EmblemRow>();
  for (const row of emblemRows) {
    const iso = row.iso3 ?? isoFromViName(row.countryText, countryByNames) ?? isoFromViName(row.countryLink, countryByNames);
    if (iso && !emblemByIso.has(iso)) emblemByIso.set(iso, row);
  }

  let updatedCountries = 0;
  const nextProfiles = profiles.map((profile): CountryPoliticalProfile => {
    const residence = residenceByIso.get(profile.iso3);
    let next = { ...profile };
    if (residence) {
      const buildingName = residence.buildingText && residence.buildingText.length > 2 ? residence.buildingText : undefined;
      if (buildingName) {
        next.powerStructure = next.powerStructure && next.powerStructure !== "Needs verification"
          ? next.powerStructure
          : `Trụ sở chính quyền/nguyên thủ được ghi nhận trong nguồn tiếng Việt: ${buildingName}.`;
        next.notes = appendNote(next.notes, `Wikipedia tiếng Việt ghi nhận trụ sở chính quyền/nguyên thủ liên quan: ${buildingName}.`);
      }
      next.sources = dedupeSources([...next.sources, source("residence", "headResidence")]);
      updatedCountries++;
    }
    next.sources = dedupeSources([...next.sources, source("headOfState", "headOfState")]);
    return next;
  });
  upsertCountryProfiles(nextProfiles);

  const symbols = JSON.parse(fs.readFileSync(symbolPath, "utf8")) as CountrySymbolProfile[];
  let updatedSymbols = 0;
  for (const symbol of symbols) {
    const residence = residenceByIso.get(symbol.iso3);
    if (residence) {
      const section = symbol.sections.headResidence;
      if (residence.buildingText && residence.buildingText.length > 2) {
        section.officialName = residence.buildingText;
        section.description = `Theo danh sách trụ sở chính quyền và nguyên thủ quốc gia trên Wikipedia tiếng Việt, ${residence.buildingText} là công trình/trụ sở gắn với cơ quan chính quyền hoặc nguyên thủ của ${symbol.countryNameVi}. ${section.description}`;
      }
      if (residence.buildingLink) section.sourceUrl = wikiPageUrl(residence.buildingLink) ?? section.sourceUrl;
      if (residence.imageFile) section.imageUrl = commonsFileUrl(residence.imageFile) ?? section.imageUrl;
      symbol.mainSources = dedupeSources([...symbol.mainSources, source("residence", "headResidence")]);
      updatedSymbols++;
    }

    const emblem = emblemByIso.get(symbol.iso3);
    if (emblem) {
      const section = symbol.sections.emblem;
      section.officialName = section.officialName || `Quốc huy ${symbol.countryNameVi}`;
      if (emblem.imageFile) section.imageUrl = commonsFileUrl(emblem.imageFile) ?? section.imageUrl;
      if (emblem.articleLink) section.sourceUrl = wikiPageUrl(emblem.articleLink) ?? section.sourceUrl;
      if (emblem.motto && emblem.motto !== "—" && !/không/i.test(emblem.motto)) {
        section.description = `${section.description} Khẩu hiệu/Tiêu ngữ được ghi trong danh sách quốc huy châu Á: ${emblem.motto}.`;
      }
      symbol.mainSources = dedupeSources([...symbol.mainSources, source("asiaEmblems", "emblem")]);
      updatedSymbols++;
    }

    symbol.mainSources = dedupeSources([...symbol.mainSources, source("headOfState", "leaders")]);
    symbol.updatedAt = new Date().toISOString().slice(0, 10);
  }
  fs.writeFileSync(symbolPath, JSON.stringify(symbols, null, 2));

  console.log(`Cập nhật ${updatedCountries} hồ sơ quốc gia và ${updatedSymbols} mục biểu tượng từ Wikipedia tiếng Việt.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
