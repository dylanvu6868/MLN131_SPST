import { Bot, Map } from "lucide-react";

import { AtlasChatbot } from "@/components/chatbot/atlas-chatbot";
import { WorldMapPanel } from "@/components/dashboard/world-map-panel";
import { CountryLandingExperience } from "@/components/landing/country-landing";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllCountries } from "@/lib/countries";

export default function HomePage() {
  const countries = getAllCountries();

  return (
    <main>
      <CountryLandingExperience countries={countries} />

      <section id="map" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Bản đồ thế giới"
            title="Chạm vào từng quốc gia để mở lớp thông tin chính trị"
            description="Bản đồ giúp quan sát các nhóm chế độ, mô hình nhà nước và hồ sơ quốc gia trong cùng một không gian trực quan."
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
            <Map className="h-4 w-4" aria-hidden="true" />
            Kéo để di chuyển · Cuộn để zoom
          </div>
        </div>
        <WorldMapPanel countries={countries} />
      </section>

      <section id="atlas-ai" className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="atlas-surface rounded-lg p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-amber-300/35 bg-amber-400/10 text-amber-100">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-amber-200">Atlas AI</p>
              <h2 className="text-xl font-semibold text-white">Hỏi nhanh về một quốc gia</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Đặt câu hỏi về thể chế, lãnh đạo, quốc hội, bản sắc chính trị hoặc so sánh giữa các quốc gia.
          </p>
        </div>

        <AtlasChatbot compact />
      </section>
    </main>
  );
}
