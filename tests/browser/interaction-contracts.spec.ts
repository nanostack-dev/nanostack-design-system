import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/interaction-contracts.html');
});

test('navigates radio submenus, keeps disabled items inert, and returns keyboard focus', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Sort options' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const submenu = page.getByRole('menuitem', { name: 'Order', exact: true });
  await expect(submenu).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitemradio', { name: 'Newest first' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemradio', { name: 'Restricted' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Order: newest');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemradio', { name: 'Oldest first' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menuitemradio', { name: 'Oldest first' })).toBeChecked();
  await expect(page.getByRole('status')).toHaveText('Order: oldest');
  const popup = page
    .getByRole('menuitemradio', { name: 'Oldest first' })
    .locator('xpath=ancestor::div[contains(@class,"ns-theme")]');
  await expect(popup).toHaveAttribute('data-ns-theme', 'dark');
  await page.keyboard.press('ArrowLeft');
  await expect(submenu).toBeFocused();
  await expect(page.getByRole('menuitemradio')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('uses a trapped mobile dialog and returns focus to its external opener', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open supporting panel' });
  await trigger.click();
  if (page.viewportSize()!.width > 767) {
    await expect(page.getByRole('complementary', { name: 'Supporting detail' })).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    return;
  }
  const panel = page.getByRole('dialog', { name: 'Supporting detail' });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Close panel' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(panel.getByRole('button', { name: 'Panel action' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(panel.getByRole('button', { name: 'Close panel' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
