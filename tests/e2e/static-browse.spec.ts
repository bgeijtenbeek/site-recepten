import { expect, test } from '@playwright/test';

test.describe('statische ervaring zonder JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('blijft volledig doorbladerbaar', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: 'Wat eten we vandaag?' })).toHaveCount(0);
    await expect(page.getByText('Onze digitale receptenmap')).toHaveCount(0);
    await expect(page.getByText('Zoek in onze favorieten, filter op wat er in huis is of laat je verrassen.')).toHaveCount(0);
    await expect(page.getByText('Voor aan onze tafel')).toHaveCount(0);
    await expect(page.locator('[data-recipe-id]:visible')).toHaveCount(2);
    await expect(page.getByRole('navigation', { name: /Blader op|Maaltijdtypes/ })).toHaveCount(0);

    await page.getByRole('link', { name: 'Spinaziesoep' }).click();
    await expect(page.getByText('Totale kooktijd', { exact: true })).toBeVisible();
    await expect(page.getByText('15 min', { exact: true })).toBeVisible();
    await expect(page.getByText('Voorbereiden', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Moeilijkheid', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Ingrediënten' })).toBeVisible();
    await expect(page.getByText('4 personen')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bereiding' })).toBeVisible();
  });

  test('toont een bruikbare afbeeldingsfallback', async ({ page }) => {
    await page.goto('recepten/spinaziesoep/');
    await expect(page.getByRole('img', { name: 'Geen foto beschikbaar' })).toBeVisible();
    await expect(page.locator('.recipe-intro img')).toHaveCount(0);
  });
});

for (const width of [360, 768, 1280]) {
  test(`heeft geen horizontale overloop bij ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['./', 'recepten/spinaziesoep/']) {
      await page.goto(route);
      const overflows = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflows).toBe(false);

      if (route === './' && width === 1280) {
        const contentWidths = await page.locator('.search-field, .filter-groups').evaluateAll((items) =>
          items.map((item) => item.getBoundingClientRect().width),
        );
        expect(Math.abs(contentWidths[0] - contentWidths[1])).toBeLessThan(1);
        const filterBoxes = await page.locator('.filter-group').evaluateAll((items) =>
          items.map((item) => {
            const box = item.getBoundingClientRect();
            return { top: box.top, bottom: box.bottom, width: box.width };
          }),
        );
        expect(filterBoxes).toHaveLength(2);
        expect(filterBoxes[1].top).toBeGreaterThan(filterBoxes[0].bottom);
        expect(Math.abs(filterBoxes[0].width - contentWidths[0])).toBeLessThan(1);
        expect(Math.abs(filterBoxes[1].width - contentWidths[0])).toBeLessThan(1);
        const columns = await page.locator('[data-grid]').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
        expect(columns).toBe(3);
        await expect(page.locator('.recipe-card').first().locator('.card-meta dd')).toHaveCount(1);
      }
    }
  });
}
