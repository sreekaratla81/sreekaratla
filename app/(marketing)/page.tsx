import { draftMode } from "next/headers";
import { Hero } from "@/components/hero";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { TrackCard } from "@/components/track-card";
import { NewsletterCta } from "@/components/newsletter-cta";
import { getFeaturedPosts, getPostsByTrack, TRACKS } from "@/lib/content";

export default function MarketingHomePage() {
  const { isEnabled } = draftMode();
  const trackCollections = TRACKS.map((track) => {
    const featured = getFeaturedPosts({ includeDrafts: isEnabled, track });
    const list = featured.length > 0 ? featured : getPostsByTrack(track, { includeDrafts: isEnabled });
    return { track, posts: list.slice(0, 3) };
  });

  return (
    <div className="space-y-16 pb-24">
      <Container className="pt-12">
        <Hero />
      </Container>
      <Container>
        <SectionHeader
          eyebrow="Four-track focus"
          title="Tech, hospitality, leadership, and spirituality—woven together."
          description="Choose a track to explore featured plays and emerging ideas. Each list updates as new MDX articles land."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {trackCollections.map(({ track, posts }) => (
            <TrackCard key={track} track={track} posts={posts} />
          ))}
        </div>
      </Container>
      <Container>
        <NewsletterCta />
      </Container>
    </div>
  );
}
