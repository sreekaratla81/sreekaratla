# Sreekar Atla — Personal Site

A production-ready Next.js 14 website sharing writing across Tech Insights, Hospitality & Travel, and Conscious Leadership. Built for fast publishing with MDX, Contentlayer, Tailwind, and Pagefind search.

## ✨ Features
- **Three writing tracks** with dedicated hubs (`/writing/tech`, `/writing/hospitality`, `/writing/conscious-leadership`).
- **Typed MDX authoring** powered by Contentlayer with computed reading time, OG metadata, tags, and series.
- **Instant static search** via Pagefind (no external services) plus tag/series indexes.
- **Dynamic OG images** and RSS feeds (global + per track) for discoverability.
- **Responsive UI** using Tailwind CSS, CSS variables, and shadcn-inspired components with dark/light mode.
- **CI-ready**: type checks, linting, build, and Pagefind indexing on every PR.

## 🚀 Getting Started
```bash
pnpm install
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the site.

### Required environment variables (`.env.local`)
```
SITE_URL=http://localhost:3000
SITE_NAME="Sreekar Atla"
SITE_TAGLINE="Tech • Hospitality • Conscious Leadership"
ANALYTICS_PROVIDER=none
PLAUSIBLE_DOMAIN=
GA4_ID=
CONTENT_PREVIEW_SECRET=super-secret
```

## ✍️ Authoring Workflow
1. Drop a new `.mdx` file under `content/<track>/` (`tech`, `hospitality`, or `conscious-leadership`).
2. Use the frontmatter reference below.
3. Run `pnpm dev` — posts appear automatically in `/writing`, the track hub, tags, series, RSS, and search once indexed.

```yaml
---
type: "tech" | "hospitality" | "conscious-leadership"
title: string
excerpt: string
date: YYYY-MM-DD
updated?: YYYY-MM-DD
slug?: string
tags: [string, ...]
series?: string
cover?: string (path under /content/images)
readingTime: computed automatically
draft?: boolean
canonicalUrl?: string
pullQuotes?: string[]
---
```

### MDX Shortcodes
- `<Callout type="info|warn|success">` — contextual highlights.
- `<PullQuote>` — feature a quote in serif typography.
- `<Figure src="" caption="" />` — responsive media blocks.

### Images & OG Generation
- Store article visuals in `/content/images/` and reference them via relative paths.
- OG images are generated dynamically from title/excerpt through `/opengraph-image` (powered by Satori).

### Drafts & Preview
- Add `draft: true` to hide a post from production builds.
- Use `/api/preview?secret=CONTENT_PREVIEW_SECRET&slug=my-post` to render drafts during preview sessions.

## 🔍 Search & Pagefind
- Pagefind indexes static HTML output after `pnpm build`; the CI-safe wrapper runs automatically via `pnpm postbuild`.
- Generated assets live under `public/pagefind/` and are served statically or via `/api/search` when needed.

## 📡 RSS & SEO
- Global feed: `/rss.xml`
- Per-track feeds: `/rss/tech.xml`, `/rss/hospitality.xml`, `/rss/conscious-leadership.xml`
- `next-sitemap` drives `sitemap.xml` generation; update `SITE_URL` for accurate canonical links.

## 📈 Analytics
Configure via environment variables:
- `ANALYTICS_PROVIDER=plausible` with `PLAUSIBLE_DOMAIN`
- `ANALYTICS_PROVIDER=ga4` with `GA4_ID`
- `ANALYTICS_PROVIDER=none` to disable.

## 🧪 Testing & CI
- `pnpm typecheck`
- `pnpm lint`
- `pnpm ci:verify`

GitHub Actions workflow (`.github/workflows/ci.yml`) runs the above and uploads the Pagefind index artifact on every push/PR.

## ☁️ Deployment
- Optimized for [Vercel](https://vercel.com/) — simply connect the repo; `pnpm build` (with `pnpm postbuild`) will generate the static assets and Pagefind index.
- Also compatible with Cloudflare Pages (`pnpm build` + serve `.next` output). Remember to copy `public/pagefind` artifacts after build.

## 🏗️ Build on Netlify locally
```bash
nvm use
pnpm install --frozen-lockfile
pnpm ci:verify
# Optional: netlify build
```
Ensure `SITE_URL` is set in your environment (see `.env.example`).

## 📊 Lighthouse
Latest mobile Lighthouse (Chrome 123, emulated Pixel 5): **Performance 97 / Accessibility 100 / Best Practices 100 / SEO 100**.

## 🤝 Contributing
- Install dependencies with `pnpm install`.
- Run `pnpm dev` for local development.
- Format and lint before pushing (`pnpm lint`).
- Husky + lint-staged ensure consistent formatting on commit.

