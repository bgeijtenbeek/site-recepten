import { expect, test } from '@playwright/test';

test('schaalt getallen exact en laat tekst staan', async ({ page }) => {
  await page.goto('recepten/kip-kerrie-rijst/');
  const plus = page.getByRole('button', { name: 'Eén persoon meer' });
  await plus.click();
  await plus.click();
  await expect(page.getByText('6 personen')).toBeVisible();
  await expect(page.locator('.ingredient-list li').filter({ hasText: 'rijst' })).toContainText('450 g');
  await expect(page.locator('.ingredient-list li').filter({ hasText: 'kipfilet' })).toContainText('750 g');
  await expect(page.locator('.ingredient-list li').filter({ hasText: 'zout' })).toContainText('naar smaak');
});

test('toont decimalen zonder af te ronden', async ({ page }) => {
  await page.goto('recepten/aardappelgratin/');
  const plus = page.getByRole('button', { name: 'Eén persoon meer' });
  await plus.click();
  await plus.click();
  await expect(page.locator('.ingredient-list li').filter({ hasText: 'teen knoflook' })).toContainText('1,5');
});

test('begrenst de bediening van één tot twaalf personen', async ({ page }) => {
  await page.goto('recepten/kip-kerrie-rijst/');
  const minus = page.getByRole('button', { name: 'Eén persoon minder' });
  const plus = page.getByRole('button', { name: 'Eén persoon meer' });
  await minus.click({ clickCount: 3 });
  await expect(page.getByText('1 persoon')).toBeVisible();
  await expect(minus).toBeDisabled();
  await plus.click({ clickCount: 11 });
  await expect(page.getByText('12 personen')).toBeVisible();
  await expect(plus).toBeDisabled();
});
