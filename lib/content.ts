import readingTime from "reading-time";
import { compareDesc } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";

export type PostType = Post["type"];

export const getReadingTime = (raw: string) => readingTime(raw);

const filterDrafts = (post: Post, includeDrafts: boolean) => {
  if (includeDrafts) return true;
  if (post.draft && process.env.NODE_ENV === "production") {
    return false;
  }
  return true;
};

export const getAllPosts = (options: { includeDrafts?: boolean } = {}) =>
  allPosts
    .filter((post) => filterDrafts(post, options.includeDrafts ?? false))
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

export const getPostsByType = (type: PostType, options: { includeDrafts?: boolean } = {}) =>
  getAllPosts(options).filter((post) => post.type === type);

export const getPostBySlug = (slug: string, options: { includeDrafts?: boolean } = {}) =>
  getAllPosts(options).find((post) => post.slug === slug);

export const getPostsByTag = (tag: string, options: { includeDrafts?: boolean } = {}) =>
  getAllPosts(options).filter((post) => post.tags.includes(tag));

export const getPostsBySeries = (series: string, options: { includeDrafts?: boolean } = {}) =>
  getAllPosts(options).filter((post) => post.series === series);

export const getTags = (options: { includeDrafts?: boolean } = {}) => {
  const tagSet = new Set<string>();
  getAllPosts(options).forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
};

export const getSeries = (options: { includeDrafts?: boolean } = {}) => {
  const seriesSet = new Set<string>();
  getAllPosts(options)
    .filter((post) => post.series)
    .forEach((post) => seriesSet.add(post.series!));
  return Array.from(seriesSet).sort((a, b) => a.localeCompare(b));
};

export const getAdjacentPosts = (post: Post, options: { includeDrafts?: boolean } = {}) => {
  const trackPosts = getPostsByType(post.type, options);
  const currentIndex = trackPosts.findIndex((item) => item.slug === post.slug);
  return {
    previous: currentIndex < trackPosts.length - 1 ? trackPosts[currentIndex + 1] : undefined,
    next: currentIndex > 0 ? trackPosts[currentIndex - 1] : undefined
  };
};

export const getRelatedPosts = (post: Post, limit = 3, options: { includeDrafts?: boolean } = {}) => {
  const tags = new Set(post.tags);
  return getPostsByType(post.type, options)
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({
      post: item,
      score: item.tags.reduce((acc, tag) => acc + (tags.has(tag) ? 1 : 0), 0)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.post);
};
