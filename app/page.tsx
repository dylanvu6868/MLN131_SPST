import { Map } from "lucide-react";

import { WorldMapPanel } from "@/components/dashboard/world-map-panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrText } from "@/components/ui/tr-text";
import { getAllCountries } from "@/lib/countries";

export default function HomePage() {
  const countries = getAllCountries();

  return (
    <main>
      <section id="map" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Bản đồ thế giới"
            title="Chạm vào từng quốc gia để mở lớp thông tin chính trị"
            description="Bản đồ giúp quan sát các nhóm chế độ, mô hình nhà nước và hồ sơ quốc gia trong cùng một không gian trực quan."
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
            <Map className="h-4 w-4" aria-hidden="true" />
            <TrText vi="Kéo để di chuyển · Cuộn để zoom" />
          </div>
        </div>
        <WorldMapPanel countries={countries} />
      </section>
    </main>
  );
}
