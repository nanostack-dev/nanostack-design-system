import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/polish.html');
});

test('a search input shows its icon inside the field, beside its action', async ({ page }) => {
  const input = page.getByRole('textbox', { name: 'Search variables' });
  const field = (await input.boundingBox())!;
  const icon = (await page.locator('.ns-input-icon svg').boundingBox())!;
  const action = (await page.getByRole('button', { name: 'Add variable' }).boundingBox())!;
  expect(icon.x).toBeGreaterThan(field.x);
  expect(icon.x + icon.width).toBeLessThan(field.x + 32);
  expect(Math.abs(icon.y + icon.height / 2 - (field.y + field.height / 2))).toBeLessThan(2);
  expect(Math.abs(action.y + action.height / 2 - (field.y + field.height / 2))).toBeLessThan(2);
});

test('a select fits its options in a toolbar and fills a form field', async ({ page }) => {
  const toolbar = page.getByRole('combobox', { name: 'Toolbar environment' });
  const form = page.getByRole('combobox', { name: 'Form environment' });
  expect(await toolbar.evaluate((element) => getComputedStyle(element).appearance)).toBe('none');
  expect((await toolbar.boundingBox())!.width).toBeLessThan(200);
  expect((await form.boundingBox())!.width).toBeGreaterThan(300);
});

test('an empty state action keeps a readable width for a definition list', async ({ page }) => {
  const shortcut = page.getByText('⌘ Enter');
  expect((await shortcut.boundingBox())!.height).toBeLessThan(30);
});

test('a report heading scrolls with its report when it is not sticky', async ({ page }) => {
  const position = (name: string) =>
    page.getByText(name).evaluate((element) => getComputedStyle(element).position);
  expect(await position('Pinned heading')).toBe('sticky');
  expect(await position('Scrolling heading')).toBe('static');
});

test('a disclosure trigger reads as a label, not a heading', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Headers' });
  expect(await trigger.evaluate((element) => getComputedStyle(element).fontSize)).toBe('13px');
});

test('a ghost button keeps its resting look after a tap on a touch screen', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Ghost action' });
  const background = () =>
    button.evaluate((element) => getComputedStyle(element).backgroundColor);
  const resting = await background();
  await button.hover();
  const hoverCapable = await page.evaluate(() => matchMedia('(hover: hover)').matches);
  if (hoverCapable) {
    await expect.poll(background).not.toBe(resting);
  } else {
    await button.evaluate(
      (element) => Promise.all(element.getAnimations().map((animation) => animation.finished)),
    );
    expect(await background()).toBe(resting);
  }
});
