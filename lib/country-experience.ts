import { getCountrySymbolProfile } from "@/lib/country-symbols";
import { displayCountryName, displayRegion, displayValue } from "@/lib/i18n";
import type { CountryPoliticalProfile, CountrySymbolSection, SymbolVerificationLevel } from "@/lib/types";

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
  sections: {
    title: string;
    kicker: string;
    kind: "emblem" | "anthem" | "seal" | "headResidence" | "cultureIdentity" | "historyDepth";
    image?: string;
    imageAlt: string;
    audioUrl?: string;
    sourceLabel?: string;
    sourceUrl?: string;
    verificationLevel: SymbolVerificationLevel;
    licenseNote?: string;
    description: string;
    details: {
      label: string;
      value: string;
    }[];
  }[];
  insights: {
    label: string;
    value: string;
  }[];
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
      { label: "Bản sắc", value: "Độc lập, cộng hòa, xã hội chủ nghĩa" },
      { label: "Quốc ca", value: "Tiến quân ca" },
      { label: "Nguyên thủ", value: "Chủ tịch nước" },
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

    return {
      slug: country.iso3.toLowerCase(),
      iso3: country.iso3,
      name: localName,
      localName,
      theme,
      hero: predefined?.hero ?? {
        subtitle: `Quốc gia ${region} với mô hình ${govSys}`,
        description: `Khám phá ${localName} qua các biểu tượng nhà nước, quốc ca, tòa nhà nguyên thủ, văn hóa và bề dày lịch sử.`,
        image: country.flagSvgUrl ?? `https://picsum.photos/seed/${country.iso3}-hero/1800/1000`
      },
      politics: {
        title: "Hệ thống chính trị",
        summary: `${localName} được đặc trưng bởi cấu trúc nhà nước ${stateForm.toLowerCase()} và vận hành theo mô hình ${govSys.toLowerCase()}. ${
          country.powerStructure ? `Quyền lực được phân bổ theo: ${country.powerStructure}.` : ""
        }`,
        facts: [govSys, stateForm, legSys, `Khu vực: ${region}`]
      },
      sections: buildCountrySections(country, symbolProfile),
      insights: predefined?.insights ?? [
        { label: "Bộ dữ liệu", value: symbolProfile ? "Đã có 6 ô kiểm chứng mẫu" : "Đang chờ xử lý theo batch" },
        { label: "Mức xác minh", value: symbolProfile?.verificationLevel ?? "Cần kiểm chứng thêm" },
        { label: "Mô hình", value: govSys },
        { label: "Hình thức", value: stateForm }
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
  if (symbolProfile) {
    return [
      makeSection("emblem", "Biểu tượng nhà nước", symbolProfile.sections.emblem, symbolProfile.verificationLevel, country),
      makeSection("anthem", "Âm thanh quốc gia", symbolProfile.sections.anthem, symbolProfile.verificationLevel, country),
      makeSection("seal", "Văn bản nhà nước", symbolProfile.sections.seal, symbolProfile.verificationLevel, country),
      makeSection("headResidence", "Nơi nguyên thủ làm việc", symbolProfile.sections.headResidence, symbolProfile.verificationLevel, country),
      makeSection("cultureIdentity", "Bản sắc văn hóa", symbolProfile.sections.cultureIdentity, symbolProfile.verificationLevel, country),
      makeSection("historyDepth", "Lớp thời gian", symbolProfile.sections.historyDepth, symbolProfile.verificationLevel, country)
    ];
  }

  const localName = displayCountryName(country);
  const fallbackSource = "Chưa xác minh được nguồn chính thức";
  const fallbackDescription = `Mục này của ${localName} chưa nằm trong batch dữ liệu đã kiểm chứng. Cần tra cứu nguồn chính thức trước khi gắn hình ảnh hoặc âm thanh.`;

  return [
    makeFallbackSection("emblem", "Quốc huy", "Biểu tượng nhà nước", fallbackDescription, fallbackSource, country),
    makeFallbackSection("anthem", "Quốc ca", "Âm thanh quốc gia", fallbackDescription, fallbackSource, country),
    makeFallbackSection("seal", "Quốc ấn / Con dấu quốc gia", "Văn bản nhà nước", fallbackDescription, fallbackSource, country),
    makeFallbackSection("headResidence", "Tòa nhà nguyên thủ", "Nơi nguyên thủ làm việc", fallbackDescription, fallbackSource, country),
    makeFallbackSection("cultureIdentity", "Bản sắc văn hóa", "Bản sắc văn hóa", fallbackDescription, fallbackSource, country),
    makeFallbackSection("historyDepth", "Bề dày lịch sử", "Lớp thời gian", fallbackDescription, fallbackSource, country)
  ];
}

function makeSection(
  kind: CountryExperience["sections"][number]["kind"],
  kicker: string,
  source: CountrySymbolSection,
  verificationLevel: SymbolVerificationLevel,
  country: CountryPoliticalProfile
): CountryExperience["sections"][number] {
  return {
    title: source.title,
    kicker,
    kind,
    image: source.imageUrl,
    imageAlt: `${source.title} ${displayCountryName(country)}`,
    audioUrl: source.audioUrl,
    sourceLabel: source.sourceUrl ? "Nguồn kiểm chứng" : undefined,
    sourceUrl: source.sourceUrl,
    verificationLevel,
    licenseNote: source.licenseNote,
    description: source.description,
    details: compactDetails([
      ["Tên gọi", source.officialName],
      ["Tên gốc", source.nativeName],
      ["Tác giả lời", source.lyricist],
      ["Tác giả nhạc", source.composer],
      ["Công nhận", source.adopted],
      ["Vai trò", source.role],
      ["Thành phố", source.city],
      ["Địa chỉ", source.address],
      ["Mốc chính", source.keyMilestone],
      ["Số năm", source.yearsCount ? `${source.yearsCount}` : undefined],
      ["Cách tính", source.calculation],
      ["Lịch sử cổ", source.ancientDepth],
      ["Bản quyền", source.licenseNote]
    ])
  };
}

function makeFallbackSection(
  kind: CountryExperience["sections"][number]["kind"],
  title: string,
  kicker: string,
  description: string,
  sourceLabel: string,
  country: CountryPoliticalProfile
): CountryExperience["sections"][number] {
  return {
    title,
    kicker,
    kind,
    imageAlt: `${title} ${displayCountryName(country)}`,
    sourceLabel,
    verificationLevel: "Cần kiểm chứng thêm",
    description,
    details: [["ISO", country.iso3]].map(([label, value]) => ({ label, value }))
  };
}

function compactDetails(rows: [string, string | undefined][]) {
  return rows
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => ({ label, value }));
}
