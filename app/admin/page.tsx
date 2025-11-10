import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

const ADMIN_ENABLED = process.env.ADMIN_ENABLED === "true";
const ADMIN_PASS = process.env.ADMIN_PASS ?? "";
const TEMPLATE_URL = (
  process.env.ADMIN_TEMPLATE_URL ??
  "https://github.com/sreekaratla81/sreekaratla/tree/main/templates/post.mdx"
) as `http${string}`;
const DOCS_URL = (
  process.env.ADMIN_DOCS_URL ??
  "https://github.com/sreekaratla81/sreekaratla#authoring-articles"
) as `http${string}`;

export const runtime = "nodejs";

export default function AdminPage() {
  if (!ADMIN_ENABLED || !ADMIN_PASS) {
    notFound();
  }

  const secret = headers().get("x-admin-pass");
  if (secret !== ADMIN_PASS) {
    notFound();
  }

  return (
    <Container className="space-y-12 py-16">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Authoring helpers</p>
        <h1 className="text-3xl font-semibold text-foreground">Create or update articles</h1>
        <p className="max-w-2xl text-sm text-foreground/70">
          Copy a template, fill in frontmatter, and drop the MDX file into <code className="rounded bg-muted px-1 py-0.5">/content/&lt;track&gt;</code>.
          Use preview mode to review drafts and future-dated posts before publishing.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <AdminCard
          title="New Article Template"
          description="Start from the pre-filled frontmatter and guidance comments."
          href={TEMPLATE_URL}
          action="Open MDX template"
        />
        <AdminCard
          title="Authoring Docs"
          description="Workflow, naming conventions, and preview instructions."
          href={DOCS_URL}
          action="Read authoring docs"
        />
      </div>
      <div className="rounded-3xl border border-dashed border-border/60 bg-muted/40 p-6 text-xs text-foreground/60">
        <p>
          Preview mode: <code>/api/preview?token=PREVIEW_TOKEN&amp;redirect=/tech</code> — replace the redirect path with the page you want to inspect. Append <code>&amp;mode=disable</code> to exit.
        </p>
      </div>
    </Container>
  );
}

function AdminCard({
  title,
  description,
  href,
  action
}: {
  title: string;
  description: string;
  href: `http${string}`;
  action: string;
}) {
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-border/60 bg-background/90 p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-foreground/70">{description}</p>
      </div>
      <Button asChild>
        <a href={href} target="_blank" rel="noreferrer">
          {action}
        </a>
      </Button>
    </div>
  );
}
