import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/collections.html');
});
test('navigation reserves detail space and content selectors compose inline', async ({ page }) => {
  const navigation = (await page.getByTestId('navigation-track').boundingBox())!;
  const detail = (await page.getByTestId('detail-track').boundingBox())!;
  if (page.viewportSize()!.width >= 768) {
    expect(navigation.width).toBeLessThan(detail.width);
    expect(navigation.y).toBe(detail.y);
  } else {
    expect(detail.y).toBeGreaterThan(navigation.y);
  }
  const environment = (await page
    .getByRole('combobox', { name: 'Toolbar environment' })
    .boundingBox())!;
  const runner = (await page.getByRole('combobox', { name: 'Toolbar runner' }).boundingBox())!;
  expect(environment.y).toBe(runner.y);
  expect(runner.x).toBeGreaterThan(environment.x + environment.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
test('suggestion keyboard selection and free-text values survive blur', async ({ page }) => {
  const input = page.getByRole('combobox', { name: 'Environment', exact: true });
  await input.fill('stag');
  await expect(page.getByRole('option', { name: 'staging', exact: true })).toBeVisible();
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(input).toHaveValue('staging');
  await input.fill('future-region');
  await input.press('Tab');
  await expect(input).toHaveValue('future-region');
});
test('data displays and popovers fit both themes with accessible names', async ({ page }) => {
  for (const scheme of ['light', 'dark']) {
    if (scheme === 'dark') await page.getByRole('button', { name: 'Toggle theme' }).click();
    const trigger = page.getByRole('button', { name: 'Inspect capacity' });
    await trigger.click();
    // Contrast scans must sample the settled theme, not a color transition.
    await trigger.evaluate(async (element) => {
      void getComputedStyle(element).backgroundColor;
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });
    const popup = page.getByRole('dialog', { name: 'Workers' });
    await expect(popup).toBeVisible();
    const bounds = (await popup.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .exclude('[data-base-ui-focus-guard]')
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  }
});
test('server-paged table selection follows row IDs across pages', async ({ page }) => {
  const table = page.getByRole('table', { name: 'Server runs' });
  await table.getByRole('checkbox', { name: 'Select Run 1' }).click();
  await expect(page.getByText('Selected runs: run-1')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  const sixth = table.getByRole('checkbox', { name: 'Select Run 6' });
  const sixthRow = table.getByRole('row', { name: /Run 6/ });
  await expect(sixth).not.toBeChecked();
  await expect(sixthRow).toHaveAttribute('aria-selected', 'false');
  await expect(page.getByText('1 of 42 selected')).toBeVisible();
  const unselectedBackground = await sixthRow.evaluate(
    (row) => getComputedStyle(row).backgroundColor,
  );
  await sixth.press('Space');
  await expect(sixth).toBeChecked();
  await expect(sixthRow).toHaveAttribute('aria-selected', 'true');
  await expect
    .poll(() => sixthRow.evaluate((row) => getComputedStyle(row).backgroundColor))
    .not.toBe(unselectedBackground);
  await expect(page.getByText('Selected runs: run-1, run-6')).toBeVisible();
  await expect(page.getByText('2 of 42 selected')).toBeVisible();
  await page.getByRole('button', { name: 'Previous' }).click();
  await expect(table.getByRole('checkbox', { name: 'Select Run 1' })).toBeChecked();
  await expect(table.getByRole('checkbox', { name: 'Select Run 2' })).not.toBeChecked();
});
test('a failed page stops requesting until Retry and keeps focus in the list', async ({ page }) => {
  const list = page.getByRole('region', { name: 'Deliveries' });
  await expect(list.getByText('Deliveries could not be loaded.')).toBeVisible();
  // A failed request must not be resent on its own; give a retry loop time to show.
  await page.waitForTimeout(500);
  await expect(page.getByText('Delivery requests: 1')).toBeVisible();
  await page.getByRole('button', { name: 'Restore network' }).click();
  await list.getByRole('button', { name: 'Retry' }).focus();
  await page.keyboard.press('Enter');
  await expect(list).toBeFocused();
  await list.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(list.getByText('Delivery 11')).toBeVisible();
  await expect(page.getByText('Delivery requests: 3')).toBeVisible();
  await expect(list.getByRole('button', { name: 'Retry' })).toHaveCount(0);
});
