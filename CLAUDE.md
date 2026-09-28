# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Workflow

**IMPORTANT**: Never push to origin without explicit permission from the user.

- Create commits locally as work progresses
- Ask the user before running `git push`
- When squashing commits, reset and create a single logical commit before pushing

## Project Overview

Static documentation site for Major Context products, built with Astro. Hosts documentation for three products: [Moat](https://github.com/majorcontext/moat), [Keep](https://github.com/majorcontext/keep), and [Gatekeeper](https://github.com/majorcontext/gatekeeper).

**Key characteristic**: Documentation content is fetched from source repositories at build time, not stored in this repo.

## Commands

**Development**
```bash
bun run dev              # Start dev server at localhost:4321
bun run build            # Full build (checks assets, fetches docs, builds site)
bun run preview          # Preview production build locally
```

**Quality & Validation**
```bash
bun run validate         # Complete validation: check + lint + build
bun run check            # Astro type checking only
bun run lint             # ESLint on .js/.ts/.astro files
bun run lint:fix         # Auto-fix linting issues
bun run test:lighthouse  # Run Lighthouse performance tests
```

**Documentation Sync**
```bash
bun run fetch:docs       # Fetch all product documentation from GitHub
bun run fetch:moat       # Fetch only Moat documentation
bun run fetch:keep       # Fetch only Keep documentation
bun run fetch:gatekeeper # Fetch only Gatekeeper documentation
bun run check:assets     # Verify required assets exist (logo.svg, favicons)
```

**Utilities**
```bash
bun run validate:links   # Check for broken internal/external links
```

## Architecture

### Content Flow

1. **Source of truth**: Documentation lives in product repositories (e.g., `majorcontext/moat/docs/content`)
2. **Build-time sync**: `scripts/fetch-docs.ts` fetches markdown files via GitHub API
3. **Link rewriting**: Markdown links (`../concepts/file.md`) are rewritten to Astro routes (`/moat/concepts/slug`)
4. **Static generation**: Astro builds static HTML with proper routing

**Critical**: Never manually edit files in `src/content/{moat,keep,gatekeeper}/` — they're overwritten on every build.

### Multi-Product System

The site is architected to host documentation for multiple products:

- **Product registry**: `src/lib/products.ts` defines all products with their GitHub repos and doc paths
- **Content collections**: Each product gets its own collection in `src/content/config.ts`
- **Dynamic routing**: Pages use `[category]/[slug]` pattern to support any product structure
- **Navigation config**: `src/config/navigation.ts` builds sidebar structure per product (`buildNavigation(docs, productId)`), shared across Moat, Keep, and Gatekeeper

To add a new product:
1. Add entry to `src/lib/products.ts`
2. Add collection to `src/content/config.ts`
3. Create navigation config in `src/config/navigation.ts`
4. Run `bun run fetch:docs` to sync content

### URL Structure

```
/moat/getting-started/introduction    → src/content/moat/getting-started/01-introduction.md
/moat/concepts/sandboxing            → src/content/moat/concepts/01-sandboxing.md
/moat/reference/cli                  → src/content/moat/reference/01-cli.md
```

File numbering (e.g., `01-`, `02-`) is stripped from URLs but preserved in navigation ordering.

### Layout Hierarchy

```
BaseLayout.astro
  └─ DocsLayout.astro (adds header, sidebar, TOC)
      └─ [category]/[slug].astro (renders markdown content)
```

**DocsLayout** provides:
- Fixed header with logo and GitHub link
- Collapsible sidebar navigation (mobile)
- Table of contents (desktop lg+, fixed right)
- Mobile menu toggle

**Responsive behavior**:
- `< md (768px)`: Sidebar hidden, mobile menu toggle
- `md - lg (768px - 1024px)`: Sidebar visible, no TOC
- `lg+ (1024px+)`: Sidebar + content + TOC (three-column)

### Components

**Navigation**
- `NavLink.astro`: Sidebar navigation items with numbering and active state
- `SectionHeader.astro`: Section dividers in sidebar
- `TableOfContents.astro`: Right-side TOC with scroll tracking (Intersection Observer)

**Key behavior**: TOC uses `scroll-mt-24` on H2 headings to account for fixed header when jumping to anchors.

### GitHub Documentation Sync

`scripts/fetch-docs.ts` handles fetching docs from GitHub:

**Authentication**: Uses `gh` CLI (GitHub CLI). CI runs authenticated with the built-in `GH_TOKEN` (`github.token`) — sufficient since all three product repos are public; a broader-scoped token would be needed if a source repo went private.

**Fetching logic**:
1. Calls GitHub API via `gh api` to list directory contents
2. Downloads files recursively from `docsPath` in each product's repo
3. Validates markdown frontmatter (adds default if missing)
4. Rewrites internal links to match Astro routing
5. Writes to `src/content/{productId}/`

**Error handling**: Falls back to cached content if fetch fails (useful for dev without GitHub auth).

**Link rewriting patterns**:
- `../concepts/01-file.md` → `/moat/concepts/file`
- `./02-file.md` → `/moat/{current-category}/file`
- `concepts/01-file.md` → `/moat/concepts/file`

## Design System

See `docs/style-guide.md` for complete guidelines. Key principles:

**Typography**
- Doc prose: Newsreader (serif), 17px / 19px from `md`, ~66ch measure
- UI, nav, H2s, code, tables: JetBrains Mono
- H2 headings: Small caps, uppercase, wide tracking, underlined
- `antialiased` on `<body>`

**Colors** are tokens in `tailwind.config.js` with built-in dark values: `paper`, `surface`, `raised`, `rule`, `ink`, `muted`, `subtle`, and `accent` (+ `-strong`, `-soft`). Don't use raw `stone-*`/product colors or add `dark:` variants for them.
- `accent` resolves per product via `data-product` (set on `<html>` by `BaseLayout`'s `productId`, or on any element): `sky` Moat (site default), `amber` Keep, `emerald` Gatekeeper, `violet` Harness
- Code blocks: `stone-900` background in both themes

**Homepage** lists `projects` from `src/lib/products.ts`, which is separate from `products` because it includes projects with no docs on this site (Harness until its docs exist, Bailey while private). Only `products` drives `fetch-docs` and `llms.txt`.

**Sidebar numbers** appear only for `getting-started` (assigned by position); other sections are unnumbered.

**Spacing philosophy**: Prefer consistent Tailwind spacing (4, 6, 8, 12). Avoid arbitrary values except for specific design needs (e.g., tracking).

**Prose styling**: Uses `@tailwindcss/typography` with extensive customization in DocsLayout. H2s have special styling (`prose-h2:` prefixes) for section headers.

## Development Patterns

**Content Collections**: Always use Astro's content collections (`getCollection()`) for markdown. Define schemas in `src/content/config.ts` with Zod validation.

**Static Generation**: Use `getStaticPaths()` for dynamic routes. Site is fully static (SSG), no SSR.

**Type Safety**: Explicit types for all public functions. Use `import type` for type-only imports.

**Error Messages**: Fail fast with clear error messages. See `fetch-docs.ts` for example of helpful error handling (detects auth issues, rate limits, etc.).

**Markdown Link Rewriting**: When working with fetched markdown, remember links need rewriting. Pattern is in `fetch-docs.ts:rewriteMarkdownLinks()`.

## Common Tasks

**Adding a navigation item**: Edit `src/config/navigation.ts` and add to appropriate section.

**Modifying page layout**: Edit `src/layouts/DocsLayout.astro` for global changes, or `src/pages/{moat,keep,gatekeeper}/[category]/[slug].astro` for content-specific changes.

**Styling H2 headings**: All H2 styling is in DocsLayout's prose classes. Look for `prose-h2:` prefixes.

**Adjusting TOC behavior**:
- Position/styling: `src/components/TableOfContents.astro`
- Scroll offset: `scroll-mt-24` in DocsLayout prose classes
- Right padding to prevent overlap: `lg:pr-72` on main element

**Testing with real content**: Run `bun run fetch:docs` (or a per-product variant like `bun run fetch:moat`) to pull latest docs from GitHub, then `bun run dev`.

## CI/CD

GitHub Actions workflows in `.github/workflows/`:
- Runs validation on push and PRs
- Builds and deploys to GitHub Pages on push to `main`, manual dispatch, and a daily schedule (`deploy.yml`) — the schedule exists because docs are fetched from the product repos' HEADs at build time, and nothing else triggers a rebuild when only a docs repo changes
- Uses the built-in `GH_TOKEN`; a custom token secret is only needed if a source repo becomes private

## OG Images

Dynamic OG (social share) images generated at `/og/[...path].png` using `@vercel/og`. Images render page title, description, and a per-product brand color (sky for Moat, amber for Keep, emerald for Gatekeeper; see `BRAND_COLORS` in `src/pages/og/[...path].png.ts`).
