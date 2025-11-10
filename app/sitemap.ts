import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getAllPosts, TRACKS } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const staticRoutes = ["/", "/about", "/contact", "/now", "/tags"];
  const trackRoutes = TRACKS.map((track) => `/${track}`);

  const pages = [...staticRoutes, ...trackRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));

  const posts = getAllPosts().map((post) => ({
    url: `${base}${post.url}`,
    lastModified: new Date(post.updated ?? post.date)
  }));

  return [...pages, ...posts];
}
