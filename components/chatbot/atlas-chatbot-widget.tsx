"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, MessageCircle, X } from "lucide-react";

import { AtlasChatbot } from "@/components/chatbot/atlas-chatbot";

function getContextCountry(pathname: string | null) {
  const match = pathname?.match(/^\/countries\/([A-Z0-9]{3})/i);
  return match?.[1]?.toUpperCase();
}

export function AtlasChatbotWidget() {
  const pathname = usePathname();
  const contextCountry = useMemo(() => getContextCountry(pathname), [pathname]);
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open ? (
        <div className="w-[calc(100vw-2rem)] max-w-[420px] overflow-hidden rounded-2xl border border-teal-300/25 bg-slate-950/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-teal-300/35 bg-teal-400/15">
                <Bot className="h-4 w-4 text-teal-100" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Atlas AI</p>
                <p className="text-xs text-slate-400">
                  {contextCountry ? `Đang xem hồ sơ ${contextCountry}` : "Hỏi đáp nhanh trên mọi trang"}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="focus-ring grid h-9 w-9 place-items-center rounded-md border border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-300/50 hover:text-amber-100"
              aria-label="Đóng Atlas AI"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <AtlasChatbot contextCountry={contextCountry} compact embedded />
        </div>
      ) : (
        <button
          type="button"
          className="focus-ring group flex min-h-14 items-center gap-3 rounded-full border border-teal-300/35 bg-slate-950/95 px-4 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl transition hover:border-amber-300/50 hover:bg-slate-900"
          aria-label="Mở Atlas AI"
          onClick={() => setOpen(true)}
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-teal-400/15 text-teal-100 transition group-hover:bg-amber-300/15 group-hover:text-amber-100">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden pr-1 sm:inline">Hỏi Atlas AI</span>
        </button>
      )}
    </div>
  );
}
