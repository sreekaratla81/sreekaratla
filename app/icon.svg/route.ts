export const runtime = "edge";

import { NextResponse } from "next/server";

const svg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="24" fill="#0F172A"/>
  <path d="M40 88L64 40l24 48" stroke="#38BDF8" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="64" cy="80" r="8" fill="#FACC15"/>
</svg>`;

export function GET() {
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400"
    }
  });
}
