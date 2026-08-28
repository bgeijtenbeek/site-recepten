import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { makeRecipeSchema } from './lib/recipe-schema';

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/data/recipes' }),
  schema: ({ image }) => makeRecipeSchema(image()),
});

export const collections = { recipes };
