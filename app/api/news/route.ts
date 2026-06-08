import { NextResponse } from "next/server";

import { findCountry, getAllCountries } from "@/lib/countries";
import { displayCountryName } from "@/lib/i18n";
import { getAvailableNewsProviders, NewsProviderError, searchCountryNews, type NewsProvider } from "@/lib/news-providers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const iso3 = searchParams.get("iso3")?.trim();
  const countryQuery = searchParams.get("country")?.trim();
  const provider = normalizeProvider(searchParams.get("provider"));
  const countries = getAllCountries();
  const country =
    (iso3 ? countries.find((entry) => entry.iso3.toLowerCase() === iso3.toLowerCase()) : null) ??
    (countryQuery ? findCountry(countryQuery, countries) : null);

  if (!country) {
    return NextResponse.json({ error: "Không tìm thấy quốc gia đã chọn." }, { status: 404 });
  }

  try {
    const displayName = displayCountryName(country);
    const result = await searchCountryNews({
      country,
      displayName,
      provider
    });

    return NextResponse.json(
      {
        country: {
          iso3: country.iso3,
          name: displayName
        },
        generatedAt: new Date().toISOString(),
        provider: result.provider,
        providers: getAvailableNewsProviders(),
        query: result.query,
        articles: result.articles
      }
    );
  } catch (error) {
    if (error instanceof NewsProviderError) {
      return NextResponse.json(
        {
          error: error.message,
          providers: getAvailableNewsProviders()
        },
        { status: error.status }
      );
    }

    return NextResponse.json({ error: "Không thể tải tin nóng lúc này." }, { status: 500 });
  }
}

function normalizeProvider(value: string | null): NewsProvider {
  const selected = value === "auto" || !value ? "auto" : value;

  if (selected === "tavily" || selected === "tavify" || selected === "serpapi" || selected === "firecrawl") {
    return selected;
  }

  return "auto";
}
