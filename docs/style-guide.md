# Major Context Design System

A design system for Major Context documentation and product interfaces. Built for clarity, technical credibility, and warmth.

---

## Design Principles

1. **Technical but approachable** — Monospace typography signals precision; serif headlines add editorial weight
2. **Warm, not sterile** — Paper tones instead of clinical whites; warm grays throughout
3. **Structured chaos** — Numbered navigation, grid-based layouts, but with intentional contrast (dark code blocks against light backgrounds)
4. **Show, don't decorate** — No gratuitous icons or illustrations; let the content and typography carry the design

---

## Color Palette

### Core Colors

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| `paper` | `stone-100` | Primary background |
| `paper-dark` | `stone-200` | Secondary surfaces (sidebar, cards) |
| `paper-darker` | `stone-300` | Borders, dividers, muted elements |
| `foreground` | `stone-800` | Primary text |
| `foreground-muted` | `stone-600` | Secondary text, descriptions |
| `foreground-subtle` | `stone-400` | Tertiary text, labels, placeholders |

### Accent Colors

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| `accent` | `sky-700` | Links, interactive elements, brand moments |
| `accent-hover` | `sky-800` | Hover states |
| `accent-subtle` | `sky-100` | Accent backgrounds (tags, callouts) |

### Code & Terminal

| Token | Tailwind Class | Usage |
|-------|----------------|-------|
| `code-bg` | `stone-900` | Code block backgrounds |
| `code-text` | `stone-200` | Default code text |
| `syntax-comment` | `stone-500` | Code comments |
| `syntax-keyword` | `violet-400` | Keywords, reserved words |
| `syntax-string` | `green-300` | Strings, values |
| `syntax-function` | `sky-400` | Functions, properties |

---

## Typography

### Font Stack

```
--font-mono: 'JetBrains Mono', ui-monospace, monospace
--font-serif: 'Newsreader', Georgia, serif
```

**Primary (mono)**: All body text, navigation, UI elements
**Secondary (serif)**: Headlines, lead paragraphs, editorial moments

### Type Scale

| Element | Font | Size | Weight | Tracking | Tailwind Classes |
|---------|------|------|--------|----------|------------------|
| Display | Serif | 3rem (48px) | 400 | -0.02em | `font-serif text-5xl font-normal tracking-tight` |
| Lead | Serif | 1.25rem (20px) | 400 | normal | `font-serif text-xl font-normal` |
| Section header | Mono | 0.6875rem (11px) | 600 | 0.2em | `font-mono text-xs font-semibold uppercase tracking-[0.2em]` |
| Body | Mono | 0.9375rem (15px) | 400 | normal | `font-mono text-[15px]` |
| Small | Mono | 0.8125rem (13px) | 400 | normal | `font-mono text-sm` |
| Caption | Mono | 0.6875rem (11px) | 500 | 0.05em | `font-mono text-xs font-medium tracking-wide` |
| Code | Mono | 0.8125rem (13px) | 400 | normal | `font-mono text-sm` |

### Line Height

- Body text: `leading-relaxed` (1.7)
- Headlines: `leading-tight` (1.1)
- Code blocks: `leading-loose` (1.8)

---

## Spacing

Use Tailwind's default spacing scale. Preferred values:

| Context | Value | Tailwind |
|---------|-------|----------|
| Inline spacing (icons, badges) | 8px | `gap-2` |
| Component padding | 16-24px | `p-4` to `p-6` |
| Section spacing | 48-56px | `mb-12` to `mb-14` |
| Page padding | 48-64px | `p-12` to `p-16` |

---

## Astro-Specific Guidelines

### Code Style

1. **Strict typing**. All public functions and exported values should have explicit return types. Avoid `any` types; use `unknown` and type guards instead.
2. **Minimal abstractions**. Avoid creating unnecessary layers or helper functions. Only abstract when you see the same pattern repeated 3+ times.
3. **Data fetching patterns**. Prefer `getStaticPaths()` with static generation over server-side rendering. Use content collections for markdown/MDX content.
4. **File organization**. Keep components in `src/components/`, pages in `src/pages/`, layouts in `src/layouts/`. Use index files sparingly.
5. **Component design**. Props interfaces should be explicit. Prefer composition over configuration. Don't use default exports except in pages.
6. **Type imports**. Use `import type` for type-only imports to improve build performance and clarity.
7. **Error handling**. Fail fast with meaningful error messages. Don't silently swallow errors or use empty catch blocks.
8. **Environment variables**. Use `import.meta.env` for environment variables. Validate required env vars at build time.
9. **Build output**. Prefer static output unless you need SSR. Configure output mode explicitly in astro.config.

### Content Collections

Always define content collections in `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

export const collections = { docs: docsCollection };
```

---

## Layout

### Page Structure

```
┌─────────────────────────────────────────────────────────┐
│  Topbar (sticky)                                        │
├──────────┬─────────────────────────────────┬────────────┤
│          │                                 │            │
│  Sidebar │         Content                 │    TOC     │
│  200px   │         max-w-3xl               │   240px    │
│          │                                 │            │
│          │                                 │            │
└──────────┴─────────────────────────────────┴────────────┘
```

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `< 768px` | Single column, hide sidebar and TOC |
| `768px - 1100px` | Two columns, hide TOC |
| `> 1100px` | Full three-column layout |

---

## Components

### Navigation Link

**Default state**
```html
<a class="flex items-center gap-2 px-6 py-1.5 text-sm text-stone-600
          border-l-2 border-transparent transition-colors
          hover:text-stone-800">
  <span class="text-[10px] text-stone-400 w-5">01</span>
  Introduction
</a>
```

**Active state**
Add: `text-stone-800 bg-stone-100 border-l-sky-700`

### Section Header

```html
<h2 class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400
           mb-5 pb-3 border-b border-stone-300">
  Why this exists
</h2>
```

### Tag / Badge

```html
<span class="inline-block text-[10px] font-semibold uppercase tracking-[0.15em]
             text-sky-700 bg-sky-100 border border-sky-200 px-2.5 py-1">
  Documentation
</span>
```

### Code Block

```html
<div class="bg-stone-900 relative">
  <span class="absolute top-0 right-0 text-[9px] font-semibold tracking-wide
               text-stone-500 px-3 py-2">
    BASH
  </span>
  <pre class="p-6 text-sm leading-loose text-stone-200 overflow-x-auto">
    <span class="text-stone-500"># Comment</span>
    moat run <span class="text-sky-400">--allow-net</span>=api.anthropic.com python agent.py
  </pre>
</div>
```

### Inline Code

```html
<code class="font-mono text-[0.9em] bg-stone-200 border border-stone-300
             px-1.5 py-0.5 text-stone-700">
  moat.toml
</code>
```

### Callout / Note

```html
<div class="border-l-2 border-sky-700 bg-sky-100 px-5 py-4">
  <div class="text-[10px] font-semibold uppercase tracking-[0.15em]
              text-sky-700 mb-2">
    Note
  </div>
  <p class="text-sm text-stone-700 m-0">
    Moat is not a security boundary against malicious code. It's a guardrail
    against well-intentioned agents doing dumb things.
  </p>
</div>
```

### Footer Navigation

```html
<div class="flex justify-between pt-8 border-t border-stone-300 mt-12">
  <a href="#" class="group">
    <div class="text-[10px] tracking-[0.15em] text-stone-400 mb-1">PREVIOUS</div>
    <div class="text-sm text-stone-800 group-hover:text-sky-700">
      ← 01 — Introduction
    </div>
  </a>
  <a href="#" class="group text-right">
    <div class="text-[10px] tracking-[0.15em] text-stone-400 mb-1">NEXT</div>
    <div class="text-sm text-stone-800 group-hover:text-sky-700">
      02 — Installation →
    </div>
  </a>
</div>
```

---

## Logo

```html
<div class="flex items-center gap-4">
  <!-- Mark -->
  <div class="flex flex-col gap-0.5">
    <div class="flex gap-0.5">
      <div class="w-3 h-[3px] bg-stone-800"></div>
      <div class="w-1.5 h-[3px] bg-sky-700"></div>
    </div>
    <div class="w-5 h-[3px] bg-stone-800"></div>
    <div class="w-5 h-[3px] bg-stone-800"></div>
  </div>
  <!-- Wordmark -->
  <span class="text-xs font-semibold tracking-[0.15em] text-stone-600">
    MAJOR CONTEXT
    <span class="text-stone-400 mx-0.5">/</span>
    <span class="text-stone-800">MOAT</span>
  </span>
</div>
```

---

## Interaction States

### Links
- Default: `text-sky-700`
- Hover: `text-sky-800`
- Within body text: underline on hover only

### Buttons (if needed)
- Primary: `bg-sky-700 text-stone-100 hover:bg-sky-800`
- Secondary: `border border-stone-300 text-stone-800 hover:border-stone-400 hover:bg-stone-200`

### Focus States
- Use `focus:outline-none focus:ring-2 focus:ring-sky-700 focus:ring-offset-2 focus:ring-offset-stone-100`

---

## Tailwind Config Extensions

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'widest': '0.2em',
      },
      fontSize: {
        '2xs': '0.6875rem', // 11px
      },
    },
  },
}
```

### Fonts

Load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

---

## Dark Mode

### Three-Mode System

The site supports three theme preferences, persisted in `localStorage` under the key `theme`:

| Mode | Behavior |
|------|----------|
| **System** (default) | Follows `prefers-color-scheme` from the OS |
| **Light** | Forces light mode |
| **Dark** | Forces dark mode |

A toggle button in the header cycles through: system → light → dark → system.

### Dark Color Palette

| Token | Light | Dark |
|-------|-------|------|
| Page bg | `stone-100` | `stone-900` |
| Sidebar bg | `stone-200` | `stone-800` |
| Borders | `stone-300` | `stone-700` |
| Primary text | `stone-800` | `stone-300` |
| Muted text | `stone-600` | `stone-400` |
| Subtle text | `stone-400`/`stone-500` | `stone-500` |
| Links | `sky-700` | `sky-400` |
| Link hover | `sky-800` | `sky-300` |
| Accent bg (badges) | `sky-100` | `sky-900` |
| Accent text (badges) | `sky-700` | `sky-300` |
| Inline code bg | `stone-200` | `stone-800` |
| Inline code text | `stone-600` | `stone-300` |
| Code blocks | `stone-900` bg / `stone-200` text | Same (dark in both modes) |
| Alert bgs | `{color}-50` | `{color}-950` |
| Alert titles | `{color}-700`/`800` | `{color}-400` |

### FOUC Prevention

A synchronous inline `<script is:inline>` in `<head>` reads `localStorage` and applies the `dark` class on `<html>` before first paint. This must not be a module import — it runs before any CSS or rendering happens.

### Convention

Always pair light and dark classes together:

```html
<!-- Good: dark variant immediately follows light -->
<div class="bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-300">

<!-- Bad: dark variants separated from their light counterparts -->
<div class="bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-300">
```

### Code Blocks

Code blocks use `stone-900` background and `stone-200` text in both light and dark modes. No dark variants needed — they're already dark.

### The `data-active` Pattern

For JS-driven state that needs dark mode support (e.g., TOC active link), use `data-*` attributes instead of toggling color classes in JS:

```html
<!-- Template: appearance handled entirely in CSS -->
<a class="text-stone-600 dark:text-stone-400
          data-[active]:text-sky-700 dark:data-[active]:text-sky-400">

<!-- JS: only toggles state, not appearance -->
element.dataset.active = '';   // activate
delete element.dataset.active; // deactivate
```

This separates state (JS) from appearance (CSS) and avoids duplicating dark mode class lists in JavaScript.

---

*Last updated: February 2026*
