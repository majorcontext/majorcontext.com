import { defineCollection, z } from 'astro:content';

const moatCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

export const collections = {
  moat: moatCollection,
};
