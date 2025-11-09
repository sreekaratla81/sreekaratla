import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach out to Sreekar Atla for collaborations, advisory, or speaking."
};

export default function ContactPage() {
  return (
    <Container className="space-y-12 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">Contact</h1>
        <p className="text-foreground/60 max-w-2xl">
          I love collaborating with leaders on technology transformation, hospitality ventures, and consciousness-infused
          leadership work. Send a note and I’ll respond within two business days.
        </p>
      </div>
      <div className="grid gap-10 rounded-3xl border border-border/60 bg-muted/40 p-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Start a conversation</h2>
          <p className="text-foreground/70">
            Tell me about your project, challenge, or gathering. Include timelines, goals, and how you heard about my work.
          </p>
          <Button asChild>
            <a href="mailto:hello@sreekaratla.com">Email hello@sreekaratla.com</a>
          </Button>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Prefer async?</h3>
          <ul className="space-y-2 text-foreground/70">
            <li>• Schedule time: <a className="underline" href="https://cal.com">cal.com/sreekar</a></li>
            <li>• Follow on LinkedIn: <a className="underline" href="https://www.linkedin.com/in/sreekaratla">LinkedIn</a></li>
            <li>• Newsletter for event invites and essays.</li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
