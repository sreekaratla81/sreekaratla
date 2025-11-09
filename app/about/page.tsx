import { Container } from "@/components/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Sreekar Atla",
  description:
    "Technologist, hospitality operator, and leadership guide exploring the nexus of AI strategy, guest experience, and conscious leadership."
};

export default function AboutPage() {
  return (
    <Container className="space-y-10 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">About</h1>
        <p className="text-foreground/60 max-w-2xl">
          I build bridges between enterprise technology and soulful hospitality. After leading engineering and AI strategy across
          global organizations, I now apply those lessons to immersive guest experiences and conscious leadership practices.
        </p>
      </div>
      <div className="space-y-6 text-lg leading-relaxed text-foreground/80">
        <p>
          My career spans CTO and CIO roles, large-scale architecture modernization, and the creation of Atlas — a hospitality
          collective experimenting with productized guest journeys. Along the way I have developed frameworks for AI roadmaps,
          human-centered operations, and leadership grounded in inner stillness.
        </p>
        <p>
          This site is a laboratory for sharing those frameworks. Expect deep dives on enterprise platform strategy, the
          realities of scaling hospitality, and essays on the inner work required to lead with clarity.
        </p>
        <p>
          When I’m not writing, you’ll find me hosting salons, advising founders, and exploring the intersection of ritual and
          operations.
        </p>
      </div>
      <div className="rounded-3xl border border-border/60 bg-muted/60 p-6">
        <h2 className="text-2xl font-semibold">Credentials</h2>
        <ul className="mt-4 space-y-2 text-foreground/70">
          <li>• 15+ years leading engineering and data teams across global enterprises.</li>
          <li>• Founder of Atlas — blending hospitality, travel, and community design.</li>
          <li>• Facilitator for conscious leadership circles and executive retreats.</li>
        </ul>
        <a
          href="https://drive.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex text-sm font-semibold text-accent"
        >
          Download CV →
        </a>
      </div>
    </Container>
  );
}
