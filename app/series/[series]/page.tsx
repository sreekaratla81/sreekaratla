import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Container } from "@/components/container";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getPostsBySeries } from "@/lib/content";

interface SeriesPageProps {
  params: { series: string };
}

export const generateStaticParams = () => {
  const series = new Set<string>();
  getAllPosts()
    .filter((post) => post.series)
    .forEach((post) => series.add(post.series!));
  return Array.from(series).map((value) => ({ series: value }));
};

export const dynamicParams = false;

export const generateMetadata = ({ params }: SeriesPageProps): Metadata => {
  return {
    title: `${params.series} series`,
    description: `All essays in the ${params.series} series by Sreekar Atla.`
  };
};

export default function SeriesPage({ params }: SeriesPageProps) {
  const { isEnabled } = draftMode();
  const posts = getPostsBySeries(params.series, { includeDrafts: isEnabled });
  if (posts.length === 0) {
    notFound();
  }

  return (
    <Container className="space-y-10 py-16">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-foreground/60">Series</p>
        <h1 className="text-4xl font-semibold">{params.series}</h1>
        <p className="text-foreground/60">Curated essays connected by a common thread.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </Container>
  );
}
