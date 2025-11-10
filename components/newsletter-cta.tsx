import { Button } from "@/components/ui/button";

export function NewsletterCta() {
  return (
    <section
      id="newsletter"
      className="relative isolate overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-r from-brand-bg to-muted/80 p-10 shadow-lg"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_60%)]" />
      <div className="relative z-10 grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Stay connected</p>
          <h2 className="text-3xl font-semibold text-foreground">Monthly field notes from the four tracks.</h2>
          <p className="text-sm text-foreground/70">
            Practical insights on enterprise architecture, hospitality operations, leadership rituals, and spiritual practice. One thoughtful email—no noise.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild>
            <a href="mailto:hello@sreekaratla.com?subject=Newsletter%20Signup">Join the newsletter</a>
          </Button>
          <span className="text-xs text-foreground/60">
            Prefer RSS? Subscribe via <a className="underline" href="/rss.xml">RSS feed</a>.
          </span>
        </div>
      </div>
    </section>
  );
}
