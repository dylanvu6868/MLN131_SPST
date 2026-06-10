import { notFound } from "next/navigation";

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
    title: country ? `${displayCountryName(country)} — AtlasSocialism AI` : "Quốc gia — AtlasSocialism AI",
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
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CountryProfile country={country} />
    </main>
  );
}
