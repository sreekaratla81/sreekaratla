import { draftMode } from "next/headers";
import { Container } from "@/components/container";
import { PostCard } from "@/components/post-card";
import { trackLabels, trackDescriptions } from "@/lib/config";
import { getPostsByType } from "@/lib/content";

export const metadata = {
  title: `${trackLabels.tech} Writing`
};

export default function TechWritingPage() {
  const { isEnabled } = draftMode();
  const posts = getPostsByType("tech", { includeDrafts: isEnabled });

  return (
    <Container className="space-y-10 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">{trackLabels.tech}</h1>
        <p className="text-foreground/60 max-w-2xl">{trackDescriptions.tech}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
        {posts.length === 0 && <p className="text-foreground/60">Coming soon.</p>}
      </div>
    </Container>
  );
}
