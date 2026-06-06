import type { CountrySymbolSection } from "@/lib/types";

export const SYMBOL_SECTION_ORDER = [
  "emblem",
  "anthem",
  "seal",
  "headResidence",
  "cultureIdentity",
  "historyDepth"
] as const;

export type SymbolSectionKind = (typeof SYMBOL_SECTION_ORDER)[number];

export const UNVERIFIED_SOURCE = "Chưa xác minh được nguồn chính thức";

export const SYMBOL_SECTION_META: Record<
  SymbolSectionKind,
  {
    number: number;
    title: string;
    kicker: string;
  }
> = {
  emblem: { number: 1, title: "Quốc Huy", kicker: "Biểu tượng nhà nước" },
  anthem: { number: 2, title: "Quốc Ca", kicker: "Âm thanh quốc gia" },
  seal: { number: 3, title: "Quốc Ấn / Con dấu quốc gia", kicker: "Văn bản nhà nước" },
  headResidence: { number: 4, title: "Tòa nhà nguyên thủ quốc gia", kicker: "Nơi nguyên thủ làm việc" },
  cultureIdentity: { number: 5, title: "Bản sắc văn hóa", kicker: "Văn hóa · Bản sắc" },
  historyDepth: { number: 6, title: "Bề dày lịch sử", kicker: "Lớp thời gian" }
};

type DetailRow = { label: string; value: string; muted?: boolean };

const CURRENT_YEAR = 2026;

function withFallback(value: string | number | undefined, fallback = UNVERIFIED_SOURCE) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  return String(value);
}

function resolveHistoryYears(section: CountrySymbolSection) {
  if (section.yearsCount) {
    return {
      yearsCount: section.yearsCount,
      calculation: section.calculation ?? `${CURRENT_YEAR} − năm mốc = ${section.yearsCount} năm`
    };
  }

  if (section.modernFoundingYear) {
    const yearsCount = CURRENT_YEAR - section.modernFoundingYear;
    return {
      yearsCount,
      calculation: `${CURRENT_YEAR} − ${section.modernFoundingYear} = ${yearsCount} năm`
    };
  }

  return { yearsCount: undefined, calculation: undefined };
}

export function buildSymbolSectionDetails(kind: SymbolSectionKind, section: CountrySymbolSection): DetailRow[] {
  const history = resolveHistoryYears(section);

  switch (kind) {
    case "emblem":
      return [
        { label: "Tên gọi chính thức", value: withFallback(section.officialName) },
        { label: "Nguồn xác minh", value: section.sourceUrl ? "Đã có liên kết nguồn" : UNVERIFIED_SOURCE, muted: !section.sourceUrl }
      ];
    case "anthem":
      return [
        { label: "Tên quốc ca", value: withFallback(section.officialName ?? section.title) },
        { label: "Tên gốc", value: withFallback(section.nativeName) },
        { label: "Tác giả lời", value: withFallback(section.lyricist) },
        { label: "Tác giả nhạc", value: withFallback(section.composer) },
        { label: "Năm công nhận", value: withFallback(section.adopted) },
        { label: "Ghi chú bản quyền", value: withFallback(section.licenseNote) }
      ];
    case "seal":
      return [
        { label: "Tên gọi chính thức", value: withFallback(section.officialName) },
        { label: "Nguồn xác minh", value: section.sourceUrl ? "Đã có liên kết nguồn" : UNVERIFIED_SOURCE, muted: !section.sourceUrl },
        { label: "Biểu tượng thay thế", value: section.licenseNote ? section.licenseNote : UNVERIFIED_SOURCE, muted: !section.licenseNote }
      ];
    case "headResidence":
      return [
        { label: "Tên tòa nhà/dinh thự", value: withFallback(section.officialName ?? section.title) },
        { label: "Vai trò", value: withFallback(section.role) },
        { label: "Thành phố", value: withFallback(section.city) },
        { label: "Địa chỉ", value: withFallback(section.address) },
        {
          label: "Tọa độ (GPS)",
          value: section.coordinates
            ? `${section.coordinates.lat.toFixed(5)}, ${section.coordinates.lng.toFixed(5)}`
            : UNVERIFIED_SOURCE,
          muted: !section.coordinates
        },
        { label: "Nguồn xác minh", value: section.sourceUrl ? "Đã có liên kết nguồn" : UNVERIFIED_SOURCE, muted: !section.sourceUrl }
      ];
    case "cultureIdentity":
      return [
        { label: "Nguồn tham khảo", value: section.sourceUrl ? "Đã có liên kết nguồn" : UNVERIFIED_SOURCE, muted: !section.sourceUrl }
      ];
    case "historyDepth":
      return [
        { label: "Năm hình thành/độc lập", value: withFallback(section.modernFoundingYear) },
        { label: "Mốc lịch sử quan trọng", value: withFallback(section.keyMilestone) },
        { label: "Số năm lịch sử/độc lập", value: withFallback(history.yearsCount) },
        { label: "Cách tính", value: withFallback(history.calculation) },
        { label: "Bề dày văn minh cổ", value: withFallback(section.ancientDepth) },
        { label: "Nguồn xác minh", value: section.sourceUrl ? "Đã có liên kết nguồn" : UNVERIFIED_SOURCE, muted: !section.sourceUrl }
      ];
    default:
      return [];
  }
}

export function buildFallbackSymbolSectionDetails(kind: SymbolSectionKind, iso3: string): DetailRow[] {
  const placeholder = UNVERIFIED_SOURCE;

  switch (kind) {
    case "emblem":
      return [
        { label: "Tên gọi chính thức", value: placeholder, muted: true },
        { label: "Nguồn xác minh", value: placeholder, muted: true }
      ];
    case "anthem":
      return [
        { label: "Tên quốc ca", value: placeholder, muted: true },
        { label: "Tên gốc", value: placeholder, muted: true },
        { label: "Tác giả lời", value: placeholder, muted: true },
        { label: "Tác giả nhạc", value: placeholder, muted: true },
        { label: "Năm công nhận", value: placeholder, muted: true },
        { label: "Ghi chú bản quyền", value: placeholder, muted: true }
      ];
    case "seal":
      return [
        { label: "Tên gọi chính thức", value: placeholder, muted: true },
        { label: "Nguồn xác minh", value: placeholder, muted: true },
        { label: "Biểu tượng thay thế", value: placeholder, muted: true }
      ];
    case "headResidence":
      return [
        { label: "Tên tòa nhà/dinh thự", value: placeholder, muted: true },
        { label: "Vai trò", value: placeholder, muted: true },
        { label: "Thành phố", value: placeholder, muted: true },
        { label: "Địa chỉ", value: placeholder, muted: true },
        { label: "Tọa độ (GPS)", value: placeholder, muted: true },
        { label: "Nguồn xác minh", value: placeholder, muted: true }
      ];
    case "cultureIdentity":
      return [{ label: "Nguồn tham khảo", value: placeholder, muted: true }];
    case "historyDepth":
      return [
        { label: "Năm hình thành/độc lập", value: placeholder, muted: true },
        { label: "Mốc lịch sử quan trọng", value: placeholder, muted: true },
        { label: "Số năm lịch sử/độc lập", value: placeholder, muted: true },
        { label: "Cách tính", value: placeholder, muted: true },
        { label: "Bề dày văn minh cổ", value: placeholder, muted: true },
        { label: "Nguồn xác minh", value: placeholder, muted: true }
      ];
    default:
      return [{ label: "ISO", value: iso3 }];
  }
}
