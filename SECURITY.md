# Security Policy

## Secret Handling
- **PREVIEW_TOKEN** and **ADMIN_PASS** are sensitive secrets and must never be committed to the repository, shared in screenshots, or exposed in client-side bundles.
- Analytics identifiers (e.g., Plausible, Google Analytics) should be treated as configuration values and stored separately from private credentials. Only share the minimum identifier required for analytics integrations and never embed administrative API keys in client-side code.
- Rotate secrets immediately if you suspect exposure. Keep a rotation log and update dependent services promptly.

## Local Storage of Secrets
- Store development credentials in `.env.local` only. This file is already git-ignored and should never be checked into source control.
- If teammates need access, share secrets through the approved secret manager or encrypted channels—never through chat logs or email.
- When running preview builds or Vercel deployments, configure environment variables through the platform dashboard rather than hardcoding values.

## Admin Route Protection
- All `/admin` routes must require authentication backed by the `ADMIN_PASS` secret.
- Do not expose administrative UI components unless the request has been validated server-side. Client-side checks alone are insufficient.
- Implement rate limiting and audit logging on administrative endpoints to detect abuse and support incident response.

## Dependency Audit Practices
- Run the following commands before each release branch cut and at least monthly:
  - `pnpm audit`
  - `pnpm dlx npm-check-updates`
  - `pnpm outdated`
- Review advisories and dependency diffs within one business day. Patch or pin vulnerable packages as soon as upstream fixes are available.

## Reporting a Vulnerability
- Email security reports to [security@example.com](mailto:security@example.com). Provide reproduction steps, affected components, and impact assessment if available.
- For sensitive findings, request a secure file transfer link rather than including exploit code in the initial email.
- We acknowledge receipt within two business days and strive to provide status updates every five business days until resolution.
