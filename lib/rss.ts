import { Feed } from "rss";
import { siteConfig, trackLabels } from "./config";
import { getAllPosts, getPostsByType } from "./content";

const buildFeed = (title: string, description: string, posts = getAllPosts()) => {
  const feed = new Feed({
    title,
    description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: "en",
    feedLinks: {
      rss2: `${siteConfig.url}/rss.xml`
    },
    image: `${siteConfig.url}/opengraph-image`,
    favicon: `${siteConfig.url}/favicon.ico`
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteConfig.url}${post.url}`,
      link: `${siteConfig.url}${post.url}`,
      description: post.excerpt,
      date: new Date(post.date),
      category: post.tags.map((tag) => ({ name: tag })),
      author: [{ name: "Sreekar Atla" }]
    });
  });

  return feed;
};

export const buildGlobalFeed = () =>
  buildFeed(
    `${siteConfig.name} — Writing`,
    "All essays from Sreekar Atla across technology, hospitality, and conscious leadership."
  ).rss2();

export const buildTrackFeed = (track: keyof typeof trackLabels) =>
  buildFeed(
    `${siteConfig.name} — ${trackLabels[track]}`,
    `${trackLabels[track]} articles from Sreekar Atla.`,
    getPostsByType(track)
  ).rss2();
