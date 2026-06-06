import { NextRequest, NextResponse } from "next/server";

import { syncCountriesToDatabase } from "@/lib/data-sync/restcountries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.DATA_SYNC_SECRET;
  const providedSecret = request.headers.get("x-atlas-sync-secret") ?? request.nextUrl.searchParams.get("secret");

  if (configuredSecret && configuredSecret !== providedSecret) {
    return NextResponse.json({ error: "Mã bí mật đồng bộ dữ liệu không hợp lệ." }, { status: 401 });
  }

  const includeWikidata = request.nextUrl.searchParams.get("wikidata") !== "false";
  const result = await syncCountriesToDatabase({ includeWikidata });
  return NextResponse.json(result);
}
