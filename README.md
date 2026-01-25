# Moat Documentation Site

Documentation site for [Moat](https://github.com/majorcontext/moat) - Run AI agents in isolated containers with credential injection and observability.

## Development

```bash
# Install dependencies
bun install

# Fetch latest documentation from moat repo
bun run fetch:docs

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Quality & Testing

```bash
# Type checking with Astro
npm run check

# Lint code (ESLint)
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run Lighthouse CI tests
npm run test:lighthouse

# Full validation (check + lint + build)
npm run validate
```

## Tech Stack

- **Astro** - Static site generator
- **Tailwind CSS** - Styling with Typography plugin
- **TypeScript** - Type safety
- **Bun/Node** - Runtime

## Content Management

Documentation content is dynamically fetched from the [moat repository](https://github.com/majorcontext/moat) at build time. The `scripts/fetch-moat-docs.ts` script pulls markdown files from `docs/content` and places them in `src/content/moat/`.

The content is organized into:
- **Getting Started** - Introduction, installation, quick start
- **Concepts** - Core concepts like sandboxing, credentials, observability
- **Guides** - Step-by-step guides for common tasks
- **Reference** - CLI reference, agent.yaml configuration

## Project Structure

```
/
├── scripts/
│   └── fetch-moat-docs.ts    # Fetches docs from moat repo
├── src/
│   ├── components/            # Reusable components
│   ├── content/
│   │   ├── config.ts         # Content collection definitions
│   │   └── moat/             # Fetched markdown content (gitignored)
│   ├── layouts/
│   │   ├── BaseLayout.astro  # Base HTML layout
│   │   └── DocsLayout.astro  # Documentation page layout
│   └── pages/
│       ├── index.astro       # Redirects to /moat
│       └── moat/
│           ├── index.astro                # Moat docs home
│           └── [category]/[slug].astro   # Dynamic doc pages
├── docs/
│   └── style-guide.md        # Project style guide
└── astro.config.mjs          # Astro configuration
```

## Deployment

The site is built as a static site (`output: 'static'`). Deploy the `dist/` directory to any static hosting provider.

During build:
1. Documentation is fetched from the moat repository
2. Astro generates static HTML pages for all documentation
3. Output is placed in `dist/`
