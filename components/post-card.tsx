import Link from "next/link";
import type { Route } from "next";
import type { Post } from "contentlayer/generated";
import { formatDate } from "@/lib/date";
import { trackLabels, type TrackId } from "@/lib/config";
import { resolveTrack } from "@/lib/content";
import { TagBadge } from "./tag-badge";
import { ReadingTime } from "./reading-time";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  showTrack?: boolean;
}

const trackAccent: Record<TrackId, string> = {
  tech: "border-tech/40",
  hospitality: "border-hospitality/40",
  leadership: "border-leadership/40",
  spirituality: "border-spirituality/40"
};

export function PostCard({ post, showTrack = true }: PostCardProps) {
  const track = resolveTrack(post);
  const accentClass = trackAccent[track] ?? "border-border/60";

  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-4 rounded-3xl border bg-background/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl",
        accentClass
      )}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-foreground/60">
        {showTrack ? (
          <span className="rounded-full border border-border/60 px-3 py-1 text-foreground/70">
            {trackLabels[track]}
          </span>
        ) : null}
        <span>{formatDate(post.date)}</span>
        <ReadingTime post={post} />
        {post.updated && <span>Updated {formatDate(post.updated)}</span>}
      </div>
      <Link href={post.url as Route} className="space-y-3">
        <h3 className="text-2xl font-semibold leading-tight text-foreground group-hover:text-foreground/90">
          {post.title}
        </h3>
        <p className="text-sm text-foreground/70">{post.description}</p>
      </Link>
      <div className="mt-auto flex flex-wrap gap-2">
        {post.tags?.slice(0, 3).map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </article>
  );
}
