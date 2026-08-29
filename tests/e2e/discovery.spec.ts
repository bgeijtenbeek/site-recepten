import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('toont alle beschikbare, geschikte inspiratierecepten zonder duplicaten', async ({ page }) => {
  const cards = page.locator('[data-recipe-id]:visible');
  await expect(cards).toHaveCount(2);
  await expect(page.getByText('2 recepten ter inspiratie')).toBeVisible();
  await expect(cards.locator('.card-kenmerken')).toHaveCount(2);
  expect((await cards.locator('.card-kenmerken').allTextContents()).every((text) => text.trim().length > 0)).toBe(true);
  const ids = await cards.evaluateAll((items) => items.map((item) => item.getAttribute('data-recipe-id')));
  expect(new Set(ids).size).toBe(2);
  const mealTypes = await cards.evaluateAll((items) => items.map((item) => item.getAttribute('data-meal-type')));
  expect(mealTypes).not.toContain('Voorgerechten');
  expect(mealTypes).not.toContain('Desserts');
});

test('toont de kenmerken op volgorde en filtert het echte recept', async ({ page }) => {
  const filterOrder = await page.locator('input[name="kenmerk"]').evaluateAll((items) =>
    items.map((item) => (item as HTMLInputElement).value),
  );
  expect(filterOrder).toEqual(['Vlees', 'Vis', 'Kip', 'Vega', 'Pasta', 'Rijst', 'Aardappel', 'Soep', 'Ei', 'Zoet', 'Ovengerecht']);

  await page.getByRole('checkbox', { name: 'Vega' }).check();
  await expect(page.locator('[data-recipe-id]:visible')).toHaveCount(1);
  await expect(page.getByText('1 recept gevonden')).toBeVisible();
});

test('zoekt live in ingrediënten en wist terug naar dezelfde inspiratie', async ({ page }) => {
  const initialIds = await page.locator('[data-recipe-id]:visible').evaluateAll((items) => items.map((item) => item.getAttribute('data-recipe-id')));
  await page.getByLabel('Zoek een recept').fill('croutons');
  await expect(page.getByText('1 recept gevonden')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Spinaziesoep' })).toBeVisible();
  await page.getByRole('button', { name: 'Wis zoeken en filters' }).click();
  const restoredIds = await page.locator('[data-recipe-id]:visible').evaluateAll((items) => items.map((item) => item.getAttribute('data-recipe-id')));
  expect(restoredIds).toEqual(initialIds);
});

test('combineert kenmerken met EN-logica en toont een lege staat', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Vega' }).check();
  await page.getByRole('checkbox', { name: 'Soep' }).check();
  await expect(page.getByText('1 recept gevonden')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Spinaziesoep' })).toBeVisible();

  await page.getByLabel('Zoek een recept').fill('chocolade');
  await expect(page.getByRole('heading', { name: 'Geen recepten gevonden' })).toBeVisible();
  await expect(page.locator('[data-recipe-id]:visible')).toHaveCount(0);
});
