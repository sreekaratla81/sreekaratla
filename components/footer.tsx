import Link from "next/link";
import type { Route } from "next";
import { Container } from "./container";
import { siteConfig } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background py-12 text-sm">
      <Container className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-lg font-semibold">{siteConfig.name}</p>
          <p className="text-foreground/70 max-w-prose">{siteConfig.description}</p>
        </div>
        <div className="flex flex-wrap gap-4 md:justify-end">
          {Object.entries(siteConfig.social).map(([key, value]) => (
            <a key={key} href={value} className="text-foreground/70 hocus:text-accent" target="_blank" rel="noreferrer">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </a>
          ))}
        </div>
      </Container>
      <Container className="mt-8 flex items-center justify-between text-xs text-foreground/60">
        <span>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
        <Link href={"/rss.xml" as Route} className="hocus:text-accent">
          RSS
        </Link>
      </Container>
    </footer>
  );
}
