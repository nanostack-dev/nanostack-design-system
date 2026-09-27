import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/workspace-editing.html');
});

async function focusSequence(page: Page, from: string, to: string) {
  await page.getByRole('button', { name: from, exact: true }).focus();
  const names: string[] = [];
  for (let step = 0; step < 12; step++) {
    await page.keyboard.press('Tab');
    const name = await page.evaluate(
      () =>
        document.activeElement?.getAttribute('aria-label') ??
        document.activeElement?.textContent?.trim() ??
        '',
    );
    names.push(name);
    if (name === to) break;
  }
  return names;
}

test('keeps a collapsed split pane out of the tab order until it is restored', async ({ page }) => {
  await page.getByRole('button', { name: 'Show only Alpha primary' }).click();
  const primaryOnly = await focusSequence(page, 'Alpha primary action', 'After splits');
  expect(primaryOnly).not.toContain('Alpha secondary action');
  expect(primaryOnly).toContain('Resize Alpha');

  await page.getByRole('button', { name: 'Show only Alpha secondary' }).click();
  const secondaryOnly = await focusSequence(page, 'Split Alpha', 'After splits');
  expect(secondaryOnly).not.toContain('Alpha primary action');
  expect(secondaryOnly).toContain('Alpha secondary action');

  await page.getByRole('button', { name: 'Split Alpha' }).click();
  const split = await focusSequence(page, 'Split Alpha', 'Alpha secondary action');
  expect(split).toContain('Alpha primary action');
  expect(split.at(-1)).toBe('Alpha secondary action');
});

test('keeps two splits on one page independent, with unique pane ids and library layout keys', async ({
  page,
}) => {
  const duplicates = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  expect(duplicates).toEqual([]);
  for (const name of ['Resize Alpha', 'Resize Beta']) {
    const controlled = await page.getByRole('separator', { name }).getAttribute('aria-controls');
    expect(controlled).toBeTruthy();
    await expect(page.locator(`[id="${controlled}"]`)).toHaveCount(1);
  }
  await page.getByRole('button', { name: 'Show only Alpha primary' }).click();
  await expect(page.getByRole('status', { name: 'Alpha layout' })).toHaveText('100/0');
  await expect(page.getByRole('status', { name: 'Beta layout' })).toHaveText('55/45');
  await expect(page.getByRole('button', { name: 'Beta secondary action' })).toBeVisible();
});

test('navigates the tree by item with arrows, typeahead and one tab stop in both themes', async ({
  page,
}) => {
  const tree = page.getByRole('tree', { name: 'Collections' });
  const item = (name: string) => tree.getByRole('treeitem', { name, exact: true });
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Toggle theme' }).click();
    await page.getByRole('button', { name: 'After tree' }).focus();
    await page.keyboard.press('Shift+Tab');
    const start = theme === 'light' ? 'Billing' : 'Health check';
    await expect(item(start)).toBeFocused();
    if (theme === 'light') {
      await page.keyboard.press('ArrowRight');
      await expect(item('Billing')).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('ArrowRight');
      await expect(item('Invoices')).toBeFocused();
      await expect(item('Invoices')).toHaveAttribute('aria-level', '2');
      await page.keyboard.press('ArrowLeft');
      await expect(item('Billing')).toBeFocused();
      await page.keyboard.press('h');
      await expect(item('Health check')).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(item('Health check')).toHaveAttribute('aria-selected', 'true');
    }
    await expect(tree.locator('[tabindex="0"]')).toHaveCount(1);
    expect(
      (await new AxeBuilder({ page }).include('[data-testid="tree"]').analyze()).violations,
    ).toEqual([]);
  }
});

test('edits inline text from the keyboard and keeps focus on the renamed text', async ({
  page,
}) => {
  const identity = page.getByRole('region', { name: 'Request identity' });
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Toggle theme' }).click();
    expect(
      (await new AxeBuilder({ page }).include('[data-testid="identity"]').analyze()).violations,
    ).toEqual([]);
  }
  await page.getByRole('button', { name: 'Toggle theme' }).focus();
  await page.keyboard.press('Tab');
  await expect(identity.getByRole('button', { name: 'List invoices' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(identity.getByRole('textbox', { name: 'Request name' })).toBeFocused();
  await page.keyboard.press('End');
  await page.keyboard.type(' draft');
  await page.keyboard.press('Escape');
  await expect(identity.getByRole('button', { name: 'List invoices' })).toBeFocused();
  await expect(page.getByRole('status', { name: 'Saved name' })).toHaveText('List invoices');
  await identity.getByRole('button', { name: 'List invoices' }).click();
  await page.keyboard.press('End');
  await page.keyboard.type(' v2');
  await page.keyboard.press('Enter');
  await expect(identity.getByRole('button', { name: 'List invoices v2' })).toBeFocused();
  await expect(page.getByRole('status', { name: 'Saved name' })).toHaveText('List invoices v2');
});
