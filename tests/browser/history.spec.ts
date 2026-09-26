import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/history.html');
});
test('virtual rows measure, paginate and preserve a focused row across scrolling', async ({
  page,
}) => {
  const viewport = page.getByRole('region', { name: 'Records' });
  const first = page.getByRole('button', { name: /^Record 0 / });
  await first.focus();
  await expect(first).toBeFocused();
  expect(await page.getByRole('listitem').count()).toBeLessThan(40);
  await viewport.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(page.getByText('Fetches: 1')).toBeVisible();
  await expect(first).toBeFocused();
  await viewport.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(page.getByText('Fetches: 2')).toBeVisible();
  await viewport.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await page.getByRole('button', { name: /^Record 79 / }).click();
  await expect(page.getByText('Selected: 79')).toBeVisible();
});
test('chart keyboard selection and mobile panel focus restore work in both themes', async ({
  page,
  isMobile,
}) => {
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Toggle theme' }).click();
    const bar = page.getByRole('button', { name: 'Slow, 100 milliseconds' });
    await bar.focus();
    await page.keyboard.press('Enter');
    await expect(bar).toHaveAttribute('aria-current', 'true');
    const trigger = page.getByRole('button', { name: 'Open detail' });
    await trigger.click();
    await expect(page.getByText('Selected record slow')).toBeVisible();
    if (isMobile && page.viewportSize()!.width < 768) {
      const dialog = page.getByRole('dialog', { name: 'Details' });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Close detail' })).toBeFocused();
    }
    // Inspect the settled palette and modal scope, not a theme transition frame.
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
          .map((animation) => animation.finished.catch(() => undefined)),
      ),
    );
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .exclude('[data-base-ui-focus-guard]')
          .analyze()
      ).violations,
    ).toEqual([]);
    if (isMobile && page.viewportSize()!.width < 768) {
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
    } else await page.getByRole('button', { name: 'Close detail' }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  }
});
