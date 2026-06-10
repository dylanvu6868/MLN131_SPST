import type { Metadata } from "next";

import { RankingClient } from "@/components/ranking/ranking-client";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllCountries } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Xếp hạng quốc gia | AtlasSocialism AI Agent",
  description: "Sắp xếp quốc gia theo các tiêu chí có trong hồ sơ chính trị, dữ liệu và kinh tế."
};

export default function RankingPage() {
  const countries = getAllCountries();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <SectionHeading
          eyebrow="Xếp hạng"
          title="Sắp xếp quốc gia theo tiêu chí đánh giá"
          description="Chọn tiêu chí, khu vực và hướng sắp xếp để xem thứ tự quốc gia theo dữ liệu đang có trong hồ sơ."
        />
      </div>
      <RankingClient countries={countries} />
    </main>
  );
}
