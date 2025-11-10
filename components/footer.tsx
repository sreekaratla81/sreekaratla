import Link from "next/link";
import type { Route } from "next";
import { Github, Linkedin } from "lucide-react";
import { Container } from "./container";
import { siteConfig, TRACK_NAV } from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-background">
      <Container className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xl font-semibold text-foreground">{siteConfig.name}</p>
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">{siteConfig.tagline}</p>
          </div>
          <p className="max-w-xl text-sm text-foreground/70">{siteConfig.description}</p>
          <div className="flex items-center gap-3">
            <SocialLink href={siteConfig.social.github} label="GitHub">
              <Github className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={siteConfig.social.linkedin} label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </SocialLink>
          </div>
        </div>
        <div className="grid gap-8 text-sm text-foreground/70 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">Navigate</p>
            <ul className="mt-3 space-y-2">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href as Route} className="transition hover:text-foreground">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">Tracks</p>
            <ul className="mt-3 space-y-2">
              {TRACK_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href as Route} className="transition hover:text-foreground">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-border/60 bg-brand-bg/40 py-4">
        <Container className="flex flex-col gap-2 text-xs text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {siteConfig.name}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href={"/rss.xml" as Route} className="transition hover:text-foreground">
              RSS
            </Link>
            <Link href={"/sitemap.xml" as Route} className="transition hover:text-foreground">
              Sitemap
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-foreground/70 transition hover:border-ring hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {children}
    </a>
  );
}
