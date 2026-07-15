import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { slugify } from '../../../utils/strings';
import { SITE_URL } from '../../../lib/gatekeeper-llms';

export async function getStaticPaths() {
  const docs = await getCollection('gatekeeper');

  return docs.map((doc) => {
    const parts = doc.id.split('/');
    const category = parts[0];
    const fileName = parts[1];
    const slug = slugify(fileName);

    return {
      params: { category, slug },
      props: { doc },
    };
  });
}

const FOOTER = `\n\n---\n[← Gatekeeper documentation index](${SITE_URL}/gatekeeper/llms.txt)\n`;

export const GET: APIRoute = ({ props }) => {
  const { doc } = props as { doc: Awaited<ReturnType<typeof getCollection<'gatekeeper'>>>[number] };
  return new Response(doc.body + FOOTER, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
