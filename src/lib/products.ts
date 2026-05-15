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

export function getProduct(id: string): Product {
  const product = products[id];
  if (!product) {
    throw new Error(`Product ${id} not found`);
  }
  return product;
}
