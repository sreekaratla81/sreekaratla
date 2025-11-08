import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getAllPosts, getTags, getSeries } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/contact",
    "/now",
    "/writing"
  ].map((path) => ({ url: `${base}${path}` }));

  const trackRoutes: MetadataRoute.Sitemap = [
    "/writing/tech",
    "/writing/hospitality",
    "/writing/conscious-leadership"
  ].map((path) => ({ url: `${base}${path}` }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${base}${post.url}`,
    lastModified: post.updated ?? post.date
  }));

  const tagRoutes = getTags().map((tag) => ({ url: `${base}/tags/${tag}` }));
  const seriesRoutes = getSeries().map((series) => ({ url: `${base}/series/${series}` }));

  return [...staticRoutes, ...trackRoutes, ...postRoutes, ...tagRoutes, ...seriesRoutes];
}
