# First contribution idea: cache header test for `/api/search`

This walkthrough outlines a bite-sized pull request that adds coverage for the `/api/search` route's caching behavior. It is meant to be a template you can adapt when you are ready to open your first contribution.

## Affected files

- `tests/api/search-cache.test.ts` (new) – provides focused coverage for the cache header contract.
- `tests/test-utils.ts` – optionally reused helper utilities if additional fixtures are needed.
- `app/api/search/route.ts` – only touched if the test reveals a missing or incorrect cache header.

## Implementation steps

1. Create `tests/api/search-cache.test.ts` and import the handler from `app/api/search/route.ts`.
2. Use the existing test runner (`node --test`) helpers from `tests/test-utils.ts` to invoke the handler with a mock `Request`.
3. Assert that the returned `Response` object includes `Cache-Control: public, max-age=60` (or the current expected cache policy).
4. If the assertion fails, update `app/api/search/route.ts` to set the proper `Cache-Control` header before returning.
5. Run the automated checks below and commit the changes once they pass.

## Commands to run

```bash
pnpm test
pnpm lint
```

## Expected output

Both commands should finish with exit code `0` and report no failing tests or lint errors. `pnpm test` prints a summary similar to `Tests:       1 passed`, and `pnpm lint` ends with `✅  Everything is awesome!` when the project conforms to the lint rules.
