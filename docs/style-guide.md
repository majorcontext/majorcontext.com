# Astro Style Guide

1. **Strict typing**. All public functions and exported values should have explicit return types. Avoid `any` types; use `unknown` and type guards instead.
2. **Minimal abstractions**. Avoid creating unnecessary layers or helper functions. Only abstract when you see the same pattern repeated 3+ times.
3. **Data fetching patterns**. Prefer `getStaticPaths()` with static generation over server-side rendering. Use content collections for markdown/MDX content.
4. **File organization**. Keep components in `src/components/`, pages in `src/pages/`, layouts in `src/layouts/`. Use index files sparingly.
5. **Component design**. Props interfaces should be explicit. Prefer composition over configuration. Don't use default exports except in pages.
6. **Styling approach**. Use Tailwind utility classes. Avoid custom CSS unless absolutely necessary. Keep responsive design mobile-first.
7. **Type imports**. Use `import type` for type-only imports to improve build performance and clarity.
8. **Error handling**. Fail fast with meaningful error messages. Don't silently swallow errors or use empty catch blocks.
9. **Environment variables**. Use `import.meta.env` for environment variables. Validate required env vars at build time.
10. **Build output**. Prefer static output unless you need SSR. Configure output mode explicitly in astro.config.

## Code Style Specifics

### TypeScript
```typescript
// Good: Explicit return type, proper typing
export function getPageData(slug: string): PageData | null {
  const page = pages.find(p => p.slug === slug);
  return page ?? null;
}

// Bad: Implicit any, no return type
export function getPageData(slug) {
  return pages.find(p => p.slug === slug);
}
```

### Components
```astro
---
// Good: Explicit Props interface, type import
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
  showExcerpt?: boolean;
}

const { post, showExcerpt = false } = Astro.props;
---

<!-- Bad: No props interface, unclear types -->
```

### Data Fetching
```typescript
// Good: Content collections for markdown
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

// Bad: Manual file system reading with glob
import { glob } from 'astro/loaders';
const posts = Object.values(import.meta.glob('./posts/*.md'));
```

### Styling
```astro
<!-- Good: Tailwind utilities, semantic HTML -->
<article class="prose prose-lg max-w-4xl mx-auto">
  <h1 class="text-4xl font-bold mb-4">{title}</h1>
</article>

<!-- Bad: Custom CSS, generic divs -->
<div class="custom-container">
  <div class="title">{title}</div>
</div>
<style>
  .custom-container { max-width: 800px; }
  .title { font-size: 2rem; }
</style>
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Header.astro
│   └── Footer.astro
├── layouts/          # Page layouts
│   └── BaseLayout.astro
├── pages/            # File-based routing
│   ├── index.astro
│   └── blog/
│       └── [slug].astro
├── content/          # Content collections
│   └── config.ts
└── styles/           # Global styles (minimal)
    └── global.css
```

## Content Collections

Always define content collections in `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

## Performance

1. Use `client:load`, `client:idle`, or `client:visible` directives sparingly
2. Prefer static generation over SSR
3. Optimize images with the Image component
4. Minimize JavaScript shipped to client
5. Use `preload` for critical resources

## Accessibility

1. Use semantic HTML elements
2. Include proper ARIA labels where needed
3. Ensure keyboard navigation works
4. Maintain proper heading hierarchy (h1 → h2 → h3)
5. Add alt text to images

## Testing Approach

1. Validate content schemas at build time
2. Use TypeScript strict mode
3. Test critical user paths manually
4. Validate HTML output in production builds
5. Check Lighthouse scores for performance/a11y

## Common Pitfalls to Avoid

1. **Don't** mix client and server code without understanding boundaries
2. **Don't** use React state management (useState, etc.) in Astro components
3. **Don't** forget to add `client:*` directives for interactive islands
4. **Don't** import components with side effects in frontmatter
5. **Don't** use `getStaticPaths()` with `output: 'server'`
6. **Don't** forget to handle 404s and error states
7. **Don't** commit `.env` files; use `.env.example` instead

## Deployment Checklist

- [ ] Build completes without errors (`bun run build`)
- [ ] No TypeScript errors (`bun run check`)
- [ ] Environment variables documented in `.env.example`
- [ ] 404 page implemented
- [ ] Meta tags (title, description, OG) set appropriately
- [ ] Sitemap generated (if public site)
- [ ] Robots.txt configured
- [ ] Analytics configured (if needed)

## When to Deviate

These guidelines prioritize simplicity and type safety. Deviate when:
- The framework requires it (e.g., default exports in pages)
- Performance profiling shows a clear benefit to a different approach
- Third-party integrations demand specific patterns
- The complexity of following the rule exceeds the benefit

Always prefer working code over perfect adherence to style guidelines.
