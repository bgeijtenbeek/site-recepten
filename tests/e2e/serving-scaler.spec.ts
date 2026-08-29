import { expect, test } from '@playwright/test';

test('schaalt getallen exact en laat tekst staan', async ({ page }) => {
  await page.goto('recepten/spinaziesoep/');
  const plus = page.getByRole('button', { name: 'Eén persoon meer' });
  await plus.click();
  await plus.click();
  await expect(page.getByText('6 personen')).toBeVisible();
  await expect(page.locator('.ingredient-list li').filter({ hasText: 'melk' })).toContainText('750 ml');
  await expect(page.locator('.ingredient-list li').filter({ hasText: 'diepvries spinazie' })).toContainText('450 g');
  await expect(page.locator('.ingredient-list li').filter({ hasText: 'Stokbrood' })).toContainText('2-3');
  await expect(page.locator('.ingredient-list li').filter({ hasText: 'Beleg' })).toContainText('naar wens');
});

test('toont decimalen zonder af te ronden', async ({ page }) => {
  await page.goto('recepten/spinaziesoep/');
  const plus = page.getByRole('button', { name: 'Eén persoon meer' });
  await plus.click();
  await plus.click();
  await expect(page.locator('.ingredient-list li').filter({ hasText: 'croutons / knapperbolletjes' })).toContainText('1,5 zakje');
});

test('begrenst de bediening van één tot twaalf personen', async ({ page }) => {
  await page.goto('recepten/spinaziesoep/');
  const minus = page.getByRole('button', { name: 'Eén persoon minder' });
  const plus = page.getByRole('button', { name: 'Eén persoon meer' });
  await minus.click({ clickCount: 3 });
  await expect(page.getByText('1 persoon')).toBeVisible();
  await expect(minus).toBeDisabled();
  await plus.click({ clickCount: 11 });
  await expect(page.getByText('12 personen')).toBeVisible();
  await expect(plus).toBeDisabled();
});
