import { readCountryProfilesFromDb, upsertCountryProfiles } from "@/lib/db";
import type { CountryPoliticalProfile, DataSource } from "@/lib/types";

const economyFallbacks: Record<string, { gdp?: number; gdpPerCapita?: number; note: string }> = {
  ALA: { note: "Kinh tế lãnh thổ tự trị nhỏ; số liệu GDP chuẩn hóa quốc tế không có trong World Bank." },
  AIA: { note: "Lãnh thổ hải ngoại; số liệu GDP có thể nằm trong nguồn thống kê địa phương/UK OTs." },
  ATA: { note: "Nam Cực không có nền kinh tế quốc gia theo nghĩa thông thường." },
  BVT: { note: "Đảo không có dân cư thường trú; không áp dụng GDP quốc gia." },
  IOT: { note: "Lãnh thổ quân sự/đặc thù; GDP dân sự không được chuẩn hóa." },
  VGB: { note: "Lãnh thổ hải ngoại; cần nguồn thống kê địa phương cho GDP." },
  BES: { note: "Đơn vị đặc biệt thuộc Hà Lan; số liệu thường tách theo thống kê Hà Lan/Caribe." },
  CXR: { note: "Lãnh thổ ngoài khơi của Úc; số liệu GDP không tách chuẩn trong World Bank." },
  CCK: { note: "Lãnh thổ ngoài khơi của Úc; số liệu GDP không tách chuẩn trong World Bank." },
  COK: { note: "Quốc gia liên kết New Zealand; một số nguồn quốc tế không có chuỗi GDP đầy đủ." },
  FLK: { note: "Lãnh thổ hải ngoại; số liệu GDP thường lấy từ thống kê địa phương." },
  GUF: { note: "Vùng hải ngoại của Pháp; GDP thường nằm trong thống kê Pháp/INSEE." },
  ATF: { note: "Vùng lãnh thổ không có dân cư thường trú; GDP quốc gia không áp dụng." },
  GIB: { note: "Lãnh thổ hải ngoại; cần nguồn thống kê địa phương Gibraltar." },
  GLP: { note: "Vùng hải ngoại của Pháp; GDP thường nằm trong thống kê Pháp/INSEE." },
  GGY: { note: "Crown Dependency; số liệu GDP nằm ở thống kê địa phương Guernsey." },
  HMD: { note: "Đảo không có dân cư thường trú; không áp dụng GDP quốc gia." },
  JEY: { note: "Crown Dependency; số liệu GDP nằm ở thống kê địa phương Jersey." },
  UNK: { note: "Kosovo có dữ liệu kinh tế ở một số nguồn nhưng không chuẩn hóa trong toàn bộ bộ dữ liệu hiện tại." },
  MTQ: { note: "Vùng hải ngoại của Pháp; GDP thường nằm trong thống kê Pháp/INSEE." },
  MYT: { note: "Vùng hải ngoại của Pháp; GDP thường nằm trong thống kê Pháp/INSEE." },
  MSR: { note: "Lãnh thổ hải ngoại; cần nguồn thống kê địa phương Montserrat." },
  NIU: { note: "Quốc gia liên kết New Zealand; chuỗi GDP quốc tế không đầy đủ." },
  NFK: { note: "Lãnh thổ ngoài khơi của Úc; số liệu GDP không tách chuẩn trong World Bank." },
  PRK: { note: "Triều Tiên không công bố đầy đủ dữ liệu GDP theo chuẩn World Bank/IMF." },
  PCN: { note: "Dân số rất nhỏ; không có GDP quốc gia chuẩn hóa." },
  REU: { note: "Vùng hải ngoại của Pháp; GDP thường nằm trong thống kê Pháp/INSEE." },
  BLM: { note: "Cộng đồng hải ngoại của Pháp; cần nguồn thống kê địa phương/INSEE." },
  SHN: { note: "Lãnh thổ hải ngoại; cần nguồn thống kê địa phương Saint Helena." },
  SPM: { note: "Cộng đồng hải ngoại của Pháp; cần nguồn thống kê địa phương/INSEE." },
  SGS: { note: "Không có dân cư thường trú; GDP quốc gia không áp dụng." },
  SJM: { note: "Lãnh thổ đặc thù của Na Uy; GDP địa phương không chuẩn hóa như quốc gia." },
  TWN: { note: "Đài Loan không có trong một số API World Bank quốc gia; cần nguồn thống kê Đài Loan/IMF." },
  TKL: { note: "Lãnh thổ phụ thuộc New Zealand; dữ liệu GDP quốc tế không đầy đủ." },
  UMI: { note: "Các đảo nhỏ xa bờ của Hoa Kỳ; không có GDP quốc gia riêng." },
  VAT: { note: "Vatican không công bố GDP theo chuẩn quốc gia thông thường." },
  WLF: { note: "Cộng đồng hải ngoại của Pháp; cần nguồn thống kê địa phương/INSEE." },
  ESH: { note: "Tây Sahara có tình trạng tranh chấp; số liệu GDP chuẩn hóa không thống nhất." }
};

function source(field: string): DataSource {
  return {
    name: "Economic fallback note",
    url: "https://data.worldbank.org/",
    field,
    retrievedAt: new Date().toISOString()
  };
}

function isMissingNumber(value?: number) {
  return typeof value !== "number" || !Number.isFinite(value) || value <= 0;
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

function main() {
  const profiles = readCountryProfilesFromDb();
  let updated = 0;

  const next = profiles.map((profile): CountryPoliticalProfile => {
    const fallback = economyFallbacks[profile.iso3];
    if (!fallback) return profile;

    const nextProfile: CountryPoliticalProfile = { ...profile };
    if (isMissingNumber(nextProfile.gdp) && fallback.gdp) nextProfile.gdp = fallback.gdp;
    if (isMissingNumber(nextProfile.gdpPerCapita) && fallback.gdpPerCapita) nextProfile.gdpPerCapita = fallback.gdpPerCapita;

    nextProfile.economicModel = nextProfile.economicModel || "Kinh tế đặc thù/lãnh thổ phụ thuộc; số liệu cần nguồn địa phương.";
    nextProfile.notes = Array.from(new Set([...(nextProfile.notes ?? []), fallback.note]));
    nextProfile.sources = dedupeSources([...nextProfile.sources, source("gdp"), source("gdpPerCapita")]);
    nextProfile.dataUpdatedAt = new Date().toISOString().slice(0, 10);
    updated++;
    return nextProfile;
  });

  upsertCountryProfiles(next);
  console.log(`Added economic fallback notes for ${updated}/${profiles.length} profiles.`);
}

main();
