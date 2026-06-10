import { NextRequest, NextResponse } from "next/server";

import { syncWorldometersPopulationToDatabase } from "@/lib/data-sync/worldometers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.DATA_SYNC_SECRET;
  const providedSecret = request.headers.get("x-atlas-sync-secret") ?? request.nextUrl.searchParams.get("secret");

  if (configuredSecret && configuredSecret !== providedSecret) {
    return NextResponse.json({ error: "Mã bí mật đồng bộ dữ liệu không hợp lệ." }, { status: 401 });
  }

  try {
    const result = await syncWorldometersPopulationToDatabase();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
