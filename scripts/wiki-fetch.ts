import fs from "node:fs";

const profilesPath = "./data/country-symbol-profiles.json";

async function fetchWikiSummary(countryName: string, lang: string = "vi") {
  try {
    const response = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`, {
      headers: {
        'User-Agent': 'WorldIdeologyAtlasBot/1.0 (contact@example.com) Node.js/20'
      }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return {
      extract: data.extract,
      thumbnail: data.thumbnail?.source
    };
  } catch (err) {
    return null;
  }
}

async function main() {
  if (!fs.existsSync(profilesPath)) {
    console.error("Profiles JSON not found!");
    return;
  }

  let existingProfiles: any[] = JSON.parse(fs.readFileSync(profilesPath, "utf8"));
  
  const targetProfiles = existingProfiles.filter(
    p => p.verificationLevel === "Cần kiểm chứng thêm" || p.verificationLevel === "Sinh tự động"
  );

  console.log(`Found ${targetProfiles.length} procedurally generated profiles to enrich with Wikipedia.`);

  // Process in batches of 3 to avoid overwhelming the Wiki API
  const BATCH_SIZE = 3;
  
  for (let i = 0; i < targetProfiles.length; i += BATCH_SIZE) {
    const batch = targetProfiles.slice(i, i + BATCH_SIZE);
    
    await Promise.all(batch.map(async (profile) => {
      console.log(`Fetching Wikipedia for ${profile.countryNameVi}...`);
      
      let wikiData = await fetchWikiSummary(profile.countryNameVi, "vi");
      
      // Fallback to English if Vietnamese fails or gives no extract
      if (!wikiData || !wikiData.extract) {
        wikiData = await fetchWikiSummary(profile.countryNameEn, "en");
      }

      if (wikiData && wikiData.extract) {
        // Update history depth with the Wikipedia summary
        profile.sections.historyDepth.description = wikiData.extract;
        
        if (wikiData.thumbnail) {
          // Replace the placeholder image with the actual Wikipedia thumbnail!
          profile.sections.historyDepth.imageUrl = wikiData.thumbnail;
        }

        profile.verificationLevel = "Dữ liệu Wikipedia";
      } else {
        console.warn(`Could not find Wikipedia data for ${profile.countryNameVi}`);
      }
    }));
    
    // Save continuously so we don't lose data
    fs.writeFileSync(profilesPath, JSON.stringify(existingProfiles, null, 2));
    
    // Tiny delay
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("Finished updating Wikipedia data!");
}

main().catch(console.error);
