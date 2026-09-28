export interface Product {
  id: string;
  name: string;
  displayName: string;
  tagline: string;
  githubUrl: string;
  color: string; // Tailwind color name like 'sky'
  docsRepo: string; // GitHub repo (e.g., 'majorcontext/moat')
  docsPath: string; // Path to docs in repo (e.g., 'docs/content')
  skipFetch?: boolean; // Skip when running fetch:docs across all products (docs not yet on default branch)
}

export const products: Record<string, Product> = {
  moat: {
    id: 'moat',
    name: 'Moat',
    displayName: 'MOAT',
    tagline: 'Let agents break things safely',
    githubUrl: 'https://github.com/majorcontext/moat',
    color: 'sky',
    docsRepo: 'majorcontext/moat',
    docsPath: 'docs/content',
  },
  keep: {
    id: 'keep',
    name: 'Keep',
    displayName: 'KEEP',
    tagline: 'Policy engine for AI agent tool calls',
    githubUrl: 'https://github.com/majorcontext/keep',
    color: 'amber',
    docsRepo: 'majorcontext/keep',
    docsPath: 'docs/content',
  },
  gatekeeper: {
    id: 'gatekeeper',
    name: 'Gatekeeper',
    displayName: 'GATEKEEPER',
    tagline: 'Credential-injecting TLS-intercepting proxy',
    githubUrl: 'https://github.com/majorcontext/gatekeeper',
    color: 'emerald',
    docsRepo: 'majorcontext/gatekeeper',
    docsPath: 'docs/content',
  },
};

/**
 * A row on the homepage. Unlike `products`, this includes projects that
 * have no docs on this site yet (so it must not drive fetch-docs or llms.txt).
 */
export interface Project {
  id: string; // Matches a data-product accent in tailwind.config.js, if it has one
  name: string;
  summary: string;
  docsHref?: string;
  githubUrl?: string; // Omitted for private repos
}

export const projects: Project[] = [
  {
    id: 'harness',
    name: 'Harness',
    summary: 'A fast, extensible, composable agent harness in Go',
    githubUrl: 'https://github.com/majorcontext/harness',
  },
  {
    id: 'keep',
    name: 'Keep',
    summary: 'Allow, block, or redact your agents’ tool calls',
    docsHref: '/keep',
    githubUrl: products.keep.githubUrl,
  },
  {
    id: 'moat',
    name: 'Moat',
    summary: 'Run coding agents in a sandbox on your machine',
    docsHref: '/moat',
    githubUrl: products.moat.githubUrl,
  },
  {
    id: 'bailey',
    name: 'Bailey',
    summary: 'Run coding agents in persistent cloud environments',
  },
  {
    id: 'gatekeeper',
    name: 'Gatekeeper',
    summary: 'Let agents call APIs without seeing your keys',
    docsHref: '/gatekeeper',
    githubUrl: products.gatekeeper.githubUrl,
  },
];

export function getProduct(id: string): Product {
  const product = products[id];
  if (!product) {
    throw new Error(`Product ${id} not found`);
  }
  return product;
}
