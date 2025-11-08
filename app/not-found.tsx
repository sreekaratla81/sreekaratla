import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <p className="text-sm uppercase tracking-wide text-foreground/60">404</p>
      <h1 className="text-4xl font-semibold">This page drifted off the itinerary.</h1>
      <p className="max-w-md text-foreground/60">
        The link you followed might be outdated or the page may have moved. Explore the latest writing or return home.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/" className="rounded-full border border-border/60 px-4 py-2 text-sm hocus:border-accent hocus:text-accent">
          Back to home
        </Link>
        <Link
          href="/writing"
          className="rounded-full border border-border/60 px-4 py-2 text-sm hocus:border-accent hocus:text-accent"
        >
          View writing
        </Link>
      </div>
    </Container>
  );
}
