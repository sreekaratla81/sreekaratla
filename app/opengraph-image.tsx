import { createOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/config";

type OgProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default async function Image({ searchParams }: OgProps) {
  const title = typeof searchParams.title === "string" ? searchParams.title : siteConfig.name;
  const description =
    typeof searchParams.description === "string" ? searchParams.description : siteConfig.tagline;
  return createOgImage(title, description);
}
