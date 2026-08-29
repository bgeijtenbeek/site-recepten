import { z } from 'zod';

import { kenmerkLabels, mealTypeLabels } from '../data/taxonomies';
import { parseQuantity } from './quantities';

const text = z.string().trim().min(1);

export const scalableIngredientSchema = z.object({
  name: text,
  quantity: text.refine((value) => {
    try {
      parseQuantity(value);
      return true;
    } catch {
      return false;
    }
  }, 'De hoeveelheid moet een positief getal, een breuk of een gemengde breuk zijn.'),
  unit: text.optional(),
  amount: z.never().optional(),
}).strict();

export const fixedIngredientSchema = z.object({
  name: text,
  amount: text,
  quantity: z.never().optional(),
  unit: z.never().optional(),
}).strict();

export const ingredientSchema = z.union([scalableIngredientSchema, fixedIngredientSchema]);

export function makeRecipeSchema<TImage extends z.ZodType>(imageSchema: TImage) {
  return z.object({
    title: text,
    description: text,
    image: imageSchema.optional(),
    imageAlt: text.optional(),
    mealType: z.enum(mealTypeLabels),
    kenmerken: z.array(z.enum(kenmerkLabels)).default([]),
    totalTime: z.number().int().positive(),
    servings: z.literal(4),
    ingredients: z.array(ingredientSchema).min(1),
    steps: z.array(text).min(1),
    notes: text.optional(),
  }).strict().superRefine((recipe, context) => {
    if (recipe.image && !recipe.imageAlt) {
      context.addIssue({
        code: 'custom',
        path: ['imageAlt'],
        message: 'Een afbeelding heeft beschrijvende alt-tekst nodig.',
      });
    }
    if (!recipe.image && recipe.imageAlt) {
      context.addIssue({
        code: 'custom',
        path: ['imageAlt'],
        message: 'Alt-tekst mag alleen samen met een afbeelding worden ingevuld.',
      });
    }
    if (new Set(recipe.kenmerken).size !== recipe.kenmerken.length) {
      context.addIssue({
        code: 'custom',
        path: ['kenmerken'],
        message: 'Een kenmerk mag maar één keer voorkomen.',
      });
    }
  });
}

export type Ingredient = z.infer<typeof ingredientSchema>;
