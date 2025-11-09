import fs from "node:fs";
import path from "node:path";
import RSS from "rss";

const SITE_URL = (process.env.SITE_URL ?? "https://sreekaratla.com").replace(/\/$/, "");
const SITE_NAME = process.env.SITE_NAME ?? "Sreekar Atla";
const SITE_DESCRIPTION =
  process.env.SITE_TAGLINE ?? "Tech • Hospitality • Conscious Leadership";

const TRACKS = [
  {
    slug: "tech",
    label: "Tech Insights",
    description: "CTO perspectives on enterprise architecture, AI, and modern engineering.",
  },
  {
    slug: "hospitality",
    label: "Hospitality & Travel",
    description: "Playbooks from hospitality operations, productization, and guest experience.",
  },
  {
    slug: "conscious-leadership",
    label: "Conscious Leadership",
    description: "Spiritual essays on evolving from seeker to leader.",
  },
];

const normalizePath = (value = "") => value.replace(/\\+/g, "/");

const resolvePostType = (post) => {
  if (TRACKS.some((track) => track.slug === post.type)) {
    return post.type;
  }

  const flattened = normalizePath(post._raw?.flattenedPath)
    .split("/")
    .filter(Boolean);
  if (TRACKS.some((track) => track.slug === flattened[0])) {
    return flattened[0];
  }

  const directory = normalizePath(post._raw?.sourceFileDir)
    .split("/")
    .filter(Boolean);
  if (TRACKS.some((track) => track.slug === directory[0])) {
    return directory[0];
  }

  return TRACKS[0].slug;
};

async function loadPosts() {
  const jsonPath = path.join(process.cwd(), ".contentlayer/generated/Post/_index.json");
  const raw = fs.readFileSync(jsonPath, "utf8");
  const allPosts = JSON.parse(raw);
  const includeDrafts = process.env.NODE_ENV !== "production";
  return allPosts
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => ({ ...post, track: resolvePostType(post) }));
}

function createFeed({ title, description, posts, feedPath }) {
  const feed = new RSS({
    title,
    description,
    site_url: SITE_URL,
    feed_url: `${SITE_URL}${feedPath}`,
    language: "en",
    image_url: `${SITE_URL}/opengraph-image`,
  });

  for (const post of posts) {
    feed.item({
      title: post.title,
      url: `${SITE_URL}${post.url}`,
      guid: `${SITE_URL}${post.url}`,
      description: post.excerpt ?? post.summary,
      date: post.updated ?? post.date,
      categories: post.tags,
      author: "Sreekar Atla",
    });
  }

  return feed;
}

function writeFeed(feed, relativePath) {
  const xml = feed.xml({ indent: true });
  const outPath = path.join(process.cwd(), "public", relativePath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml);
  console.log(`Wrote public/${relativePath}`);
}

async function main() {
  const posts = await loadPosts();

  const globalFeed = createFeed({
    title: `${SITE_NAME} — Writing`,
    description: `${SITE_DESCRIPTION} essays from ${SITE_NAME}.`,
    posts,
    feedPath: "/rss.xml",
  });
  writeFeed(globalFeed, "rss.xml");

  for (const track of TRACKS) {
    const trackPosts = posts.filter((post) => post.track === track.slug);
    if (trackPosts.length === 0) continue;

    const trackFeed = createFeed({
      title: `${SITE_NAME} — ${track.label}`,
      description: `${track.description} articles from ${SITE_NAME}.`,
      posts: trackPosts,
      feedPath: `/rss/${track.slug}.xml`,
    });
    writeFeed(trackFeed, path.join("rss", `${track.slug}.xml`));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
