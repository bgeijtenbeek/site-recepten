import { describe, expect, it } from 'vitest';

import { filterRecipes, isDiscoveryActive, normalizeDutchText } from '../../src/lib/search';

const records = [
  {
    id: 'kip-rijst',
    title: 'Kip met rijst',
    description: 'Een romige favoriet',
    ingredientNames: ['kipfilet', 'basmatirijst'],
    mealType: 'Hoofdgerechten',
    kenmerken: ['Kip', 'Rijst'],
  },
  {
    id: 'groenten',
    title: 'Geroosterde groenten',
    description: 'Kleurrijk en knapperig',
    ingredientNames: ['paprika', 'kikkererwten'],
    mealType: 'Overig',
    kenmerken: ['Vega', 'Ovengerecht'],
  },
  {
    id: 'creme',
    title: 'Crème van bloemkool',
    description: 'Zachte soep',
    ingredientNames: ['bloemkool'],
    mealType: 'Voorgerechten',
    kenmerken: ['Vega'],
  },
] as const;

describe('recipe discovery', () => {
  it('finds ingredient-only text', () => {
    expect(filterRecipes(records, 'kikkererwten', []).map(({ id }) => id)).toEqual(['groenten']);
  });

  it('matches every query term across title, description, and ingredients', () => {
    expect(filterRecipes(records, 'romige basmati', []).map(({ id }) => id)).toEqual(['kip-rijst']);
    expect(filterRecipes(records, 'romige kikkererwten', [])).toEqual([]);
  });

  it('requires every selected kenmerk', () => {
    expect(filterRecipes(records, '', ['Kip', 'Rijst']).map(({ id }) => id)).toEqual(['kip-rijst']);
    expect(filterRecipes(records, '', ['Kip', 'Vega'])).toEqual([]);
  });

  it('combines query and selected kenmerken with AND behavior', () => {
    expect(filterRecipes(records, 'kip', ['Rijst']).map(({ id }) => id)).toEqual(['kip-rijst']);
    expect(filterRecipes(records, 'kip', ['Vega'])).toEqual([]);
  });

  it('ignores case and composed or decomposed accents', () => {
    expect(normalizeDutchText('CRÈME')).toBe(normalizeDutchText('Cre\u0300me'));
    expect(filterRecipes(records, 'CREME', []).map(({ id }) => id)).toEqual(['creme']);
  });

  it('treats blank search as inactive', () => {
    expect(isDiscoveryActive('   ', [])).toBe(false);
    expect(isDiscoveryActive('', ['Vega'])).toBe(true);
    expect(filterRecipes(records, '   ', [])).toEqual(records);
  });
});
