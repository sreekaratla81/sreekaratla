import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Briefcase, Github, Linkedin, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-border/60 bg-gradient-to-br from-brand-bg to-muted p-8 shadow-xl sm:p-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_transparent_60%)]" />
      <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr),minmax(0,1fr)] lg:items-center">
        <div className="space-y-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/60">Sreekar Atla</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Enterprise architect & AI/cloud leader, hospitality operator, and conscious leadership guide.
          </h1>
          <p className="max-w-2xl text-lg text-foreground/75">
            I design large-scale technology platforms, run Atlas Homestays, and coach teams in mindful, high-trust execution. Every engagement blends systems thinking, guest experience craft, and inner work.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <a
                href={siteConfig.resumeUrl}
                target={siteConfig.resumeUrl.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                Download Resume
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={siteConfig.hireMeUrl}>
                <Briefcase className="h-4 w-4" /> Hire Me
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link href={"/tech" as Route}>Browse Articles</Link>
            </Button>
            <Button asChild variant="ghost">
              <a href="#newsletter">
                <Newspaper className="h-4 w-4" /> Newsletter Signup
              </a>
            </Button>
            <div className="flex items-center gap-3 text-sm text-foreground/60">
              <a href={siteConfig.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 transition hover:border-ring hover:text-foreground">
                <Github className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 transition hover:border-ring hover:text-foreground">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-foreground/50">
            Built on Next.js • Deployed on Cloudflare • MDX Articles
          </p>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative h-64 w-64 overflow-hidden rounded-[2rem] border border-border/80 bg-background/80 shadow-xl">
            <Image
              src="/social/avatar.svg"
              alt="Portrait of Sreekar Atla"
              fill
              priority
              sizes="(max-width: 1024px) 60vw, 320px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
