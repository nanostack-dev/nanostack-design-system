import { expect, test, type Page } from '@playwright/test';

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
