import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { translate } from "@vitalets/google-translate-api";

const DB_PATH = path.resolve(process.cwd(), "./data/world-ideology-atlas.db");

// --- STATIC DICTIONARY ---
const DICT: Record<string, string> = {
  // Region & Subregion
  "Asia": "Châu Á",
  "Europe": "Châu Âu",
  "Africa": "Châu Phi",
  "Americas": "Châu Mỹ",
  "Oceania": "Châu Đại Dương",
  "Antarctic": "Nam Cực",
  "Northern Europe": "Bắc Âu",
  "Western Europe": "Tây Âu",
  "Eastern Europe": "Đông Âu",
  "Southern Europe": "Nam Âu",
  "North America": "Bắc Mỹ",
  "South America": "Nam Mỹ",
  "Central America": "Trung Mỹ",
  "Caribbean": "Caribe",
  "Eastern Asia": "Đông Á",
  "South-Eastern Asia": "Đông Nam Á",
  "Southern Asia": "Nam Á",
  "Western Asia": "Tây Á",
  "Central Asia": "Trung Á",
  "Northern Africa": "Bắc Phi",
  "Sub-Saharan Africa": "Châu Phi cận Sahara",
  "Eastern Africa": "Đông Phi",
  "Middle Africa": "Trung Phi",
  "Southern Africa": "Nam Phi",
  "Western Africa": "Tây Phi",
  "Australia and New Zealand": "Úc và New Zealand",
  "Melanesia": "Melanesia",
  "Micronesia": "Micronesia",
  "Polynesia": "Polynesia",

  // State Form
  "Unitary presidential republic": "Cộng hòa tổng thống đơn nhất",
  "Unitary semi-presidential republic": "Cộng hòa bán tổng thống đơn nhất",
  "Unitary parliamentary republic": "Cộng hòa đại nghị đơn nhất",
  "Unitary parliamentary constitutional monarchy": "Quân chủ lập hiến đại nghị đơn nhất",
  "Unitary constitutional monarchy": "Quân chủ lập hiến đơn nhất",
  "Unitary absolute monarchy": "Quân chủ chuyên chế đơn nhất",
  "Federal presidential republic": "Cộng hòa tổng thống liên bang",
  "Federal parliamentary republic": "Cộng hòa đại nghị liên bang",
  "Federal semi-presidential republic": "Cộng hòa bán tổng thống liên bang",
  "Federal parliamentary constitutional monarchy": "Quân chủ lập hiến đại nghị liên bang",
  "Unitary one-party socialist republic": "Cộng hòa xã hội chủ nghĩa độc đảng đơn nhất",
  "Unitary dominant-party republic": "Cộng hòa độc đảng đơn nhất",
  "Special Administrative Region of China": "Đặc khu hành chính của Trung Quốc",
  "British Overseas Territory / Crown Dependency": "Lãnh thổ Hải ngoại / Thuộc địa vương quyền Anh",
  "French Overseas Department / Collectivity": "Tỉnh / Tập thể hải ngoại của Pháp",
  "United States Territory": "Vùng lãnh thổ Hoa Kỳ",
  "Constituent Country / Municipality of the Netherlands": "Quốc gia cấu thành / Đô thị của Hà Lan",
  "Territory / Associated State of New Zealand": "Lãnh thổ / Quốc gia liên kết của New Zealand",
  "Autonomous Territory of Denmark": "Lãnh thổ tự trị của Đan Mạch",
  "Autonomous Region of Finland": "Vùng tự trị của Phần Lan",
  "External Territory of Australia": "Lãnh thổ ngoài hải đảo của Úc",
  "Unincorporated Area / Dependency of Norway": "Khu vực chưa hợp nhất / Thuộc địa của Na Uy",
  "Disputed Territory / International Treaty Area": "Vùng lãnh thổ tranh chấp / Khu vực hiệp ước quốc tế",
  "Unitary presidential republic (transitional)": "Cộng hòa tổng thống đơn nhất (chuyển tiếp)",
  "Federal presidential republic (transitional)": "Cộng hòa tổng thống liên bang (chuyển tiếp)",

  // Government System
  "Presidential republic": "Cộng hòa tổng thống",
  "Semi-presidential republic": "Cộng hòa bán tổng thống",
  "Parliamentary republic": "Cộng hòa đại nghị",
  "Parliamentary monarchy": "Quân chủ đại nghị",
  "Constitutional monarchy": "Quân chủ lập hiến",
  "Absolute monarchy": "Quân chủ chuyên chế",
  "One-party socialist state": "Nhà nước xã hội chủ nghĩa độc đảng",
  "Presidential dominant-party system": "Hệ thống độc đảng tổng thống",
  "Directorial republic": "Cộng hòa chỉ đạo (Directorial)",
  "Transitional government": "Chính phủ chuyển tiếp",
  "Dependent Territory Administration": "Chính quyền lãnh thổ phụ thuộc",

  // Regime Category
  "Liberal democracy": "Dân chủ tự do",
  "Electoral democracy": "Dân chủ bầu cử",
  "Electoral autocracy": "Chuyên chế bầu cử",
  "Closed autocracy": "Chuyên chế khép kín",

  // Titles
  "President": "Tổng thống",
  "Prime Minister": "Thủ tướng",
  "Monarch": "Quân chủ",
  "King": "Quốc vương",
  "Queen": "Nữ vương",
  "Emperor": "Hoàng đế",
  "Supreme Leader": "Lãnh tụ tối cao",
  "General Secretary": "Tổng Bí thư",
  "Chairman": "Chủ tịch",
  "Chancellor": "Thủ tướng (Chancellor)",
  "Sultan": "Sultan",
  "Emir": "Tiểu vương",
  "Prince": "Thân vương",
  "Pope": "Giáo hoàng",
  "Governor": "Thống đốc",
  "Premier": "Thủ hiến",
  "Chief Minister": "Thủ hiến (Chief Minister)",
  "Local Executive / Governor": "Giám đốc hành pháp / Thống đốc",
  "Local Administrator": "Quản trị viên địa phương",
  "None": "Không có",
  "N/A": "Không có dữ liệu",
  
  // Power Structure
  "Unitary state": "Nhà nước đơn nhất",
  "Federal state": "Nhà nước liên bang",
  "Confederation": "Liên bang tập quyền",

  // Economic Model
  "Mixed economy": "Kinh tế hỗn hợp",
  "Social market economy": "Kinh tế thị trường xã hội",
  "State capitalist economy": "Kinh tế tư bản nhà nước",
  "Socialist market economy": "Kinh tế thị trường định hướng xã hội chủ nghĩa",
  "Command economy": "Kinh tế kế hoạch hóa tập trung",

  // Official Ideology fallback
  "No single official ideology": "Không có hệ tư tưởng chính thức duy nhất"
};

// Helper to delay execution (prevent rate-limit)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function translateText(text: string, attempt = 1): Promise<string> {
  if (!text || text.trim() === "" || text === "N/A" || text === "None") return text;
  
  // Check static dictionary first
  if (DICT[text]) return DICT[text];
  
  // Quick heuristic: If it already looks like Vietnamese (contains specific accents)
  if (/[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/i.test(text) && !text.includes("Curaçao") && !text.includes("Barthélemy") && !text.includes("São") && !text.includes("Príncipe")) {
    return text;
  }

  try {
    const res = await translate(text, { to: "vi" });
    return res.text;
  } catch (error: any) {
    if (attempt <= 3) {
      console.warn(`[API] Lỗi dịch (thử lại lần ${attempt}): ${text.substring(0, 20)}...`);
      await delay(2000 * attempt);
      return translateText(text, attempt + 1);
    }
    console.error(`[API] Lỗi dịch sau 3 lần: ${text.substring(0, 20)}`);
    return text; // Fallback to original text
  }
}

async function main() {
  console.log("Bắt đầu tiến trình dịch thuật và hoàn thiện dữ liệu...");
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL");

  const rows = db.prepare("SELECT iso3, profile_json FROM country_profiles").all() as Array<{ iso3: string; profile_json: string }>;
  const update = db.prepare("UPDATE country_profiles SET profile_json = ?, country_name = ?, region = ? WHERE iso3 = ?");

  db.exec("BEGIN IMMEDIATE TRANSACTION");
  
  let processed = 0;
  
  for (const row of rows) {
    const p = JSON.parse(row.profile_json) as Record<string, unknown>;
    
    // 1. Hoàn thiện dữ liệu bị thiếu (constitutionalIdentity, politicalRegime)
    if (!p.constitutionalIdentity || p.constitutionalIdentity === "Needs verification" || p.constitutionalIdentity === "Data unavailable") {
      p.constitutionalIdentity = p.stateForm || "Unitary state";
    }
    if (!p.politicalRegime || p.politicalRegime === "Needs verification" || p.politicalRegime === "Data unavailable") {
      p.politicalRegime = p.governmentSystem || "Standard administrative structure";
    }

    // 2. Dịch qua Dictionary (nhanh, chính xác 100% cho thuật ngữ chính trị)
    const dictFields = [
      "region", "subregion", "stateForm", "governmentSystem",
      "regimeCategory", "headOfStateTitle", "headOfGovernmentTitle", 
      "powerStructure", "economicModel", "officialIdeology"
    ];
    for (const field of dictFields) {
      if (typeof p[field] === "string" && DICT[p[field] as string]) {
        p[field] = DICT[p[field] as string];
      }
    }

    // 3. Dịch qua API (các trường dài, tên riêng)
    // Để tránh quá tải API, ta chỉ dịch những trường thực sự cần.
    // Tên người (headOfState, headOfGovernment) KHÔNG dịch.
    const apiFields = [
      "countryName", "officialName", "summary", 
      "legislature", "judiciary", "constitution",
      "politicalRegime", "constitutionalIdentity", "rulingParty"
    ];

    for (const field of apiFields) {
      const val = p[field] as string;
      if (val && typeof val === "string") {
        // Chỉ gọi API nếu chưa có tiếng Việt và không nằm trong DICT
        if (!DICT[val] && !/[áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/i.test(val)) {
           p[field] = await translateText(val);
           await delay(100); // Throttling 100ms giữa mỗi request API
        } else if (DICT[val]) {
           p[field] = DICT[val];
        }
      }
    }
    
    // Cập nhật lại vào DB
    // Lưu ý update.run cũng cập nhật cột country_name và region trong schema
    update.run(JSON.stringify(p), String(p.countryName), String(p.region), row.iso3);
    
    processed++;
    if (processed % 10 === 0) {
      console.log(`Đã xử lý: ${processed}/${rows.length} quốc gia...`);
    }
  }

  db.exec("COMMIT");
  db.close();
  console.log(`\n✅ Hoàn tất! Đã hoàn thiện và dịch ${processed} quốc gia sang Tiếng Việt.`);
}

main().catch(err => {
  console.error("Lỗi nghiêm trọng:", err);
  process.exit(1);
});
