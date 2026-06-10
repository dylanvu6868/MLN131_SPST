import { NextResponse } from "next/server";

import { getAllCountries } from "@/lib/countries";
import type { CountryLeaderEntry } from "@/lib/types";
import { fetchCurrentLeadersLite } from "@/lib/wikipedia-leaders";

export const runtime = "nodejs";
// Wikipedia infoboxes update within minutes; refresh hourly to stay current
// without hammering the API. stale-while-revalidate keeps responses instant.
export const revalidate = 3600;

type RouteContext = {
  params: Promise<{ iso3: string }>;
};

function pickLeader(leaders: CountryLeaderEntry[], role: CountryLeaderEntry["role"]) {
  const match = leaders
    .filter((leader) => leader.role === role && leader.name)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))[0];
  if (!match) {
    return null;
  }
  return { name: match.name, title: match.title, titleEn: match.titleEn };
}

export async function GET(_request: Request, context: RouteContext) {
  const { iso3: rawIso3 } = await context.params;
  const iso3 = rawIso3?.toUpperCase();
  const country = getAllCountries().find((item) => item.iso3 === iso3);

  if (!country) {
    return NextResponse.json({ error: "Không tìm thấy quốc gia." }, { status: 404 });
  }

  try {
    const result = await fetchCurrentLeadersLite(country.englishName ?? country.countryName, iso3);
    return NextResponse.json(
      {
        iso3,
        generatedAt: new Date().toISOString(),
        source: result.sourceUrl,
        pageTitle: result.pageTitle,
        headOfState: pickLeader(result.leaders, "headOfState"),
        headOfGovernment: pickLeader(result.leaders, "headOfGovernment")
      },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
