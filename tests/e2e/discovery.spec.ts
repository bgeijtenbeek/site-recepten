import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('toont zes unieke, geschikte inspiratierecepten', async ({ page }) => {
  const cards = page.locator('[data-recipe-id]:visible');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('.card-kenmerken')).toHaveCount(6);
  expect((await cards.locator('.card-kenmerken').allTextContents()).every((text) => text.trim().length > 0)).toBe(true);
  const ids = await cards.evaluateAll((items) => items.map((item) => item.getAttribute('data-recipe-id')));
  expect(new Set(ids).size).toBe(6);
  const mealTypes = await cards.evaluateAll((items) => items.map((item) => item.getAttribute('data-meal-type')));
  expect(mealTypes).not.toContain('Voorgerechten');
  expect(mealTypes).not.toContain('Desserts');
});

test('beperkt actieve filterresultaten niet tot de inspiratieomvang', async ({ page }) => {
  const filterOrder = await page.locator('input[name="kenmerk"]').evaluateAll((items) =>
    items.map((item) => (item as HTMLInputElement).value),
  );
  expect(filterOrder).toEqual(['Vlees', 'Vis', 'Kip', 'Vega', 'Pasta', 'Rijst', 'Aardappel', 'Ei', 'Zoet', 'Ovengerecht']);

  await page.getByRole('checkbox', { name: 'Vega' }).check();
  await expect(page.locator('[data-recipe-id]:visible')).toHaveCount(12);
  await expect(page.getByText('12 recepten gevonden')).toBeVisible();
});

test('zoekt live in ingrediënten en wist terug naar dezelfde inspiratie', async ({ page }) => {
  const initialIds = await page.locator('[data-recipe-id]:visible').evaluateAll((items) => items.map((item) => item.getAttribute('data-recipe-id')));
  await page.getByLabel('Zoek een recept').fill('kikkererwten');
  await expect(page.getByText('1 recept gevonden')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Geroosterde groenten met kikkererwten' })).toBeVisible();
  await page.getByRole('button', { name: 'Wis zoeken en filters' }).click();
  const restoredIds = await page.locator('[data-recipe-id]:visible').evaluateAll((items) => items.map((item) => item.getAttribute('data-recipe-id')));
  expect(restoredIds).toEqual(initialIds);
});

test('combineert kenmerken met EN-logica en toont een lege staat', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Kip' }).check();
  await page.getByRole('checkbox', { name: 'Rijst' }).check();
  await expect(page.getByText('1 recept gevonden')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kip-kerrie met rijst' })).toBeVisible();

  await page.getByLabel('Zoek een recept').fill('chocolade');
  await expect(page.getByRole('heading', { name: 'Geen recepten gevonden' })).toBeVisible();
  await expect(page.locator('[data-recipe-id]:visible')).toHaveCount(0);
});
