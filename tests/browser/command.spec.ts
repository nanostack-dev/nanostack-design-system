import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/command.html');
});

test('empty, loading and failed lists have inert accessible status options', async ({ page }) => {
  const input = page.getByRole('combobox', { name: 'Tasks' });
  for (const state of ['empty', 'loading', 'error']) {
    if (state === 'empty') await input.fill('unmatched');
    else
      await page
        .getByRole('button', { name: state === 'loading' ? 'Loading' : 'Error', exact: true })
        .click();
    const status = page.getByRole('option');
    await expect(status).toHaveCount(1);
    await expect(status).toHaveAttribute('aria-disabled', 'true');
    await expect(status).toHaveAttribute('aria-selected', 'false');
    await input.focus();
    await input.press('ArrowDown');
    await input.press('Enter');
    await expect(page.getByRole('status')).toHaveText('Nothing selected');
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
  }
});

test('collapsed suggestions cannot activate hidden items and expand again with the keyboard', async ({
  page,
}) => {
  const input = page.getByRole('combobox', { name: 'Tasks' });
  await input.focus();
  await input.press('ArrowDown');
  await input.press('Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).not.toHaveAttribute('aria-activedescendant');
  const listId = await input.getAttribute('aria-controls');
  await expect(page.locator(`[id="${listId}"]`)).toHaveCount(1);
  await expect(page.locator(`[id="${listId}"]`)).toBeHidden();
  await input.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Nothing selected');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  await input.press('ArrowDown');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await input.press('Enter');
  await expect(page.getByRole('status')).not.toHaveText('Nothing selected');
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(input).toBeDisabled();
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});

test('tag suggestions preserve valid closed, empty, loading and selected states', async ({
  page,
}) => {
  const input = page.getByRole('combobox', { name: 'Tags', exact: true });
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  const listId = await input.getAttribute('aria-controls');
  const list = page.locator(`[id="${listId}"]`);
  await expect(list).toHaveCount(1);
  await expect(list).toBeHidden();
  await input.fill('operations');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(list.getByRole('option', { name: 'operations' })).toBeVisible();
  await input.press('Enter');
  await expect(page.getByRole('button', { name: 'Remove operations' })).toBeVisible();
  await input.fill('unmatched');
  const empty = list.getByRole('option', { name: 'No matching tags.' });
  await expect(empty).toHaveAttribute('aria-disabled', 'true');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(page.getByRole('button', { name: /^Remove / })).toHaveCount(1);
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  await input.press('Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await input.fill('payments');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(list.getByRole('option', { name: 'payments' })).toBeVisible();
  await input.fill('unmatched');
  await page.getByRole('button', { name: 'Loading', exact: true }).click();
  await input.focus();
  await expect(list.getByRole('option', { name: 'Loading tags...' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(input).toBeDisabled();
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(list).toBeHidden();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});
