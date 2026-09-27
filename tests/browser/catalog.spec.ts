import { expect, test, type Page } from '@playwright/test';
import { chooseAppearance, expectFitsAndAccessible } from './site-helpers';

const sections = [
  'Foundations',
  'Forms',
  'Overlays and navigation',
  'Pages and screens',
  'Collections',
  'Editors',
  'Data display',
];
const screenFrames = ['Workspace shell example', 'Centered screen example', 'Split screen example'];
const frameLoadTimeout = 30_000;

async function waitForScreenFrames(page: Page, colorScheme: string) {
  for (const title of screenFrames) {
    const frame = page.frameLocator(`iframe[title="${title}"]`);
    await expect(frame.getByRole('heading', { level: 1 })).toBeVisible({
      timeout: frameLoadTimeout,
    });
    await expect(frame.locator('.ns-theme').first()).toHaveAttribute('data-ns-theme', colorScheme, {
      timeout: frameLoadTimeout,
    });
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/?page=components');
  await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible();
});

test('catalog compositions fit the viewport and remain accessible in both themes', async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const colorScheme of ['light', 'dark']) {
    await chooseAppearance(page, 'Color scheme', colorScheme);
    for (const section of sections) {
      await page.getByRole('tab', { name: section, exact: true }).click();
      await expect(page.getByRole('tabpanel', { name: section })).toBeVisible();
      if (section === 'Pages and screens') await waitForScreenFrames(page, colorScheme);
      await expectFitsAndAccessible(page, `${section}, ${colorScheme}`);
    }
  }
});

test('each section has its own address', async ({ page }) => {
  await page.getByRole('tab', { name: 'Editors', exact: true }).click();
  await expect(page).toHaveURL(/\?page=components&tab=editors$/);
  await page.reload();
  await expect(page.getByRole('tab', { name: 'Editors', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('textbox', { name: 'Example document' })).toBeVisible();
});

test('keyboard navigation, dialog focus and menu choices work with finite themes', async ({
  page,
}) => {
  await chooseAppearance(page, 'Brand', 'echopoint');
  await chooseAppearance(page, 'Density', 'compact');
  await chooseAppearance(page, 'Color scheme', 'dark');
  await page.getByRole('tab', { name: 'Foundations', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Forms', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('ArrowRight');
  await expect(
    page.getByRole('tab', { name: 'Overlays and navigation', exact: true }),
  ).toHaveAttribute('aria-selected', 'true');
  const trigger = page.getByRole('button', { name: 'Open example dialog' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'A composed dialog' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('xpath=ancestor::*[@data-ns-theme][1]')).toHaveAttribute(
    'data-ns-theme',
    'dark',
  );
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

test('confirmation stays busy until the work finishes, then a toast reports it', async ({
  page,
}) => {
  await page.getByRole('tab', { name: 'Overlays and navigation', exact: true }).click();
  const archive = page.getByRole('button', { name: 'Archive record' });
  await archive.click();
  const dialog = page.getByRole('alertdialog', { name: 'Archive this record?' });
  await dialog.getByRole('button', { name: 'Archive', exact: true }).click();
  await expect(dialog.getByRole('button', { name: 'Archive', exact: true })).toHaveAttribute(
    'aria-busy',
    'true',
  );
  await expect(dialog).toBeHidden();
  await expect(page.getByText('Record archived', { exact: true })).toBeVisible();
  await expect(archive).toBeFocused();
});

test('command palette filters, chooses and reports loading', async ({ page }) => {
  await page.getByRole('tab', { name: 'Overlays and navigation', exact: true }).click();
  const input = page.getByRole('combobox', { name: 'Example commands' });
  await input.fill('invite');
  const results = page.getByRole('listbox', { name: 'Example command results' });
  await expect(results.getByRole('option')).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(page.getByText('Chosen: Invite a teammate', { exact: true })).toBeVisible();
  await input.fill('nothing like this');
  await expect(page.getByText('No commands match.')).toBeVisible();
  await page.getByRole('button', { name: 'Show loading state' }).click();
  await expect(page.getByText('Loading commands…')).toBeVisible();
});

test('pinned rows reorder from the keyboard and announce the move', async ({ page }) => {
  await page.getByRole('tab', { name: 'Collections', exact: true }).click();
  const list = page.getByRole('list', { name: 'Pinned pages' });
  await page.getByRole('button', { name: 'Move Overview down' }).click();
  await expect(list.getByRole('link')).toHaveText([
    'Components',
    'Overview',
    'Guidelines',
    'Changelog',
  ]);
  await expect(page.getByText('Overview moved to position 2.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Move Components up' })).toBeDisabled();
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
  await page.getByRole('tab', { name: 'Data display', exact: true }).click();
  await page.getByRole('button', { name: /^Example run 2\b/ }).click();
  await expect(page.getByText('Selected: run_2', { exact: true })).toBeVisible();
});
