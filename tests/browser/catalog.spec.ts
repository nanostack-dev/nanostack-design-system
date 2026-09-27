import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const sections = ['Foundations', 'Controls', 'Collections', 'Editors', 'History'];

test.beforeEach(async ({ page }) => {
  await page.goto('/?catalog');
  await expect(page.getByRole('heading', { name: 'The block catalog' })).toBeVisible();
});

test('catalog compositions fit the viewport and remain accessible in both themes', async ({
  page,
}) => {
  for (const colorScheme of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Color scheme' }).selectOption(colorScheme);
    for (const section of sections) {
      await page.getByRole('tab', { name: section, exact: true }).click();
      await expect(page.getByRole('tabpanel', { name: section })).toBeVisible();
      await page.getByRole('tabpanel', { name: section }).evaluate(async (element) => {
        const entrances = element.getAnimations({ subtree: true }).filter(
          (animation) => animation.effect?.getTiming().iterations !== Infinity,
        );
        await Promise.all(entrances.map((animation) => animation.finished.catch(() => undefined)));
      });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        `${section}, ${colorScheme}: horizontal page overflow`,
      ).toBe(false);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .exclude('[data-base-ui-focus-guard]')
        .analyze();
      expect(result.violations, `${section}, ${colorScheme}`).toEqual([]);
    }
  }
});

test('keyboard navigation, dialog focus and menu choices work with finite themes', async ({
  page,
}) => {
  await page.getByRole('combobox', { name: 'Brand', exact: true }).selectOption('echopoint');
  await page.getByRole('combobox', { name: 'Density', exact: true }).selectOption('compact');
  await page.getByRole('combobox', { name: 'Color scheme' }).selectOption('dark');
  await page.getByRole('tab', { name: 'Foundations', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Controls', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  const trigger = page.getByRole('button', { name: 'Open example dialog' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'A composed dialog' });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Example name' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  const menu = page.getByRole('button', { name: 'Example menu' });
  await menu.focus();
  await page.keyboard.press('ArrowDown');
  const normalPriority = page.getByRole('menuitemradio', { name: 'Normal priority' });
  const highPriority = page.getByRole('menuitemradio', { name: 'High priority' });
  await expect(normalPriority).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(highPriority).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(highPriority).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(highPriority).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
});

test('composed table, editor and history examples retain local behavior', async ({ page }) => {
  await page.getByRole('tab', { name: 'Collections', exact: true }).click();
  const table = page.getByRole('table', { name: 'Example records' });
  await expect(table.getByRole('row')).toHaveCount(4);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(table.getByRole('row')).toHaveCount(3);
  await page.getByRole('textbox', { name: 'Search example records' }).fill('Payment');
  await expect(table.getByText('Payment confirmation')).toBeVisible();
  await page.getByRole('tab', { name: 'Editors', exact: true }).click();
  const editor = page.getByRole('textbox', { name: 'Example document' });
  await editor.click();
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Unsaved preview changes', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Check example', exact: true }).click();
  await expect(page.getByText('Valid', { exact: true })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Example result' })).toContainText('"fields": 3');
  await page.getByRole('button', { name: 'payload.json', exact: true }).click();
  await page.getByRole('textbox', { name: 'Document name' }).fill('event.json');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'event.json', exact: true })).toBeFocused();
  await page.getByRole('tab', { name: 'History', exact: true }).click();
  await page.getByRole('button', { name: /^Example run 2\b/ }).click();
  await expect(page.getByText('Selected: run_2', { exact: true })).toBeVisible();
});
