import { getCountrySymbolProfile } from "@/lib/country-symbols";
import { displayCountryName, displayRegion, displayValue } from "@/lib/i18n";
import {
  SYMBOL_SECTION_META,
  SYMBOL_SECTION_ORDER,
  UNVERIFIED_SOURCE,
  buildFallbackSymbolSectionDetails,
  buildSymbolSectionDetails,
  type SymbolSectionKind
} from "@/lib/symbol-section-config";
import type {
  CountryLeaderEntry,
  CountryPoliticalProfile,
  CountrySymbolSection,
  GeoCoordinates,
  SymbolVerificationLevel
} from "@/lib/types";

export type CountryExperience = {
  slug: string;
  iso3: string;
  name: string;
  localName: string;
  theme: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
    muted: string;
  };
  hero: {
    subtitle: string;
    description: string;
    image: string;
  };
  politics: {
    title: string;
    summary: string;
    facts: string[];
  };
  meta: {
    countryNameEn: string;
    iso2: string;
    iso3: string;
    regionVi: string;
    verificationLevel: SymbolVerificationLevel;
    notes?: string;
  };
  sections: {
    sectionNumber: number;
    title: string;
    officialName?: string;
    kicker: string;
    kind: SymbolSectionKind;
    image?: string;
    imageAlt: string;
    coordinates?: GeoCoordinates;
    mapUrl?: string;
    audioUrl?: string;
    sourceLabel?: string;
    sourceUrl?: string;
    verificationLevel: SymbolVerificationLevel;
    licenseNote?: string;
    description: string;
    details: {
      label: string;
      value: string;
      muted?: boolean;
    }[];
  }[];
  insights: {
    label: string;
    value: string;
  }[];
  leaders: CountryLeaderEntry[];
};

const THEME_PALETTES = [
  { primary: "#B22222", secondary: "#DAA520", background: "#2A1816", accent: "#F2C94C", muted: "#A57465" },
  { primary: "#1B365D", secondary: "#B22234", background: "#121820", accent: "#F5F0E6", muted: "#5C6682" },
  { primary: "#1F4E79", secondary: "#C0392B", background: "#101820", accent: "#F2F2F2", muted: "#5C6682" },
  { primary: "#8B1E1E", secondary: "#D4AF37", background: "#241312", accent: "#C0392B", muted: "#A57465" },
  { primary: "#1F7A4C", secondary: "#B65F1A", background: "#0E2014", accent: "#E9C46A", muted: "#568A6F" },
  { primary: "#4A235A", secondary: "#D4AC0D", background: "#1A0E20", accent: "#F1C40F", muted: "#8E44AD" },
  { primary: "#0B5345", secondary: "#E67E22", background: "#081A15", accent: "#F39C12", muted: "#117864" },
  { primary: "#78281F", secondary: "#F39C12", background: "#1A0E0C", accent: "#E67E22", muted: "#943126" }
];

const HERO_IMAGES: Record<string, string> = {
  VNM: "https://commons.wikimedia.org/wiki/Special:FilePath/Hoi%20An%20Ancient%20Town%2C%20Vietnam%20%287090650319%29.jpg",
  CHN: "https://commons.wikimedia.org/wiki/Special:FilePath/Forbidden%20City.jpg",
  JPN: "https://commons.wikimedia.org/wiki/Special:FilePath/Mt.%20Fuji%20view%20from%20Lake%20Kawaguchi.jpg",
  KOR: "https://commons.wikimedia.org/wiki/Special:FilePath/Gyeongbokgung%20Palace.jpg",
  FRA: "https://commons.wikimedia.org/wiki/Special:FilePath/Louvre%20Museum%20Wikimedia%20Commons.jpg"
};

const PREDEFINED_COPY: Record<
  string,
  Partial<Pick<CountryExperience, "theme" | "hero" | "insights">>
> = {
  VNM: {
    theme: THEME_PALETTES[0],
    hero: {
      subtitle: "Di sản chính trị, bản sắc văn hóa và tinh thần quốc gia",
      description: "Khám phá Việt Nam qua quốc huy, quốc ca, biểu tượng nhà nước, Phủ Chủ tịch, văn hóa và chiều sâu lịch sử.",
      image: HERO_IMAGES.VNM
    },
    insights: [
      { label: "Nguyên thủ", value: "Tô Lâm — Tổng Bí thư & Chủ tịch nước" },
      { label: "Thủ tướng", value: "Lê Minh Hưng (từ 4/2026)" },
      { label: "Quốc ca", value: "Tiến quân ca" },
      { label: "Mốc hiện đại", value: "1945" }
    ]
  },
  CHN: {
    theme: THEME_PALETTES[3],
    hero: {
      subtitle: "Văn minh cổ đại, nhà nước hiện đại và biểu tượng Á Đông",
      description: "Theo dõi Trung Quốc qua quốc huy, quốc ca, dấu ấn nhà nước, Trung Nam Hải, văn hóa và lịch sử hiện đại.",
      image: HERO_IMAGES.CHN
    }
  },
  JPN: {
    theme: { primary: "#F7F3E8", secondary: "#BC002D", background: "#1D1D1D", accent: "#C9A66B", muted: "#A5A0A8" },
    hero: {
      subtitle: "Hiến định hiện đại, nghi lễ hoàng gia và mỹ học tối giản",
      description: "Nhật Bản được trình bày qua biểu tượng hoàng gia, quốc ca, Hoàng cung, văn hóa và hai lớp lịch sử cổ - hiện đại.",
      image: HERO_IMAGES.JPN
    }
  },
  KOR: {
    theme: THEME_PALETTES[2],
    hero: {
      subtitle: "Biểu tượng quốc gia, Hangeul, ký ức độc lập và hiện đại hóa",
      description: "Hàn Quốc được nhìn qua quốc huy, Aegukga, Guksae, Cheong Wa Dae, bản sắc văn hóa và mốc nhà nước 1948.",
      image: HERO_IMAGES.KOR
    }
  },
  FRA: {
    theme: THEME_PALETTES[1],
    hero: {
      subtitle: "Cộng hòa, La Marseillaise và di sản văn hóa châu Âu",
      description: "Pháp được trình bày qua các biểu tượng cộng hòa, quốc ca, Đại ấn, Điện Élysée, văn hóa và Đệ Ngũ Cộng hòa.",
      image: HERO_IMAGES.FRA
    }
  }
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function generateCountryExperiences(profiles: CountryPoliticalProfile[]): CountryExperience[] {
  const sortedProfiles = [...profiles].sort((a, b) => {
    const order = ["VNM", "CHN", "JPN", "KOR", "FRA", "EGY", "IND"];
    const aIndex = order.indexOf(a.iso3);
    const bIndex = order.indexOf(b.iso3);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return displayCountryName(a).localeCompare(displayCountryName(b));
  });

  return sortedProfiles.map((country) => {
    const predefined = PREDEFINED_COPY[country.iso3];
    const themeIndex = hashString(country.iso3) % THEME_PALETTES.length;
    const theme = predefined?.theme ?? THEME_PALETTES[themeIndex];
    const localName = displayCountryName(country);
    const govSys = displayValue(country.governmentSystem);
    const stateForm = displayValue(country.stateForm);
    const legSys = displayValue(country.legislature);
    const region = displayRegion(country.region);
    const symbolProfile = getCountrySymbolProfile(country.iso3);

    const verificationLevel = symbolProfile?.verificationLevel ?? "Cần kiểm chứng thêm";

    return {
      slug: country.iso3.toLowerCase(),
      iso3: country.iso3,
      name: localName,
      localName,
      theme,
      hero: predefined?.hero ?? {
        subtitle: `Quốc gia ${region} với mô hình ${govSys}`,
        description: `Khám phá ${localName} qua 6 ô thông tin chuẩn: quốc huy, quốc ca, quốc ấn, tòa nhà nguyên thủ, bản sắc văn hóa và bề dày lịch sử.`,
        image: country.flagSvgUrl ?? `https://picsum.photos/seed/${country.iso3}-hero/1800/1000`
      },
      meta: {
        countryNameEn: symbolProfile?.countryNameEn ?? country.englishName,
        iso2: symbolProfile?.iso2 ?? country.iso2,
        iso3: country.iso3,
        regionVi: symbolProfile?.regionVi ?? region,
        verificationLevel,
        notes: symbolProfile?.notes
      },
      politics: {
        title: "Hệ thống chính trị",
        summary: `${localName} được đặc trưng bởi cấu trúc nhà nước ${stateForm.toLowerCase()} và vận hành theo mô hình ${govSys.toLowerCase()}. ${
          country.powerStructure ? `Quyền lực được phân bổ theo: ${country.powerStructure}.` : ""
        }`,
        facts: [govSys, stateForm, legSys, `Khu vực: ${region}`]
      },
      sections: buildCountrySections(country, symbolProfile),
      leaders: buildLeaders(country, symbolProfile),
      insights: predefined?.insights ?? [
        { label: "Tên tiếng Anh", value: symbolProfile?.countryNameEn ?? country.englishName },
        { label: "Mã ISO", value: `${symbolProfile?.iso2 ?? country.iso2} · ${country.iso3}` },
        { label: "Khu vực", value: symbolProfile?.regionVi ?? region },
        { label: "Mức xác minh", value: verificationLevel }
      ]
    };
  });
}

export function getDefaultExperience() {
  return undefined;
}

function buildCountrySections(
  country: CountryPoliticalProfile,
  symbolProfile?: ReturnType<typeof getCountrySymbolProfile>
): CountryExperience["sections"] {
  const verificationLevel = symbolProfile?.verificationLevel ?? "Cần kiểm chứng thêm";

  return SYMBOL_SECTION_ORDER.map((kind) => {
    const meta = SYMBOL_SECTION_META[kind];
    const source = symbolProfile?.sections[kind];

    if (source) {
      return makeSection(kind, source, verificationLevel, country);
    }

    return makeFallbackSection(kind, verificationLevel, country);
  });
}

function makeSection(
  kind: SymbolSectionKind,
  source: CountrySymbolSection,
  verificationLevel: SymbolVerificationLevel,
  country: CountryPoliticalProfile
): CountryExperience["sections"][number] {
  const meta = SYMBOL_SECTION_META[kind];

  const coordinates = kind === "headResidence" ? source.coordinates : undefined;

  return {
    sectionNumber: meta.number,
    title: meta.title,
    officialName: source.officialName,
    kicker: meta.kicker,
    kind,
    image: source.imageUrl,
    imageAlt: `${meta.title} ${displayCountryName(country)}`,
    coordinates,
    mapUrl: coordinates ? buildMapUrl(coordinates) : undefined,
    audioUrl: source.audioUrl,
    sourceLabel: source.sourceUrl ? "Nguồn kiểm chứng" : UNVERIFIED_SOURCE,
    sourceUrl: source.sourceUrl,
    verificationLevel,
    licenseNote: source.licenseNote,
    description: source.description,
    details: buildSymbolSectionDetails(kind, source)
  };
}

function makeFallbackSection(
  kind: SymbolSectionKind,
  verificationLevel: SymbolVerificationLevel,
  country: CountryPoliticalProfile
): CountryExperience["sections"][number] {
  const meta = SYMBOL_SECTION_META[kind];
  const localName = displayCountryName(country);

  return {
    sectionNumber: meta.number,
    title: meta.title,
    kicker: meta.kicker,
    kind,
    imageAlt: `${meta.title} ${localName}`,
    sourceLabel: UNVERIFIED_SOURCE,
    verificationLevel,
    description: `Mục ${meta.title} của ${localName} chưa nằm trong batch dữ liệu đã kiểm chứng. Cần tra cứu nguồn chính thức trước khi gắn hình ảnh hoặc âm thanh.`,
    details: buildFallbackSymbolSectionDetails(kind, country.iso3)
  };
}

function buildMapUrl(coordinates: GeoCoordinates) {
  const { lat, lng } = coordinates;
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}

function buildLeaders(
  country: CountryPoliticalProfile,
  symbolProfile?: ReturnType<typeof getCountrySymbolProfile>
): CountryLeaderEntry[] {
  if (symbolProfile?.leaders?.length) {
    return [...symbolProfile.leaders].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }

  const leaders: CountryLeaderEntry[] = [];
  const headName = country.headOfState?.trim();
  const govName = country.headOfGovernment?.trim();

  if (headName && headName !== "N/A" && headName !== "Unknown" && headName !== "Needs verification") {
    leaders.push({
      role: "headOfState",
      title: country.headOfStateTitle ?? "Nguyên thủ quốc gia",
      name: headName,
      since: country.headOfStateSince,
      order: 1
    });
  }

  if (
    govName &&
    govName !== "N/A" &&
    govName !== "Unknown" &&
    govName !== "Needs verification" &&
    govName !== headName
  ) {
    leaders.push({
      role: "headOfGovernment",
      title: country.headOfGovernmentTitle ?? "Người đứng đầu chính phủ",
      name: govName,
      since: country.headOfGovernmentSince,
      order: 2
    });
  }

  return leaders;
}
