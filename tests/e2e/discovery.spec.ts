import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('toont tien unieke, geschikte inspiratierecepten', async ({ page }) => {
  const cards = page.locator('[data-recipe-id]:visible');
  await expect(cards).toHaveCount(10);
  const ids = await cards.evaluateAll((items) => items.map((item) => item.getAttribute('data-recipe-id')));
  expect(new Set(ids).size).toBe(10);
  const mealTypes = await cards.evaluateAll((items) => items.map((item) => item.getAttribute('data-meal-type')));
  expect(mealTypes).not.toContain('Voorgerechten');
  expect(mealTypes).not.toContain('Desserts');
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
