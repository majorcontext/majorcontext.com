import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { titleCase } from '../../utils/strings';
import { MAIN_CATEGORIES, OPTIONAL_CATEGORIES, INTRO } from '../../lib/moat-llms';

// Strip the leading H1 (redundant with ### title we add) and shift remaining
// headings down by 2 levels so they nest correctly under ### doc titles.
function formatBody(body: string): string {
  return body
    .trim()
    .replace(/^#[^\n]+\n/, '')
    .trim()
    .replace(/^(#{2,6})/gm, (_, hashes) => '#'.repeat(Math.min(hashes.length + 2, 6)));
}

export const GET: APIRoute = async () => {
  const docs = await getCollection('moat');
  docs.sort((a, b) => a.id.localeCompare(b.id));

  const grouped = new Map<string, typeof docs>();
  for (const doc of docs) {
    const category = doc.id.split('/')[0];
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category)!.push(doc);
  }

  const lines: string[] = [];

  lines.push('# Moat', '');
  lines.push('> Run AI agents in isolated containers with credential injection and observability.', '');
  lines.push(INTRO, '');

  for (const category of MAIN_CATEGORIES) {
    const categoryDocs = grouped.get(category) ?? [];
    if (categoryDocs.length === 0) continue;

    lines.push(`## ${titleCase(category)}`, '');

    for (let i = 0; i < categoryDocs.length; i++) {
      lines.push(`### ${categoryDocs[i].data.title}`, '');
      lines.push(formatBody(categoryDocs[i].body), '');
      if (i < categoryDocs.length - 1) lines.push('---', '');
    }
    lines.push('');
  }

  lines.push('## Reference', '');

  for (const category of OPTIONAL_CATEGORIES) {
    const categoryDocs = grouped.get(category) ?? [];
    for (let i = 0; i < categoryDocs.length; i++) {
      lines.push(`### ${categoryDocs[i].data.title}`, '');
      lines.push(formatBody(categoryDocs[i].body), '');
      if (i < categoryDocs.length - 1) lines.push('---', '');
    }
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
