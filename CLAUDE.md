# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static documentation site for Major Context products, built with Astro. Currently hosts documentation for [Moat](https://github.com/majorcontext/moat), with architecture designed to support multiple products.

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

**Critical**: Never manually edit files in `src/content/moat/` — they're overwritten on every build.

### Multi-Product System

The site is architected to host documentation for multiple products:

- **Product registry**: `src/lib/products.ts` defines all products with their GitHub repos and doc paths
- **Content collections**: Each product gets its own collection in `src/content/config.ts`
- **Dynamic routing**: Pages use `[category]/[slug]` pattern to support any product structure
- **Navigation config**: `src/config/navigation.ts` defines sidebar structure (currently Moat-only)

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

**Authentication**: Uses `gh` CLI (GitHub CLI). In CI, set `MOAT_DOCS_TOKEN` secret for private repos.

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
- Body: JetBrains Mono (monospace) for technical feel
- Headlines: Newsreader (serif) for editorial weight
- H2 headings: Small caps, uppercase, wide tracking, underlined

**Colors**
- Background: `stone-100` (warm paper)
- Sidebar: `stone-200`
- Text: `stone-800` / `stone-600` (muted)
- Accent: `sky-700` (links, active states)
- Code blocks: `stone-900` background

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

**Modifying page layout**: Edit `src/layouts/DocsLayout.astro` for global changes, or `src/pages/moat/[category]/[slug].astro` for content-specific changes.

**Styling H2 headings**: All H2 styling is in DocsLayout's prose classes. Look for `prose-h2:` prefixes.

**Adjusting TOC behavior**:
- Position/styling: `src/components/TableOfContents.astro`
- Scroll offset: `scroll-mt-24` in DocsLayout prose classes
- Right padding to prevent overlap: `lg:pr-72` on main element

**Testing with real content**: Run `bun run fetch:moat` to pull latest Moat docs from GitHub, then `bun run dev`.

## CI/CD

GitHub Actions workflow in `.github/workflows/`:
- Runs validation on push and PRs
- Builds and deploys to GitHub Pages
- Requires `MOAT_DOCS_TOKEN` secret if source repos are private

## OG Images

Dynamic OG (social share) images generated at `/og/[...path].png` using `@vercel/og`. Images render page title and Moat branding.
