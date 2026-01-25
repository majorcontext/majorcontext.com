# Major Context

Website for [majorcontext.com](https://majorcontext.com), home of [Moat](https://github.com/majorcontext/moat).

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Preview build
bun run preview
```

## Quality

```bash
# Full validation (check + lint + build)
bun run validate

# Type checking
bun run check

# Linting
bun run lint

# Lighthouse tests
bun run test:lighthouse
```

## Tech Stack

- **Astro** - Static site generator
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Bun** - Runtime and package manager

## Content

Documentation is fetched from source repositories at build time. See `scripts/fetch-moat-docs.ts` for the Moat documentation sync.

## CI/CD

GitHub Actions run validation and Lighthouse tests on push and PRs. For private source repos, add a `MOAT_DOCS_TOKEN` secret with read access.

## Style Guide

See `docs/style-guide.md` for the Major Context Design System.
