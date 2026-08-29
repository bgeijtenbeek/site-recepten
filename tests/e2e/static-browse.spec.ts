import { expect, test } from '@playwright/test';

test.describe('statische ervaring zonder JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('blijft volledig doorbladerbaar', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { name: 'Wat eten we vandaag?' })).toHaveCount(0);
    await expect(page.getByText('Onze digitale receptenmap')).toHaveCount(0);
    await expect(page.getByText('Zoek in onze favorieten, filter op wat er in huis is of laat je verrassen.')).toHaveCount(0);
    await expect(page.getByText('Voor aan onze tafel')).toHaveCount(0);
    await expect(page.locator('[data-recipe-id]:visible')).toHaveCount(6);

    const kenmerken = page.getByRole('navigation', { name: 'Blader op kenmerken' });
    await expect(kenmerken.locator('details')).not.toHaveAttribute('open', '');
    await kenmerken.locator('summary').click();
    await kenmerken.getByRole('link', { name: 'Kip', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Kip', level: 1 })).toBeVisible();

    await page.goto('./');
    const maaltijdtypes = page.getByRole('navigation', { name: 'Maaltijdtypes' });
    await maaltijdtypes.locator('summary').click();
    await expect(maaltijdtypes.getByRole('link', { name: 'Overig', exact: true })).toBeVisible();
    await expect(maaltijdtypes.getByRole('link', { name: 'Bijgerechten', exact: true })).toHaveCount(0);
    await expect(maaltijdtypes.getByRole('link', { name: 'Snacks', exact: true })).toHaveCount(0);
    await maaltijdtypes.getByRole('link', { name: 'Hoofdgerechten' }).click();
    await expect(page.getByRole('heading', { name: 'Hoofdgerechten', level: 1 })).toBeVisible();
    await expect(page.locator('.recipe-card h2')).toHaveCount(0);
    await expect(page.locator('.recipe-card h3')).not.toHaveCount(0);
    const titles = await page.locator('.card-title').allTextContents();
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, 'nl-NL')));

    await page.getByRole('link', { name: 'Kip-kerrie met rijst' }).click();
    await expect(page.getByText('Totale kooktijd', { exact: true })).toBeVisible();
    await expect(page.getByText('40 min', { exact: true })).toBeVisible();
    await expect(page.getByText('Voorbereiden', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Moeilijkheid', { exact: true })).toHaveCount(0);
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

      if (route === './' && width === 1280) {
        const contentWidths = await page.locator('.search-field, .homepage-taxonomies').evaluateAll((items) =>
          items.map((item) => item.getBoundingClientRect().width),
        );
        expect(Math.abs(contentWidths[0] - contentWidths[1])).toBeLessThan(1);
        const columns = await page.locator('[data-grid]').evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
        expect(columns).toBe(3);
        await expect(page.locator('.recipe-card').first().locator('.card-meta dd')).toHaveCount(1);
      }
    }
  });
}
