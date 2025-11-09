export const runtime = "edge";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file") ?? "index.json";
  const assetUrl = new URL(`/pagefind/${file}`, request.url);

  const response = await fetch(assetUrl);
  if (!response.ok) {
    return new NextResponse("Index not found", { status: response.status === 404 ? 404 : 500 });
  }

  const body = await response.arrayBuffer();
  const contentType =
    response.headers.get("content-type") ?? (file.endsWith(".json") ? "application/json" : "application/octet-stream");
  const cacheControl = response.headers.get("cache-control") ?? "public, max-age=3600";

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": cacheControl
    }
  });
}
