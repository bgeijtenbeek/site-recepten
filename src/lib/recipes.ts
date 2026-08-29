import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

import type { RecipeSearchRecord } from './search';

export interface RecipeSummary extends RecipeSearchRecord {
  totalTime: number;
  image?: ImageMetadata;
  imageAlt?: string;
}

export function toRecipeSummary(entry: CollectionEntry<'recipes'>): RecipeSummary {
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    ingredientNames: entry.data.ingredients.map(({ name }) => name),
    mealType: entry.data.mealType,
    kenmerken: [...entry.data.kenmerken],
    totalTime: entry.data.totalTime,
    image: entry.data.image,
    imageAlt: entry.data.imageAlt,
  };
}

export function recipesForMealType<T extends { mealType: string }>(
  recipes: ReadonlyArray<T>,
  mealType: string,
): T[] {
  return recipes.filter((recipe) => recipe.mealType === mealType);
}

export function recipesForKenmerk<T extends { kenmerken: ReadonlyArray<string> }>(
  recipes: ReadonlyArray<T>,
  kenmerk: string,
): T[] {
  return recipes.filter((recipe) => recipe.kenmerken.includes(kenmerk));
}
