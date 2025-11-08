import type { Post } from "contentlayer/generated";

export function ReadingTime({ post }: { post: Post }) {
  const minutes = Math.ceil(post.readingTime.minutes);
  return <span>{minutes} min read</span>;
}
