import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
// Define simplified subset of schema for generation to avoid strict enum issues
const GeneratedSymbolSectionSchema = z.object({
  title: z.string(),
  officialName: z.string().optional(),
  description: z.string(),
  imageUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  licenseNote: z.string().optional(),
  
  // Specific fields per section type
  lyricist: z.string().optional(),
  composer: z.string().optional(),
  nativeName: z.string().optional(),
  adopted: z.string().optional(),
  audioUrl: z.string().url().optional(),
  role: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  ancientDepth: z.string().optional(),
  modernFoundingYear: z.number().int().optional(),
  keyMilestone: z.string().optional(),
  yearsCount: z.number().int().optional(),
  calculation: z.string().optional(),
});

const GeneratedCountrySchema = z.object({
  sections: z.object({
    emblem: GeneratedSymbolSectionSchema,
    anthem: GeneratedSymbolSectionSchema,
    seal: GeneratedSymbolSectionSchema,
    headResidence: GeneratedSymbolSectionSchema,
    cultureIdentity: GeneratedSymbolSectionSchema,
    historyDepth: GeneratedSymbolSectionSchema,
  }),
  notes: z.string().optional()
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY
});

const model = google("gemini-2.5-flash");

const dbPath = process.env.ATLAS_DB_PATH || "./data/world-ideology-atlas.db";
const profilesPath = "./data/country-symbol-profiles.json";

async function main() {
  if (!fs.existsSync(dbPath)) {
    console.error(`Database not found at ${dbPath}`);
    return;
  }

  const db = new DatabaseSync(dbPath);
  const rows = db.prepare('SELECT profile_json FROM country_profiles').all() as any[];
  const countries = rows.map(r => JSON.parse(r.profile_json));
  
  let existingProfiles: any[] = [];
  if (fs.existsSync(profilesPath)) {
    try {
      existingProfiles = JSON.parse(fs.readFileSync(profilesPath, "utf8"));
    } catch (e) {
      console.warn("Could not parse existing profiles");
    }
  }

  const existingIso3s = new Set(existingProfiles.map(p => p.iso3));
  
  const missingCountries = countries.filter(c => !existingIso3s.has(c.iso3));
  console.log(`Found ${missingCountries.length} countries to generate...`);

  const BATCH_SIZE = 5;

  for (let i = 0; i < missingCountries.length; i += BATCH_SIZE) {
    const batch = missingCountries.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(missingCountries.length / BATCH_SIZE)}`);
    
    const promises = batch.map(async (country) => {
      try {
        console.log(`Generating for ${country.englishName} (${country.iso3})...`);
        const { object } = await generateObject({
          model,
          schema: GeneratedCountrySchema,
          prompt: `Tạo dữ liệu biểu tượng quốc gia chi tiết bằng tiếng Việt cho quốc gia: ${country.englishName} (Tên tiếng Việt: ${country.countryName}, ISO3: ${country.iso3}). 
          
Yêu cầu 6 phần:
1. Quốc huy (emblem): Tên chính thức, mô tả.
2. Quốc ca (anthem): Tên, tác giả (lyricist/composer), năm áp dụng.
3. Quốc ấn (seal): Tên con dấu quốc gia, mô tả. Nếu không rõ thì ghi chú.
4. Tòa nhà nguyên thủ (headResidence): Tên dinh tổng thống/cung điện, thành phố, vai trò.
5. Bản sắc văn hóa (cultureIdentity): Mô tả sâu sắc về đặc trưng văn hóa, ẩm thực, tôn giáo, kiến trúc.
6. Bề dày lịch sử (historyDepth): Mô tả nền văn minh cổ đại (ancientDepth), năm lập quốc hiện đại (modernFoundingYear) và mốc lịch sử chính (keyMilestone).

Viết bằng tiếng Việt học thuật, trang trọng.
Cung cấp các imageUrl từ Wikipedia/Wikimedia Commons (link đuôi .jpg, .svg hợp lệ) minh họa cho mỗi phần.
          `,
        });

        const newProfile = {
          iso2: country.iso2,
          iso3: country.iso3,
          countryNameVi: country.countryName,
          countryNameEn: country.englishName,
          regionVi: country.region,
          verificationLevel: "Trung bình",
          updatedAt: new Date().toISOString().split("T")[0],
          mainSources: [
            {
              name: "Wikimedia Commons",
              url: "https://commons.wikimedia.org/"
            }
          ],
          sections: object.sections,
          notes: object.notes
        };

        return newProfile;
      } catch (err) {
        console.error(`Failed for ${country.iso3}:`, err);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const validResults = results.filter(r => r !== null);
    
    existingProfiles.push(...validResults);
    fs.writeFileSync(profilesPath, JSON.stringify(existingProfiles, null, 2));
    console.log(`Saved ${validResults.length} new profiles. Taking a short break...`);
    
    // Rate limit prevention
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log("Generation complete!");
}

main().catch(console.error);
