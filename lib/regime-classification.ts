import type { CountryPoliticalProfile, RegimeCategory } from "@/lib/types";

const liberalDemocracies = new Set([
  "AND", "AUS", "AUT", "BEL", "CAN", "CHE", "CRI", "CYP", "CZE", "DEU", "DNK", "ESP", "EST", "FIN", "FRA", "GBR", "GRC", "IRL", "ISL", "ITA", "JPN", "KOR", "LIE", "LTU", "LUX", "LVA", "MLT", "NLD", "NOR", "NZL", "PRT", "SMR", "SVK", "SVN", "SWE", "TWN", "URY"
]);

const electoralDemocracies = new Set([
  "ALB", "ARG", "ARM", "BGR", "BOL", "BIH", "BWA", "BRA", "BRB", "CHL", "COL", "CPV", "DOM", "ECU", "FJI", "GEO", "GHA", "GRD", "HRV", "IDN", "IND", "ISR", "JAM", "KEN", "KIR", "LKA", "LSO", "MDA", "MEX", "MHL", "MKD", "MNE", "MUS", "MWI", "MYS", "NAM", "NRU", "PAN", "PER", "PHL", "PLW", "POL", "ROU", "SEN", "SLB", "SRB", "STP", "SUR", "TLS", "TTO", "TUN", "TUV", "VUT", "WSM", "ZAF", "ZMB"
]);

const closedAutocracies = new Set([
  "AFG", "CHN", "CUB", "ERI", "IRN", "LAO", "PRK", "SAU", "SYR", "TKM", "VAT", "YEM"
]);

const electoralAutocracies = new Set([
  "AGO", "AZE", "BDI", "BFA", "BGD", "BHR", "BLR", "BRN", "CAF", "CMR", "COG", "COM", "DJI", "DZA", "EGY", "ETH", "GAB", "GNQ", "GTM", "GIN", "GNB", "GUY", "HND", "HTI", "IRQ", "JOR", "KAZ", "KGZ", "KHM", "KWT", "LBN", "LBR", "LBY", "MAR", "MDG", "MDV", "MLI", "MMR", "MOZ", "MRT", "NER", "NGA", "NIC", "OMN", "PAK", "PSE", "QAT", "RUS", "RWA", "SDN", "SGP", "SLE", "SLV", "SOM", "SSD", "SWZ", "TCD", "TGO", "THA", "TJK", "TUR", "TZA", "UGA", "UKR", "UZB", "VEN", "VNM", "ZWE"
]);

const monarchies = new Set([
  "AND", "ATG", "AUS", "BHS", "BHR", "BEL", "BLZ", "BRB", "BRN", "BTN", "CAN", "DNK", "ESP", "GBR", "GRD", "JAM", "JOR", "JPN", "KHM", "KNA", "KWT", "LCA", "LIE", "LSO", "LUX", "MAR", "MCO", "NLD", "NOR", "NZL", "OMN", "PNG", "QAT", "SAU", "SLB", "SWE", "SWZ", "THA", "TON", "TUV", "VAT", "VCT"
]);

const federalStates = new Set([
  "ARG", "AUS", "AUT", "BEL", "BIH", "BRA", "CAN", "CHE", "COM", "DEU", "ETH", "FSM", "IND", "IRQ", "MEX", "MYS", "NGA", "NPL", "PAK", "RUS", "SDN", "SOM", "SSD", "ARE", "USA", "VEN"
]);

const territoryIso3 = new Set([
  "ABW", "AIA", "ALA", "ASM", "ATA", "BES", "BMU", "BVT", "CCK", "COK", "CUW", "CXR", "CYM", "FLK", "FRO", "GUF", "GGY", "GIB", "GLP", "GRL", "GUM", "HKG", "HMD", "IMN", "IOT", "JEY", "MAC", "MAF", "MNP", "MSR", "MTQ", "MYT", "NCL", "NFK", "NIU", "PCN", "PRI", "PYF", "REU", "SGS", "SHN", "SJM", "SPM", "SXM", "TCA", "TKL", "UMI", "VGB", "VIR", "WLF"
]);

export function inferRegimeCategory(country: Pick<CountryPoliticalProfile, "iso3" | "region" | "politicalRegime" | "regimeCategory">): RegimeCategory {
  if (country.regimeCategory && country.regimeCategory !== "Unknown") {
    return country.regimeCategory;
  }

  const iso3 = country.iso3.toUpperCase();
  if (liberalDemocracies.has(iso3)) return "Liberal democracy";
  if (electoralDemocracies.has(iso3)) return "Electoral democracy";
  if (closedAutocracies.has(iso3)) return "Closed autocracy";
  if (electoralAutocracies.has(iso3)) return "Electoral autocracy";

  if (territoryIso3.has(iso3)) {
    return "Electoral democracy";
  }

  if (country.region === "Europe" || country.region === "Oceania") {
    return "Electoral democracy";
  }

  if (country.region === "Africa" || country.region === "Asia") {
    return "Electoral autocracy";
  }

  if (country.region === "Americas") {
    return "Electoral democracy";
  }

  return "Electoral democracy";
}

export function enrichPoliticalDefaults(profile: CountryPoliticalProfile): CountryPoliticalProfile {
  const regimeCategory = inferRegimeCategory(profile);
  const isMonarchy = profile.isMonarchy ?? monarchies.has(profile.iso3);
  const isFederal = profile.isFederal ?? federalStates.has(profile.iso3);
  const isRepublic = profile.isRepublic ?? (!isMonarchy && !territoryIso3.has(profile.iso3));
  const isUnitary = profile.isUnitary ?? (!isFederal && !territoryIso3.has(profile.iso3));
  const isTerritory = territoryIso3.has(profile.iso3);

  const stateForm = needsReview(profile.stateForm)
    ? isTerritory
      ? "Lãnh thổ Phụ thuộc / Vùng Tự trị"
      : isFederal
        ? isMonarchy
          ? "Quân chủ Liên bang"
          : "Cộng hòa Liên bang"
        : isMonarchy
          ? "Quân chủ Đơn nhất"
          : "Cộng hòa Đơn nhất"
    : profile.stateForm;

  const governmentSystem = needsReview(profile.governmentSystem)
    ? isTerritory
      ? "Chính quyền lãnh thổ trong khuôn khổ quốc gia quản lý"
      : isMonarchy
        ? "Quân chủ Lập hiến hoặc Quân chủ Chuyên chế tùy bối cảnh"
        : regimeCategory === "Closed autocracy"
          ? "Chính quyền tập trung quyền lực cao"
          : regimeCategory === "Electoral autocracy"
            ? "Cộng hòa có bầu cử với cạnh tranh chính trị hạn chế"
            : "Chính thể dân chủ đại diện"
    : profile.governmentSystem;

  const politicalRegime = needsReview(profile.politicalRegime) ? regimeCategory : profile.politicalRegime;
  const politicalModel = needsReview(profile.politicalModel)
    ? derivePoliticalModel(profile, regimeCategory, isMonarchy, isTerritory)
    : profile.politicalModel;
  const officialIdeology = needsReview(profile.officialIdeology) ? "Không có hệ tư tưởng chính thức duy nhất / cần đối chiếu nguồn hiến định" : profile.officialIdeology;
  const powerStructure = needsReview(profile.powerStructure)
    ? powerStructureFor(regimeCategory, isTerritory)
    : profile.powerStructure;
  const economicModel = needsReview(profile.economicModel) ? "Kinh tế hỗn hợp; mức độ can thiệp nhà nước khác nhau theo từng quốc gia" : profile.economicModel;

  const summary = needsReview(profile.summary)
    ? buildVietnameseSummary({ ...profile, regimeCategory, stateForm, governmentSystem, powerStructure })
    : profile.summary;

  const sources = dedupeSources([
    ...(profile.sources ?? []),
    {
      name: "Wikipedia",
      url: wikipediaSearchUrl(profile.englishName || profile.countryName),
      field: "country-background"
    },
    {
      name: "Wikipedia tiếng Việt",
      url: vietnameseWikipediaSearchUrl(profile.countryName),
      field: "country-background-vi"
    }
  ]);

  const notes = dedupeStrings([
    ...(profile.notes ?? []),
    "Phân loại chế độ trên bản đồ là lớp tham chiếu trực quan, cần đọc cùng phương pháp luận và nguồn dữ liệu cập nhật."
  ]);

  return {
    ...profile,
    regimeCategory,
    stateForm,
    governmentSystem,
    politicalRegime,
    politicalModel,
    officialIdeology,
    powerStructure,
    economicModel,
    summary,
    isMonarchy,
    isRepublic,
    isFederal,
    isUnitary,
    sources,
    notes,
    confidenceLevel: profile.confidenceLevel === "unknown" ? "medium" : profile.confidenceLevel
  };
}

function needsReview(value?: string | null) {
  return !value || value === "Needs verification" || value === "Data unavailable" || value === "Unknown";
}

// A single concise, comparable label for each country's political model,
// synthesized from the regime category, ruling-party structure and state form.
// English-canonical (translated for display via the phrase table). Read it
// alongside the more granular regime/state-form fields, not as a sole label.
function derivePoliticalModel(
  profile: CountryPoliticalProfile,
  regimeCategory: RegimeCategory,
  isMonarchy: boolean,
  isTerritory: boolean
): string {
  if (isTerritory) return "Dependent territory / special administration";
  if (profile.hasCommunistRulingParty) return "One-party socialist state";
  if (profile.hasMilitaryGovernment) return "Military-led government";
  if (isMonarchy && regimeCategory === "Closed autocracy") return "Absolute monarchy";

  switch (regimeCategory) {
    case "Liberal democracy":
      return "Multi-party liberal democracy";
    case "Electoral democracy":
      return "Multi-party electoral democracy";
    case "Electoral autocracy":
      return "Electoral authoritarian system";
    case "Closed autocracy":
      return "Authoritarian system";
    default:
      break;
  }

  if (isMonarchy) return "Constitutional monarchy";
  return "Mixed system; needs verification";
}

function powerStructureFor(category: RegimeCategory, isTerritory: boolean) {
  if (isTerritory) return "Quyền lực địa phương chịu ràng buộc bởi quốc gia hoặc thể chế quản lý lãnh thổ.";
  if (category === "Liberal democracy") return "Quyền lực được kiểm soát bởi bầu cử cạnh tranh, pháp quyền và các thiết chế đối trọng mạnh.";
  if (category === "Electoral democracy") return "Quyền lực hình thành qua bầu cử đa đảng, với mức độ đối trọng và chất lượng thể chế khác nhau.";
  if (category === "Electoral autocracy") return "Có bầu cử nhưng cạnh tranh chính trị, truyền thông hoặc thiết chế đối trọng bị hạn chế đáng kể.";
  if (category === "Closed autocracy") return "Quyền lực tập trung cao, cạnh tranh chính trị thực chất rất hạn chế hoặc không tồn tại.";
  return "Cấu trúc quyền lực cần được đối chiếu thêm từ nguồn chuyên ngành.";
}

function buildVietnameseSummary(country: CountryPoliticalProfile) {
  const name = country.countryName;
  const region = country.region === "Americas" ? "châu Mỹ" : country.region === "Africa" ? "châu Phi" : country.region === "Asia" ? "châu Á" : country.region === "Europe" ? "châu Âu" : country.region === "Oceania" ? "châu Đại Dương" : "khu vực chưa xác định";
  const capital = country.capital ? ` Thủ đô là ${country.capital}.` : "";
  const population = typeof country.population === "number" ? ` Dân số khoảng ${new Intl.NumberFormat("vi-VN").format(country.population)} người.` : "";
  return `${name} là một quốc gia hoặc vùng lãnh thổ thuộc ${region}.${capital}${population} Hồ sơ này trình bày theo các lớp: nhóm chế độ, hình thức nhà nước, mô hình chính phủ, cấu trúc quyền lực, kinh tế và nguồn tham khảo để người đọc so sánh một cách trung lập.`;
}

function wikipediaSearchUrl(name: string) {
  return `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(name)}`;
}

function vietnameseWikipediaSearchUrl(name: string) {
  return `https://vi.wikipedia.org/wiki/%C4%90%E1%BA%B7c_bi%E1%BB%87t:T%C3%ACm_ki%E1%BA%BFm?search=${encodeURIComponent(name)}`;
}

function dedupeSources(sources: NonNullable<CountryPoliticalProfile["sources"]>) {
  const seen = new Set<string>();
  return sources.filter((source) => {
    const key = `${source.name}:${source.url ?? ""}:${source.field ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}
