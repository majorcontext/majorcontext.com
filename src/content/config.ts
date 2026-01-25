import { defineCollection, z } from 'astro:content';

const moatCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1, 'Title cannot be empty'),
    description: z.string().optional().default('Moat documentation'),
    keywords: z.array(z.string()).optional().default([]),
  }),
});

export const collections = {
  moat: moatCollection,
};
