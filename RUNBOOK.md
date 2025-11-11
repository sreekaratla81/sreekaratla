# Runbook

## Overview
This runbook documents the common operational tasks for the application, including starting the app, verifying health, inspecting logs, performing resets, and understanding deployment and escalation paths.

## Starting the Application
1. Install dependencies if needed with `pnpm install`.
2. Start the development server locally with `pnpm dev`.
3. For a production-like start, run `pnpm start` after building via `pnpm build`.

## Health Verification
1. Confirm the home page renders without errors at `http://localhost:3000/`.
2. Check the search API endpoint by visiting `http://localhost:3000/api/search?file=index.json`. A successful response indicates Pagefind indexing is available.
3. Monitor for console warnings or errors in the browser's developer tools during both checks.

## Log Inspection Tips
- **Next.js console output**: Review the terminal where `pnpm dev` or `pnpm start` is running for server-side logs and Next.js warnings.
- **Pagefind index errors**: Look for errors mentioning Pagefind or index generation in the server logs. These may indicate issues with the search index build.
- **Browser console**: Use the browser developer tools (Console tab) to spot client-side errors or hydration warnings.

## Reset Steps
1. Stop any running development server.
2. Clear the Contentlayer cache directory by deleting the `.contentlayer` folder.
3. Rebuild Contentlayer artifacts by running `pnpm contentlayer:build`.
4. Restart the app (`pnpm dev` or `pnpm start`) and re-run the health verification steps.

## Deployment
- Follow the detailed deployment guidance in the [README.md “Build & deploy” section](README.md#-build--deploy) for Vercel or Cloudflare Pages.
- Ensure build commands include `pnpm build` and the Contentlayer build step before deployment.
- After deployment, repeat the health verification checks against the deployed URLs.

## Escalation and Contacts
- **Primary on-call**: _TBD — assign a production owner_.
- **Secondary contact**: _TBD — designate backup engineer or team_.
- **Escalation path**: _TBD — document Slack channel, email list, or ticketing process_.

Update the placeholders above once production ownership is defined.
