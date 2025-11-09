#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import RSS from "rss";
import { compareDesc } from "date-fns";

const TRACKS = ["tech", "hospitality", "conscious-leadership"];
const trackLabels = {
  tech: "Tech Insights",
  hospitality: "Hospitality & Travel",
  "conscious-leadership": "Conscious Leadership",
};
const trackDescriptions = {
  tech: "CTO perspectives on enterprise architecture, AI, and modern engineering.",
  hospitality: "Playbooks from hospitality operations, productization, and guest experience.",
  "conscious-leadership": "Spiritual essays on evolving from seeker to leader.",
};

const siteUrlEnv = process.env.SITE_URL ?? "https://sreekaratla.com";
const siteName = process.env.SITE_NAME ?? "sreekaratla.com";
const siteDescription =
  process.env.SITE_TAGLINE ??
  "Insights across technology leadership, hospitality, and conscious leadership by Sreekar Atla.";

const baseUrl = siteUrlEnv.replace(/\/+$/, "");

const normalizePath = (value) => (value ?? "").replace(/\\+/g, "/");
const isPostType = (value) => value != null && TRACKS.includes(value);
const resolvePostType = (post) => {
  if (isPostType(post.type)) return post.type;
  const flattened = normalizePath(post._raw?.flattenedPath)
    .split("/")
    .filter(Boolean);
  const fromFlattened = flattened[0];
  if (isPostType(fromFlattened)) return fromFlattened;
  const dir = normalizePath(post._raw?.sourceFileDir)
    .split("/")
    .filter(Boolean);
  const fromDir = dir[0];
  if (isPostType(fromDir)) return fromDir;
  return TRACKS[0];
};

async function loadContentlayerPosts() {
  const jsonPath = path.join(process.cwd(), ".contentlayer", "generated", "Post", "_index.json");
  try {
    const raw = await fs.readFile(jsonPath, "utf8");
    const allPosts = JSON.parse(raw);
    const includeDrafts = process.env.NODE_ENV !== "production";
    return allPosts
      .filter((post) => includeDrafts || !post.draft)
      .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(
        "[gen:rss] Contentlayer output not found. Run `pnpm contentlayer:build` before generating RSS.",
        { cause: error }
      );
    }
    throw error;
  }
}

function toAbsoluteUrl(relative) {
  if (!relative) return baseUrl;
  try {
    const origin = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    return new URL(relative, origin).toString();
  } catch {
    return `${baseUrl}${relative.startsWith("/") ? relative : `/${relative}`}`;
  }
}

function createFeed({ title, description, feedPath }) {
  return new RSS({
    title,
    description,
    site_url: baseUrl,
    feed_url: `${baseUrl}${feedPath.startsWith("/") ? feedPath : `/${feedPath}`}`,
    language: "en",
  });
}

function addPostsToFeed(feed, posts) {
  for (const post of posts) {
    const url = toAbsoluteUrl(post.url ?? "/");
    const description = post.excerpt ?? post.summary ?? "";
    feed.item({
      title: post.title,
      url,
      guid: url,
      date: new Date(post.updated ?? post.date),
      description,
      categories: Array.isArray(post.tags) ? post.tags : undefined,
    });
  }
}

(async () => {
  const posts = await loadContentlayerPosts();

  const globalFeed = createFeed({
    title: siteName,
    description: siteDescription,
    feedPath: "/rss.xml",
  });
  addPostsToFeed(globalFeed, posts);

  const outDir = path.join(process.cwd(), "public");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "rss.xml"), globalFeed.xml({ indent: true }), "utf8");
  console.log("[gen:rss] Wrote public/rss.xml");

  const trackDir = path.join(outDir, "rss");
  await fs.mkdir(trackDir, { recursive: true });

  for (const track of TRACKS) {
    const trackPosts = posts.filter((post) => resolvePostType(post) === track);
    if (trackPosts.length === 0) continue;
    const trackFeed = createFeed({
      title: `${siteName} — ${trackLabels[track]}`,
      description: trackDescriptions[track] ?? siteDescription,
      feedPath: `/rss/${track}.xml`,
    });
    addPostsToFeed(trackFeed, trackPosts);
    await fs.writeFile(
      path.join(trackDir, `${track}.xml`),
      trackFeed.xml({ indent: true }),
      "utf8"
    );
    console.log(`[gen:rss] Wrote public/rss/${track}.xml`);
  }
})().catch((error) => {
  console.error("[gen:rss] Failed to generate RSS:", error);
  process.exit(1);
});
