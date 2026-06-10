import type { ConfidenceLevel, CountryPoliticalProfile, RegimeCategory } from "@/lib/types";
import {
  buildGenericSummary,
  isGenericSummary,
  legislatureToVi,
  noteToVi,
  phraseToVi,
  type Lang
} from "@/lib/i18n-data";
import { UI_STRINGS } from "@/lib/ui-strings";

export type DisplayLanguage = Lang;

// Module-level current language. Client components re-render on toggle because
// LanguageProvider remounts its subtree with key={language}, so each render
// reads the up-to-date value here.
let displayLanguage: DisplayLanguage = "vi";

export function setDisplayLanguage(language: DisplayLanguage) {
  displayLanguage = language;
}

export function getDisplayLanguage() {
  return displayLanguage;
}

const regionNamesVi = new Intl.DisplayNames(["vi"], { type: "region" });
const regionNamesEn = new Intl.DisplayNames(["en"], { type: "region" });

const regimeLabelsVi: Record<RegimeCategory, string> = {
  "Liberal democracy": "Dân chủ tự do",
  "Electoral democracy": "Dân chủ bầu cử",
  "Electoral autocracy": "Chuyên chế bầu cử",
  "Closed autocracy": "Chuyên chế đóng",
  Unknown: "Chưa xác định"
};

const confidenceLabelsVi: Record<ConfidenceLevel, string> = {
  high: "cao",
  medium: "trung bình",
  low: "thấp",
  unknown: "chưa xác định"
};

const confidenceLabelsEn: Record<ConfidenceLevel, string> = {
  high: "high",
  medium: "medium",
  low: "low",
  unknown: "unknown"
};

export function regimeLabel(value?: RegimeCategory | string) {
  const key = (value ?? "Unknown") as string;
  if (displayLanguage === "en") {
    return key;
  }
  return regimeLabelsVi[key as RegimeCategory] ?? phraseToVi(key) ?? key;
}

export function confidenceLabel(value?: ConfidenceLevel) {
  const key = value ?? "unknown";
  return displayLanguage === "en" ? confidenceLabelsEn[key] : confidenceLabelsVi[key];
}

export function displayCountryName(country: CountryPoliticalProfile) {
  if (displayLanguage === "en") {
    return regionNamesEn.of(country.iso2) ?? country.englishName ?? country.countryName;
  }
  return regionNamesVi.of(country.iso2) ?? country.countryName;
}

// Curated Vietnamese official names where the generic pattern below would be
// awkward or wrong (proper-noun spelling differs from the short country name).
const OFFICIAL_NAME_VI_OVERRIDES: Record<string, string> = {
  USA: "Hợp chúng quốc Hoa Kỳ",
  GBR: "Vương quốc Liên hiệp Anh và Bắc Ireland",
  CHN: "Cộng hòa Nhân dân Trung Hoa",
  KOR: "Đại Hàn Dân quốc",
  PRK: "Cộng hòa Dân chủ Nhân dân Triều Tiên",
  LAO: "Cộng hòa Dân chủ Nhân dân Lào",
  ARE: "Các Tiểu vương quốc Ả Rập Thống nhất",
  RUS: "Liên bang Nga",
  CHE: "Liên bang Thụy Sĩ",
  MMR: "Cộng hòa Liên bang Myanmar",
  COD: "Cộng hòa Dân chủ Congo",
  COG: "Cộng hòa Congo",
  PSE: "Nhà nước Palestine",
  BOL: "Nhà nước Đa Dân tộc Bolivia",
  ITA: "Cộng hòa Ý",
  TZA: "Cộng hòa Thống nhất Tanzania",
  VAT: "Thành quốc Vatican"
};

// English official-name prefixes → the correctly-cased Vietnamese state form.
// The short country name (correctly cased by Intl) is appended after it.
const OFFICIAL_FORM_PATTERNS: [RegExp, string][] = [
  [/^Socialist Republic of /i, "Cộng hòa Xã hội Chủ nghĩa "],
  [/^Democratic People'?s Republic of /i, "Cộng hòa Dân chủ Nhân dân "],
  [/^People'?s Democratic Republic of /i, "Cộng hòa Dân chủ Nhân dân "],
  [/^Federal Democratic Republic of /i, "Cộng hòa Dân chủ Liên bang "],
  [/^People'?s Republic of /i, "Cộng hòa Nhân dân "],
  [/^Islamic Republic of /i, "Cộng hòa Hồi giáo "],
  [/^Bolivarian Republic of /i, "Cộng hòa Bolivar "],
  [/^Arab Republic of /i, "Cộng hòa Ả Rập "],
  [/^Co-?operative Republic of /i, "Cộng hòa Hợp tác "],
  [/^Federal Republic of /i, "Cộng hòa Liên bang "],
  [/^Democratic Republic of the /i, "Cộng hòa Dân chủ "],
  [/^Democratic Republic of /i, "Cộng hòa Dân chủ "],
  [/^Republic of the /i, "Cộng hòa "],
  [/^Republic of /i, "Cộng hòa "],
  [/^Kingdom of the /i, "Vương quốc "],
  [/^Kingdom of /i, "Vương quốc "],
  [/^Grand Duchy of /i, "Đại Công quốc "],
  [/^Principality of /i, "Công quốc "],
  [/^Sultanate of /i, "Vương quốc Hồi giáo "],
  [/^State of /i, "Nhà nước "],
  [/^Commonwealth of /i, "Thịnh vượng chung "],
  [/^Federation of /i, "Liên bang "],
  [/^Union of /i, "Liên bang "]
];

const VI_FORM_PREFIX =
  /^(Cộng hòa Dân chủ Nhân dân |Cộng hòa Dân chủ |Cộng hòa Nhân dân |Cộng hòa |Vương quốc |Nhà nước |Liên bang |CHDCND |CHDC |CHND )/i;

function bareViName(viName: string) {
  return viName.replace(VI_FORM_PREFIX, "").trim() || viName;
}

// The official country name, rendered with correct Vietnamese capitalization in
// VI mode (e.g. "Cộng hòa Xã hội Chủ nghĩa Việt Nam") and the canonical English
// official name in EN mode.
export function displayOfficialName(country: CountryPoliticalProfile) {
  const officialEn = country.officialName ?? country.englishName ?? country.countryName;
  if (displayLanguage === "en") {
    return officialEn;
  }

  const override = OFFICIAL_NAME_VI_OVERRIDES[country.iso3];
  if (override) {
    return override;
  }

  const viName = regionNamesVi.of(country.iso2) ?? country.countryName;
  for (const [pattern, prefix] of OFFICIAL_FORM_PATTERNS) {
    if (pattern.test(officialEn)) {
      return prefix + bareViName(viName);
    }
  }

  // Adjectival forms without "of" (e.g. "French Republic", "Czech Republic").
  if (/People'?s Democratic Republic$/i.test(officialEn)) return `Cộng hòa Dân chủ Nhân dân ${bareViName(viName)}`;
  if (/Democratic Republic$/i.test(officialEn)) return `Cộng hòa Dân chủ ${bareViName(viName)}`;
  if (/Republic$/i.test(officialEn) && !VI_FORM_PREFIX.test(viName)) return `Cộng hòa ${viName}`;
  if (/Kingdom$/i.test(officialEn) && !VI_FORM_PREFIX.test(viName)) return `Vương quốc ${viName}`;

  // Bare names (Japan, Canada, …) or unmatched: the correctly-cased VI name.
  return viName;
}

// Political model: the researched Vietnamese label is shown in VI mode, the
// English label/category in EN mode. Falls back through the phrase table for
// countries that only have the synthesized (un-researched) category.
export function displayPoliticalModel(country: CountryPoliticalProfile) {
  if (displayLanguage === "en") {
    return country.politicalModel ?? "Data unavailable";
  }
  if (country.politicalModelVi) {
    return country.politicalModelVi;
  }
  if (country.politicalModel) {
    return phraseToVi(country.politicalModel) ?? country.politicalModel;
  }
  return "Chưa có dữ liệu";
}

export function displayRegion(region?: string) {
  if (!region) {
    return displayLanguage === "en" ? "Unknown" : "Chưa xác định";
  }
  return displayLanguage === "en" ? region : phraseToVi(region) ?? region;
}

// Translate a stored (canonical English) data value for display.
export function displayValue(value?: string | number | null) {
  if (value === undefined || value === null || value === "") {
    return displayLanguage === "en" ? "Data unavailable" : "Chưa có dữ liệu";
  }
  if (typeof value === "number") {
    return String(value);
  }
  return displayLanguage === "en" ? value : phraseToVi(value) ?? value;
}

// Legislature names follow institution patterns; translate the institution
// token in Vietnamese mode and keep the proper place name.
export function displayLegislature(value?: string | null) {
  if (!value) {
    return displayLanguage === "en" ? "Data unavailable" : "Chưa có dữ liệu";
  }
  return displayLanguage === "en" ? value : legislatureToVi(value);
}

export function displayNote(note: string) {
  return displayLanguage === "en" ? note : noteToVi(note);
}

export function displaySummary(country: CountryPoliticalProfile) {
  const summary = country.summary;
  if (!summary || isGenericSummary(summary)) {
    return buildGenericSummary(
      {
        englishName: country.englishName,
        countryName: displayCountryName(country),
        region: country.region,
        capital: country.capital,
        population: country.population
      },
      displayLanguage
    );
  }
  return displayLanguage === "en" ? summary : phraseToVi(summary) ?? summary;
}

// UI chrome strings are authored in Vietnamese in the components and translated
// to English here when needed.
export function tr(vi: string) {
  if (displayLanguage === "vi") return vi;
  return UI_STRINGS[vi] ?? vi;
}
