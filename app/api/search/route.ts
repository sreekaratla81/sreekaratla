export const runtime = "edge";

import { NextResponse } from "next/server";

const FALLBACK_CACHE_CONTROL = "public, max-age=3600";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file") ?? "index.json";
  const assetUrl = new URL(`/pagefind/${file}`, request.url);

  try {
    const response = await fetch(assetUrl);

    if (!response.ok || !response.body) {
      return new NextResponse("Index not found", { status: 404 });
    }

    const headers = new Headers(response.headers);
    if (!headers.has("Cache-Control")) {
      headers.set("Cache-Control", FALLBACK_CACHE_CONTROL);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers
    });
  } catch (error) {
    return new NextResponse("Index not found", { status: 404 });
  }
}
