import { NextRequest, NextResponse } from "next/server";

import { getGlobalStats } from "@/lib/stats";
import type { CountryPoliticalProfile } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const groupBy = request.nextUrl.searchParams.get("groupBy") as keyof CountryPoliticalProfile | null;
  return NextResponse.json(getGlobalStats(groupBy ?? "regimeCategory"));
}

