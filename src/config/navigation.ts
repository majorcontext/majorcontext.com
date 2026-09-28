export interface NavItem {
  href: string;
  order: string; // Filename prefix, used only for sorting
  number?: string; // Displayed position; set only for sections read in sequence
  label: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Category display order — categories not listed here appear at the end alphabetically
const categoryOrder = ['getting-started', 'concepts', 'guides', 'reference'];

// Categories meant to be read in order get visible step numbers. Numbers are
// assigned by position, so gaps in filename prefixes never show.
const sequentialCategories = new Set(['getting-started']);

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
      order: num,
      label: doc.data.navTitle || doc.data.title,
    });
  }

  // Sort items within each section by filename prefix
  for (const [category, items] of sections) {
    items.sort((a, b) => a.order.localeCompare(b.order));
    if (sequentialCategories.has(category)) {
      items.forEach((item, i) => {
        item.number = String(i + 1).padStart(2, '0');
      });
    }
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
