import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/editor.html');
});

test('types, completes variables with Tab and keeps Tab as a focus move when no completion exists', async ({
  page,
}) => {
  const input = page.getByRole('textbox', { name: 'URL', exact: true });
  await input.fill('{{ho');
  await expect(page.getByRole('option', { name: /host/ })).toBeVisible();
  await input.press('Tab');
  await expect(page.getByRole('status', { name: 'Current value' })).toHaveText('{{host}}');
  await expect(input).toBeFocused();
  await input.press('Tab');
  await expect(page.getByRole('textbox', { name: 'JSON body', exact: true })).toBeFocused();
  await expect(input.locator('.cm-variable-resolved')).toHaveText('{{host}}');
});

test('maintains read-only behavior and accessible viewers, themes and height variants', async ({
  page,
}, testInfo) => {
  const input = page.getByRole('textbox', { name: 'URL', exact: true });
  await input.fill('https://example.com');
  await page.getByRole('button', { name: 'Toggle readonly' }).click();
  await expect(input).toHaveAttribute('contenteditable', 'false');
  await expect(input).toHaveAttribute('aria-readonly', 'true');
  await input.click();
  await page.keyboard.type('ignored');
  await expect(input).toHaveText('https://example.com');
  await expect(page.getByRole('textbox', { name: 'Response' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
  await expect(page.locator('.cm-foldGutter')).toHaveCount(1);
  for (const scheme of ['light', 'dark']) {
    if (scheme === 'dark') await page.getByRole('button', { name: 'Toggle theme' }).click();
    await expect(page.locator('.ns-editor-popovers').first().locator('..')).toHaveAttribute(
      'data-ns-theme',
      scheme,
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
    ).toBe(false);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  const inputHeight = await input
    .locator('xpath=ancestor::div[@data-slot="code-editor"]')
    .evaluate((element) => element.getBoundingClientRect().height);
  expect(inputHeight).toBeGreaterThanOrEqual(testInfo.project.name === 'desktop' ? 36 : 44);
});

test('accepts a narrowed variable completion with Tab typed right after the last character', async ({
  page,
}) => {
  const input = page.getByRole('textbox', { name: 'URL', exact: true });
  await input.click();
  await page.keyboard.type('{{');
  await expect(page.getByRole('option', { name: /host/ })).toBeVisible();
  await page.keyboard.type('ho');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('status', { name: 'Current value' })).toHaveText('{{host}}');
  await expect(input).toBeFocused();
});

test('keeps the single-line input on one line through Enter variants and paste', async ({
  page,
}) => {
  const input = page.getByRole('textbox', { name: 'URL', exact: true });
  await input.click();
  await page.keyboard.type('https://api');
  await page.keyboard.press('Shift+Enter');
  await page.keyboard.press('ControlOrMeta+Enter');
  await input.evaluate((element) => {
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', '.example.com/users\n');
    element.dispatchEvent(
      new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }),
    );
  });
  await expect(page.getByRole('status', { name: 'Current value' })).toHaveText(
    'https://api.example.com/users',
  );
  await expect(input.locator('.cm-line')).toHaveCount(1);
});

test('lets a wheel over a single-line input scroll its pane', async ({ page }) => {
  const region = page.getByRole('region', { name: 'Request form' });
  const input = region.getByRole('textbox', { name: 'Scrolling URL' });
  await region.scrollIntoViewIfNeeded();
  const box = (await input.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 160);
  await expect.poll(() => region.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
});
