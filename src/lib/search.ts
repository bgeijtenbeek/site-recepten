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

export function isDiscoveryActive(query: string, selectedKenmerken: ReadonlyArray<string>): boolean {
  return queryTerms(query).length > 0 || selectedKenmerken.length > 0;
}

export function matchesDiscovery(
  searchableText: string,
  normalizedKenmerken: ReadonlySet<string>,
  terms: ReadonlyArray<string>,
  selectedKenmerken: ReadonlyArray<string>,
): boolean {
  return terms.every((term) => searchableText.includes(term))
    && selectedKenmerken.every((kenmerk) => normalizedKenmerken.has(kenmerk));
}

export function filterRecipes<T extends RecipeSearchRecord>(
  recipes: ReadonlyArray<T>,
  query: string,
  selectedKenmerken: ReadonlyArray<string>,
): T[] {
  const terms = queryTerms(query);
  const selected = selectedKenmerken.map(normalizeDutchText);

  return recipes.filter((recipe) => {
    const haystack = normalizeDutchText([
      recipe.title,
      recipe.description,
      ...recipe.ingredientNames,
    ].join(' '));
    const normalizedKenmerken = new Set(recipe.kenmerken.map(normalizeDutchText));

    return matchesDiscovery(haystack, normalizedKenmerken, terms, selected);
  });
}
