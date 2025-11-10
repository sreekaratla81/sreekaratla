import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { allPosts } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { Prose } from "@/components/prose";
import { TagBadge } from "@/components/tag-badge";
import { ShareButtons } from "@/components/share-buttons";
import { ReadingTime } from "@/components/reading-time";
import { NewsletterCta } from "@/components/newsletter-cta";
import { getAdjacentPosts, getPostByParams, getRelatedPosts, resolveTrack } from "@/lib/content";
import { formatDate } from "@/lib/date";
import { siteConfig, trackLabels } from "@/lib/config";
import { mdxComponents } from "@/lib/mdx";
import type { TrackId } from "@/lib/config";
import { PostCard } from "@/components/post-card";

interface ArticlePageProps {
  params: { category: TrackId; slug: string };
}

export const generateStaticParams = () =>
  allPosts.map((post) => ({ category: resolveTrack(post), slug: post.slug }));

export const dynamicParams = false;

export const generateMetadata = ({ params }: ArticlePageProps): Metadata => {
  const { isEnabled } = draftMode();
  const post = getPostByParams(params.category, params.slug, { includeDrafts: isEnabled });
  if (!post) return {};

  const track = resolveTrack(post);
  const url = `${siteConfig.url}${post.url}`;
  const description = post.description;

  return {
    title: `${post.title} • ${trackLabels[track]}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      siteName: siteConfig.name
    },
    twitter: {
      title: post.title,
      description
    }
  } satisfies Metadata;
};

export default function ArticlePage({ params }: ArticlePageProps) {
  const { isEnabled } = draftMode();
  const post = getPostByParams(params.category, params.slug, { includeDrafts: isEnabled });

  if (!post) {
    notFound();
  }

  const track = resolveTrack(post);
  const Component = useMDXComponent(post.body.code);
  const adjacent = getAdjacentPosts(post, { includeDrafts: isEnabled });
  const related = getRelatedPosts(post, 3, { includeDrafts: isEnabled });

  return (
    <article className="pb-16">
      <Container className="space-y-10 py-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: trackLabels[track], href: `/${track}` },
            { label: post.title }
          ]}
        />
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-foreground/50">
            <span>{trackLabels[track]}</span>
            <span>{formatDate(post.date)}</span>
            <ReadingTime post={post} />
            {post.updated ? <span>Updated {formatDate(post.updated)}</span> : null}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{post.title}</h1>
          <p className="max-w-3xl text-lg text-foreground/70">{post.description}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </header>
        <Prose>
          <Component components={mdxComponents} />
        </Prose>
        <ShareButtons title={post.title} />
        <nav className="grid gap-4 border-t border-border/60 pt-6 text-sm text-foreground/70 sm:grid-cols-2">
          {adjacent.previous && (
            <Link href={adjacent.previous.url as Route} className="group space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">Previous</span>
              <span className="block text-base font-semibold text-foreground group-hover:text-foreground/80">
                {adjacent.previous.title}
              </span>
            </Link>
          )}
          {adjacent.next && (
            <Link href={adjacent.next.url as Route} className="group space-y-1 text-right sm:text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">Next</span>
              <span className="block text-base font-semibold text-foreground group-hover:text-foreground/80">
                {adjacent.next.title}
              </span>
            </Link>
          )}
        </nav>
        {related.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Related articles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <PostCard key={item._id} post={item} />
              ))}
            </div>
          </section>
        )}
        <NewsletterCta />
      </Container>
    </article>
  );
}
