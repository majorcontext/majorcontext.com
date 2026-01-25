export interface Product {
  id: string;
  name: string;
  displayName: string;
  tagline: string;
  githubUrl: string;
  color: string; // Tailwind color name like 'sky'
}

export const products: Record<string, Product> = {
  moat: {
    id: 'moat',
    name: 'Moat',
    displayName: 'MOAT',
    tagline: 'Let agents break things safely',
    githubUrl: 'https://github.com/majorcontext/moat',
    color: 'sky',
  },
  // Future products can be added here
};

export function getProduct(id: string): Product {
  const product = products[id];
  if (!product) {
    throw new Error(`Product ${id} not found`);
  }
  return product;
}
