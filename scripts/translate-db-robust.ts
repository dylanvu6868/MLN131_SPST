import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const DB_PATH = path.resolve(process.cwd(), "./data/world-ideology-atlas.db");

// --- STATIC DICTIONARIES ---
const DICT: Record<string, string> = {
  // Region & Subregion
  "Asia": "Châu Á", "Europe": "Châu Âu", "Africa": "Châu Phi", "Americas": "Châu Mỹ", "Oceania": "Châu Đại Dương", "Antarctic": "Nam Cực",
  "Northern Europe": "Bắc Âu", "Western Europe": "Tây Âu", "Eastern Europe": "Đông Âu", "Southern Europe": "Nam Âu",
  "North America": "Bắc Mỹ", "South America": "Nam Mỹ", "Central America": "Trung Mỹ", "Caribbean": "Caribe",
  "Eastern Asia": "Đông Á", "South-Eastern Asia": "Đông Nam Á", "Southern Asia": "Nam Á", "Western Asia": "Tây Á", "Central Asia": "Trung Á",
  "Northern Africa": "Bắc Phi", "Sub-Saharan Africa": "Châu Phi cận Sahara", "Eastern Africa": "Đông Phi", "Middle Africa": "Trung Phi", "Southern Africa": "Nam Phi", "Western Africa": "Tây Phi",
  "Australia and New Zealand": "Úc và New Zealand", "Melanesia": "Melanesia", "Micronesia": "Micronesia", "Polynesia": "Polynesia",

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
  "Federal constitutional monarchy": "Quân chủ lập hiến liên bang",
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
  "Unitary semi-presidential republic (transitional)": "Cộng hòa bán tổng thống đơn nhất (chuyển tiếp)",
  "Unitary parliamentary directorial republic": "Cộng hòa chỉ đạo đại nghị đơn nhất",
  "Federal directorial republic": "Cộng hòa chỉ đạo liên bang",
  "Federal absolute monarchy": "Quân chủ chuyên chế liên bang",
  "Unitary assembly-independent republic": "Cộng hòa độc lập hội đồng đơn nhất",

  // Government System
  "Presidential republic": "Cộng hòa tổng thống",
  "Semi-presidential republic": "Cộng hòa bán tổng thống",
  "Parliamentary republic": "Cộng hòa đại nghị",
  "Parliamentary republic with executive president": "Cộng hòa đại nghị với tổng thống hành pháp",
  "Parliamentary monarchy": "Quân chủ đại nghị",
  "Constitutional monarchy": "Quân chủ lập hiến",
  "Absolute monarchy": "Quân chủ chuyên chế",
  "Absolute monarchy (Theocracy)": "Quân chủ chuyên chế (Thần quyền)",
  "One-party socialist state": "Nhà nước xã hội chủ nghĩa độc đảng",
  "Presidential dominant-party system": "Hệ thống độc đảng tổng thống",
  "Presidential dominant-party republic": "Cộng hòa độc đảng tổng thống",
  "Directorial republic": "Cộng hòa chỉ đạo (Directorial)",
  "Transitional government": "Chính phủ chuyển tiếp",
  "Dependent Territory Administration": "Chính quyền lãnh thổ phụ thuộc",
  "Semi-presidential republic (divided)": "Cộng hòa bán tổng thống (phân chia)",
  "Presidential Leadership Council": "Hội đồng Lãnh đạo Tổng thống",
  "Military junta": "Chính quyền quân sự",
  "Federal parliamentary republic": "Cộng hòa đại nghị liên bang",

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
  "Chancellor": "Thủ tướng",
  "Sultan": "Sultan",
  "Emir": "Tiểu vương",
  "Prince": "Thân vương",
  "Pope": "Giáo hoàng",
  "Governor": "Thống đốc",
  "Governor-General": "Toàn quyền",
  "Premier": "Thủ hiến",
  "Chief Minister": "Thủ hiến",
  "Local Executive / Governor": "Người đứng đầu / Thống đốc",
  "Local Administrator": "Quản trị viên địa phương",
  "Captains Regent": "Đại nhiếp chính",
  "President of the Governorate": "Chủ tịch Chính phủ",
  "Transitional Presidential Council": "Hội đồng Tổng thống Chuyển tiếp",
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

  // Ideology
  "No single official ideology": "Không có hệ tư tưởng chính thức",
  "Marxism-Leninism": "Chủ nghĩa Mác-Lênin",
  "Marxism–Leninism, Ho Chi Minh Thought": "Chủ nghĩa Mác-Lênin, Tư tưởng Hồ Chí Minh",
  "Socialism with Chinese characteristics": "Chủ nghĩa xã hội đặc sắc Trung Quốc",
  "Juche": "Chủ nghĩa Juche",
  "Islamic Republic": "Cộng hòa Hồi giáo",
  "Wahhabism": "Chủ nghĩa Wahhabi",
  "Zionism": "Chủ nghĩa Zion",
  "Bolivarianism": "Chủ nghĩa Bolivar",

  // Constitution
  "Uncodified constitution": "Hiến pháp bất thành văn",
  "Standard administrative structure": "Cấu trúc hành chính tiêu chuẩn",
  "Basic Law": "Luật cơ bản",

  // Legislature Structure
  "Unicameral": "Đơn viện",
  "Bicameral": "Lưỡng viện",
  
  // Custom Country Names
  "United States": "Hoa Kỳ", "Vietnam": "Việt Nam", "China": "Trung Quốc", "United Kingdom": "Vương quốc Anh",
  "France": "Pháp", "Germany": "Đức", "Japan": "Nhật Bản", "South Korea": "Hàn Quốc", "North Korea": "Triều Tiên",
  "Russia": "Nga", "India": "Ấn Độ", "Brazil": "Brazil", "Mexico": "Mexico", "Canada": "Canada", "Australia": "Úc",
  "Italy": "Ý", "Spain": "Tây Ban Nha", "South Africa": "Nam Phi", "Egypt": "Ai Cập", "Turkey": "Thổ Nhĩ Kỳ",
  "Saudi Arabia": "Ả Rập Xê Út", "Iran": "Iran", "Indonesia": "Indonesia", "Thailand": "Thái Lan", "Philippines": "Philippines",
  "Malaysia": "Malaysia", "Singapore": "Singapore", "New Zealand": "New Zealand", "Argentina": "Argentina",
  "Chile": "Chile", "Colombia": "Colombia", "Peru": "Peru", "Venezuela": "Venezuela", "Cuba": "Cuba",
  "Nigeria": "Nigeria", "Kenya": "Kenya", "Ethiopia": "Ethiopia", "Morocco": "Maroc", "Algeria": "Algeria",
  "Ukraine": "Ukraine", "Poland": "Ba Lan", "Sweden": "Thụy Điển", "Norway": "Na Uy", "Denmark": "Đan Mạch",
  "Finland": "Phần Lan", "Netherlands": "Hà Lan", "Belgium": "Bỉ", "Switzerland": "Thụy Sĩ", "Austria": "Áo",
  "Greece": "Hy Lạp", "Portugal": "Bồ Đào Nha", "Ireland": "Ireland", "Israel": "Israel", "United Arab Emirates": "Các Tiểu vương quốc Ả Rập Thống nhất",
  "Taiwan": "Đài Loan", "Hong Kong": "Hồng Kông", "Macau": "Ma Cao", "Puerto Rico": "Puerto Rico",
  "Antarctica": "Nam Cực"
};

// Generic translator
function t(text: unknown): string {
  if (typeof text !== "string") return String(text || "");
  if (!text || text === "N/A" || text === "None" || text === "Needs verification" || text === "Data unavailable") return "Không có dữ liệu";
  
  // Try exact match
  if (DICT[text]) return DICT[text];
  
  // Quick heuristic for legislature and common stuff
  let res = text;
  res = res.replace("National Assembly", "Quốc hội")
           .replace("Parliament", "Nghị viện")
           .replace("Congress", "Quốc hội")
           .replace("Supreme Court", "Tòa án Tối cao")
           .replace("Constitutional Court", "Tòa án Hiến pháp")
           .replace("Federal Supreme Court", "Tòa án Tối cao Liên bang")
           .replace("High Court", "Tòa án Cấp cao")
           .replace("Constitution of ", "Hiến pháp ")
           .replace("Basic Law of ", "Luật Cơ bản ")
           .replace("Independent", "Độc lập")
           .replace("Communist Party of ", "Đảng Cộng sản ")
           .replace("Democratic Party", "Đảng Dân chủ")
           .replace("Republican Party", "Đảng Cộng hòa")
           .replace("Conservative Party", "Đảng Bảo thủ")
           .replace("Labour Party", "Đảng Lao động")
           .replace("Social Democratic Party", "Đảng Dân chủ Xã hội")
           .replace("Liberal Party", "Đảng Tự do");

  return res;
}

function generateVietnameseSummary(p: Record<string, unknown>): string {
  const cName = t(p.countryName) !== "Không có dữ liệu" ? t(p.countryName) : p.countryName;
  const region = t(p.region);
  const stateForm = t(p.stateForm).toLowerCase();
  const govSys = t(p.governmentSystem).toLowerCase();
  
  const hos = t(p.headOfStateTitle) !== "Không có dữ liệu" ? t(p.headOfStateTitle).toLowerCase() : "người đứng đầu";
  const hosName = p.headOfState && p.headOfState !== "N/A" ? p.headOfState : "hiện tại";
  
  const hog = t(p.headOfGovernmentTitle) !== "Không có dữ liệu" ? t(p.headOfGovernmentTitle).toLowerCase() : "người đứng đầu chính phủ";
  const hogName = p.headOfGovernment && p.headOfGovernment !== "N/A" ? p.headOfGovernment : "hiện tại";
  
  let leaderText = `Người đứng đầu nhà nước là ${hos} ${hosName}`;
  if (hosName !== hogName && hogName !== "N/A") {
      leaderText += `, và chính phủ được điều hành bởi ${hog} ${hogName}.`;
  } else {
      leaderText += `.`;
  }

  const legislature = p.legislature ? t(p.legislature) : "Cơ quan lập pháp";
  const legStruct = p.legislatureStructure ? ` (${t(p.legislatureStructure).toLowerCase()})` : "";
  const judiciary = p.judiciary ? t(p.judiciary) : "Cơ quan tư pháp";

  return `${cName} là một ${stateForm} nằm ở khu vực ${region}. Quốc gia/vùng lãnh thổ này vận hành theo chế độ ${govSys}. ${leaderText} Cơ quan lập pháp cao nhất là ${legislature}${legStruct}, trong khi hệ thống tư pháp do ${judiciary} đứng đầu.`;
}

function main() {
  console.log("Bắt đầu tiến trình dịch thuật offline (Robust)...");
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL");

  const rows = db.prepare("SELECT iso3, profile_json FROM country_profiles").all() as Array<{ iso3: string; profile_json: string }>;
  const update = db.prepare("UPDATE country_profiles SET profile_json = ?, country_name = ?, region = ? WHERE iso3 = ?");

  db.exec("BEGIN IMMEDIATE TRANSACTION");
  
  let processed = 0;
  
  for (const row of rows) {
    const p = JSON.parse(row.profile_json) as Record<string, unknown>;
    
    // 1. Điền dữ liệu thiếu
    if (!p.constitutionalIdentity || p.constitutionalIdentity === "Needs verification" || p.constitutionalIdentity === "Data unavailable") {
      p.constitutionalIdentity = p.stateForm || "Unitary state";
    }
    if (!p.politicalRegime || p.politicalRegime === "Needs verification" || p.politicalRegime === "Data unavailable") {
      p.politicalRegime = p.governmentSystem || "Standard administrative structure";
    }

    // 2. Dịch các trường
    const fieldsToTranslate = [
      "countryName", "officialName", "region", "subregion", "stateForm", 
      "governmentSystem", "regimeCategory", "headOfStateTitle", "headOfGovernmentTitle", 
      "powerStructure", "economicModel", "officialIdeology", "legislature",
      "judiciary", "constitution", "politicalRegime", "constitutionalIdentity", 
      "rulingParty", "legislatureStructure", "partySystem"
    ];

    for (const field of fieldsToTranslate) {
      if (typeof p[field] === "string") {
        p[field] = t(p[field]);
      }
    }

    // 3. Thay thế summary bằng tiếng Việt
    p.summary = generateVietnameseSummary(p);
    
    // Đảm bảo không còn chuỗi "Needs verification" nào sót lại (nếu có trường ẩn)
    for (const key of Object.keys(p)) {
      if (p[key] === "Needs verification" || p[key] === "Data unavailable") {
        p[key] = "Không có dữ liệu";
      }
    }
    
    // Lưu lại
    update.run(JSON.stringify(p), String(p.countryName), String(p.region), row.iso3);
    processed++;
  }

  db.exec("COMMIT");
  db.close();
  console.log(`\n✅ Hoàn tất! Đã xử lý toàn bộ ${processed} quốc gia bằng phương pháp dịch thuật trực tiếp.`);
}

main();
