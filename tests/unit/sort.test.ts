import { describe, expect, it } from 'vitest';

import { sortRecipesByTitle } from '../../src/lib/sort';

describe('Dutch recipe ordering', () => {
  it('sorts alphabetically with numeric fragments', () => {
    const recipes = [
      { id: 'b', title: 'Pannenkoek 10' },
      { id: 'c', title: 'Äardappelsoep' },
      { id: 'a', title: 'Pannenkoek 2' },
      { id: 'd', title: 'Bietensalade' },
    ];

    expect(sortRecipesByTitle(recipes).map(({ id }) => id)).toEqual(['c', 'd', 'a', 'b']);
    expect(recipes.map(({ id }) => id)).toEqual(['b', 'c', 'a', 'd']);
  });

  it('uses the recipe ID as a stable tie-breaker', () => {
    expect(sortRecipesByTitle([
      { id: 'twee', title: 'Soep' },
      { id: 'een', title: 'soep' },
    ]).map(({ id }) => id)).toEqual(['een', 'twee']);
  });
});
