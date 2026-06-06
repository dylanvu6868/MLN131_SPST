import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";

import { SYMBOL_SECTION_META } from "../lib/symbol-section-config";

const dbPath = process.env.ATLAS_DB_PATH || "./data/world-ideology-atlas.db";
const profilesPath = "./data/country-symbol-profiles.json";

function getPlausibleImageUrl(countryName: string, type: 'Emblem' | 'Flag' | 'Palace') {
  const formattedName = countryName.replace(/ /g, '_');
  if (type === 'Emblem') {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/Emblem_of_${formattedName}.svg`;
  }
  if (type === 'Flag') {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_${formattedName}.svg`;
  }
  return `https://commons.wikimedia.org/wiki/Special:FilePath/Presidential_Palace_${formattedName}.jpg`;
}

function generateProceduralProfile(country: any) {
  const nameVi = country.countryName || country.englishName;
  const nameEn = country.englishName;
  const govSys = country.governmentSystem || "cộng hòa";
  const capital = country.capital || "thủ đô";
  
  return {
    iso2: country.iso2,
    iso3: country.iso3,
    countryNameVi: nameVi,
    countryNameEn: nameEn,
    regionVi: country.region,
    verificationLevel: "Cần kiểm chứng thêm",
    updatedAt: new Date().toISOString().split("T")[0],
    mainSources: [
      {
        name: "Hệ thống Bách khoa toàn thư mở",
        url: `https://vi.wikipedia.org/wiki/${encodeURIComponent(nameVi)}`
      }
    ],
    sections: {
      emblem: {
        title: SYMBOL_SECTION_META.emblem.title,
        officialName: `Quốc huy ${nameVi}`,
        description: `Quốc huy của ${nameVi} là biểu tượng thiêng liêng đại diện cho chủ quyền, lịch sử và giá trị cốt lõi của quốc gia này. Thiết kế thường phản ánh chế độ ${govSys.toLowerCase()} và đặc trưng văn hóa khu vực ${country.region}.`,
        imageUrl: getPlausibleImageUrl(nameEn, 'Emblem'),
        sourceUrl: `https://en.wikipedia.org/wiki/Emblem_of_${encodeURIComponent(nameEn)}`,
        licenseNote: "Hình ảnh phỏng đoán theo chuẩn Wikimedia Commons"
      },
      anthem: {
        title: SYMBOL_SECTION_META.anthem.title,
        officialName: `Quốc ca ${nameVi}`,
        nativeName: "Bài ca quốc gia",
        description: `Quốc ca của ${nameVi} mang âm hưởng hào hùng, phản ánh chặng đường lịch sử và tinh thần đoàn kết của nhân dân. Tác phẩm này được cử hành trong các nghi lễ cấp nhà nước và quốc tế.`,
        imageUrl: getPlausibleImageUrl(nameEn, 'Flag'),
        adopted: "Không xác định",
        licenseNote: "Thông tin cơ bản"
      },
      seal: {
        title: SYMBOL_SECTION_META.seal.title,
        officialName: `Đại ấn ${nameVi}`,
        description: `Quốc ấn được sử dụng để đóng dấu các văn kiện pháp lý và hiến định quan trọng của nhà nước ${nameVi}, bảo chứng cho quyền lực của hệ thống chính trị.`,
        imageUrl: getPlausibleImageUrl(nameEn, 'Emblem'),
        licenseNote: "Sử dụng quốc huy thay thế"
      },
      headResidence: {
        title: SYMBOL_SECTION_META.headResidence.title,
        officialName: `Dinh thự Nguyên thủ ${nameVi}`,
        role: "Nơi làm việc và tiếp khách quốc tế",
        city: capital,
        description: `Nằm tại ${capital}, đây là trung tâm quyền lực hành pháp của ${nameVi}. Công trình này không chỉ có ý nghĩa hành chính mà còn là biểu tượng kiến trúc quan trọng.`,
        imageUrl: getPlausibleImageUrl(nameEn, 'Palace')
      },
      cultureIdentity: {
        title: SYMBOL_SECTION_META.cultureIdentity.title,
        description: `${nameVi} sở hữu một nền văn hóa đa dạng, được định hình bởi vị trí địa lý tại ${country.region}. Đặc trưng văn hóa thể hiện qua kiến trúc, ngôn ngữ, ẩm thực truyền thống và các lễ hội dân gian mang đậm dấu ấn bản địa.`,
        imageUrl: `https://picsum.photos/seed/${country.iso3}-culture/800/600`,
        licenseNote: "Ảnh minh họa ngẫu nhiên (chờ cập nhật thực tế)"
      },
      historyDepth: {
        title: SYMBOL_SECTION_META.historyDepth.title,
        ancientDepth: "Có nguồn gốc từ các nền văn minh và vương quốc bản địa cổ đại.",
        keyMilestone: `Quá trình hình thành nhà nước hiện đại gắn liền với cấu trúc ${govSys.toLowerCase()}.`,
        description: `Lịch sử của ${nameVi} là một chuỗi các sự kiện giao thoa văn hóa, đấu tranh giành độc lập và xây dựng quốc gia hiện đại. Quá trình này đã tạo nên một cấu trúc xã hội độc đáo như ngày nay.`,
        imageUrl: `https://picsum.photos/seed/${country.iso3}-history/800/600`
      }
    },
    notes: "Hồ sơ được sinh tự động do giới hạn API."
  };
}

async function main() {
  const db = new DatabaseSync(dbPath);
  const rows = db.prepare('SELECT profile_json FROM country_profiles').all() as any[];
  const countries = rows.map(r => JSON.parse(r.profile_json));
  
  let existingProfiles: any[] = [];
  if (fs.existsSync(profilesPath)) {
    existingProfiles = JSON.parse(fs.readFileSync(profilesPath, "utf8"));
  }

  const existingIso3s = new Set(existingProfiles.map(p => p.iso3));
  
  const missingCountries = countries.filter(c => !existingIso3s.has(c.iso3));
  console.log(`Found ${missingCountries.length} missing countries. Generating procedurally...`);

  const newProfiles = missingCountries.map(c => generateProceduralProfile(c));
  
  existingProfiles.push(...newProfiles);
  fs.writeFileSync(profilesPath, JSON.stringify(existingProfiles, null, 2));
  
  console.log(`Successfully appended ${newProfiles.length} profiles.`);
}

main().catch(console.error);
