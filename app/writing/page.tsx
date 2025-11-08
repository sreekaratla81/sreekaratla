import Link from "next/link";
import { draftMode } from "next/headers";
import { Container } from "@/components/container";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getAllPosts, getPostsByType, getTags } from "@/lib/content";
import { trackDescriptions, trackLabels, type Track } from "@/lib/config";

const POSTS_PER_PAGE = 6;

const isValidTrack = (value: string): value is Track => Object.hasOwn(trackLabels, value);

const trackTabs: { key: Track | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "tech", label: trackLabels.tech },
  { key: "hospitality", label: trackLabels.hospitality },
  { key: "conscious-leadership", label: trackLabels["conscious-leadership"] }
];

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function WritingPage({ searchParams }: Props) {
  const trackParam = typeof searchParams.track === "string" && isValidTrack(searchParams.track) ? searchParams.track : "all";
  const tagParam = typeof searchParams.tag === "string" ? searchParams.tag : undefined;
  const page = Number(searchParams.page ?? "1");

  const { isEnabled } = draftMode();
  let posts = trackParam === "all" ? getAllPosts({ includeDrafts: isEnabled }) : getPostsByType(trackParam, { includeDrafts: isEnabled });
  if (tagParam) {
    posts = posts.filter((post) => post.tags.includes(tagParam));
  }

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const paginated = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const tags = getTags({ includeDrafts: isEnabled });

  return (
    <Container className="space-y-12 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">Writing</h1>
        <p className="text-foreground/60 max-w-2xl">
          Essays, playbooks, and reflections from the intersections of technology leadership, hospitality, and conscious growth.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {trackTabs.map((tab) => (
          <Link
            key={tab.key}
            href={{
              pathname: "/writing",
              query: { ...(tab.key !== "all" ? { track: tab.key } : {}), ...(tagParam ? { tag: tagParam } : {}) }
            }}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              trackParam === tab.key ? "border-accent text-accent" : "border-border/60 text-foreground/70 hocus:border-accent"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {trackParam !== "all" && (
        <p className="rounded-2xl border border-border/60 bg-muted/60 p-5 text-sm text-foreground/70">
          {trackDescriptions[trackParam]}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = tag === tagParam;
          return (
            <Link
              key={tag}
              href={{
                pathname: "/writing",
                query: {
                  ...(trackParam !== "all" ? { track: trackParam } : {}),
                  ...(active ? {} : { tag })
                }
              }}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                active ? "border-accent bg-accent/10 text-accent" : "border-border/60 text-foreground/60 hocus:border-accent"
              }`}
            >
              #{tag}
            </Link>
          );
        })}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {paginated.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
        {paginated.length === 0 && <p className="text-foreground/60">No posts yet. Check back soon.</p>}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/writing"
        query={{ ...(trackParam !== "all" ? { track: trackParam } : {}), ...(tagParam ? { tag: tagParam } : {}) }}
      />
    </Container>
  );
}
