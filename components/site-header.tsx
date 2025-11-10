"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";
import { siteConfig, TRACK_NAV } from "@/lib/config";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <Container className="flex items-center justify-between gap-6 py-4">
        <div className="flex flex-1 items-center gap-4">
          <Link href="/" className="flex items-center gap-3" onClick={close}>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-foreground">{siteConfig.name}</span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/60">
                {siteConfig.tagline}
              </span>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-foreground/70 lg:flex">
            {siteConfig.navigation.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className={cn(
                    "transition-colors hover:text-foreground",
                    active ? "text-foreground" : undefined
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <SocialIcon href={siteConfig.social.github} label="GitHub">
              <Github className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href={siteConfig.social.linkedin} label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </SocialIcon>
          </div>
          <ThemeToggle />
          <button
            type="button"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-foreground/80",
              "lg:hidden"
            )}
            onClick={toggle}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </Container>
      <MobileNav open={open} close={close} pathname={pathname ?? ""} />
    </header>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-foreground/70 transition hover:border-ring hover:text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      {children}
    </a>
  );
}

function MobileNav({
  open,
  close,
  pathname
}: {
  open: boolean;
  close: () => void;
  pathname: string;
}) {
  if (!open) return null;

  return (
    <div className="border-t border-border/60 bg-background/95 shadow-lg lg:hidden">
      <Container className="space-y-6 py-6">
        <div className="flex items-center gap-3">
          <SocialIcon href={siteConfig.social.github} label="GitHub">
            <Github className="h-4 w-4" />
          </SocialIcon>
          <SocialIcon href={siteConfig.social.linkedin} label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </SocialIcon>
        </div>
        <nav className="grid gap-3 text-sm font-medium">
          {siteConfig.navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href as Route}
                onClick={close}
                className={cn(
                  "rounded-xl border border-transparent px-3 py-2 transition-colors",
                  active
                    ? "border-ring bg-brand.bg/40 text-foreground"
                    : "text-foreground/70 hover:border-ring hover:bg-muted"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="grid gap-2 text-xs uppercase tracking-wide text-foreground/50">
          <p className="font-semibold">Tracks</p>
          <div className="grid gap-2">
            {TRACK_NAV.map((item) => (
              <Link
                key={item.id}
                href={item.href as Route}
                onClick={close}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-foreground/70 hover:text-foreground"
              >
                {item.title}
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/40">{item.id}</span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
