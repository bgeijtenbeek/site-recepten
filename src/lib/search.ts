export interface RecipeSearchRecord {
  id: string;
  title: string;
  description: string;
  ingredientNames: ReadonlyArray<string>;
  mealType: string;
  kenmerken: ReadonlyArray<string>;
}

export function normalizeDutchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('nl-NL')
    .trim();
}

export function queryTerms(query: string): string[] {
  return normalizeDutchText(query).split(/\s+/).filter(Boolean);
}

export function isDiscoveryActive(
  query: string,
  selectedMoment: string,
  selectedKenmerken: ReadonlyArray<string>,
): boolean {
  return queryTerms(query).length > 0
    || normalizeDutchText(selectedMoment).length > 0
    || selectedKenmerken.length > 0;
}

export function matchesDiscovery(
  searchableText: string,
  normalizedMealType: string,
  normalizedKenmerken: ReadonlySet<string>,
  terms: ReadonlyArray<string>,
  selectedMoment: string,
  selectedKenmerken: ReadonlyArray<string>,
): boolean {
  return terms.every((term) => searchableText.includes(term))
    && (!selectedMoment || normalizedMealType === selectedMoment)
    && selectedKenmerken.every((kenmerk) => normalizedKenmerken.has(kenmerk));
}

export function filterRecipes<T extends RecipeSearchRecord>(
  recipes: ReadonlyArray<T>,
  query: string,
  selectedMoment: string,
  selectedKenmerken: ReadonlyArray<string>,
): T[] {
  const terms = queryTerms(query);
  const moment = normalizeDutchText(selectedMoment);
  const selected = selectedKenmerken.map(normalizeDutchText);

  return recipes.filter((recipe) => {
    const haystack = normalizeDutchText([
      recipe.title,
      recipe.description,
      ...recipe.ingredientNames,
    ].join(' '));
    const mealType = normalizeDutchText(recipe.mealType);
    const normalizedKenmerken = new Set(recipe.kenmerken.map(normalizeDutchText));

    return matchesDiscovery(haystack, mealType, normalizedKenmerken, terms, moment, selected);
  });
}
