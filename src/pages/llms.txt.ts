import type { APIRoute } from 'astro';
import { products } from '../lib/products';
import { SITE_URL } from '../lib/llms-shared';

export const GET: APIRoute = () => {
  const lines: string[] = [];

  lines.push('# Major Context', '');
  lines.push('> Developer tools for running AI agents safely.', '');
  lines.push('## Products', '');

  for (const product of Object.values(products)) {
    lines.push(`- [${product.name}](${SITE_URL}/${product.id}/llms.txt): ${product.tagline}`);
  }

  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
