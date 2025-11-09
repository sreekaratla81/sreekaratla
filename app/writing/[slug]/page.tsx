import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { allPosts } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import { Container } from "@/components/container";
import { Prose } from "@/components/prose";
import { TagBadge } from "@/components/tag-badge";
import { ShareButtons } from "@/components/share-buttons";
import { ReadingTime } from "@/components/reading-time";
import { PostCard } from "@/components/post-card";
import { getAdjacentPosts, getPostBySlug, getRelatedPosts } from "@/lib/content";
import { formatDate } from "@/lib/date";
import { trackLabels, siteConfig } from "@/lib/config";
import { mdxComponents } from "@/lib/mdx";

interface ArticlePageProps {
  params: { slug: string };
}

export const generateStaticParams = () => allPosts.map((post) => ({ slug: post.slug }));

export const dynamicParams = false;

export const generateMetadata = ({ params }: ArticlePageProps): Metadata => {
  const { isEnabled } = draftMode();
  const post = getPostBySlug(params.slug, { includeDrafts: isEnabled });
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: post.canonicalUrl ?? `${siteConfig.url}${post.url}`
    },
    openGraph: {
      title: post.ogTitle,
      description: post.ogDescription,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      url: `${siteConfig.url}${post.url}`,
      tags: post.tags,
      authors: ["Sreekar Atla"]
    },
    twitter: {
      title: post.ogTitle,
      description: post.ogDescription
    }
  } satisfies Metadata;
};

const extractHeadings = (source: string) => {
  const headingRegex = /^(#{2,3})\s+(.*)$/gm;
  const headings: { depth: number; title: string; id: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(source)) !== null) {
    const depth = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    headings.push({ depth, title, id });
  }
  return headings;
};

const depthPadding: Record<number, string> = {
  2: "pl-0",
  3: "pl-4"
};

export default function ArticlePage({ params }: ArticlePageProps) {
  const { isEnabled } = draftMode();
  const post = getPostBySlug(params.slug, { includeDrafts: isEnabled });

  if (!post) {
    notFound();
  }

  const Component = useMDXComponent(post.body.code);
  const headings = extractHeadings(post.body.raw ?? "");
  const adjacent = getAdjacentPosts(post, { includeDrafts: isEnabled });
  const related = getRelatedPosts(post, 3, { includeDrafts: isEnabled });

  return (
    <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,3fr),minmax(0,1fr)]">
      <article className="space-y-8">
        <div className="space-y-4">
          <Link href={`/writing?track=${post.type}`} className="inline-flex items-center text-sm text-accent">
            {trackLabels[post.type]}
          </Link>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>
          <p className="text-foreground/70">{post.excerpt}</p>
          <div className="flex flex-wrap gap-3 text-sm text-foreground/60">
            <span>{formatDate(post.date)}</span>
            <ReadingTime post={post} />
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>
        <Prose>
          <Component components={mdxComponents} />
        </Prose>
        {post.pullQuotes && post.pullQuotes.length > 0 && (
          <aside className="space-y-4 rounded-3xl border border-border/60 bg-muted/60 p-6">
            <p className="text-sm uppercase tracking-wide text-foreground/60">Pull quotes</p>
            <ul className="space-y-3 text-lg font-serif text-foreground/80">
              {post.pullQuotes.slice(0, 5).map((quote) => (
                <li key={quote}>“{quote}”</li>
              ))}
            </ul>
          </aside>
        )}
        <ShareButtons title={post.title} />
        <div className="grid gap-6 border-t border-border/60 pt-6 md:grid-cols-2">
          {adjacent.previous && (
            <div>
              <p className="text-xs uppercase tracking-wide text-foreground/50">Previous</p>
              <Link href={adjacent.previous.url as Route} className="text-lg font-semibold hocus:text-accent">
                {adjacent.previous.title}
              </Link>
            </div>
          )}
          {adjacent.next && (
            <div>
              <p className="text-xs uppercase tracking-wide text-foreground/50">Next</p>
              <Link href={adjacent.next.url as Route} className="text-lg font-semibold hocus:text-accent">
                {adjacent.next.title}
              </Link>
            </div>
          )}
        </div>
        {related.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Related essays</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <PostCard key={item._id} post={item} />
              ))}
            </div>
          </div>
        )}
      </article>
      <aside className="space-y-6">
        {headings.length > 0 && (
          <nav className="sticky top-28 space-y-3 rounded-3xl border border-border/60 bg-muted/40 p-6 text-sm">
            <p className="text-xs uppercase tracking-wide text-foreground/50">On this page</p>
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li key={heading.id} className={depthPadding[heading.depth] ?? "pl-0"}>
                  <a href={`#${heading.id}`} className="text-foreground/70 transition hocus:text-accent">
                    {heading.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </aside>
    </Container>
  );
}
