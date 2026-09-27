import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** Appearance controls live in the sidebar, which is a drawer on narrow screens. */
export async function chooseAppearance(
  page: Page,
  label: 'Brand' | 'Color scheme' | 'Density',
  value: string,
) {
  const trigger = page.getByRole('button', { name: 'Open navigation' });
  const drawer = await trigger.isVisible();
  if (drawer) await trigger.click();
  await page.getByRole('combobox', { name: label, exact: true }).selectOption(value);
  if (drawer) {
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Site navigation' })).toBeHidden();
  }
}

export async function openPage(page: Page, name: string) {
  const trigger = page.getByRole('button', { name: 'Open navigation' });
  if (await trigger.isVisible()) await trigger.click();
  await page
    .getByRole('navigation', { name: 'Documentation' })
    .getByRole('link', { name, exact: true })
    .click();
}

export async function settle(page: Page) {
  await page.evaluate(async () => {
    const entrances = document
      .getAnimations()
      .filter((animation) => animation.effect?.getTiming().iterations !== Infinity);
    await Promise.all(entrances.map((animation) => animation.finished.catch(() => undefined)));
  });
}

export async function expectFitsAndAccessible(page: Page, context: string) {
  await settle(page);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    `${context}: horizontal page overflow`,
  ).toBe(false);
  const scan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .exclude('[data-base-ui-focus-guard]')
    .analyze();
  expect(scan.violations, context).toEqual([]);
}
