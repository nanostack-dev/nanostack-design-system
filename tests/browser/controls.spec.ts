import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/controls.html');
});

test('supports form input, menu commands and disclosures with shared themes', async ({
  page,
}, testInfo) => {
  const checkbox = page.getByRole('checkbox', { name: 'Notifications' });
  await checkbox.click();
  await expect(checkbox).toBeChecked();
  await page.getByRole('textbox', { name: 'Description' }).fill('Multiline\nnotes');
  await expect(page.getByRole('textbox', { name: 'Description' })).toHaveValue('Multiline\nnotes');

  for (const scheme of ['light', 'dark']) {
    if (scheme === 'dark') await page.getByRole('button', { name: 'Toggle theme' }).click();
    await page.getByRole('button', { name: 'Actions' }).click();
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await expect(menu.locator('xpath=ancestor::div[contains(@class,"ns-theme")]')).toHaveAttribute(
      'data-ns-theme',
      scheme,
    );
    // Base UI's hidden focus sentinels redirect focus; they are not user controls.
    // The keyboard test below checks that focus never remains in those sentinels.
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .exclude('[data-base-ui-focus-guard]')
          .analyze()
      ).violations,
    ).toEqual([]);
    const box = await menu.boundingBox();
    expect(box?.x).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(page.viewportSize()!.width);
    await page.getByRole('menuitem', { name: 'Archive', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Archived');
  }

  await page.getByRole('button', { name: 'Advanced options' }).click();
  await expect(page.getByText('Optional settings are available here.')).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  if (testInfo.project.name !== 'desktop') {
    expect((await checkbox.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    expect(
      await page
        .getByRole('textbox', { name: 'Description' })
        .evaluate((element) => getComputedStyle(element).fontSize),
    ).toBe('16px');
  }
});

test('keeps menu keyboard focus on real controls and returns it on Escape', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Actions' });
  await trigger.focus();
  await trigger.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Archive', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Show metadata' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Advanced options' })).toBeFocused();
});

test('opens a visual tooltip on keyboard focus and dismisses it without moving focus', async ({
  page,
}) => {
  await page.keyboard.press('Tab');
  const trigger = page.getByRole('button', { name: 'Refresh activity' });
  await trigger.focus();
  await expect(page.locator('.ns-tooltip-content')).toHaveText('Refresh activity');
  await page.keyboard.press('Escape');
  await expect(page.locator('.ns-tooltip-content')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
