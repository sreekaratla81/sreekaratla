export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { join } from "path";
import { promises as fs } from "fs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file") ?? "index.json";
  const path = join(process.cwd(), "public", "pagefind", file);

  try {
    const data = await fs.readFile(path);
    return new NextResponse(data, {
      headers: {
        "Content-Type": file.endsWith(".json") ? "application/json" : "application/octet-stream",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    return new NextResponse("Index not found", { status: 404 });
  }
}
