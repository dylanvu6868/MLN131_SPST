import { NextResponse } from "next/server";

import { getWorldometersLiveSnapshot } from "@/lib/data-sync/worldometers";

export const runtime = "nodejs";
// Worldometers publishes annual figures, so a fresh scrape every 6h is plenty.
export const revalidate = 21600;

export async function GET() {
  try {
    const snapshot = await getWorldometersLiveSnapshot();
    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
