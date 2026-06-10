import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

import { searchFirecrawlResearch } from "@/lib/data-sync/firecrawl";
import type { CountryPoliticalProfile } from "@/lib/types";

// Controlled categories anchor the LLM's reasoning; the human-facing answer is
// the free `vi` / `en` label, which is what gets shown for comparison.
export const POLITICAL_MODEL_CATEGORIES = [
  "Multi-party liberal democracy",
  "Multi-party electoral democracy",
  "Electoral authoritarian system",
  "Authoritarian system",
  "One-party socialist state",
  "Constitutional monarchy",
  "Absolute monarchy",
  "Theocratic state",
  "Military-led government",
  "Dependent territory / special administration",
  "Transitional / mixed system"
] as const;

const ResultSchema = z.object({
  vi: z.string().min(2).describe("Nhãn mô hình chính trị tiếng Việt, ngắn gọn, viết hoa đúng chuẩn"),
  en: z.string().min(2).describe("Concise English equivalent label"),
  category: z.enum(POLITICAL_MODEL_CATEGORIES),
  confidence: z.enum(["high", "medium", "low"])
});

export type PoliticalModelResult = z.infer<typeof ResultSchema> & { sources: string[] };

type SearchHit = { title: string; snippet: string; url?: string };

const regionNamesVi = new Intl.DisplayNames(["vi"], { type: "region" });

export function politicalModelQuery(country: Pick<CountryPoliticalProfile, "iso2" | "countryName">) {
  const nameVi = regionNamesVi.of(country.iso2) ?? country.countryName;
  return `Mô hình chính trị của ${nameVi} là gì?`;
}

/** Google web search via SerpAPI, falling back to Firecrawl. */
async function googleSearch(query: string): Promise<SearchHit[]> {
  const serpApiKey = process.env.SERPAPI_API_KEY ?? process.env.SERP_API_KEY;
  if (serpApiKey) {
    try {
      const url = new URL("https://serpapi.com/search.json");
      url.searchParams.set("engine", "google");
      url.searchParams.set("q", query);
      url.searchParams.set("hl", "vi");
      url.searchParams.set("gl", "vn");
      url.searchParams.set("num", "8");
      url.searchParams.set("api_key", serpApiKey);

      const response = await fetch(url, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as SerpApiResponse | null;
      if (payload && !payload.error) {
        const hits: SearchHit[] = [];
        const answer = payload.answer_box?.snippet ?? payload.answer_box?.answer;
        if (answer) hits.push({ title: payload.answer_box?.title ?? "Hộp trả lời", snippet: answer });
        if (payload.knowledge_graph?.description) {
          hits.push({ title: payload.knowledge_graph.title ?? "Tri thức", snippet: payload.knowledge_graph.description });
        }
        for (const result of payload.organic_results ?? []) {
          if (result.snippet) hits.push({ title: result.title ?? "", snippet: result.snippet, url: result.link });
        }
        if (hits.length) return hits.slice(0, 8);
      }
    } catch {
      /* fall through to Firecrawl */
    }
  }

  const firecrawl = await searchFirecrawlResearch({ query, limit: 6, scrapeMarkdown: false }).catch(() => null);
  if (firecrawl?.results?.length) {
    return firecrawl.results.map((result) => ({
      title: result.title,
      snippet: result.description ?? result.markdownPreview ?? "",
      url: result.url
    }));
  }
  return [];
}

function resolveModel() {
  const apiKey =
    process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Thiếu GEMINI_API_KEY/GOOGLE_GENERATIVE_AI_API_KEY để trích xuất mô hình chính trị.");
  }
  const google = createGoogleGenerativeAI({ apiKey });
  // Use a model with generous free-tier limits for the bulk research job,
  // independent of the chatbot's GEMINI_MODEL.
  return google(process.env.ATLAS_RESEARCH_MODEL ?? "gemini-2.5-flash");
}

const SYSTEM_PROMPT = [
  "Bạn là chuyên gia chính trị học so sánh.",
  "Nhiệm vụ: xác định MÔ HÌNH CHÍNH TRỊ chính xác và cập nhật nhất của một quốc gia/vùng lãnh thổ,",
  "dựa trên kết quả tìm kiếm Google được cung cấp (ưu tiên Wikipedia, nguồn học thuật và cơ quan nhà nước)",
  "kết hợp kiến thức nền. Trả lời trung lập, học thuật, ngắn gọn.",
  "Quy tắc viết hoa tiếng Việt cho nhãn 'vi': viết hoa chữ đầu mỗi từ của danh từ riêng chỉ thể chế",
  "(ví dụ 'Cộng hòa Xã hội Chủ nghĩa', 'Quân chủ Lập hiến', 'Cộng hòa Tổng thống Liên bang');",
  "chỉ viết thường các từ nối như do, với, và, theo, một, đa."
].join(" ");

export async function researchPoliticalModel(
  country: Pick<CountryPoliticalProfile, "iso2" | "iso3" | "countryName" | "englishName">
): Promise<PoliticalModelResult | null> {
  const nameVi = regionNamesVi.of(country.iso2) ?? country.countryName;
  const nameEn = country.englishName ?? country.countryName;
  const hits = await googleSearch(politicalModelQuery(country));

  const context = hits.length
    ? hits.map((hit, index) => `[${index + 1}] ${hit.title}\n${hit.snippet}`).join("\n\n")
    : "(Không có kết quả tìm kiếm — hãy dựa trên kiến thức nền, đặt confidence thấp hơn.)";

  const prompt = [
    `Quốc gia/vùng lãnh thổ: ${nameVi} (${nameEn}, ${country.iso3}).`,
    `Câu hỏi: "Mô hình chính trị của ${nameVi} là gì?"`,
    "",
    "Kết quả tìm kiếm Google:",
    context,
    "",
    "Yêu cầu trả về:",
    "- vi: nhãn mô hình chính trị tiếng Việt, NGẮN GỌN (4–14 từ), viết hoa đúng chuẩn danh từ riêng nhà nước.",
    "- en: nhãn tương đương bằng tiếng Anh.",
    "- category: chọn đúng MỘT mục trong danh sách cho trước.",
    "- confidence: high nếu nguồn rõ ràng và nhất quán; medium/low nếu mâu thuẫn hoặc thiếu nguồn."
  ].join("\n");

  const { object } = await generateObject({
    model: resolveModel(),
    schema: ResultSchema,
    system: SYSTEM_PROMPT,
    prompt,
    temperature: 0.1
  });

  return {
    ...object,
    sources: hits.map((hit) => hit.url).filter((url): url is string => Boolean(url)).slice(0, 5)
  };
}

type SerpApiResponse = {
  error?: string;
  answer_box?: { title?: string; snippet?: string; answer?: string };
  knowledge_graph?: { title?: string; description?: string };
  organic_results?: { title?: string; link?: string; snippet?: string }[];
};
