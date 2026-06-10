import type { Metadata } from "next";

import { CountryNewsClient } from "@/components/news/country-news-client";
import { getAllCountries } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Tin tức hôm nay | AtlasSocialism AI",
  description: "Tin nóng theo từng quốc gia, cập nhật trong ngày."
};

export default function NewsPage() {
  const countries = getAllCountries();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CountryNewsClient countries={countries} />
    </main>
  );
}
