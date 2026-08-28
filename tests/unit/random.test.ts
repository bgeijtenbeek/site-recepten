import { describe, expect, it } from 'vitest';

import { createSeededRandom, selectInspiration } from '../../src/lib/random';

const recipes = [
  ...Array.from({ length: 12 }, (_, index) => ({
    id: `eligible-${index + 1}`,
    mealType: index % 2 === 0 ? 'Hoofdgerechten' : 'Snacks',
  })),
  { id: 'starter', mealType: 'Voorgerechten' },
  { id: 'dessert', mealType: 'Desserts' },
];

describe('random inspiration', () => {
  it('returns ten distinct recipes and excludes starters and desserts', () => {
    const result = selectInspiration(recipes, 10, createSeededRandom(42));

    expect(result).toHaveLength(10);
    expect(new Set(result.map(({ id }) => id)).size).toBe(10);
    expect(result.every(({ mealType }) => !['Voorgerechten', 'Desserts'].includes(mealType))).toBe(true);
  });

  it('returns every eligible recipe once when fewer than ten exist', () => {
    const result = selectInspiration(recipes.slice(0, 7), 10, createSeededRandom(42));

    expect(result).toHaveLength(7);
    expect(new Set(result.map(({ id }) => id)).size).toBe(7);
  });

  it('is reproducible for a fixed seed', () => {
    const first = selectInspiration(recipes, 10, createSeededRandom(123));
    const second = selectInspiration(recipes, 10, createSeededRandom(123));
    const other = selectInspiration(recipes, 10, createSeededRandom(987));

    expect(second).toEqual(first);
    expect(other.map(({ id }) => id)).not.toEqual(first.map(({ id }) => id));
  });

  it('rejects invalid sample sizes and random outputs', () => {
    expect(() => selectInspiration(recipes, -1, createSeededRandom(1))).toThrow(/aantal/i);
    expect(() => selectInspiration(recipes, 10, () => 1)).toThrow(/willekeurig/i);
  });
});
