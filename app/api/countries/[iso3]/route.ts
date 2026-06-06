import { NextResponse } from "next/server";

import { findCountry } from "@/lib/countries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    iso3: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { iso3 } = await context.params;
  const country = findCountry(iso3);

  if (!country) {
    return NextResponse.json({ error: "Không tìm thấy quốc gia." }, { status: 404 });
  }

  return NextResponse.json(country);
}
