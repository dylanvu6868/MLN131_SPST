import { notFound } from "next/navigation";

import { AtlasChatbot } from "@/components/chatbot/atlas-chatbot";
import { CountryProfile } from "@/components/countries/country-profile";
import { findCountry, getAllCountries } from "@/lib/countries";
import { displayCountryName } from "@/lib/i18n";

type PageProps = {
  params: Promise<{
    iso3: string;
  }>;
};

export function generateStaticParams() {
  return getAllCountries().map((country) => ({
    iso3: country.iso3
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { iso3 } = await params;
  const country = findCountry(iso3);
  return {
    title: country ? `${displayCountryName(country)} — World Ideology Atlas` : "Quốc gia — World Ideology Atlas",
    description: country?.summary ?? "Hồ sơ chính trị quốc gia với nguồn và metadata độ tin cậy."
  };
}

export default async function CountryDetailPage({ params }: PageProps) {
  const { iso3 } = await params;
  const country = findCountry(iso3);

  if (!country) {
    notFound();
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
      <CountryProfile country={country} />
      <div className="lg:sticky lg:top-24 lg:self-start">
        <AtlasChatbot contextCountry={country.iso3} compact />
      </div>
    </main>
  );
}
