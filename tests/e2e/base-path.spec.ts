import { expect, test } from '@playwright/test';

test('serves the Dutch shell from the domain root', async ({ page }) => {
  await page.goto('./');

  await expect(page).toHaveTitle('DeGoat - Recepten');
  await expect(page.getByLabel('Zoek een recept')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Onderdeel van degoat.nl' })).toHaveAttribute('href', 'https://degoat.nl');
  await expect(page.getByText('Met zorg verzameld voor familie en vrienden.')).toHaveCount(0);
});

test('keeps direct routes and internal assets below the domain root', async ({ page }) => {
  for (const route of [
    'recepten/spinaziesoep/',
    'recepten/tagliatelle-met-champignons/',
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await page.reload();
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/${route}$`));
  }

  await page.goto('./');
  const localLinks = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  const internalLinks = localLinks.filter((href) => href && !href.startsWith('#') && !/^[a-z][a-z\d+.-]*:/i.test(href));
  expect(internalLinks.every((href) => href!.startsWith('/'))).toBe(true);
  const localImages = await page.locator('img').evaluateAll((images) => images.map((image) => image.getAttribute('src')));
  expect(localImages.filter(Boolean).every((src) => src!.startsWith('/'))).toBe(true);
});

test('does not publish standalone taxonomy pages', async ({ page }) => {
  for (const route of ['maaltijdtypes/hoofdgerechten/', 'kenmerken/vega/']) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
  }
});
