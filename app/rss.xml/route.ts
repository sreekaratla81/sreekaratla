export const runtime = "edge";

import { NextResponse } from "next/server";
import { buildGlobalFeed } from "@/lib/rss";

export async function GET() {
  const feed = buildGlobalFeed();
  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate"
    }
  });
}
