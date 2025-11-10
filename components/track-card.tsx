import Link from "next/link";
import type { Route } from "next";
import type { Post } from "contentlayer/generated";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { trackDescriptions, trackLabels, type TrackId } from "@/lib/config";

const accentBg: Record<TrackId, string> = {
  tech: "bg-tech/10",
  hospitality: "bg-hospitality/10",
  leadership: "bg-leadership/10",
  spirituality: "bg-spirituality/10"
};

const accentDot: Record<TrackId, string> = {
  tech: "bg-tech",
  hospitality: "bg-hospitality",
  leadership: "bg-leadership",
  spirituality: "bg-spirituality"
};

interface TrackCardProps {
  track: TrackId;
  posts: Post[];
}

export function TrackCard({ track, posts }: TrackCardProps) {
  const description = trackDescriptions[track];
  const items = posts.slice(0, 3);

  return (
    <article className={cn("flex h-full flex-col gap-6 rounded-3xl border border-border/60 p-6", accentBg[track])}>
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
          {trackLabels[track]}
        </span>
        <p className="text-sm text-foreground/70">{description.intro}</p>
        <p className="text-xs uppercase tracking-[0.18em] text-foreground/40">{description.highlight}</p>
      </div>
      <ul className="flex-1 space-y-4">
        {items.map((post) => (
          <li key={post._id} className="group">
            <Link
              href={post.url as Route}
              className={cn(
                "grid gap-2 rounded-2xl border border-transparent px-3 py-2 transition-colors",
                "group-hover:border-ring group-hover:bg-background/70"
              )}
            >
              <div className="flex items-center gap-2 text-xs text-foreground/50">
                <span className={cn("h-2.5 w-2.5 rounded-full", accentDot[track])} aria-hidden />
                <span>{formatDate(post.date)}</span>
              </div>
              <p className="text-sm font-medium text-foreground group-hover:text-foreground/90">{post.title}</p>
              <p className="text-xs text-foreground/60">{post.description}</p>
            </Link>
          </li>
        ))}
        {items.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border/60 p-3 text-sm text-foreground/60">
            Articles coming soon.
          </li>
        )}
      </ul>
      <Link
        href={`/${track}` as Route}
        className="inline-flex items-center justify-center rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-foreground/80 transition hover:border-ring hover:text-foreground"
      >
        Browse {trackLabels[track]}
      </Link>
    </article>
  );
}
