from pathlib import Path
p=Path('app/api/chatbot/route.ts')
s=p.read_text(encoding='utf-8')
# replace getAtlasModel return structure with provider
s=s.replace('''    return {
      model: openrouter(process.env.OPENROUTER_MODEL ?? "~openai/gpt-latest"),
      maxOutputTokens: getMaxOutputTokens("openrouter")
    };''','''    return {
      provider: "openrouter" as const,
      model: openrouter(process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini"),
      maxOutputTokens: getMaxOutputTokens("openrouter")
    };''')
s=s.replace('''    return {
      model: google(process.env.GEMINI_MODEL ?? "gemini-2.5-flash"),
      maxOutputTokens: getMaxOutputTokens("gemini")
    };''','''    return {
      provider: "gemini" as const,
      model: google(process.env.GEMINI_MODEL ?? "gemini-2.5-flash"),
      maxOutputTokens: getMaxOutputTokens("gemini")
    };''')
# insert compact prompt function after getAtlasModel
marker='''function checkRateLimit(clientId: string) {'''
insert='''function getSystemPrompt(provider: "openrouter" | "gemini", contextCountry?: string) {
  if (provider === "openrouter") {
    return [
      "Bạn là Atlas AI, trợ lý tiếng Việt của World Ideology Atlas.",
      "Trả lời ngắn gọn, rõ ràng, trung lập, học thuật.",
      "Ưu tiên dữ liệu trong hồ sơ quốc gia: hệ tư tưởng, nhà nước, chính phủ, lãnh đạo, thiết chế, kinh tế, nguồn.",
      "Không tuyên truyền, không vận động chính trị, không bịa số liệu hoặc nguồn.",
      contextCountry ? `Ngữ cảnh trang hiện tại: quốc gia ${contextCountry}.` : ""
    ].filter(Boolean).join("\\n");
  }

  return contextCountry 
    ? `${ATLAS_SYSTEM_PROMPT}\\n\\nNgữ cảnh hiện tại: Người dùng đang xem thông tin về quốc gia: ${contextCountry}.`
    : ATLAS_SYSTEM_PROMPT;
}

function getTools(provider: "openrouter" | "gemini") {
  if (provider === "openrouter" && process.env.ATLAS_AI_ENABLE_TOOLS !== "true") {
    return undefined;
  }
  return atlasTools;
}

'''
s=s.replace(marker, insert+marker)
# replace systemPrompt block and stream tools
old='''    const systemPrompt = contextCountry 
      ? `${ATLAS_SYSTEM_PROMPT}\n\nNgữ cảnh hiện tại: Người dùng đang xem thông tin về quốc gia: ${contextCountry}.`
      : ATLAS_SYSTEM_PROMPT;

    const result = streamText({
      model: modelConfig.model,
      system: systemPrompt,
      maxOutputTokens: modelConfig.maxOutputTokens,
      messages,
      tools: atlasTools,
      temperature: 0.25,
    });'''
new='''    const systemPrompt = getSystemPrompt(modelConfig.provider, contextCountry);
    const tools = getTools(modelConfig.provider);

    const result = streamText({
      model: modelConfig.model,
      system: systemPrompt,
      maxOutputTokens: modelConfig.maxOutputTokens,
      messages,
      tools,
      temperature: 0.25,
    });'''
if old not in s:
    raise SystemExit('old system block not found')
s=s.replace(old,new)
p.write_text(s,encoding='utf-8')
