import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

import type { RecipeSearchRecord } from './search';

export interface RecipeSummary extends RecipeSearchRecord {
  prepTime: number;
  cookTime: number;
  difficulty: string;
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
    prepTime: entry.data.prepTime,
    cookTime: entry.data.cookTime,
    difficulty: entry.data.difficulty,
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
