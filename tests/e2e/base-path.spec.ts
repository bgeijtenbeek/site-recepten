import { expect, test } from '@playwright/test';

test('serves the Dutch shell below the project path', async ({ page }) => {
  await page.goto('./');

  await expect(page).toHaveTitle('Familierecepten');
  await expect(page.getByRole('heading', { name: 'Wat eten we vandaag?' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  await expect(page).toHaveURL(/\/site-recepten\/$/);
});

test('keeps direct routes and internal assets below the project path', async ({ page }) => {
  for (const route of [
    'recepten/kip-kerrie-rijst/',
    'maaltijdtypes/hoofdgerechten/',
    'kenmerken/kip/',
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await page.reload();
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/site-recepten/${route}$`));
  }

  await page.goto('./');
  const localLinks = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(localLinks.filter((href) => href && !href.startsWith('#')).every((href) => href!.startsWith('/site-recepten/'))).toBe(true);
  const localImages = await page.locator('img').evaluateAll((images) => images.map((image) => image.getAttribute('src')));
  expect(localImages.filter(Boolean).every((src) => src!.startsWith('/site-recepten/'))).toBe(true);
});
