import type { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Now",
  description: "What Sreekar Atla is focused on this season."
};

export default function NowPage() {
  return (
    <Container className="space-y-10 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold">Now</h1>
        <p className="text-foreground/60 max-w-2xl">
          A living log of my current focus areas. Inspired by Derek Sivers’ /now movement.
        </p>
      </div>
      <div className="space-y-6 text-lg text-foreground/80">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Building</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Atlas hospitality playbook for AI-augmented guest journeys.</li>
            <li>Enterprise architecture diagnostics for post-cloud scale-ups.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Exploring</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Generative AI orchestration for hospitality service recovery.</li>
            <li>Somatic practices for executive decision-making.</li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Reading</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>“Leading from the Emerging Future” by Otto Scharmer.</li>
            <li>“Setting the Table” by Danny Meyer — for the hundredth time.</li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
