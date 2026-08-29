import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { makeRecipeSchema } from '../../src/lib/recipe-schema';

const schema = makeRecipeSchema(z.string().min(1));

const completeRecipe = {
  title: 'Kip met rijst',
  description: 'Een snelle maaltijd voor het hele gezin.',
  image: './kip.svg',
  imageAlt: 'Een schaal met kip en rijst',
  mealType: 'Hoofdgerechten',
  kenmerken: ['Kip', 'Rijst'],
  totalTime: 40,
  servings: 4,
  ingredients: [
    { name: 'rijst', quantity: '300', unit: 'g' },
    { name: 'zout', amount: 'naar smaak' },
  ],
  steps: ['Kook de rijst.', 'Bak de kip.'],
  notes: 'Lekker met komkommer.',
};

describe('recipe content contract', () => {
  it('accepts a complete recipe with an image and multiple kenmerken', () => {
    expect(schema.parse(completeRecipe)).toEqual(completeRecipe);
  });

  it('accepts a recipe without an image for fallback rendering', () => {
    const { image: _image, imageAlt: _imageAlt, ...withoutImage } = completeRecipe;
    expect(schema.parse(withoutImage)).toEqual(withoutImage);
  });

  it('requires useful alt text when an image is declared', () => {
    const { imageAlt: _imageAlt, ...withoutAlt } = completeRecipe;
    expect(() => schema.parse(withoutAlt)).toThrow(/alt/i);
  });

  it.each([
    ['unknown meal type', { mealType: 'Avondeten' }],
    ['unknown kenmerk', { kenmerken: ['Kip', 'Pittig'] }],
    ['duplicate kenmerken', { kenmerken: ['Kip', 'Kip'] }],
    ['non-four base servings', { servings: 2 }],
    ['empty ingredients', { ingredients: [] }],
    ['empty steps', { steps: [] }],
  ])('rejects %s', (_label, change) => {
    expect(() => schema.parse({ ...completeRecipe, ...change })).toThrow();
  });

  it('rejects ingredients with both scalable and fixed amounts', () => {
    expect(() => schema.parse({
      ...completeRecipe,
      ingredients: [{ name: 'zout', quantity: '1', amount: 'naar smaak' }],
    })).toThrow();
  });

  it.each(['nooit', '0', '-2'])('rejects invalid numeric quantity %s', (quantity) => {
    expect(() => schema.parse({
      ...completeRecipe,
      ingredients: [{ name: 'rijst', quantity, unit: 'g' }],
    })).toThrow(/hoeveelheid/i);
  });
});
