"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";

export function AtlasChatbot({
  contextCountry,
  compact = false
}: {
  contextCountry?: string;
  compact?: boolean;
}) {
  const [input, setInput] = useState(contextCountry ? `Giải thích hồ sơ chính trị của ${contextCountry}` : "");
  
  const { messages, status, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chatbot",
      body: { contextCountry },
    }),
    messages: [
      {
        id: "initial-msg",
        role: "assistant",
        parts: [{ type: "text", text: "Atlas AI sẵn sàng hỗ trợ. Hãy hỏi theo nhiều lớp: hệ tư tưởng, hình thức nhà nước, cơ cấu quyền lực, lãnh đạo, kinh tế và tài liệu tham khảo." }]
      }
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";
  // Limit visible messages to the last 6 to keep UI clean, but always keep the conversation going
  const visibleMessages = messages.slice(-6);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  return (
    <section id="atlas-ai" className="atlas-surface rounded-lg p-4 sm:p-5" aria-labelledby="atlas-ai-title">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md border border-teal-300/40 bg-teal-400/15">
            <Bot className="h-5 w-5 text-teal-100" aria-hidden="true" />
          </span>
          <div>
            <h2 id="atlas-ai-title" className="text-lg font-semibold text-white">
              Atlas AI
            </h2>
            <p className="text-sm text-slate-400">Trợ lý phân tích hồ sơ quốc gia</p>
          </div>
        </div>
        <Sparkles className="h-5 w-5 text-amber-200" aria-hidden="true" />
      </div>

      <div className={compact ? "mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1" : "mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1"}>
        {visibleMessages.map((message) => (
          <div
            key={message.id}
            className={message.role === "assistant" ? "rounded-lg border border-slate-700 bg-slate-950/55 p-3" : "rounded-lg border border-teal-400/30 bg-teal-400/10 p-3"}
          >
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-100">
              {message.parts ? message.parts.map((part: any, index: number) => {
                if (part.type === "text") return <span key={index}>{part.text}</span>;
                if (part.type === "tool-invocation") return (
                  <span key={index} className="block mt-2 text-xs italic text-teal-300/70">
                    Tra cứu công cụ: {part.toolInvocation.toolName}...
                  </span>
                );
                return null;
              }) : ""}
            </p>
          </div>
        ))}
        {isLoading && messages.length > 0 && (messages[messages.length - 1].role as string) === "user" ? (
          <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/55 p-3 text-sm text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Atlas AI đang suy nghĩ...
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-3 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error.message || "Đã xảy ra lỗi khi kết nối với Atlas AI."}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Hỏi Atlas AI</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="atlas-input w-full rounded-md px-3 py-2"
            placeholder={contextCountry ? `Hỏi về ${contextCountry}...` : "Hỏi về Việt Nam, Hoa Kỳ, Trung Quốc..."}
          />
        </label>
        <button className="atlas-button focus-ring w-12 shrink-0" type="submit" aria-label="Gửi tin nhắn" disabled={isLoading || !input.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
        </button>
      </form>
    </section>
  );
}
