# Contributing Guide

Thank you for your interest in contributing! This document explains the conventions and tooling we use so you can ship changes smoothly.

## Branching strategy

- **`main`** contains the code that is currently deployed. Commits land here only via reviewed pull requests.
- **Feature branches** should be created off `main` and named descriptively (for example, `feature/add-dark-mode-toggle` or `fix/header-overflow`).
- Rebase your branch on top of `main` before opening (or merging) a pull request to keep history clean and resolve conflicts early.

## Commit message format

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. A few quick reminders:

- Start each commit with a type such as `feat`, `fix`, `docs`, `chore`, or `refactor`.
- Include an optional scope in parentheses when it clarifies the area touched (e.g., `feat(nav): add skip link`).
- Write a concise, lowercase description that completes the sentence "If applied, this commit will…".
- Use the body of the commit message to provide motivation or context when necessary.

## Required checks

Before submitting a pull request—and again before merging—run the full verification suite locally:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm check:links
```

Pull requests are expected to pass the same commands in continuous integration.

## Pull request checklist

When you open a pull request, confirm that:

- [ ] Documentation is updated (including MDX content or README snippets) when behavior or APIs change.
- [ ] UI-affecting changes include before/after screenshots in the PR description.
- [ ] A dependency audit (`pnpm audit` or equivalent) has been run if packages were added or upgraded, and findings are addressed or justified.

## Pre-commit tooling

This repository uses [Husky](https://typicode.github.io/husky) to run Git hooks and [lint-staged](https://github.com/okonet/lint-staged) to format and lint staged files automatically.

- The `.husky/pre-commit` hook invokes `pnpm lint-staged` before each commit.
- `lint-staged` runs `next lint --fix --file` on staged TypeScript/JavaScript files and `prettier --write` on Markdown, MDX, JSON, and CSS files.
- If a command fails, the commit is blocked. Fix the reported issues or amend the staged changes and retry.

## Additional tips

- Use `pnpm install` to set up dependencies, and ensure you are running Node.js `20.19.x` (see `package.json`).
- Keep pull requests focused—small, well-scoped changes are easier to review and merge.
- When in doubt, open an issue or draft PR to discuss your approach before investing significant time.

Happy contributing!
