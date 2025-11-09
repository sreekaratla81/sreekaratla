export const runtime = "edge";

import { NextResponse } from "next/server";
import { buildTrackFeed } from "@/lib/rss";
import { trackLabels, type Track } from "@/lib/config";

export async function GET(_: Request, context: { params?: { track?: Track } } = {}) {
  const track = context.params?.track;
  if (!track || !trackLabels[track]) {
    return new NextResponse("Track not found", { status: 404 });
  }
  const feed = buildTrackFeed(track);
  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate"
    }
  });
}
