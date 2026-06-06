import fs from "node:fs";

import {
  SYMBOL_SECTION_META,
  SYMBOL_SECTION_ORDER,
  UNVERIFIED_SOURCE,
  type SymbolSectionKind
} from "../lib/symbol-section-config";
import type { CountrySymbolProfile, SymbolVerificationLevel } from "../lib/types";

const profilesPath = "./data/country-symbol-profiles.json";
const CURRENT_YEAR = 2026;

function normalizeVerificationLevel(value: unknown): SymbolVerificationLevel {
  if (value === "Cao" || value === "Trung bình" || value === "Cần kiểm chứng thêm") {
    return value;
  }

  if (value === "Dữ liệu Wikipedia") {
    return "Trung bình";
  }

  return "Cần kiểm chứng thêm";
}

function normalizeSectionTitle(kind: SymbolSectionKind, title: string, officialName?: string) {
  const standardTitle = SYMBOL_SECTION_META[kind].title;
  const normalizedOfficialName = officialName?.trim() || undefined;

  if (title.trim() === standardTitle) {
    return { title: standardTitle, officialName: normalizedOfficialName };
  }

  if (!normalizedOfficialName) {
    return { title: standardTitle, officialName: title.trim() };
  }

  return { title: standardTitle, officialName: normalizedOfficialName };
}

function normalizeProfile(profile: CountrySymbolProfile): CountrySymbolProfile {
  const verificationLevel = normalizeVerificationLevel(profile.verificationLevel);
  const mainSourceUrl = profile.mainSources.find((source) => source.url)?.url;

  const sections = Object.fromEntries(
    SYMBOL_SECTION_ORDER.map((kind) => {
      const section = profile.sections[kind];
      const { title, officialName } = normalizeSectionTitle(kind, section.title, section.officialName);
      const sourceUrl = section.sourceUrl ?? mainSourceUrl;
      const historyYears =
        section.yearsCount ??
        (section.modernFoundingYear ? CURRENT_YEAR - section.modernFoundingYear : undefined);
      const calculation =
        section.calculation ??
        (section.modernFoundingYear && historyYears
          ? `${CURRENT_YEAR} − ${section.modernFoundingYear} = ${historyYears} năm`
          : undefined);

      return [
        kind,
        {
          ...section,
          title,
          officialName,
          sourceUrl,
          yearsCount: historyYears,
          calculation,
          description:
            section.description?.trim() ||
            `Mục ${SYMBOL_SECTION_META[kind].title} của ${profile.countryNameVi} chưa có mô tả đã kiểm chứng.`
        }
      ];
    })
  ) as CountrySymbolProfile["sections"];

  return {
    ...profile,
    verificationLevel,
    sections,
    notes:
      profile.notes?.trim() ||
      (verificationLevel === "Cần kiểm chứng thêm"
        ? "Một số trường cần kiểm chứng thêm từ nguồn chính thức."
        : undefined)
  };
}

function main() {
  const raw = JSON.parse(fs.readFileSync(profilesPath, "utf8")) as CountrySymbolProfile[];
  const normalized = raw.map(normalizeProfile);

  const missingSourceCount = normalized.reduce((count, profile) => {
    const missing = SYMBOL_SECTION_ORDER.some((kind) => !profile.sections[kind].sourceUrl);
    return count + (missing ? 1 : 0);
  }, 0);

  fs.writeFileSync(profilesPath, JSON.stringify(normalized, null, 2));

  console.log(`Normalized ${normalized.length} symbol profiles.`);
  console.log(`Profiles missing at least one section source: ${missingSourceCount}`);
  console.log(`Fallback source label when missing: ${UNVERIFIED_SOURCE}`);
}

main();
