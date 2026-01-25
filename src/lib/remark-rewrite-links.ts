import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { Plugin } from 'unified';

/**
 * Remark plugin to rewrite markdown file links to proper Astro URLs
 * Transforms: 02-installation.md -> /moat/getting-started/installation
 */
export const remarkRewriteLinks: Plugin<[], Root> = () => {
  return (tree, file) => {
    visit(tree, 'link', (node) => {
      const url = node.url;

      // Only process relative markdown links (including ./)
      if (!url.startsWith('http') && !url.startsWith('/') && url.endsWith('.md')) {
        const currentPath = file.history[0] || file.path || '';
        const rewritten = rewriteMarkdownUrl(url, currentPath);
        node.url = rewritten;
      }
    });
  };
};

function rewriteMarkdownUrl(url: string, currentFilePath: string): string {
  // Normalize the URL by removing ./
  const normalizedUrl = url.replace(/^\.\//, '');

  // Handle relative paths going up (../)
  if (url.startsWith('../')) {
    // Cross-category link: ../concepts/01-sandboxing.md
    const parts = url.replace('../', '').split('/');
    if (parts.length >= 2) {
      const category = parts[0];
      const slug = parts[parts.length - 1].replace(/^\d+-/, '').replace(/\.md$/, '');
      return `/moat/${category}/${slug}`;
    }
  }

  // Check if URL has a category path: concepts/01-sandboxing.md
  if (normalizedUrl.includes('/') && !normalizedUrl.startsWith('./')) {
    const parts = normalizedUrl.split('/');
    const category = parts[0];
    const slug = parts[parts.length - 1].replace(/^\d+-/, '').replace(/\.md$/, '');
    return `/moat/${category}/${slug}`;
  }

  // Same-category link: 02-installation.md or ./02-installation.md
  const category = inferCategoryFromPath(currentFilePath);
  // Remove .md first, then remove leading numbers and dash
  const slug = normalizedUrl.replace(/\.md$/, '').replace(/^\d+-/, '');
  return `/moat/${category}/${slug}`;
}

function inferCategoryFromPath(filePath: string): string {
  // Extract category from path like: src/content/moat/getting-started/01-introduction.md
  // or /workspace/src/content/moat/getting-started/01-introduction.md
  // Also handles: getting-started/01-introduction or just the category name

  // Try full path match first
  let match = filePath.match(/moat[\/\\]([^\/\\]+)[\/\\]/);
  if (match) return match[1];

  // Try direct category/file match
  match = filePath.match(/^([^\/\\]+)[\/\\]/);
  if (match) return match[1];

  // Fallback
  return 'getting-started';
}
