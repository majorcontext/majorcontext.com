export interface NavItem {
  href: string;
  number: string;
  label: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Category display order — categories not listed here appear at the end alphabetically
const categoryOrder = ['getting-started', 'concepts', 'guides', 'reference'];

function formatCategoryTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

interface DocEntry {
  id: string;
  data: { title: string; navTitle?: string };
}

export function buildNavigation(docs: DocEntry[], productId: string): NavSection[] {
  const sections = new Map<string, NavItem[]>();

  for (const doc of docs) {
    const parts = doc.id.split('/');
    const category = parts[0];
    const fileName = parts[1];

    // Extract number prefix and slug from filename like "01-introduction.md"
    const match = fileName.match(/^(\d+)-(.+)\.md$/);
    if (!match) continue;

    const [, num, slug] = match;

    if (!sections.has(category)) {
      sections.set(category, []);
    }

    sections.get(category)!.push({
      href: `/${productId}/${category}/${slug}`,
      number: num,
      label: doc.data.navTitle || doc.data.title,
    });
  }

  // Sort items within each section by number
  for (const items of sections.values()) {
    items.sort((a, b) => a.number.localeCompare(b.number));
  }

  // Sort sections by categoryOrder, then alphabetically for unknown categories
  const sortedCategories = [...sections.keys()].sort((a, b) => {
    const ai = categoryOrder.indexOf(a);
    const bi = categoryOrder.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  return sortedCategories.map((category) => ({
    title: formatCategoryTitle(category),
    items: sections.get(category)!,
  }));
}
