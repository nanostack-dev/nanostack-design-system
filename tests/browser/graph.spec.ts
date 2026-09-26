import { expect, test, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function center(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Graph target has no geometry');
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}
async function drag(page: Page, start: { x: number; y: number }, end: { x: number; y: number }) {
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 20 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/graph.html');
  await expect(page.locator('.react-flow__node')).toHaveCount(2);
  await expect(page.locator('.react-flow__node').first()).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
});

test('connects, reconnects on the real anchor, preserves pins and moves nodes', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop',
    'Precise mouse gesture contract; touch layout is checked separately.',
  );
  const source = page.locator('[data-handleid="band-right-a"]');
  const target = page.locator('[data-id="b"]');
  await drag(page, await center(source), await center(target));
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);
  await expect(page.getByText('Connected', { exact: true }).last()).toBeVisible();
  const path = page.locator('.ns-graph-edge-path');
  const before = await path.getAttribute('d');
  const sourceNode = page.locator('[data-id="a"] .ns-graph-node-header');
  const start = await center(sourceNode);
  await drag(page, start, { x: start.x + 30, y: start.y - 35 });
  await expect(path).not.toHaveAttribute('d', before!);
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);
  const anchor = page.locator('.react-flow__edgeupdater-target');
  const point = await center(anchor);
  expect(
    await page.evaluate(
      ({ x, y }) =>
        document.elementFromPoint(x, y)?.classList.contains('react-flow__edgeupdater-target'),
      point,
    ),
  ).toBe(true);
  const targetBox = await target.boundingBox();
  await drag(page, point, { x: targetBox!.x + targetBox!.width / 2, y: targetBox!.y + 2 });
  await expect(page.getByRole('status')).toHaveText('Reconnected');
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);
  await expect(page.locator('g[data-ns-settling]')).toHaveAttribute('data-ns-settling', 'false');
  const pathAfterReconnect = await path.getAttribute('d');
  await page.getByRole('button', { name: 'Toggle theme' }).click();
  await expect(path).toHaveAttribute('d', pathAfterReconnect!);
});

test('supports keyboard node activation, readonly geometry and both theme layouts', async ({
  page,
}) => {
  const node = page.locator('.react-flow__node[data-id="a"]');
  await node.focus();
  await node.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Opened a');
  const action = page.getByRole('button', { name: 'Node action' });
  await action.focus();
  await action.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Action');
  const beforeControlDrag = await node.evaluate((element) => element.style.transform);
  const point = await center(action);
  await drag(page, point, { x: point.x + 20, y: point.y + 20 });
  await expect
    .poll(() => node.evaluate((element) => element.style.transform))
    .toBe(beforeControlDrag);
  await page.getByRole('button', { name: 'Toggle readonly' }).click();
  await expect(page.locator('[data-handleid="band-right-a"]')).toHaveAttribute(
    'data-inert',
    'true',
  );
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Toggle theme' }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    await expect(page.getByRole('button', { name: 'Fit to view', exact: true })).toBeVisible();
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
          .map((animation) => animation.finished.catch(() => undefined)),
      ),
    );
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});

test('the uncontrolled canvas retains drawn border pins through reconnect', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Precise mouse gesture is covered on desktop.');
  await page.goto('/tests/browser/fixtures/graph.html?uncontrolled');
  const source = page.locator('[data-handleid="band-top-a"]');
  const target = page.locator('[data-id="b"]');
  await expect(source).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
  const sourceBox = await page.locator('[data-id="a"]').boundingBox();
  const targetBefore = await target.boundingBox();
  const top = await center(source);
  const bottom = await center(page.locator('[data-handleid="band-bottom-b"]'));
  await drag(page, top, bottom);
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);
  await expect(page.locator('g[data-ns-settling]')).toHaveAttribute('data-ns-settling', 'false');
  async function endpoints() {
    return page.locator('.ns-graph-edge-path').evaluate((path: SVGPathElement) => {
      const matrix = path.getScreenCTM()!;
      const screen = (point: DOMPoint) => ({
        x: point.x * matrix.a + point.y * matrix.c + matrix.e,
        y: point.x * matrix.b + point.y * matrix.d + matrix.f,
      });
      return {
        start: screen(path.getPointAtLength(0)),
        end: screen(path.getPointAtLength(path.getTotalLength())),
      };
    });
  }
  const first = await endpoints();
  expect(Math.abs(first.start.x - top.x)).toBeLessThan(3);
  expect(Math.abs(first.start.y - sourceBox!.y)).toBeLessThan(3);
  expect(Math.abs(first.end.x - bottom.x)).toBeLessThan(3);
  expect(Math.abs(first.end.y - (targetBefore!.y + targetBefore!.height))).toBeLessThan(3);
  const targetBox = await target.boundingBox();
  await drag(page, await center(page.locator('.react-flow__edgeupdater-target')), {
    x: targetBox!.x + 2,
    y: targetBox!.y + targetBox!.height / 2,
  });
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);
  await expect(page.locator('g[data-ns-settling]')).toHaveAttribute('data-ns-settling', 'false');
  const after = await endpoints();
  expect(Math.abs(after.start.x - first.start.x)).toBeLessThan(3);
  expect(Math.abs(after.start.y - first.start.y)).toBeLessThan(3);
  expect(Math.abs(after.end.x - targetBox!.x)).toBeLessThan(8);
  expect(Math.abs(after.end.y - (targetBox!.y + targetBox!.height / 2))).toBeLessThan(3);
});
