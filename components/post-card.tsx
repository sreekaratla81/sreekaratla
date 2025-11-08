import Link from "next/link";
import type { Post } from "contentlayer/generated";
import { formatDate } from "@/lib/date";
import { trackLabels } from "@/lib/config";
import { TagBadge } from "./tag-badge";
import { ReadingTime } from "./reading-time";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group space-y-4 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm transition hocus:-translate-y-1 hocus:shadow-lg">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-foreground/60">
        <span className="rounded-full bg-muted px-3 py-1 text-foreground/80">{trackLabels[post.type]}</span>
        <span>{formatDate(post.date)}</span>
        <ReadingTime post={post} />
      </div>
      <Link href={post.url} className="block space-y-3">
        <h3 className="text-2xl font-semibold leading-tight text-foreground group-hover:text-accent">
          {post.title}
        </h3>
        <p className="text-foreground/70">{post.excerpt}</p>
      </Link>
      <div className="flex flex-wrap gap-2">
        {post.tags.slice(0, 3).map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </article>
  );
}
