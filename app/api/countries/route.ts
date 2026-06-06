import { NextRequest, NextResponse } from "next/server";

import { searchCountries } from "@/lib/countries";
import type { CountrySearchFilters } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filters: CountrySearchFilters = {
    search: searchParams.get("search") ?? undefined,
    region: searchParams.get("region") ?? undefined,
    subregion: searchParams.get("subregion") ?? undefined,
    regimeCategory: searchParams.get("regimeCategory") ?? undefined,
    officialIdeology: searchParams.get("officialIdeology") ?? undefined,
    governmentSystem: searchParams.get("governmentSystem") ?? undefined,
    stateForm: searchParams.get("stateForm") ?? undefined,
    hasCommunistRulingParty: parseBoolean(searchParams.get("hasCommunistRulingParty")),
    hasMilitaryGovernment: parseBoolean(searchParams.get("hasMilitaryGovernment")),
    isMonarchy: parseBoolean(searchParams.get("isMonarchy")),
    isRepublic: parseBoolean(searchParams.get("isRepublic")),
    isFederal: parseBoolean(searchParams.get("isFederal")),
    isUnitary: parseBoolean(searchParams.get("isUnitary")),
    sort: searchParams.get("sort") ?? undefined,
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 24)
  };

  return NextResponse.json(searchCountries(filters));
}

function parseBoolean(value: string | null) {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return undefined;
}

