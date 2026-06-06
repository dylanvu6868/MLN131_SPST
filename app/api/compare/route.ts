import { NextResponse } from "next/server";

import { compareCountries } from "@/lib/countries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    countries?: string[];
    fields?: string[];
  };

  if (!Array.isArray(body.countries) || body.countries.length < 2) {
    return NextResponse.json({ error: "Vui lòng cung cấp từ 2 đến 4 tên quốc gia hoặc mã ISO." }, { status: 400 });
  }

  return NextResponse.json(compareCountries(body.countries.slice(0, 4), body.fields));
}
