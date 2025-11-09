import { createOgImage, size } from "@/lib/og";
import { siteConfig } from "@/lib/config";

type OgProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export const runtime = "edge";
export { size };

export const contentType = "image/png";

export default function Image({ searchParams }: OgProps) {
  const title = typeof searchParams.title === "string" ? searchParams.title : siteConfig.name;
  const description =
    typeof searchParams.description === "string" ? searchParams.description : siteConfig.tagline;

  return createOgImage({
    title,
    description,
    footer: siteConfig.name
  });
}
