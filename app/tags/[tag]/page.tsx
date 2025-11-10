import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Container } from "@/components/container";
import { PostCard } from "@/components/post-card";
import { getAllPosts, getPostsByTag } from "@/lib/content";

interface TagPageProps {
  params: { tag: string };
}

export const generateStaticParams = () => {
  const tags = new Set<string>();
  getAllPosts().forEach((post) => post.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags).map((tag) => ({ tag }));
};

export const dynamicParams = false;

export const generateMetadata = ({ params }: TagPageProps): Metadata => {
  return {
    title: `Posts tagged ${params.tag}`,
    description: `All essays by Sreekar Atla tagged ${params.tag}.`
  };
};

export default function TagPage({ params }: TagPageProps) {
  const { isEnabled } = draftMode();
  const posts = getPostsByTag(params.tag, { includeDrafts: isEnabled });
  if (posts.length === 0) {
    notFound();
  }

  return (
    <Container className="space-y-10 py-16">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-foreground/60">Tag</p>
        <h1 className="text-4xl font-semibold">#{params.tag}</h1>
        <p className="text-foreground/60">Articles exploring {params.tag} from multiple perspectives.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </Container>
  );
}
