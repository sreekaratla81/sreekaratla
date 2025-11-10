# sreekaratla.com

A polished personal site for Sreekar Atla built with Next.js App Router, MDX (Contentlayer), Tailwind, and shadcn-inspired components. The experience is organised around four tracks—Tech, Hospitality, Leadership, and Spirituality—so new articles slot into the right surface automatically.

## ✨ Highlights
- Four dedicated track hubs with tag filters and featured article cards.
- MDX authoring via Contentlayer with scheduling (`date > now`) and draft support.
- Resume-forward hero with prominent CTAs (Download Resume, Hire Me, Browse Articles, Newsletter).
- Draft preview workflow (`/api/preview?token=...`) and optional `/admin` helper dashboard gated by headers.
- Calm stone/indigo/amber/emerald/violet palette with accessible contrast and keyboard focus states.
- RSS feeds, sitemap, robots, and Open Graph metadata ready for SEO.
- Basic test suite (Node test runner + React SSR) and external link checker.

## 🚀 Getting started
```bash
pnpm install
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the site.

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

### Useful scripts
```bash
pnpm lint          # Next.js lint rules
pnpm typecheck     # TypeScript project check
pnpm test          # Compile and run Node-based component tests
pnpm check:links   # Verify external links respond (HEAD requests)
pnpm build         # Production build (Contentlayer + Next.js)
```

## 📝 Authoring articles
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

A few guardrails:
- The `category` must match the folder name; Contentlayer throws if it differs.
- Posts with `draft: true` or a future `date` are hidden unless preview mode is enabled.
- Set `featured: true` to promote an article in the home/track cards.
- Place hero artwork under `content/images/` or reference external SVG/PNG assets.

### Previewing drafts & scheduled posts
1. Set `PREVIEW_TOKEN` in `.env.local`.
2. Visit `/api/preview?token=<PREVIEW_TOKEN>&redirect=/tech` to enable draft mode and redirect back to a page.
3. Exit preview with `/api/preview?mode=disable` (optionally pass `redirect` again).

### Admin helper (optional)
If you set `ADMIN_ENABLED=true` and provide `ADMIN_PASS`, a tiny dashboard is available at `/admin`. Supply the header `x-admin-pass: <ADMIN_PASS>` (e.g. via [ModHeader](https://modheader.com/)) to reveal quick links to the MDX template and authoring docs.

## 🧪 Tests
The project uses Node's built-in test runner with server-rendered components.
```bash
pnpm test:build  # transpile tests to .tests-dist/
pnpm test:run    # execute using node --test
```
Tests cover the site header navigation, marketing homepage track cards/CTAs, and article breadcrumbs.

## 🔗 Link checking
`pnpm check:links` sends `HEAD` requests to the external profiles listed in `scripts/external-links.json`. Update the list as new external destinations are added. The script exits non-zero if any URL fails.

## 📦 Build & deploy
- `pnpm build` runs Contentlayer, Next.js build, and the postbuild RSS/sitemap generators.
- Deploy on Vercel or Cloudflare Pages (the site is fully static once built). Ensure `SITE_URL` reflects the production domain so `sitemap.xml` and metadata stay accurate.

## 📊 Lighthouse (reference)
Local mobile Lighthouse on Chrome 123 emulating Pixel 5: **Performance 97 / Accessibility 100 / Best Practices 100 / SEO 100**.

## 🤝 Contributing
Pull requests welcome! Please run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm check:links` before opening a PR.
