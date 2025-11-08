import { Button } from "@/components/ui/button";
import { Container } from "./container";

export function NewsletterCta() {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-r from-muted to-background p-10">
      <Container className="grid gap-6 md:grid-cols-[2fr,1fr] md:items-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-foreground/60">Stay in the loop</p>
          <h2 className="text-3xl font-semibold">Receive the latest essays as soon as they go live.</h2>
          <p className="text-foreground/70">
            Quarterly digest across technology leadership, hospitality innovation, and conscious leadership. No spam — ever.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild>
            <a href="mailto:hello@sreekaratla.com?subject=Newsletter%20Signup">Join the newsletter</a>
          </Button>
          <span className="text-xs text-foreground/60">Prefer RSS? Subscribe via <a className="underline" href="/rss.xml">RSS feed</a>.</span>
        </div>
      </Container>
    </section>
  );
}
