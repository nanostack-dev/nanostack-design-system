import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const theme of ['light', 'dark']) {
  test(`${theme} workspace is accessible and fits the viewport`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Good parts. Better together.' })).toBeVisible();
    if (theme === 'dark') await page.getByRole('button', { name: 'Toggle color scheme' }).click();
    await expect(page.locator('.ns-theme').first()).toHaveAttribute('data-ns-theme', theme);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(scan.violations).toEqual([]);
    await page.screenshot({
      path: `.ui-craft/screenshots/library-${testInfo.project.name}-${theme}.png`,
      fullPage: true,
    });
    await page.getByRole('tab', { name: 'Controls & states' }).click();
    await expect(page.getByLabel('Endpoint URL')).toBeVisible();
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    await page.getByRole('button', { name: 'Try a dialog' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('xpath=..')).toHaveAttribute('data-ns-theme', theme);
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Try a dialog' })).toBeFocused();
    expect(errors).toEqual([]);
  });
}

test('keyboard tabs and navigation stay usable', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Blocks', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Controls & states' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  if (testInfo.project.name === 'mobile') {
    const open = page.getByRole('button', { name: 'Open navigation' });
    await open.click();
    await expect(page.getByRole('dialog', { name: 'Workspace navigation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Principles', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Principles', exact: true }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByRole('tab', { name: 'Principles', exact: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await open.click();
    await page.keyboard.press('Escape');
    await expect(open).toBeFocused();
  }
  await page.getByRole('button', { name: 'Change brand' }).click();
  await expect(page.locator('.ns-theme').first()).toHaveAttribute('data-ns-brand', 'anchor');
  await page.getByRole('button', { name: 'Toggle density' }).click();
  await expect(page.locator('.ns-theme').first()).toHaveAttribute('data-ns-density', 'compact');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('mobile navigation stays closed after returning from a desktop viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Open navigation' });
  const drawer = page.getByRole('dialog', { name: 'Workspace navigation' });
  await trigger.click();
  await expect(drawer).toBeVisible();

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(trigger).not.toBeVisible();
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Design system' })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(trigger).toBeVisible();
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Design system' })).not.toBeVisible();
  await trigger.click();
  await expect(drawer).toBeVisible();
});

test('touch controls retain their target size across size variants', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'desktop', 'Coarse pointer contract');
  await page.goto('/');
  expect(
    await page
      .getByRole('button', { name: 'Toggle color scheme' })
      .evaluate((node) => node.getBoundingClientRect().height),
  ).toBeGreaterThanOrEqual(44);
  await page.getByRole('tab', { name: 'Controls & states' }).click();
  const input = page.getByLabel('Endpoint URL');
  expect(
    await input.evaluate((node) => node.getBoundingClientRect().height),
  ).toBeGreaterThanOrEqual(44);
  expect(
    await input.evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
  ).toBeGreaterThanOrEqual(16);
});
