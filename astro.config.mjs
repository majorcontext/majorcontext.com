// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';
import remarkAlert from 'remark-github-blockquote-alert';

// https://astro.build/config
export default defineConfig({
  site: 'https://majorcontext.com',
  integrations: [
    tailwind(),
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    })
  ],
  markdown: {
    remarkPlugins: [remarkAlert],
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
    ],
    shikiConfig: {
      theme: 'github-dark-dimmed',
      transformers: [
        {
          name: 'bump-comment-contrast',
          // github-dark-dimmed renders comments as #768390 on a #22272e
          // background -- a 3.87:1 contrast ratio, short of the 4.5:1 WCAG
          // AA minimum for body text. Lighten the same hue just enough
          // (4.61:1) to pass while keeping the muted "comment" look.
          span(node) {
            if (node.properties?.style === 'color:#768390') {
              node.properties.style = 'color:#84909b';
            }
          },
        },
      ],
    },
  },
  output: 'static',
});
