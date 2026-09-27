import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/inline-editing.html');
});

test('edits inline text from the keyboard and keeps focus on the renamed text', async ({
  page,
}) => {
  const identity = page.getByRole('region', { name: 'Request identity' });
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Toggle theme' }).click();
    expect(
      (await new AxeBuilder({ page }).include('[data-testid="identity"]').analyze()).violations,
    ).toEqual([]);
  }
  await page.getByRole('button', { name: 'Toggle theme' }).focus();
  await page.keyboard.press('Tab');
  await expect(identity.getByRole('button', { name: 'List invoices' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(identity.getByRole('textbox', { name: 'Request name' })).toBeFocused();
  await page.keyboard.press('End');
  await page.keyboard.type(' draft');
  await page.keyboard.press('Escape');
  await expect(identity.getByRole('button', { name: 'List invoices' })).toBeFocused();
  await expect(page.getByRole('status', { name: 'Saved name' })).toHaveText('List invoices');
  await identity.getByRole('button', { name: 'List invoices' }).click();
  await page.keyboard.press('End');
  await page.keyboard.type(' v2');
  await page.keyboard.press('Enter');
  await expect(identity.getByRole('button', { name: 'List invoices v2' })).toBeFocused();
  await expect(page.getByRole('status', { name: 'Saved name' })).toHaveText('List invoices v2');
});
