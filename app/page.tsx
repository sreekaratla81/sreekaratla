import Link from "next/link";
import type { Route } from "next";
import { draftMode } from "next/headers";
import { Container } from "@/components/container";
import { NewsletterCta } from "@/components/newsletter-cta";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/content";
import { trackLabels } from "@/lib/config";

export default function HomePage() {
  const { isEnabled } = draftMode();
  const posts = getAllPosts({ includeDrafts: isEnabled });
  const [featured, ...rest] = posts;
  const fallbackPosts = rest.length > 0 ? rest : featured ? [featured] : [];
  const recentPosts: Array<(typeof posts)[number]> = fallbackPosts
    .filter((post: (typeof posts)[number] | undefined): post is (typeof posts)[number] => Boolean(post))
    .slice(0, 4);

  return (
    <>
      <section className="border-b border-border/60 bg-gradient-to-br from-background to-muted py-20">
        <Container className="grid gap-10 md:grid-cols-[1.4fr,1fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-wide text-foreground/60">Sreekar Atla</p>
            <h1 className="text-4xl font-semibold sm:text-5xl">
              Building the connective tissue between enterprise tech, hospitality craft, and conscious leadership.
            </h1>
            <p className="text-lg text-foreground/70">
              Essays and field notes from a technologist-operator exploring AI, guest experience, and the inner work of leadership.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {Object.entries(trackLabels).map(([key, value]) => (
                <span key={key} className="rounded-full border border-border/60 px-3 py-1">
                  {value}
                </span>
              ))}
            </div>
          </div>
          {featured ? (
            <div className="space-y-4 rounded-3xl border border-border/60 bg-background/60 p-6 shadow-lg">
              <p className="text-xs uppercase tracking-wide text-foreground/60">Featured essay</p>
              <Link href={featured.url as Route} className="space-y-3">
                <h2 className="text-2xl font-semibold leading-tight">{featured.title}</h2>
                <p className="text-foreground/70">{featured.excerpt}</p>
              </Link>
              <Link href={"/writing" as Route} className="text-sm font-semibold text-accent">
                Browse all writing →
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/60 p-6 text-foreground/60">
              <p>Writing samples coming soon.</p>
            </div>
          )}
        </Container>
      </section>
      <Container className="space-y-12 py-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">Latest essays</h2>
          <p className="text-foreground/60">Fresh thinking across the three tracks.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        <NewsletterCta />
      </Container>
    </>
  );
}
