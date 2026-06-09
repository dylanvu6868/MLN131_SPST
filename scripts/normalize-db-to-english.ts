// One-time migration: normalize every country profile in the DB to canonical
// English. Vietnamese is then produced at display time from lib/i18n-data.ts.
import { readCountryProfilesFromDb, upsertCountryProfiles } from "@/lib/db";
import {
  TERRITORY,
  MANUAL_LEADERS,
  phraseToEn,
  noteToEn,
  buildGenericSummary,
  isGenericSummary
} from "@/lib/i18n-data";
import type { CountryPoliticalProfile } from "@/lib/types";

const PROSE_FIELDS = [
  "stateForm",
  "governmentSystem",
  "officialIdeology",
  "constitutionalIdentity",
  "powerStructure",
  "partySystem",
  "economicModel",
  "judiciary",
  "constitution",
  "rulingParty",
  "rulingCoalition",
  "lastElection",
  "nextElection",
  "politicalRegime",
  "headOfStateTitle",
  "headOfGovernmentTitle"
] as const;

// Monarch / head-of-state references that were translated into Vietnamese.
const HEAD_VI_TO_EN: Record<string, string> = {
  "Willem-Alexander, Hoàng tử xứ Orange": "Willem-Alexander of the Netherlands",
  "Frederik X của Đan Mạch": "Frederik X of Denmark",
  "Quốc vương Vương quốc Anh": "Monarch of the United Kingdom",
  "Quốc vương Đan Mạch": "Monarch of Denmark",
  "Quốc vương Na Uy": "Monarch of Norway",
  "Quốc vương Hà Lan": "Monarch of the Netherlands",
  "Quốc vương New Zealand": "Monarch of New Zealand"
};

// Mixed strings the partial translation left behind.
const FIXUPS: Record<string, string> = {
  "Hiến pháp the United States": "Constitution of the United States",
  "Đảng Cộng sản Vietnam": "Communist Party of Vietnam",
  "Party Tổng Bí thư and Tổng thống": "Party General Secretary and President"
};

// Vietnamese place names inside the "seat of government" Wikipedia note.
const SEAT_PLACE_VI_TO_EN: Record<string, string> = {
  "Nhà Trắng": "White House",
  "Điện Élysée": "Élysée Palace",
  "Lâu đài Prague": "Prague Castle",
  "Trung Nam Hải": "Zhongnanhai",
  "Phủ chủ tịch": "Presidential Palace",
  "Tổng lý Đại thần Quan để": "Prime Minister's Office"
};

const SEAT_PREFIX = "Vietnamese Wikipedia records the related seat of government/head of state: ";

// Person-name / native fields legitimately keep non-English characters.
const NAME_FIELDS = new Set(["headOfState", "headOfGovernment", "nativeName", "currencies", "languages", "countryName"]);

function cleanSeatNote(note: string): string | null {
  if (!note.startsWith(SEAT_PREFIX)) return note;
  const place = note.slice(SEAT_PREFIX.length).replace(/\.$/, "");
  if (/[=|]|px/.test(place)) return null; // drop wiki markup junk
  const en = SEAT_PLACE_VI_TO_EN[place];
  return SEAT_PREFIX + (en ?? place) + ".";
}

const LEGIS_EXACT: Record<string, string> = {
  "National People's Quốc hội": "National People's Congress",
  "United States Quốc hội": "United States Congress",
  "Argentine National Quốc hội": "Argentine National Congress",
  "National Quốc hội of Brazil": "National Congress of Brazil",
  "National Quốc hội of Chile": "National Congress of Chile",
  "National Quốc hội of Honduras": "National Congress of Honduras",
  "Palau National Quốc hội": "Palau National Congress",
  "Grand Quốc hội of Turkey": "Grand National Assembly of Türkiye",
  "Quốc hội of People's Power": "National Assembly of People's Power",
  "Quốc hội Kosovo": "Assembly of Kosovo",
  "Staten-Generaal / Quốc hội Hà Lan": "States General (Staten-Generaal)",
  "Supreme Hội đồng Nhân dân": "Supreme People's Assembly",
  "National Hội đồng Nhân dân": "National People's Council",
  "Hội đồng Nhân dân of Syria": "People's Council of Syria",
  "Hội đồng lập pháp Hồng Kông": "Legislative Council of Hong Kong",
  "Quốc hội": "National Assembly",
  "Hạ viện": "House of Representatives",
  "Không có cơ quan lập pháp địa phương thường trú": "No permanent local legislature",
  "Không có cơ quan lập pháp dân cử địa phương": "No elected local legislature",
  "Không có cơ quan lập pháp quốc gia": "No national legislature",
  "Không có cơ quan lập pháp quốc gia hoạt động đầy đủ theo chuẩn nghị viện dân cử":
    "No fully functioning national legislature by elected-parliament standards",
  "Không có cơ quan lập pháp dân cử thường trú": "No permanent elected legislature",
  "Không có cơ quan lập pháp địa phương đầy đủ": "No full local legislature",
  "Thiết chế đại diện/tuyên bố chủ quyền có tranh chấp": "Representative institution / disputed sovereignty claim",
  "Thiết chế địa phương hoặc cơ chế quản trị lãnh thổ": "Local institution or territorial governance mechanism"
};

const LEGIS_TOKENS: [RegExp, string][] = [
  [/Hội đồng Lập pháp/g, "Legislative Council"],
  [/Quốc hội Lập pháp/g, "Legislative Assembly"],
  [/Cơ quan [Ll]ập pháp/g, "Legislature"],
  [/Hội đồng Tối cao/g, "Supreme Council"],
  [/Hội đồng Nhân dân/g, "People's Council"],
  [/Hội đồng [ĐđD]ảo/g, "Island Council"],
  [/Hạ viện/g, "House of Assembly"],
  [/Đại hội/g, "Congress"],
  [/Nghị viện/g, "Parliament"],
  [/Quốc hội/g, "National Assembly"],
  [/Hội đồng/g, "Council"]
];

function normalizeLegislatureToEn(value: string): string {
  if (LEGIS_EXACT[value]) return LEGIS_EXACT[value];
  let out = value;
  for (const [re, en] of LEGIS_TOKENS) out = out.replace(re, en);
  return out;
}

// Vietnamese-specific characters (avoids false positives on Portuguese/Spanish/
// Catalan proper names that only use á é í ó ú à ã õ ç ñ ê ô).
const VI_DIACRITIC = /[ạảầấậẩẫằắặẳẵẹẻếệểễịỉọỏộổỗớờợởỡụủứừựửữỳỵỷỹươĐđ]/;

function toEnProse(value: unknown): unknown {
  if (typeof value !== "string" || !value) return value;
  if (FIXUPS[value]) return FIXUPS[value];
  let v = value.replace(/Nghị viện/g, "Parliament");
  v = phraseToEn(v) ?? v;
  return v;
}

function main() {
  const profiles = readCountryProfilesFromDb();
  let changed = 0;

  const next = profiles.map((profile) => {
    const p: CountryPoliticalProfile = { ...profile } as CountryPoliticalProfile;
    const rec = p as unknown as Record<string, unknown>;

    for (const field of PROSE_FIELDS) {
      rec[field] = toEnProse(rec[field]);
    }

    if (Array.isArray(p.ideologyFamily)) {
      p.ideologyFamily = p.ideologyFamily.map((item) => (typeof item === "string" ? (phraseToEn(item) ?? item) : item));
    }

    if (typeof p.headOfState === "string" && HEAD_VI_TO_EN[p.headOfState]) {
      p.headOfState = HEAD_VI_TO_EN[p.headOfState];
    }
    if (typeof p.headOfGovernment === "string" && HEAD_VI_TO_EN[p.headOfGovernment]) {
      p.headOfGovernment = HEAD_VI_TO_EN[p.headOfGovernment];
    }
    if (typeof p.constitution === "string" && FIXUPS[p.constitution]) p.constitution = FIXUPS[p.constitution];

    // Territory-specific leadership / legislature prose.
    const t = TERRITORY[p.iso3];
    if (t) {
      if (t.head) p.headOfState = t.head.en;
      if (t.government) p.headOfGovernment = t.government.en;
      if (t.legislature) p.legislature = t.legislature.en;
      if (t.powerStructure) p.powerStructure = t.powerStructure.en;
    }

    // Manual Vietnamese-authored leaders.
    const m = MANUAL_LEADERS[p.iso3];
    if (m) {
      if (m.headOfGovernment) p.headOfGovernment = m.headOfGovernment.en;
      if (m.headOfGovernmentTitle) p.headOfGovernmentTitle = m.headOfGovernmentTitle.en;
    }

    // Legislature (non-territory): undo the partial translation.
    if (!t && typeof p.legislature === "string" && p.legislature) {
      p.legislature = normalizeLegislatureToEn(p.legislature);
    }

    // Summary: rebuild generic profiles in English; keep bespoke ones.
    if (typeof p.summary === "string" && p.summary && isGenericSummary(p.summary)) {
      p.summary = buildGenericSummary(
        { englishName: p.englishName, countryName: p.englishName, region: p.region, capital: p.capital, population: p.population },
        "en"
      );
    }

    // Notes.
    if (Array.isArray(p.notes)) {
      p.notes = p.notes
        .map((n) => noteToEn(n))
        .map((n) => cleanSeatNote(n))
        .filter((n): n is string => n !== null);
    }

    if (JSON.stringify(p) !== JSON.stringify(profile)) changed++;
    return p;
  });

  upsertCountryProfiles(next);

  // Residual Vietnamese audit (distinct value -> field + sample ISO).
  const residual = new Map<string, { field: string; iso: string; count: number }>();
  const note = (field: string, iso: string, value: string) => {
    if (NAME_FIELDS.has(field.replace("[]", ""))) return;
    if (!VI_DIACRITIC.test(value)) return;
    if (isGenericSummary(value)) return;
    const ex = residual.get(value);
    if (ex) ex.count++;
    else residual.set(value, { field, iso, count: 1 });
  };
  for (const p of next) {
    const rec = p as unknown as Record<string, unknown>;
    for (const [k, v] of Object.entries(rec)) {
      if (typeof v === "string") note(k, p.iso3, v);
      else if (Array.isArray(v)) for (const item of v) if (typeof item === "string") note(`${k}[]`, p.iso3, item);
    }
  }

  console.log(`Normalized ${changed}/${profiles.length} profiles to English.`);
  console.log(`Residual distinct Vietnamese strings: ${residual.size}`);
  for (const [value, meta] of residual) console.log(`  ⚠ [${meta.count}] ${meta.field} (${meta.iso}): ${value}`);
}

main();
