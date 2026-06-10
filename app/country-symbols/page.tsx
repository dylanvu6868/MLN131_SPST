import type { Metadata } from "next";

import { CountryLandingExperience } from "@/components/landing/country-landing";
import { getAllCountries } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Biểu tượng quốc gia — AtlasSocialism AI Agent",
  description:
    "Khám phá quốc huy, quốc ca, ấn chương, dinh thự nguyên thủ, văn hóa và lịch sử của từng quốc gia qua bản đồ di sản thế giới."
};

export default function CountrySymbolsPage() {
  const countries = getAllCountries();

  return (
    <main>
      <CountryLandingExperience countries={countries} />
    </main>
  );
}
