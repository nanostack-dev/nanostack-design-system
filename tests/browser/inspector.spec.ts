import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const node = (page: Page) => page.locator('.react-flow__node[data-id="node"]');

async function settledBox(page: Page, selector: string) {
  const locator = page.locator(selector);
  await expect
    .poll(() =>
      locator.evaluate((element) =>
        [element, ...element.querySelectorAll('*')].some((item) =>
          item.getAnimations().some((animation) => animation.playState === 'running'),
        ),
      ),
    )
    .toBe(false);
  let previous = '';
  await expect
    .poll(async () => {
      const current = JSON.stringify(await locator.boundingBox());
      const stable = current === previous;
      previous = current;
      return stable;
    })
    .toBe(true);
  return (await locator.boundingBox())!;
}

function expectRevealed(start: number, size: number, regionStart: number, regionSize: number) {
  const margin = 24;
  expect(start).toBeGreaterThanOrEqual(regionStart);
  if (size <= regionSize - 2 * margin) expect(start + size).toBeLessThanOrEqual(regionStart + regionSize);
  else expect(Math.abs(start - (regionStart + margin))).toBeLessThanOrEqual(1);
}

async function settledNode(page: Page) {
  let previous = '';
  await expect
    .poll(async () => {
      const current = JSON.stringify(await node(page).boundingBox());
      const stable = current === previous;
      previous = current;
      return stable;
    })
    .toBe(true);
  return (await node(page).boundingBox())!;
}

test('side inspector reveals the selected item beside it without trapping the page', async ({
  page,
}) => {
  await page.goto('/tests/browser/fixtures/inspector.html');
  const sidebar = page.getByRole('complementary', { name: 'Side inspector' });
  await expect(sidebar).toBeHidden();
  await page.getByRole('button', { name: 'Open sidebar' }).click();
  await expect(sidebar).toBeVisible();
  const panel = await settledBox(page, '.ns-dock-sidebar[data-open="true"]');
  const item = await settledNode(page);
  const canvas = (await page.locator('.react-flow').boundingBox())!;
  expectRevealed(item.x, item.width, canvas.x, panel.x - canvas.x);
  if ((page.viewportSize()?.width ?? 0) >= 1024) expect(Math.round(panel.width)).toBe(416);
  await page.getByRole('button', { name: 'Canvas action' }).click();
  await expect(page.getByText('Canvas actions: 1')).toBeVisible();
  await sidebar.getByRole('button', { name: 'Close inspector' }).click();
  await expect(sidebar).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('bottom inspector keeps the selected item above the sheet and the canvas usable', async ({
  page,
}) => {
  await page.goto('/tests/browser/fixtures/inspector.html');
  const sheet = page.getByRole('complementary', { name: 'Bottom inspector' });
  await expect(sheet).toBeHidden();
  await page.getByRole('button', { name: 'Open sheet' }).click();
  await expect(sheet).toBeVisible();
  const panel = await settledBox(page, '.ns-dock-sheet');
  const item = await settledNode(page);
  const main = (await page.locator('.ns-dock-main').boundingBox())!;
  const canvas = (await page.locator('.react-flow').boundingBox())!;
  expect(Math.round(panel.height)).toBe(Math.round(main.height * 0.6));
  expectRevealed(item.y, item.height, canvas.y, panel.y - canvas.y);
  await node(page).click();
  await expect(sheet).toBeVisible();
  await page.getByRole('button', { name: 'Canvas action' }).click();
  await expect(page.getByText('Canvas actions: 1')).toBeVisible();
  await sheet.getByRole('button', { name: 'Close inspector' }).click();
  await expect(sheet).toBeHidden();
  await expect(page.locator('.ns-dock-sheet')).toHaveAttribute('inert', '');
});

test('reduced motion shortens the inspector transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/tests/browser/fixtures/inspector.html');
  await expect(page.locator('.ns-dock-sheet')).toHaveCSS('transition-duration', '0.12s, 0s');
});

test('single-selection bar strip is a keyboard radio group with previews', async ({ page }) => {
  await page.goto('/tests/browser/fixtures/inspector.html');
  const strip = page.getByRole('radiogroup', { name: 'Choose a run' });
  const first = strip.getByRole('radio', { name: 'First run' });
  const second = strip.getByRole('radio', { name: 'Second run' });
  const status = page.getByRole('status');
  await expect(first).toHaveAttribute('aria-checked', 'true');
  await second.hover();
  await expect(status).toHaveText('Selected: first; preview: second');
  await page.mouse.move(0, 0);
  await expect(status).toHaveText('Selected: first; preview: none');
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(second).toHaveAttribute('aria-checked', 'true');
  await expect(second).toBeFocused();
  await expect(status).toHaveText('Selected: second; preview: second');
});

for (const theme of ['light', 'dark']) {
  test(`inspector composition is accessible with both panels in ${theme}`, async ({ page }) => {
    await page.goto('/tests/browser/fixtures/inspector.html');
    if (theme === 'dark') await page.getByRole('button', { name: 'Toggle theme' }).click();
    await page.getByRole('button', { name: 'Open sidebar' }).click();
    await settledBox(page, '.ns-dock-sidebar[data-open="true"]');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.getByRole('button', { name: 'Open sheet' }).click();
    await settledBox(page, '.ns-dock-sheet');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });
}
