import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const theme of ['light', 'dark']) {
  test(`capacity tiles preserve keyboard access and fit the viewport in ${theme}`, async ({
    page,
  }) => {
    await page.goto(`/tests/browser/fixtures/fleet-blocks.html${theme === 'dark' ? '?dark' : ''}`);
    const tile = page.getByRole('button', { name: 'Worker idle', exact: true });
    await expect(tile).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(tile).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(tile).toHaveAttribute('aria-expanded', 'true');
    await expect(tile).toHaveAttribute('data-ns-selected', 'true');
    await expect(page.locator('.ns-worker-pebble').last()).toHaveAttribute(
      'data-ns-state',
      'alarmed',
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await expect
      .poll(() =>
        tile.evaluate(
          (element) =>
            element.getAnimations().filter((animation) => animation.playState === 'running').length,
        ),
      )
      .toBe(0);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
}

test('reduced motion leaves capacity and health visible without animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/tests/browser/fixtures/fleet-blocks.html');
  await expect(page.locator('.ns-worker-pebble-wave').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.ns-resource-tile').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.ns-worker-pebble').nth(2)).toHaveAttribute(
    'data-ns-state',
    'staling',
  );
  await expect(page.getByText('3/3', { exact: true })).toBeVisible();
});
