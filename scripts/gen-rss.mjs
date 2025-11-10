#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"
import RSS from "rss"
import { compareDesc } from "date-fns"

const TRACKS = ["tech", "hospitality", "leadership", "spirituality"]
const trackLabels = {
  tech: "Technology & AI",
  hospitality: "Hospitality Ventures",
  leadership: "Leadership Ops",
  spirituality: "Spirituality in Practice"
}
const trackDescriptions = {
  tech: "Architecture patterns, AI programs, and platform strategy insights.",
  hospitality: "Guest experience, operations, and hospitality systems playbooks.",
  leadership: "Execution rhythms and conscious leadership practices.",
  spirituality: "Mindful rituals and Indian wisdom for founders and executives."
}

const siteUrlEnv = process.env.SITE_URL ?? "https://sreekaratla.com"
const siteName = process.env.SITE_NAME ?? "sreekaratla.com"
const siteDescription =
  process.env.SITE_TAGLINE ??
  "Enterprise architect and hospitality operator sharing strategies in technology, leadership, and spirituality."

const baseUrl = siteUrlEnv.replace(/\/+$/, "")

const normalizePath = (value) => (value ?? "").replace(/\\+/g, "/")
const isTrack = (value) => value != null && TRACKS.includes(value)
const resolvePostTrack = (post) => {
  if (isTrack(post.track)) return post.track
  const flattened = normalizePath(post._raw?.flattenedPath).split("/").filter(Boolean)
  if (isTrack(flattened[0])) return flattened[0]
  const dir = normalizePath(post._raw?.sourceFileDir).split("/").filter(Boolean)
  if (isTrack(dir[0])) return dir[0]
  return TRACKS[0]
}

async function loadContentlayerPosts() {
  const jsonPath = path.join(process.cwd(), ".contentlayer", "generated", "Post", "_index.json")
  try {
    const raw = await fs.readFile(jsonPath, "utf8")
    const allPosts = JSON.parse(raw)
    const includeDrafts = process.env.NODE_ENV !== "production"
    return allPosts
      .filter((post) => {
        if (includeDrafts) return true
        const publishedDate = new Date(post.date)
        return !post.draft && publishedDate.getTime() <= Date.now()
      })
      .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(
        "[gen:rss] Contentlayer output not found. Run `pnpm contentlayer:build` before generating RSS.",
        { cause: error }
      )
    }
    throw error
  }
}

function toAbsoluteUrl(relative) {
  if (!relative) return baseUrl
  try {
    const origin = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
    return new URL(relative, origin).toString()
  } catch {
    return `${baseUrl}${relative.startsWith("/") ? relative : `/${relative}`}`
  }
}

function createFeed({ title, description, feedPath }) {
  return new RSS({
    title,
    description,
    site_url: baseUrl,
    feed_url: `${baseUrl}${feedPath.startsWith("/") ? feedPath : `/${feedPath}`}`,
    language: "en"
  })
}

function addPostsToFeed(feed, posts) {
  for (const post of posts) {
    const url = toAbsoluteUrl(post.url ?? "/")
    const description = post.description ?? ""
    feed.item({
      title: post.title,
      url,
      guid: url,
      date: new Date(post.updated ?? post.date),
      description,
      categories: Array.isArray(post.tags) ? post.tags : undefined
    })
  }
}

;(async () => {
  const posts = await loadContentlayerPosts()

  const globalFeed = createFeed({
    title: siteName,
    description: siteDescription,
    feedPath: "/rss.xml"
  })
  addPostsToFeed(globalFeed, posts)

  const outDir = path.join(process.cwd(), "public")
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(path.join(outDir, "rss.xml"), globalFeed.xml({ indent: true }), "utf8")
  console.log("[gen:rss] Wrote public/rss.xml")

  const trackDir = path.join(outDir, "rss")
  await fs.mkdir(trackDir, { recursive: true })

  for (const track of TRACKS) {
    const trackPosts = posts.filter((post) => resolvePostTrack(post) === track)
    if (trackPosts.length === 0) continue
    const trackFeed = createFeed({
      title: `${siteName} — ${trackLabels[track]}`,
      description: trackDescriptions[track] ?? siteDescription,
      feedPath: `/rss/${track}.xml`
    })
    addPostsToFeed(trackFeed, trackPosts)
    await fs.writeFile(path.join(trackDir, `${track}.xml`), trackFeed.xml({ indent: true }), "utf8")
    console.log(`[gen:rss] Wrote public/rss/${track}.xml`)
  }
})().catch((error) => {
  console.error("[gen:rss] Failed to generate RSS:", error)
  process.exit(1)
})
