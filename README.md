# Major Context

Website for [majorcontext.com](https://majorcontext.com): the homepage for Major Context's projects and the documentation for [Moat](https://github.com/majorcontext/moat), [Keep](https://github.com/majorcontext/keep), and [Gatekeeper](https://github.com/majorcontext/gatekeeper).

## Development

```bash
bun install          # Install dependencies
bun run dev          # Dev server at localhost:4321
bun run build        # Check assets, fetch docs, build
bun run preview      # Preview the build
```

## Quality

```bash
bun run validate         # check + lint + build
bun run check            # Type checking
bun run lint             # Linting
bun run validate:links   # Internal link check
bun run test:lighthouse  # Lighthouse tests
```

## Content

Product docs are not stored here. `scripts/fetch-docs.ts` pulls them from each product repo at build time (`bun run fetch:docs`, or `fetch:moat` / `fetch:keep` / `fetch:gatekeeper`), using the `gh` CLI. Don't edit `src/content/{moat,keep,gatekeeper}/`; it's overwritten on every build.

Products with docs are registered in `products` in `src/lib/products.ts`. The homepage list is `projects` in the same file, which also covers projects without docs here yet.

## Design

Colors are tokens with built-in dark values, defined in `tailwind.config.js` (`bg-paper`, `text-ink`, `text-muted`, `border-rule`, `text-accent`, …). Each product's accent comes from a `data-product` attribute. Doc prose is set in Newsreader; UI, navigation, and code in JetBrains Mono. See `docs/style-guide.md`.

`docs/readme-footer.md` has the "Part of Major Context" footer for product repo READMEs.

## Deploys

Pushes to `main`, manual runs, and a daily schedule deploy to GitHub Pages (`.github/workflows/deploy.yml`). The schedule picks up doc changes in the product repos. CI uses the built-in `GH_TOKEN`, which is enough while the product repos are public.

GitHub disables scheduled workflows after 60 days without activity in the repo. If deploys stop, check `gh workflow list --all` and re-enable with `gh workflow enable "Deploy to GitHub Pages"`.
