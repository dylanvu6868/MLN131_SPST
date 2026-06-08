import { readCountryProfilesFromDb, upsertCountryProfiles } from "@/lib/db";
import type { CountryPoliticalProfile, DataSource } from "@/lib/types";

const territoryAdmin: Record<string, { sovereign: string; head?: string; government?: string; legislature?: string }> = {
  ALA: { sovereign: "Phần Lan", head: "Tổng thống Phần Lan", government: "Chính phủ tự trị Åland", legislature: "Nghị viện Åland" },
  ASM: { sovereign: "Hoa Kỳ", head: "Tổng thống Hoa Kỳ", government: "Thống đốc American Samoa", legislature: "Fono American Samoa" },
  AIA: { sovereign: "Vương quốc Anh", head: "Quốc vương Vương quốc Anh", government: "Thống đốc và Thủ hiến Anguilla", legislature: "Hạ viện Anguilla" },
  ATA: { sovereign: "Hệ thống Hiệp ước Nam Cực", head: "Không có nguyên thủ quốc gia riêng", government: "Quản trị theo Hệ thống Hiệp ước Nam Cực", legislature: "Không có cơ quan lập pháp quốc gia" },
  BVT: { sovereign: "Na Uy", head: "Quốc vương Na Uy", government: "Na Uy quản lý", legislature: "Không có cơ quan lập pháp địa phương thường trú" },
  IOT: { sovereign: "Vương quốc Anh", head: "Quốc vương Vương quốc Anh", government: "Ủy viên Lãnh thổ Ấn Độ Dương thuộc Anh", legislature: "Không có cơ quan lập pháp dân cử địa phương" },
  VGB: { sovereign: "Vương quốc Anh", head: "Quốc vương Vương quốc Anh", government: "Thống đốc và Thủ tướng Quần đảo Virgin thuộc Anh", legislature: "Hạ viện Quần đảo Virgin thuộc Anh" },
  BES: { sovereign: "Hà Lan", head: "Quốc vương Hà Lan", government: "Cơ quan công quyền Caribe thuộc Hà Lan", legislature: "Hội đồng đảo" },
  CXR: { sovereign: "Úc", head: "Quốc vương Úc", government: "Chính quyền lãnh thổ do Úc quản lý", legislature: "Hội đồng Shire Đảo Christmas" },
  CCK: { sovereign: "Úc", head: "Quốc vương Úc", government: "Chính quyền lãnh thổ do Úc quản lý", legislature: "Hội đồng Shire Quần đảo Cocos" },
  GUF: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Chính quyền lãnh thổ Guyane thuộc Pháp", legislature: "Assemblée de Guyane" },
  PYF: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Tổng thống Chính phủ Polynésie thuộc Pháp", legislature: "Assemblée de la Polynésie française" },
  ATF: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Cơ quan quản trị Vùng đất phía Nam và Nam Cực thuộc Pháp", legislature: "Không có cơ quan lập pháp dân cử thường trú" },
  GLP: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Chính quyền vùng Guadeloupe", legislature: "Hội đồng vùng và hội đồng tỉnh Guadeloupe" },
  GUM: { sovereign: "Hoa Kỳ", head: "Tổng thống Hoa Kỳ", government: "Thống đốc Guam", legislature: "Cơ quan Lập pháp Guam" },
  HMD: { sovereign: "Úc", head: "Quốc vương Úc", government: "Úc quản lý", legislature: "Không có cơ quan lập pháp địa phương thường trú" },
  HKG: { sovereign: "Trung Quốc", head: "Chủ tịch nước Cộng hòa Nhân dân Trung Hoa", government: "Đặc khu trưởng Hồng Kông", legislature: "Hội đồng Lập pháp Hồng Kông" },
  MAC: { sovereign: "Trung Quốc", head: "Chủ tịch nước Cộng hòa Nhân dân Trung Hoa", government: "Trưởng Đặc khu Ma Cao", legislature: "Hội đồng Lập pháp Ma Cao" },
  MTQ: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Chính quyền lãnh thổ Martinique", legislature: "Assemblée de Martinique" },
  MYT: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Chính quyền Mayotte", legislature: "Hội đồng tỉnh Mayotte" },
  NCL: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Chính phủ Nouvelle-Calédonie", legislature: "Đại hội Nouvelle-Calédonie" },
  NFK: { sovereign: "Úc", head: "Quốc vương Úc", government: "Chính quyền Norfolk Island", legislature: "Hội đồng vùng Norfolk Island" },
  MNP: { sovereign: "Hoa Kỳ", head: "Tổng thống Hoa Kỳ", government: "Thống đốc Quần đảo Bắc Mariana", legislature: "Cơ quan lập pháp Khối thịnh vượng chung Bắc Mariana" },
  PCN: { sovereign: "Vương quốc Anh", head: "Quốc vương Vương quốc Anh", government: "Thống đốc Pitcairn", legislature: "Hội đồng Đảo Pitcairn" },
  PRI: { sovereign: "Hoa Kỳ", head: "Tổng thống Hoa Kỳ", government: "Thống đốc Puerto Rico", legislature: "Quốc hội Lập pháp Puerto Rico" },
  REU: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Chính quyền vùng Réunion", legislature: "Hội đồng vùng và hội đồng tỉnh Réunion" },
  BLM: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Chủ tịch Hội đồng lãnh thổ Saint-Barthélemy", legislature: "Hội đồng lãnh thổ Saint-Barthélemy" },
  SHN: { sovereign: "Vương quốc Anh", head: "Quốc vương Vương quốc Anh", government: "Thống đốc Saint Helena, Ascension and Tristan da Cunha", legislature: "Hội đồng Lập pháp Saint Helena" },
  MAF: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Chủ tịch Hội đồng lãnh thổ Saint-Martin", legislature: "Hội đồng lãnh thổ Saint-Martin" },
  SPM: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Chính quyền lãnh thổ Saint-Pierre và Miquelon", legislature: "Hội đồng lãnh thổ Saint-Pierre và Miquelon" },
  SGS: { sovereign: "Vương quốc Anh", head: "Quốc vương Vương quốc Anh", government: "Ủy viên Nam Georgia và Quần đảo Nam Sandwich", legislature: "Không có cơ quan lập pháp dân cử địa phương" },
  SJM: { sovereign: "Na Uy", head: "Quốc vương Na Uy", government: "Thống đốc Svalbard", legislature: "Không có cơ quan lập pháp địa phương đầy đủ" },
  TKL: { sovereign: "New Zealand", head: "Quốc vương New Zealand", government: "Ulu-o-Tokelau và Hội đồng Faipule", legislature: "General Fono" },
  UMI: { sovereign: "Hoa Kỳ", head: "Tổng thống Hoa Kỳ", government: "Hoa Kỳ quản lý", legislature: "Không có cơ quan lập pháp địa phương thường trú" },
  VIR: { sovereign: "Hoa Kỳ", head: "Tổng thống Hoa Kỳ", government: "Thống đốc Quần đảo Virgin thuộc Mỹ", legislature: "Cơ quan lập pháp Quần đảo Virgin thuộc Mỹ" },
  WLF: { sovereign: "Pháp", head: "Tổng thống Pháp", government: "Quản trị viên cấp cao Wallis và Futuna", legislature: "Hội đồng lãnh thổ Wallis và Futuna" },
  ESH: { sovereign: "Tranh chấp / Tây Sahara", head: "Lãnh đạo chính trị của thực thể quản trị/tuyên bố chủ quyền liên quan", government: "Tình trạng quản trị tranh chấp", legislature: "Thiết chế đại diện/tuyên bố chủ quyền có tranh chấp" },
  UNK: { sovereign: "Kosovo", head: "Tổng thống Kosovo", government: "Thủ tướng Kosovo", legislature: "Quốc hội Kosovo" }
};

const manual: Record<string, Partial<CountryPoliticalProfile>> = {
  BWA: { headOfGovernment: "Duma Boko", headOfGovernmentTitle: "Tổng thống / Người đứng đầu chính phủ" },
  SMR: { headOfGovernment: "Quốc hội và Quốc vụ viện San Marino", headOfGovernmentTitle: "Cơ quan hành pháp tập thể" },
  SYR: { headOfGovernment: "Chính phủ chuyển tiếp Syria", headOfGovernmentTitle: "Người đứng đầu chính phủ" },
  VEN: { headOfGovernment: "Tổng thống Venezuela", headOfGovernmentTitle: "Người đứng đầu chính phủ" },
  FLK: { headOfGovernment: "Chính quyền Quần đảo Falkland", headOfGovernmentTitle: "Chính quyền địa phương" },
  AFG: { legislature: "Không có cơ quan lập pháp quốc gia hoạt động đầy đủ theo chuẩn nghị viện dân cử" },
  NLD: { legislature: "Staten-Generaal / Quốc hội Hà Lan" },
  CUB: { gdpPerCapita: undefined },
  PRK: { gdpPerCapita: undefined }
};

function isMissing(value: unknown) {
  return value === undefined || value === null || value === "" || value === "Needs verification" || value === "Unknown" || value === "Data unavailable";
}

function source(field: string): DataSource {
  return {
    name: "Wikipedia / Wikidata / CIA World Factbook cross-check needed",
    url: "https://www.wikidata.org/",
    field,
    retrievedAt: new Date().toISOString()
  };
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

function fallbackGdpPerCapita(profile: CountryPoliticalProfile) {
  if (!isMissing(profile.gdpPerCapita)) return profile.gdpPerCapita;
  if (typeof profile.gdp === "number" && typeof profile.population === "number" && profile.population > 0) {
    return Math.round((profile.gdp / profile.population) * 100) / 100;
  }
  return profile.gdpPerCapita;
}

function main() {
  const profiles = readCountryProfilesFromDb();
  let changed = 0;

  const next = profiles.map((profile) => {
    let p: CountryPoliticalProfile = { ...profile };
    const admin = territoryAdmin[p.iso3];

    if (admin) {
      if (isMissing(p.headOfState)) {
        p.headOfState = admin.head ?? `Nguyên thủ/quốc gia quản lý: ${admin.sovereign}`;
        p.headOfStateTitle = "Nguyên thủ/quốc gia quản lý";
      }
      if (isMissing(p.headOfGovernment)) {
        p.headOfGovernment = admin.government ?? `Chính quyền địa phương dưới chủ quyền/quản lý của ${admin.sovereign}`;
        p.headOfGovernmentTitle = "Chính quyền địa phương";
      }
      if (isMissing(p.legislature)) {
        p.legislature = admin.legislature ?? "Thiết chế địa phương hoặc cơ chế quản trị lãnh thổ";
      }
      p.powerStructure = isMissing(p.powerStructure)
        ? `Lãnh thổ/vùng tự trị gắn với ${admin.sovereign}; quyền lực địa phương chịu ràng buộc bởi khuôn khổ pháp lý của chủ thể quản lý.`
        : p.powerStructure;
    }

    if (manual[p.iso3]) {
      p = { ...p, ...manual[p.iso3] };
    }

    const computedGdppc = fallbackGdpPerCapita(p);
    if (computedGdppc !== p.gdpPerCapita) {
      p.gdpPerCapita = computedGdppc;
    }

    if (isMissing(p.gdp)) {
      p.economicModel = p.economicModel || "Kinh tế hỗn hợp; chưa có số liệu GDP chuẩn hóa trong bộ dữ liệu hiện tại";
    }

    p.sources = dedupeSources([
      ...p.sources,
      source("headOfState"),
      source("headOfGovernment"),
      source("legislature"),
      source("gdpPerCapita")
    ]);
    p.notes = Array.from(new Set([...(p.notes ?? []), "Một số trường của lãnh thổ phụ thuộc/vùng tranh chấp được trình bày theo chủ thể quản lý hoặc cơ chế tự trị, cần đọc cùng nguồn chính thức hiện hành."]));
    p.dataUpdatedAt = new Date().toISOString().slice(0, 10);

    if (JSON.stringify(p) !== JSON.stringify(profile)) changed++;
    return p;
  });

  upsertCountryProfiles(next);
  console.log(`Filled political fallbacks for ${changed}/${profiles.length} profiles.`);
}

main();
