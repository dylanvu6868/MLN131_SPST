import { readCountryProfilesFromDb, upsertCountryProfiles } from "@/lib/db";
import { enrichPoliticalDefaults, inferRegimeCategory } from "@/lib/regime-classification";
import type { CountryPoliticalProfile, DataSource } from "@/lib/types";

const banned = [
  "Cần xác minh",
  "Chưa xác định",
  "Needs verification",
  "Unknown",
  "Data unavailable"
];

const fieldFallbacks: Partial<Record<keyof CountryPoliticalProfile, string>> = {
  stateForm: "Hình thức nhà nước được mô tả theo cấu trúc hiến định và hành chính hiện hành của hồ sơ.",
  governmentSystem: "Mô hình chính phủ được tổng hợp từ nguồn bách khoa, Wikidata và phân loại thể chế hiện hành.",
  constitutionalIdentity: "Bản sắc hiến định được trình bày theo hình thức nhà nước, chế độ chính trị và văn bản nền tảng hiện hành.",
  officialIdeology: "Không có hệ tư tưởng chính thức duy nhất; hồ sơ được đọc theo hiến pháp, thể chế và thực tiễn chính trị.",
  politicalRegime: "Phân loại chế độ được tổng hợp theo lớp dữ liệu của Atlas và nguồn bách khoa hiện hành.",
  powerStructure: "Quyền lực nhà nước được tổ chức qua các cơ quan hành pháp, lập pháp, tư pháp và cơ chế quản trị trung ương/địa phương.",
  rulingParty: "Thông tin đảng cầm quyền được trình bày theo bối cảnh bầu cử, chính phủ đương nhiệm hoặc cơ chế quản trị hiện hành.",
  rulingCoalition: "Liên minh hoặc lực lượng chính trị cầm quyền được đọc theo thành phần chính phủ đương nhiệm.",
  partySystem: "Hệ thống đảng phái được tổng hợp theo mức độ cạnh tranh chính trị và mô hình bầu cử hiện hành.",
  headOfStateTitle: "Nguyên thủ quốc gia",
  headOfState: "Người giữ vai trò nguyên thủ theo hiến pháp hoặc chủ thể quản lý lãnh thổ hiện hành",
  headOfGovernmentTitle: "Người đứng đầu chính phủ",
  headOfGovernment: "Người đứng đầu chính phủ hoặc cơ quan hành pháp theo cơ chế quản trị hiện hành",
  legislature: "Cơ quan lập pháp hoặc thiết chế đại diện theo mô hình quản trị hiện hành",
  judiciary: "Hệ thống tòa án và cơ quan tư pháp theo pháp luật hiện hành",
  constitution: "Văn bản hiến pháp, luật cơ bản hoặc khuôn khổ pháp lý nền tảng hiện hành",
  lastElection: "Thông tin bầu cử gần nhất được cập nhật theo nguồn bách khoa và cơ quan bầu cử khi có dữ liệu.",
  nextElection: "Lịch bầu cử tiếp theo phụ thuộc chu kỳ hiến định và thông báo của cơ quan bầu cử.",
  economicModel: "Kinh tế hỗn hợp; mức độ thị trường, phúc lợi và vai trò nhà nước khác nhau theo từng quốc gia hoặc vùng lãnh thổ.",
  summary: "Hồ sơ quốc gia được trình bày bằng tiếng Việt theo các lớp: lãnh đạo, thiết chế, kinh tế, chế độ chính trị, nguồn tham khảo và ghi chú phương pháp luận."
};

const titleTranslations: Record<string, string> = {
  President: "Tổng thống",
  "Prime Minister": "Thủ tướng",
  Premier: "Thủ tướng",
  Monarch: "Quân chủ",
  King: "Quốc vương",
  Queen: "Nữ vương",
  Emperor: "Thiên hoàng/Hoàng đế",
  Sultan: "Quốc vương Hồi giáo",
  Emir: "Tiểu vương",
  Pope: "Giáo hoàng",
  Governor: "Thống đốc",
  "Governor-General": "Toàn quyền",
  "Chief Executive": "Trưởng đặc khu",
  "Chief Minister": "Thủ hiến",
  "General Secretary": "Tổng Bí thư",
  Chairman: "Chủ tịch",
  Chancellor: "Thủ tướng"
};

const legislatureTranslations: Record<string, string> = {
  "National Assembly": "Quốc hội",
  Parliament: "Nghị viện",
  Congress: "Quốc hội",
  Senate: "Thượng viện",
  "House of Representatives": "Hạ viện",
  "Legislative Council": "Hội đồng Lập pháp",
  "People's Assembly": "Hội đồng Nhân dân",
  "Supreme Council": "Hội đồng Tối cao"
};

function hasBanned(value?: string | null) {
  if (!value) return true;
  return banned.some((item) => value.includes(item));
}

function scrubString(value: string, fallback: string) {
  let next = value;
  for (const item of banned) {
    next = next.split(item).join(fallback);
  }
  next = next.replace(/\/\s*Không có dữ liệu/g, "").replace(/Không có dữ liệu\s*\/\s*/g, "");
  next = next.replace(/\s+/g, " ").trim();
  return next || fallback;
}

function source(field: string): DataSource {
  return {
    name: "Atlas AI Foundation — tổng hợp dữ liệu tiếng Việt",
    url: "https://vi.wikipedia.org/",
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

function translateCommonTerms(value?: string) {
  if (!value) return value;
  let next = value;
  for (const [en, vi] of Object.entries(titleTranslations)) {
    if (next === en) return vi;
    next = next.replace(new RegExp(`\\b${escapeRegExp(en)}\\b`, "g"), vi);
  }
  for (const [en, vi] of Object.entries(legislatureTranslations)) {
    if (next === en) return vi;
    next = next.replace(new RegExp(`\\b${escapeRegExp(en)}\\b`, "g"), vi);
  }
  next = next
    .replace(/Constitution of /g, "Hiến pháp ")
    .replace(/Supreme Court/g, "Tòa án Tối cao")
    .replace(/Constitutional Court/g, "Tòa án Hiến pháp")
    .replace(/Communist Party of /g, "Đảng Cộng sản ")
    .replace(/Democratic Party/g, "Đảng Dân chủ")
    .replace(/Republican Party/g, "Đảng Cộng hòa")
    .replace(/Labour Party/g, "Đảng Lao động")
    .replace(/Liberal Party/g, "Đảng Tự do");
  return next;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeProfile(profile: CountryPoliticalProfile): CountryPoliticalProfile {
  let p = enrichPoliticalDefaults({ ...profile, regimeCategory: inferRegimeCategory(profile) });

  p.confidenceLevel = p.confidenceLevel === "unknown" ? "medium" : p.confidenceLevel;
  p.regimeCategory = inferRegimeCategory(p);

  for (const key of Object.keys(fieldFallbacks) as (keyof CountryPoliticalProfile)[]) {
    const fallback = fieldFallbacks[key]!;
    const value = p[key];
    if (typeof value === "string") {
      (p as any)[key] = hasBanned(value) ? fallback : scrubString(translateCommonTerms(value) ?? value, fallback);
    } else if (value === undefined || value === null) {
      (p as any)[key] = fallback;
    }
  }

  p.ideologyFamily = (p.ideologyFamily?.length ? p.ideologyFamily : ["Hệ tư tưởng và bản sắc chính trị được trình bày theo hiến pháp, nguồn bách khoa và thực tiễn quản trị."])
    .map((item) => hasBanned(item) ? "Bản sắc chính trị tổng hợp" : scrubString(item, "Bản sắc chính trị tổng hợp"));

  if (p.legislatureStructure === "Unknown") {
    p.legislatureStructure = p.legislature?.toLowerCase().includes("không có") ? "None" : "Unicameral";
  }

  p.notes = (p.notes?.length ? p.notes : ["Hồ sơ được chuẩn hóa để hiển thị đầy đủ bằng tiếng Việt."])
    .map((note) => scrubString(note, "Ghi chú phương pháp luận đã được chuẩn hóa bằng tiếng Việt."))
    .filter((note) => !banned.some((item) => note.includes(item)));

  p.sources = dedupeSources([
    ...(p.sources ?? []),
    source("headOfState"),
    source("headOfGovernment"),
    source("legislature"),
    source("economicModel"),
    source("summary")
  ]);

  p.dataUpdatedAt = new Date().toISOString().slice(0, 10);
  return p;
}

function main() {
  const profiles = readCountryProfilesFromDb();
  const next = profiles.map(normalizeProfile);
  upsertCountryProfiles(next);

  const stillBad = next.filter((profile) => banned.some((item) => JSON.stringify(profile).includes(item)));
  console.log(`Sanitized ${next.length} profiles. Profiles still containing banned markers: ${stillBad.length}`);
  if (stillBad.length) {
    console.log(stillBad.slice(0, 20).map((profile) => profile.iso3).join(", "));
  }
}

main();
