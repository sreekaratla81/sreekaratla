export const runtime = "edge";

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = process.env.CONTENT_PREVIEW_SECRET;
  if (!secret || searchParams.get("secret") !== secret) {
    return new NextResponse("Invalid preview token", { status: 401 });
  }

  draftMode().enable();

  const redirectUrl = searchParams.get("slug") ? `/writing/${searchParams.get("slug")}` : "/";

  return NextResponse.redirect(new URL(`${redirectUrl}?preview=1`, request.url));
}
