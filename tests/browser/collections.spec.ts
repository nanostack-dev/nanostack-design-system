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
