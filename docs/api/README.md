# API Reference

This document summarises the available API endpoints exposed by the site and the expectations for using them.

## Endpoints

### `GET /api/search`
- **Purpose:** Proxies Pagefind-generated search indexes from `/public/pagefind` so static assets can be cached independently.
- **Query parameters:**
  - `file` (optional, default `index.json`): Selects which Pagefind index file to return.
- **Authentication:** Not required. The endpoint simply forwards static search assets and applies cache headers when missing.

### `GET /api/preview`
- **Purpose:** Enables or disables Next.js draft (preview) mode to reveal unpublished or scheduled content.
- **Query parameters:**
  - `mode` (optional): When set to `disable`, turns off draft mode and redirects back to the provided destination (or `/`).
  - `token` (required when enabling preview): Must match the `PREVIEW_TOKEN` environment variable to activate draft mode.
  - `redirect` (optional, default `/`): Destination path to visit after toggling draft mode. Only relative paths are allowed; non-relative values fall back to `/`.
- **Authentication:** Guarded by the shared secret `PREVIEW_TOKEN`. Requests with a missing or mismatched token receive a 401 response.

## OpenAPI coverage

An OpenAPI or Swagger specification is not currently checked into the repository. To introduce one in the future:
1. Model the two endpoints above in an OpenAPI 3.1 document (JSON or YAML) under a path such as `docs/api/openapi.yaml`.
2. Describe request query parameters, success/error response schemas, and authentication requirements.
3. Wire the spec into automated validation—e.g. add a lint step with `spectral` or `openapi-cli` and publish rendered docs via Redocly or Stoplight.
4. Optionally generate TypeScript API clients or contract tests from the spec to keep the implementation and documentation in sync.

