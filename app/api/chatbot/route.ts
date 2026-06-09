import { NextRequest, NextResponse } from "next/server";
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

import { ATLAS_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { atlasTools } from "@/lib/ai/tools";
import { findCountry } from "@/lib/countries";
import type { CountryPoliticalProfile } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;
const DEFAULT_OPENROUTER_MAX_OUTPUT_TOKENS = 180;
const DEFAULT_GEMINI_MAX_OUTPUT_TOKENS = 640;
const DEFAULT_OPENAI_MAX_OUTPUT_TOKENS = 640;
const FAST_MODE_MAX_OUTPUT_TOKENS = 900;
const MAX_MESSAGES_PER_REQUEST = 8;

const COMPACT_SYSTEM_PROMPT = [
  "Bạn là Atlas AI, trợ lý tiếng Việt của World Ideology Atlas.",
  "Luôn trả lời bằng tiếng Việt, ngắn gọn, rõ ràng, trung lập và học thuật.",
  "Ưu tiên câu trả lời 2-5 ý, không lan man; nếu người dùng yêu cầu chi tiết thì mới mở rộng.",
  "Không bình luận về yêu cầu định dạng; hãy trả lời trực tiếp vào nội dung.",
  "Nếu người dùng hỏi nguồn, kiểm chứng hoặc dẫn chứng, hãy ưu tiên liệt kê nguồn trong dữ liệu nội bộ rút gọn thay vì giải thích dài.",
  "Không tuyên truyền, không vận động chính trị, không bịa số liệu hoặc nguồn.",
  "Nếu dữ liệu có thể thay đổi nhanh, nói rõ cần kiểm chứng THỜI ĐIỂM HIỆN TẠI. TỪ NĂM 2026 trở đi về sau."
].join("\n");

type AtlasProvider = "openrouter" | "gemini" | "openai";
type AtlasToolName = keyof typeof atlasTools;


function getMaxOutputTokens(provider: AtlasProvider) {
  const envValue = Number(process.env.ATLAS_AI_MAX_OUTPUT_TOKENS);
  const configured = Number.isFinite(envValue) && envValue > 0 ? Math.floor(envValue) : null;

  if (configured) {
    return Math.min(configured, FAST_MODE_MAX_OUTPUT_TOKENS);
  }

  if (provider === "openai") return DEFAULT_OPENAI_MAX_OUTPUT_TOKENS;
  return provider === "openrouter" ? DEFAULT_OPENROUTER_MAX_OUTPUT_TOKENS : DEFAULT_GEMINI_MAX_OUTPUT_TOKENS;
}

type GoogleProvider = ReturnType<typeof createGoogleGenerativeAI>;

function makeGeminiConfig(googleProvider: GoogleProvider, modelName: string) {
  return {
    provider: "gemini" as const,
    model: googleProvider(modelName),
    googleProvider,
    modelName,
    maxOutputTokens: getMaxOutputTokens("gemini")
  };
}

function getAtlasModel() {
  const preferredProvider = (process.env.ATLAS_AI_PROVIDER ?? "gemini").toLowerCase();
  const geminiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GOOGLE_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;
  const geminiModelName = getGeminiChatbotModelName();
  const openRouterModelName = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
  const openAIModelName = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (preferredProvider === "openai" && openAIKey) {
    const openai = createOpenAI({ apiKey: openAIKey });
    return {
      provider: "openai" as const,
      model: openai(openAIModelName),
      googleProvider: null,
      modelName: openAIModelName,
      maxOutputTokens: getMaxOutputTokens("openai")
    };
  }

  if (preferredProvider === "gemini" && geminiKey) {
    return makeGeminiConfig(createGoogleGenerativeAI({ apiKey: geminiKey }), geminiModelName);
  }

  if (preferredProvider === "openrouter" && openRouterKey) {
    const openrouter = createOpenAI({
      apiKey: openRouterKey,
      baseURL: "https://openrouter.ai/api/v1",
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        "X-Title": "World Ideology Atlas"
      }
    });

    return {
      provider: "openrouter" as const,
      model: openrouter(openRouterModelName),
      googleProvider: null,
      modelName: openRouterModelName,
      maxOutputTokens: getMaxOutputTokens("openrouter")
    };
  }

  if (geminiKey) {
    return makeGeminiConfig(createGoogleGenerativeAI({ apiKey: geminiKey }), geminiModelName);
  }

  if (openRouterKey) {
    const openrouter = createOpenAI({
      apiKey: openRouterKey,
      baseURL: "https://openrouter.ai/api/v1",
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        "X-Title": "World Ideology Atlas"
      }
    });

    return {
      provider: "openrouter" as const,
      model: openrouter(openRouterModelName),
      googleProvider: null,
      modelName: openRouterModelName,
      maxOutputTokens: getMaxOutputTokens("openrouter")
    };
  }

  if (openAIKey) {
    const openai = createOpenAI({ apiKey: openAIKey });
    return {
      provider: "openai" as const,
      model: openai(openAIModelName),
      googleProvider: null,
      modelName: openAIModelName,
      maxOutputTokens: getMaxOutputTokens("openai")
    };
  }

  return null;
}

function getGeminiChatbotModelName() {
  if (process.env.ATLAS_CHATBOT_MODEL) {
    return process.env.ATLAS_CHATBOT_MODEL;
  }

  if (process.env.ATLAS_AI_FAST_MODE === "false") {
    return process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
  }

  return "gemini-2.5-flash-lite";
}

function getSystemPrompt(provider: AtlasProvider, contextCountry?: string) {
  const countryContext = getCountryContext(contextCountry);

  if (process.env.ATLAS_AI_FULL_SYSTEM_PROMPT === "true" && provider === "gemini") {
    return contextCountry
      ? `${ATLAS_SYSTEM_PROMPT}\n\nNgữ cảnh hiện tại: Người dùng đang xem thông tin về quốc gia: ${contextCountry}.\n${countryContext}`
      : ATLAS_SYSTEM_PROMPT;
  }

  return [COMPACT_SYSTEM_PROMPT, contextCountry ? `Ngữ cảnh trang hiện tại: quốc gia ${contextCountry}.` : "", countryContext]
    .filter(Boolean)
    .join("\n\n");
}

function getTools(provider: AtlasProvider, messages: unknown) {
  if ((provider === "openrouter" || provider === "openai") && process.env.ATLAS_AI_ENABLE_TOOLS !== "true") {
    return undefined;
  }

  if (process.env.ATLAS_AI_ENABLE_TOOLS !== "true") {
    return undefined;
  }

  const toolNames = getRelevantToolNames(getRequestText(messages));
  return toolNames.length ? pickAtlasTools(toolNames) : undefined;
}

function getCountryContext(contextCountry?: string) {
  if (!contextCountry) {
    return "";
  }

  const country = findCountry(contextCountry);
  return country ? compactCountryProfile(country) : "";
}

function compactCountryProfile(country: CountryPoliticalProfile) {
  const rows = [
    ["Tên", country.countryName],
    ["Tên tiếng Anh", country.englishName],
    ["ISO3", country.iso3],
    ["Khu vực", country.region],
    ["Hình thức nhà nước", country.stateForm],
    ["Mô hình chính phủ", country.governmentSystem],
    ["Bản sắc/ý thức hệ chính thức", country.officialIdeology],
    ["Chế độ chính trị", country.politicalRegime],
    ["Nhóm chế độ", country.regimeCategory],
    ["Cấu trúc quyền lực", country.powerStructure],
    ["Đảng cầm quyền/liên minh", country.rulingParty ?? country.rulingCoalition],
    ["Nguyên thủ", formatLeader(country.headOfStateTitle, country.headOfState)],
    ["Người đứng đầu chính phủ", formatLeader(country.headOfGovernmentTitle, country.headOfGovernment)],
    ["Cơ quan lập pháp", country.legislature],
    ["Mô hình kinh tế", country.economicModel],
    ["Nguồn dữ liệu chính", compactSources(country)],
    ["Mức tin cậy", country.confidenceLevel],
    ["Cập nhật dữ liệu", country.dataUpdatedAt]
  ]
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => `- ${label}: ${value}`)
    .join("\n");

  return `Dữ liệu nội bộ rút gọn để ưu tiên trả lời nhanh:\n${rows}`;
}

function formatLeader(title?: string, name?: string) {
  if (!title && !name) {
    return undefined;
  }

  return [title, name].filter(Boolean).join(": ");
}

function compactSources(country: CountryPoliticalProfile) {
  const sources = country.sources
    .filter((source) => source.name || source.url)
    .slice(0, 4)
    .map((source) => [source.name, source.url].filter(Boolean).join(": "));

  return sources.length ? sources.join("; ") : undefined;
}

function getRequestText(messages: unknown) {
  if (!Array.isArray(messages)) {
    return "";
  }

  return messages
    .slice(-MAX_MESSAGES_PER_REQUEST)
    .flatMap((message) => {
      if (!message || typeof message !== "object" || !("parts" in message) || !Array.isArray(message.parts)) {
        return [];
      }

      return message.parts.flatMap((part: unknown) => {
        if (part && typeof part === "object" && "type" in part && part.type === "text" && "text" in part && typeof part.text === "string") {
          return [part.text];
        }

        return [];
      });
    })
    .join("\n")
    .toLowerCase();
}

function getRelevantToolNames(requestText: string): AtlasToolName[] {
  if (!requestText) {
    return [];
  }

  const needsWebResearch = /\b(firecrawl|web|internet|latest|news|source|sources|research)\b|tra cứu web|tìm nguồn|nguồn mới|tin mới|mới nhất|cập nhật|dẫn chứng|kiểm chứng|xác minh/.test(requestText);
  const needsDataLookup = /so sánh|compare|thống kê|ranking|xếp hạng|dataset|nguồn|source|wikidata|sparql|tìm quốc gia|tra cứu|hồ sơ/.test(requestText);

  if (needsWebResearch) {
    return ["getCountryProfile", "getSourcesForField", "webResearchPoliticalData"];
  }

  if (needsDataLookup) {
    return ["getCountryProfile", "searchCountries", "compareCountries", "getGlobalStats", "getSourcesForField"];
  }

  return [];
}

function pickAtlasTools(toolNames: AtlasToolName[]) {
  return Object.fromEntries(toolNames.map((toolName) => [toolName, atlasTools[toolName]])) as Partial<typeof atlasTools>;
}

function getRecentMessages(messages: unknown): Array<Omit<UIMessage, "id">> {
  return Array.isArray(messages) ? (messages.slice(-MAX_MESSAGES_PER_REQUEST) as Array<Omit<UIMessage, "id">>) : [];
}

function checkRateLimit(clientId: string) {
  const now = Date.now();
  const current = rateLimit.get(clientId);
  if (!current || current.resetAt <= now) {
    rateLimit.set(clientId, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_REQUESTS) {
    return false;
  }

  current.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  const clientId = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!checkRateLimit(clientId)) {
    return NextResponse.json({ error: "Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau." }, { status: 429 });
  }

  const { messages, contextCountry } = await req.json();

  if (!messages || !messages.length) {
    return NextResponse.json({ error: "Vui lòng gửi ít nhất một tin nhắn." }, { status: 400 });
  }

  try {
    const modelConfig = getAtlasModel();
    if (!modelConfig) {
      return NextResponse.json({
        text: "Atlas AI chưa sẵn sàng. Hãy cấu hình OPENROUTER_API_KEY hoặc GEMINI_API_KEY ở phía server."
      });
    }

    const customTools = getTools(modelConfig.provider, messages);
    // Always include Google Search grounding for Gemini — free, real-time, no extra API key.
    const googleSearchTool = modelConfig.googleProvider
      ? { googleSearch: modelConfig.googleProvider.tools.googleSearch({}) }
      : null;
    const tools = googleSearchTool
      ? { ...googleSearchTool, ...customTools }
      : customTools ?? undefined;

    const result = streamText({
      model: modelConfig.model,
      system: getSystemPrompt(modelConfig.provider, contextCountry),
      maxRetries: 0,
      maxOutputTokens: modelConfig.maxOutputTokens,
      messages: await convertToModelMessages(getRecentMessages(messages)),
      tools,
      stopWhen: tools ? stepCountIs(3) : undefined,
      temperature: 0.25
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Atlas AI error:", error);
    return NextResponse.json(
      {
        error: "Yêu cầu Atlas AI thất bại.",
        details: error instanceof Error ? error.message : "Lỗi chưa xác định"
      },
      { status: 500 }
    );
  }
}
