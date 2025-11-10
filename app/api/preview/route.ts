import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

const PREVIEW_TOKEN = process.env.PREVIEW_TOKEN;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");
  const token = url.searchParams.get("token");
  const redirectTo = url.searchParams.get("redirect") ?? "/";
  const destination = redirectTo.startsWith("/") ? redirectTo : "/";

  if (mode === "disable") {
    draftMode().disable();
    return redirect(destination);
  }

  if (!PREVIEW_TOKEN || token !== PREVIEW_TOKEN) {
    return new Response("Invalid preview token", { status: 401 });
  }

  draftMode().enable();
  return redirect(destination);
}
