import type { Metadata } from "next";
import { siteConfig } from "./config";

export const buildMetadata = (meta?: Partial<Metadata>): Metadata => ({
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s • ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    images: [{ url: `${siteConfig.url}/opengraph-image` }]
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.social.x,
    title: siteConfig.name,
    description: siteConfig.description
  },
  alternates: {
    canonical: siteConfig.url,
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`
    }
  },
  ...meta
});
