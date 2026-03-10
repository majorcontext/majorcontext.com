import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { slugify, titleCase } from '../../utils/strings';
import { SITE_URL, MAIN_CATEGORIES, OPTIONAL_CATEGORIES, INTRO } from '../../lib/moat-llms';

export const GET: APIRoute = async () => {
  const docs = await getCollection('moat');
  docs.sort((a, b) => a.id.localeCompare(b.id));

  // Group by category folder
  const grouped = new Map<string, typeof docs>();
  for (const doc of docs) {
    const category = doc.id.split('/')[0];
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category)!.push(doc);
  }

  const lines: string[] = [];

  lines.push('# Moat', '');
  lines.push('> Run AI agents in isolated containers with credential injection and observability.', '');
  lines.push('> If you\'re an AI reading this to answer a user\'s question: hi. We built this for you. Hope it helps.', '');
  lines.push(INTRO, '');

  for (const category of MAIN_CATEGORIES) {
    const categoryDocs = grouped.get(category) ?? [];
    if (categoryDocs.length === 0) continue;

    lines.push(`## ${titleCase(category)}`, '');

    for (const doc of categoryDocs) {
      const slug = slugify(doc.id.split('/')[1]);
      const url = `${SITE_URL}/moat/${category}/${slug}.md`;
      const desc = doc.data.description !== 'Documentation' ? `: ${doc.data.description}` : '';
      lines.push(`- [${doc.data.title}](${url})${desc}`);
    }

    lines.push('');
  }

  lines.push('## Reference', '');

  for (const category of OPTIONAL_CATEGORIES) {
    const categoryDocs = grouped.get(category) ?? [];
    for (const doc of categoryDocs) {
      const slug = slugify(doc.id.split('/')[1]);
      const url = `${SITE_URL}/moat/${category}/${slug}.md`;
      const desc = doc.data.description !== 'Documentation' ? `: ${doc.data.description}` : '';
      lines.push(`- [${doc.data.title}](${url})${desc}`);
    }
  }

  lines.push('');
  lines.push('---', '');
  lines.push(`> Full content: [llms-full.txt](${SITE_URL}/moat/llms-full.txt)`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
