# sreekaratla.com

A polished personal site for Sreekar Atla built with Next.js App Router, MDX (Contentlayer), Tailwind, and shadcn-inspired components. The experience is organised around four tracks—Tech, Hospitality, Leadership, and Spirituality—so new articles slot into the right surface automatically.

## TL;DR
- Four track-specific hubs with tag filters, featured article cards, and a resume-forward hero that keeps CTAs (Download Resume, Hire Me, Browse Articles, Newsletter) prominent.
- Contentlayer-powered MDX workflow with scheduling (`date > now`), draft mode previews, and a header-gated `/admin` helper dashboard.
- Production-ready polish: accessible stone/indigo/amber/emerald/violet palette, SEO metadata (RSS, sitemap, robots), and a basic Node test suite plus external link checker.

## Quickstart

### Install & bootstrap
```bash
pnpm install
```

### Run the local dev server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the site.

### Run the test suite
```bash
pnpm test
```
The underlying scripts also support `pnpm test:build` (compile to `.tests-dist/`) and `pnpm test:run` (execute with `node --test`) if you prefer the split phases.

### Additional project checks
```bash
pnpm lint        # Next.js lint rules
pnpm typecheck   # TypeScript project check
pnpm check:links # Verify external links respond (HEAD requests)
pnpm build       # Production build (Contentlayer + Next.js)
```

### Environment variables (`.env.local`)
| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Canonical base URL (e.g. `https://sreekaratla.com`). |
| `SITE_NAME` | Overrides the default site name. |
| `ANALYTICS_PROVIDER` | `plausible`, `ga4`, or `none`. |
| `PLAUSIBLE_DOMAIN` / `GA4_ID` | Provider-specific analytics IDs. |
| `RESUME_URL` | Optional override for the resume download link (defaults to `/Sreekar-Atla-Resume.pdf`). |
| `HIRE_ME_URL` | Optional override for the Hire Me CTA (defaults to `mailto:hello@sreekaratla.com`). |
| `GITHUB_URL`, `LINKEDIN_URL`, `X_URL` | Social profile links rendered in the hero, header, and footer. |
| `PREVIEW_TOKEN` | Secret token required to enable draft mode via `/api/preview`. |
| `ADMIN_ENABLED` | Set to `true` to enable the `/admin` helper dashboard. |
| `ADMIN_PASS` | Shared secret sent through the `x-admin-pass` header to view `/admin`. |
| `ADMIN_TEMPLATE_URL`, `ADMIN_DOCS_URL` | Optional overrides for links shown on the admin page. |

## Project Map
- `app/` – Next.js App Router entrypoints for the marketing site, track hubs, RSS feeds, and API routes (preview/admin).
- `components/` – Shared UI built with Tailwind and shadcn-inspired primitives.
- `content/` – MDX articles grouped into `tech`, `hospitality`, `leadership`, and `spirituality` tracks plus shared images.
- `lib/` – Utilities for Contentlayer, SEO metadata, analytics, and site-wide configuration.
- `scripts/` – Maintenance utilities including `verify-content.mjs` and the external link checker.
- `templates/` – Authoring templates for new content (`post.mdx`).
- `tests/` – Node-based SSR tests covering navigation, marketing cards, and breadcrumbs.

## Common Tasks

### Authoring articles
1. Copy `templates/post.mdx` into `content/<track>/` where `<track>` is one of `tech`, `hospitality`, `leadership`, or `spirituality`.
2. Update the frontmatter. All fields are validated by Contentlayer and `scripts/verify-content.mjs`.

Frontmatter reference:
```yaml
---
title: "Designing Trustworthy AI Platforms"
description: "Guardrail patterns for enterprise AI, from intake to observability."
date: "2024-07-15"
updated: "2024-08-20" # optional
draft: false          # optional, defaults to false
tags: ["ai", "architecture"] # optional array
category: "tech"      # must match the folder name
featured: true        # optional – surfaces on home/track cards
hero: "/images/ai-roadmap-layers.svg" # optional local asset
---
```

Guardrails:
- The `category` must match the folder name; Contentlayer throws if it differs.
- Posts with `draft: true` or a future `date` are hidden unless preview mode is enabled.
- Set `featured: true` to promote an article in the home/track cards.
- Place hero artwork under `content/images/` or reference external SVG/PNG assets.

### Preview drafts & scheduled posts
1. Set `PREVIEW_TOKEN` in `.env.local`.
2. Visit `/api/preview?token=<PREVIEW_TOKEN>&redirect=/tech` to enable draft mode and redirect back to a page.
3. Exit preview with `/api/preview?mode=disable` (optionally pass `redirect` again).

### Use the optional admin helper
If you set `ADMIN_ENABLED=true` and provide `ADMIN_PASS`, a tiny dashboard is available at `/admin`. Supply the header `x-admin-pass: <ADMIN_PASS>` (e.g. via [ModHeader](https://modheader.com/)) to reveal quick links to the MDX template and authoring docs.

### Build & deploy
- `pnpm build` runs Contentlayer, Next.js build, and the postbuild RSS/sitemap generators.
- Deploy on Vercel or Cloudflare Pages (the site is fully static once built). Ensure `SITE_URL` reflects the production domain so `sitemap.xml` and metadata stay accurate.

## Troubleshooting
- **Tests or typechecks fail after editing content** – run `pnpm test`, `pnpm lint`, and `pnpm typecheck` locally to surface validation errors, then inspect the reported MDX file. `scripts/verify-content.mjs` points to invalid frontmatter.
- **`pnpm check:links` exits non-zero** – confirm the URLs in `scripts/external-links.json` respond to `HEAD`; update or remove stale links before re-running the command.
- **Draft previews not working** – ensure `PREVIEW_TOKEN` in `.env.local` matches the token passed to `/api/preview` and that cookies are not blocked in your browser.
- **Admin dashboard hidden** – confirm `ADMIN_ENABLED=true` and send `x-admin-pass: <ADMIN_PASS>` in the request headers. Tools like ModHeader make this easy during local development.

## 📊 Lighthouse (reference)
Local mobile Lighthouse on Chrome 123 emulating Pixel 5: **Performance 97 / Accessibility 100 / Best Practices 100 / SEO 100**.

## 🤝 Contributing
Pull requests welcome! Please run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm check:links` before opening a PR.
