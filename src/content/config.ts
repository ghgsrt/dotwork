import { defineCollection, z } from 'astro:content';

const art = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		inStock: z.boolean(),
		price: z.number(),
		image: z.string(),
	}),
});

export const collections = { art };
