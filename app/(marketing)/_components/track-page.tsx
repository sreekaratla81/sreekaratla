import Link from "next/link";
import type { Metadata, Route } from "next";
import { draftMode } from "next/headers";
import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { PostCard } from "@/components/post-card";
import { getPostsByTrack, getTags } from "@/lib/content";
import { siteConfig, trackDescriptions, trackLabels, type TrackId } from "@/lib/config";
import { cn } from "@/lib/utils";

export const buildTrackMetadata = (track: TrackId): Metadata => ({
  title: `${trackLabels[track]} • ${siteConfig.name}`,
  description: trackDescriptions[track].intro
});

interface TrackPageProps {
  track: TrackId;
  searchParams?: { tag?: string };
}

export function TrackPage({ track, searchParams }: TrackPageProps) {
  const { isEnabled } = draftMode();
  const tags = getTags({ includeDrafts: isEnabled, track });
  const posts = getPostsByTrack(track, { includeDrafts: isEnabled });
  const activeTag = searchParams?.tag ?? "";
  const filteredPosts = activeTag
    ? posts.filter((post) => post.tags?.includes(activeTag))
    : posts;

  return (
    <Container className="space-y-10 py-16">
      <SectionHeader
        accent={track}
        eyebrow={`${trackLabels[track]} articles`}
        title={trackDescriptions[track].intro}
        description={trackDescriptions[track].highlight}
      />
      <TagFilter track={track} tags={tags} activeTag={activeTag} />
      <div className="grid gap-6 md:grid-cols-2">
        {filteredPosts.map((post) => (
          <PostCard key={post._id} post={post} showTrack={false} />
        ))}
        {filteredPosts.length === 0 && (
          <p className="rounded-3xl border border-dashed border-border/60 p-6 text-sm text-foreground/60">
            No articles yet for this filter. Check back soon.
          </p>
        )}
      </div>
    </Container>
  );
}

function TagFilter({
  track,
  tags,
  activeTag
}: {
  track: TrackId;
  tags: string[];
  activeTag: string;
}) {
  const basePath = `/${track}` as Route;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <FilterLink href={{ pathname: basePath }} active={!activeTag}>
        All tags
      </FilterLink>
      {tags.map((tag) => (
        <FilterLink
          key={tag}
          href={{ pathname: basePath, query: { tag } }}
          active={activeTag === tag}
        >
          #{tag}
        </FilterLink>
      ))}
    </div>
  );
}

type InternalHref = { pathname: Route; query?: Record<string, string | string[]> };
type ExternalHref = `http${string}`;

type FilterLinkProps = { href: InternalHref | ExternalHref; active: boolean; children: ReactNode };

function FilterLink({ href, active, children }: FilterLinkProps) {
  const isExternal = typeof href === "string";
  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1 font-semibold transition",
          active
            ? "border-ring bg-muted text-foreground"
            : "border-border text-foreground/70 hover:border-ring hover:text-foreground"
        )}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-semibold transition",
        active
          ? "border-ring bg-muted text-foreground"
          : "border-border text-foreground/70 hover:border-ring hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}
