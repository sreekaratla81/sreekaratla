# Repo Discovery Report

## 1. Stack Overview
- **Framework & runtime**: Next.js 14.2 App Router with React 18, running on the Edge runtime by default in `app/layout.tsx` and targeting Node 20.19.x during builds.【F:package.json†L50-L56】【F:app/layout.tsx†L10-L23】
- **Content system**: Contentlayer ingests MDX from the `content/` tree, enforces track-based taxonomy, and computes slugs/URLs during the build step invoked via `pnpm contentlayer:build`.【F:contentlayer.config.ts†L13-L88】【F:package.json†L10-L24】
- **Styling & UI**: Tailwind CSS with typography plugin, Headless UI, Heroicons, and shadcn-inspired components configured globally through `globals.css` in the App Router layout.【F:package.json†L40-L63】【F:app/layout.tsx†L15-L28】
- **Build outputs & automation**: Custom scripts fix frontmatter, re-run Contentlayer, build search indexes with Pagefind, and emit RSS/sitemaps after the Next.js build completes.【F:package.json†L10-L26】【F:scripts/pagefind-safe.js†L6-L38】【F:lib/rss.ts†L1-L45】
- **Security & deployment guardrails**: Opinionated headers (CSP, Referrer Policy, etc.) and Contentlayer aliasing are wired in `next.config.mjs`, aligning with the README guidance to deploy on Vercel/Cloudflare.【F:next.config.mjs†L5-L74】【F:README.md†L89-L92】

## 2. Architecture
The repository does not ship a dedicated `ARCHITECTURE.md`; the diagrams below synthesize the inferred architecture from the codebase.

### 2.1 Build and Publishing Pipeline
```mermaid
flowchart LR
  A[Content authors<br/>MDX in content/] -->|Validate frontmatter| B[Contentlayer build]
  B -->|Generates typed data| C[Next.js build]
  C -->|Postbuild| D[RSS & sitemap scripts]
  C -->|Static assets| E[Pagefind index]
  D --> F[Static output]
  E --> F
  F --> G[Deployment (Vercel/Cloudflare Pages)]
```
- `pnpm build` orchestrates frontmatter fixing, Contentlayer compilation, Next.js build, and post-build RSS/sitemap generation.【F:package.json†L12-L24】【F:lib/rss.ts†L1-L45】
- `pnpm search:index` runs a defensive Pagefind invocation to ensure search assets exist without failing CI.【F:package.json†L15-L16】【F:scripts/pagefind-safe.js†L6-L38】

### 2.2 Runtime Request Flow
```mermaid
flowchart TD
  User -->|HTTP| Edge[Edge runtime / Next App Router]
  Edge -->|Static routes| Pages[Marketing & blog pages]
  Edge -->|API call| Preview[/api/preview]
  Preview -->|Toggle draft mode| DraftState[(Next draft cookies)]
  Edge -->|API call| Search[/api/search]
  Search -->|Proxy fetch| PagefindAssets[Static /pagefind assets]
  Pages -->|Render| ContentData[(Contentlayer data)]
```
- The App Router layout enforces Edge runtime defaults and injects the Pagefind script client-side.【F:app/layout.tsx†L10-L28】
- `/api/preview` enables or disables draft mode based on the `PREVIEW_TOKEN` guard before redirecting visitors.【F:app/api/preview/route.ts†L5-L24】
- `/api/search` is an Edge function that proxies static Pagefind JSON while applying a fallback cache policy.【F:app/api/search/route.ts†L1-L27】
- Rendered pages hydrate against the Contentlayer-generated `allPosts` helpers to source track, tag, and related-article data.【F:lib/content.ts†L1-L112】

## 3. API & Data Inventory

### 3.1 API Routes
| Route | Description | Notes |
| --- | --- | --- |
| `GET /api/preview` | Enables/disables Next draft mode via `PREVIEW_TOKEN`, redirecting to a safe in-domain path.| Requires `PREVIEW_TOKEN` in the environment; returns 401 otherwise.【F:app/api/preview/route.ts†L5-L24】 |
| `GET /api/search` | Streams Pagefind search assets with fallback cache headers from the Edge runtime.| Accepts optional `file` query (default `index.json`).【F:app/api/search/route.ts†L1-L27】 |

### 3.2 Data Sources
- **Contentlayer MDX posts**: Validated MDX under `content/<track>/` with computed slugs, URLs, reading time, and track resolution enforced at build time.【F:contentlayer.config.ts†L13-L88】
- **Post access helpers**: `lib/content.ts` filters drafts, future-dated entries, tags, featured posts, adjacency, and related content, providing the runtime data API for pages and feeds.【F:lib/content.ts†L1-L112】
- **Site configuration**: Environment-driven navigation, social links, analytics provider, and CTA URLs centralized in `lib/config.ts`.【F:lib/config.ts†L14-L77】
- **Author metadata**: Single-author profile stored in `content/authors.json` for use in MDX/SEO surfaces.【F:content/authors.json†L1-L15】
- **Feeds & SEO outputs**: `lib/rss.ts` and `lib/seo.ts` (via `buildMetadata` in the layout) derive metadata from `siteConfig` and Contentlayer exports during build time.【F:lib/rss.ts†L1-L45】【F:app/layout.tsx†L3-L28】
- **External link health**: `scripts/external-links.json` enumerates outbound URLs verified by `pnpm check:links` using a HEAD request utility.【F:scripts/external-links.json†L1-L5】【F:scripts/check-links.mjs†L1-L35】

## 4. Operational Commands & References
- **Local development**: `pnpm install` + `pnpm dev` (Contentlayer build then Next dev server).【F:README.md†L15-L19】【F:package.json†L10-L11】
- **Quality gates**: `pnpm lint`, `pnpm typecheck`, `pnpm test` (transpile + Node test runner), and `pnpm check:links` as documented for contributors.【F:README.md†L36-L88】【F:package.json†L18-L27】
- **Content validation**: `pnpm verify:content` (frontmatter enforcement) and `pnpm fix:frontmatter` (auto-repair) support the authoring workflow prior to builds.【F:package.json†L12-L24】
- **Deployment**: `pnpm build` followed by platform-specific hosting; README recommends Vercel or Cloudflare Pages with correct `SITE_URL` to keep SEO artifacts accurate.【F:package.json†L12-L24】【F:README.md†L89-L92】

## 5. Tech-Debt Hotspots & Observations
- **Environment template drift**: `.env.example` omits documented variables (`PREVIEW_TOKEN`, `ADMIN_ENABLED`, `ADMIN_PASS`, etc.) and still references `CONTENT_PREVIEW_SECRET`, which the codebase never reads.【F:.env.example†L1-L7】【F:README.md†L21-L34】【F:app/api/preview/route.ts†L5-L24】
- **Unused `SITE_TAGLINE`**: The sample env file exposes `SITE_TAGLINE`, but the runtime tagline is hard-coded in `lib/config.ts`, risking confusion for deployers expecting configurability.【F:.env.example†L1-L7】【F:lib/config.ts†L21-L44】
- **Search proxy robustness**: `/api/search` swallows network errors and always returns `404`, which keeps UX simple but hides operational visibility; consider structured logging or surfaced error messaging for debugging CDN issues.【F:app/api/search/route.ts†L7-L30】
- **Pagefind dependency**: `scripts/pagefind-safe.js` downloads Pagefind via `npx` on each run; caching the binary or pinning via devDependency could speed builds and ensure reproducibility.【F:scripts/pagefind-safe.js†L20-L38】

## 6. Recommended Roadmap
- **Day 1**
  - Align `.env.example` with actual runtime needs (add `PREVIEW_TOKEN`, `ADMIN_*`, remove/rename stale keys) and backfill README notes with verified defaults.【F:.env.example†L1-L7】【F:README.md†L21-L34】【F:app/api/preview/route.ts†L5-L24】
  - Document architecture assumptions inline (or restore a formal `ARCHITECTURE.md`) so future contributors have a canonical source for the diagrams above.
- **Week 1**
  - Harden the search proxy with logging/monitoring hooks and consider returning JSON errors to help diagnose Pagefind deployment gaps.【F:app/api/search/route.ts†L7-L30】
  - Promote Pagefind to a dev dependency or cacheable binary to reduce `npx` overhead in CI/CD builds.【F:package.json†L10-L18】【F:scripts/pagefind-safe.js†L20-L38】
  - Expand automated tests around track pages and admin guardrails to leverage the existing Node test runner scaffolding.【F:README.md†L36-L84】
- **Month 1**
  - Explore multi-author support by extending `contentlayer.config.ts` and `lib/content.ts` to ingest enriched author metadata (future-proofing for guest posts).【F:contentlayer.config.ts†L40-L88】【F:lib/content.ts†L1-L112】
  - Introduce observability (analytics event tracking alignment with Plausible/GA4) and performance budgets tied to the security headers and CDN policies already defined.【F:next.config.mjs†L5-L56】【F:README.md†L24-L34】
