import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/editor.html');
});

test('types several lines and keeps Tab as a focus move out of the editor', async ({ page }) => {
  const body = page.getByRole('textbox', { name: 'JSON body', exact: true });
  await body.click();
  await page.keyboard.type('first line');
  await page.keyboard.press('Enter');
  await page.keyboard.type('second line');
  await expect(body.locator('.cm-line')).toHaveCount(2);
  await expect
    .poll(() =>
      page.getByRole('status', { name: 'Current value' }).evaluate((node) => node.textContent),
    )
    .toBe('first line\nsecond line');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox', { name: 'Response' })).toBeFocused();
});

test('maintains read-only behavior and accessible viewers, themes and height variants', async ({
  page,
}) => {
  const body = page.getByRole('textbox', { name: 'JSON body', exact: true });
  await body.click();
  await page.keyboard.type('{}');
  await page.getByRole('button', { name: 'Toggle readonly' }).click();
  await expect(body).toHaveAttribute('contenteditable', 'false');
  await expect(body).toHaveAttribute('aria-readonly', 'true');
  await expect(body).toHaveAttribute('aria-multiline', 'true');
  await body.click();
  await page.keyboard.type('ignored');
  await expect(body).toHaveText('{}');
  await expect(page.getByRole('textbox', { name: 'Response' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
  await expect(page.locator('.cm-foldGutter')).toHaveCount(2);
  const textColors: string[] = [];
  for (const scheme of ['light', 'dark']) {
    if (scheme === 'dark') await page.getByRole('button', { name: 'Toggle theme' }).click();
    textColors.push(await body.evaluate((element) => getComputedStyle(element).color));
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
    ).toBe(false);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  expect(textColors[0]).not.toBe(textColors[1]);
  const compactHeight = await body
    .locator('xpath=ancestor::div[@data-slot="code-editor"]')
    .evaluate((element) => element.getBoundingClientRect().height);
  expect(compactHeight).toBeCloseTo(112, 0);
});

test('names an editor from a visible label and focuses it when the label is clicked', async ({
  page,
}) => {
  const path = page.getByRole('textbox', { name: 'Request path', exact: true });
  await page.getByText('Request path', { exact: true }).click();
  await expect(path).toBeFocused();
  await page.keyboard.type('/users');
  await expect(path).toHaveText('/users');
});
