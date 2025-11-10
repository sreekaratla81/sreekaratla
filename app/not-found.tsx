import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/tech", label: "Tech" },
    { href: "/hospitality", label: "Hospitality" },
    { href: "/leadership", label: "Leadership" },
    { href: "/spirituality", label: "Spirituality" }
  ];

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">404</p>
      <h1 className="text-4xl font-semibold">The page you wanted is practicing somewhere else.</h1>
      <p className="max-w-lg text-foreground/60">
        Try one of the main tracks below or head back home to keep exploring technology, hospitality, leadership, and spiritu
        ality.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-border/60 px-4 py-2 text-sm transition hover:border-ring hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </Container>
  );
}
