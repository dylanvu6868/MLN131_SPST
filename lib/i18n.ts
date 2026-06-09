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
