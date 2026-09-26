import { test, expect, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function expectUnclipped(telemetry: Locator) {
  await telemetry.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      telemetry.evaluate(
        (element) =>
          new Promise<number>((resolve) => {
            const observer = new IntersectionObserver(([entry]) => {
              observer.disconnect();
              resolve(entry?.intersectionRatio ?? 0);
            });
            observer.observe(element);
          }),
      ),
    )
    .toBe(1);
}

test('keeps completed node details readable and stops kind motion in both themes', async ({
  page,
}) => {
  await page.goto('/tests/browser/fixtures/node-presentation.html');
  const icon = page.locator('.ns-node-kind-chip .ns-icon');
  await expect(icon).toHaveCSS('animation-name', 'ns-node-kind-tick');
  const telemetry = page.locator('.ns-node-telemetry');
  await expectUnclipped(telemetry);
  await page.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(icon).toHaveCSS('animation-name', 'none');
  await expect(page.getByRole('img', { name: 'Attempts: 3 of 4' })).toBeVisible();
  await expect(page.getByText('(taken)')).toBeAttached();
  for (const dark of [false, true]) {
    if (dark) await page.getByRole('button', { name: 'Toggle theme' }).click();
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
          .map((animation) => animation.finished.catch(() => {})),
      ),
    );
    await expectUnclipped(telemetry);
    const frameBounds = await page.locator('.ns-graph-node-frame').boundingBox();
    const telemetryBounds = await telemetry.boundingBox();
    expect(telemetryBounds!.y).toBeGreaterThanOrEqual(frameBounds!.y + frameBounds!.height);
    for (const selector of ['.ns-graph-node-shell', '.ns-graph-node-annotations']) {
      const bounds = await page.locator(selector).boundingBox();
      expect(bounds!.x).toBe(frameBounds!.x);
      expect(bounds!.width).toBe(frameBounds!.width);
    }
    const colors = await telemetry.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        accent: styles.getPropertyValue('--ns-node-accent').trim(),
        tint: styles.getPropertyValue('--ns-node-tint').trim(),
        expectedAccent: styles.getPropertyValue('--ns-warning').trim(),
        expectedTint: styles.getPropertyValue('--ns-warning-soft').trim(),
      };
    });
    expect(colors.accent).not.toBe('');
    expect(colors.accent).toBe(colors.expectedAccent);
    expect(colors.tint).toBe(colors.expectedTint);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  }
});

test('keeps duration information while reducing repeating motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/tests/browser/fixtures/node-presentation.html');
  await expect(page.locator('.ns-node-kind-chip .ns-icon')).toHaveCSS('animation-name', 'none');
  await expect(page.getByRole('progressbar', { name: 'Duration' })).not.toHaveAttribute(
    'aria-valuenow',
  );
  await expect(page.locator('.ns-node-meter-fill')).toHaveCSS(
    'animation-timing-function',
    'steps(10)',
  );
});
