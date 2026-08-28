import { expect, test } from '@playwright/test';

test.describe('statische ervaring zonder JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('blijft volledig doorbladerbaar', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: 'Wat eten we vandaag?' })).toBeVisible();
    await expect(page.locator('[data-recipe-id]:visible')).toHaveCount(10);

    await page.getByRole('link', { name: 'Hoofdgerechten' }).click();
    await expect(page.getByRole('heading', { name: 'Hoofdgerechten', level: 1 })).toBeVisible();
    const titles = await page.locator('.card-title').allTextContents();
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'nl-NL')));

    await page.getByRole('link', { name: 'Kip-kerrie met rijst' }).click();
    await expect(page.getByRole('heading', { name: 'Ingrediënten' })).toBeVisible();
    await expect(page.getByText('4 personen')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bereiding' })).toBeVisible();
  });

  test('toont een bruikbare afbeeldingsfallback', async ({ page }) => {
    await page.goto('recepten/aardappelgratin/');
    await expect(page.getByRole('img', { name: 'Geen foto beschikbaar' })).toBeVisible();
    await expect(page.locator('.recipe-intro img')).toHaveCount(0);
  });
});

for (const width of [360, 768, 1280]) {
  test(`heeft geen horizontale overloop bij ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['./', 'recepten/kip-kerrie-rijst/', 'kenmerken/vega/']) {
      await page.goto(route);
      const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflows).toBe(false);
    }
  });
}
