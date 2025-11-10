import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import type { ReactNode } from "react";
import { buildTrackMetadata } from "../_components/track-page";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { PostCard } from "@/components/post-card";
import { getPostsByTrack, getTags } from "@/lib/content";
import { trackDescriptions } from "@/lib/config";
import type { TrackId } from "@/lib/config";
import { cn } from "@/lib/utils";

const TRACK: TrackId = "spirituality";
const RESOURCES = [
  { label: "Morning stillness audio", href: "#" },
  { label: "Indian wisdom reading list", href: "#" },
  { label: "Founder breathwork micro-practice", href: "#" }
];
const TIPS = [
  "Set a 12-minute window for breath, gratitude, mantra, and preview.",
  "Close every planning session with one reflective question.",
  "Track energy, not tasks—note when you feel grounded versus scattered."
];

type SearchParams = {
  tag?: string;
};

export const metadata: Metadata = buildTrackMetadata(TRACK);

type Props = {
  searchParams?: SearchParams;
};

export default function SpiritualityTrackPage({ searchParams }: Props) {
  const { isEnabled } = draftMode();
  const posts = getPostsByTrack(TRACK, { includeDrafts: isEnabled });
  const tags = getTags({ includeDrafts: isEnabled, track: TRACK });
  const activeTag = searchParams?.tag ?? "";
  const filtered = activeTag ? posts.filter((post) => post.tags?.includes(activeTag)) : posts;

  return (
    <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,3fr),minmax(0,1.25fr)]">
      <div className="space-y-8">
        <SectionHeader
          accent={TRACK}
          eyebrow="Why spirituality for leaders?"
          title={trackDescriptions[TRACK].intro}
          description={trackDescriptions[TRACK].highlight}
        />
        <TagFilter track={TRACK} tags={tags} activeTag={activeTag} />
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((post) => (
            <PostCard key={post._id} post={post} showTrack={false} />
          ))}
          {filtered.length === 0 && (
            <p className="rounded-3xl border border-dashed border-border/60 p-6 text-sm text-foreground/60">
              No practices published yet for this tag. Check back soon.
            </p>
          )}
        </div>
      </div>
      <aside className="space-y-6 rounded-3xl border border-border/60 bg-muted/40 p-6">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Curated resources</h2>
          <ul className="space-y-2 text-sm text-foreground/70">
            {RESOURCES.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="transition hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/50">Micro-practices</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            {TIPS.map((tip) => (
              <li key={tip} className="rounded-xl border border-border/50 bg-background/70 p-3">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </aside>
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
  const base = `/${track}`;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <FilterLink href={base} active={!activeTag}>
        All tags
      </FilterLink>
      {tags.map((tag) => (
        <FilterLink key={tag} href={`${base}?tag=${encodeURIComponent(tag)}`} active={activeTag === tag}>
          #{tag}
        </FilterLink>
      ))}
    </div>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
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
