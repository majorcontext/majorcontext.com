import { defineCollection, z } from 'astro:content';

const baseDocSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().optional().default('Documentation'),
  keywords: z.array(z.string()).optional().default([]),
  lastUpdated: z.date().optional(),
  category: z.string().optional(),
});

const moatCollection = defineCollection({
  type: 'content',
  schema: baseDocSchema.extend({
    // Moat-specific fields can go here
  }),
});

export const collections = {
  moat: moatCollection,
};
