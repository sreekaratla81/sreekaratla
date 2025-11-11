# Onboarding checklist

- Review the [First contribution idea for `/api/search` caching](docs/first-pr.md) to explore a scoped starter task and the required checks.

# Onboarding guide

Welcome to the sreekaratla.com project! This guide covers the local environment, how to run the app, and a few project-specific concepts so you can ship confidently.

## Environment prerequisites
- **Node.js 20.x** – match production by using the current LTS line (`node --version`). Tools like [fnm](https://github.com/Schniz/fnm) or [volta](https://volta.sh/) keep the version pinned.
- **pnpm** – the workspace uses pnpm for installs and scripts. Install globally (`corepack enable`) if you do not already have it.

## Initial setup
1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```
2. Start the development server:
   ```bash
   pnpm dev
   ```
3. Run the test suite to confirm your environment is ready:
   ```bash
   pnpm test
   ```

## Verify the app
Once `pnpm dev` is running, hit the health endpoint to confirm the server responds:

```bash
curl -I http://localhost:3000
```

A `200 OK` response confirms the marketing homepage and static assets are being served correctly.

## Domain glossary
- **Tracks** – the site groups content into four tracks (`tech`, `hospitality`, `leadership`, `spirituality`). Each track has its own landing page and feed, so new MDX posts land in the correct experience automatically.
- **Contentlayer** – compiles the Markdown/MDX sources under `content/` into type-safe data consumed by the App Router. Keep schemas and generated types in sync when authoring new content or fields.
- **Admin dashboard** – an optional helper at `/admin` that surfaces quick links for authors. It only renders when `ADMIN_ENABLED=true` and the request includes the `x-admin-pass` header matching `ADMIN_PASS`.

## Starter issues
- Review `docs/first-pr.md` for curated ideas aimed at first-time contributors.
- Check the `good first issue` and `help wanted` labels on GitHub for additional opportunities.

## Common gotchas
- **Preview mode** – set `PREVIEW_TOKEN` in `.env.local` before visiting `/api/preview?token=...`; without it you cannot toggle draft mode to see scheduled or draft content.
- **Admin headers** – when testing `/admin`, include the header `x-admin-pass: <ADMIN_PASS>` in your request (a browser extension like ModHeader helps). Missing the header results in a blank dashboard even if `ADMIN_ENABLED` is true.

Happy shipping!
