import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('presents per-element live state and releases settled animation layers', async ({ page }) => {
  await page.goto('/tests/browser/fixtures/graph-presentation.html');
  const first = page.locator('[data-id="a"] .ns-graph-node-frame');
  await expect(first).toBeVisible();
  const geometry = await first.evaluate((article) => {
    const frame = article as HTMLElement;
    const shell = frame.parentElement!;
    const host = shell.querySelector<HTMLElement>('.ns-graph-node-annotations')!;
    const node = shell.parentElement!;
    return {
      frameWidth: frame.offsetWidth,
      frameHeight: frame.offsetHeight,
      shellWidth: shell.offsetWidth,
      shellHeight: shell.offsetHeight,
      hostWidth: host.offsetWidth,
      hostHeight: host.offsetHeight,
      nodeWidth: node.offsetWidth,
      nodeHeight: node.offsetHeight,
      clip: getComputedStyle(frame).overflow,
      pointerEvents: getComputedStyle(host).pointerEvents,
    };
  });
  expect(geometry.shellWidth).toBe(geometry.frameWidth);
  expect(geometry.shellHeight).toBe(geometry.frameHeight);
  expect(geometry.hostWidth).toBe(geometry.frameWidth);
  expect(geometry.hostHeight).toBe(geometry.frameHeight);
  expect(geometry.nodeWidth).toBe(geometry.frameWidth + 8);
  expect(geometry.nodeHeight).toBe(geometry.frameHeight + 8);
  expect(geometry.clip).toBe('hidden');
  expect(geometry.pointerEvents).toBe('none');
  const position = await page.locator('.react-flow__node[data-id="a"]').getAttribute('style');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(first).toHaveAttribute('data-ns-run-phase', 'running');
  await expect(page.locator('.ns-graph-node-beam')).toHaveCount(1);
  await page.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(first).toHaveAttribute('data-ns-run-phase', 'success');
  await expect(page.locator('.ns-graph-edge-progress')).toHaveAttribute(
    'data-ns-phase',
    'traversed',
  );
  await expect(page.locator('.ns-graph-node-beam')).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator('.ns-graph-canvas')
        .evaluate(
          (element) =>
            element
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === 'running').length,
        ),
    )
    .toBe(0);
  await expect(page.locator('.react-flow__node[data-id="a"]')).toHaveAttribute('style', position!);
  await page.getByRole('button', { name: 'Join finished run' }).click();
  await expect(first).toHaveAttribute('data-ns-run-instant', 'true');
  await expect(page.locator('.ns-graph-edge-comet')).toHaveCount(0);
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});

test('reduced motion keeps live status readable without looping effects', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/tests/browser/fixtures/graph-presentation.html');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.locator('[data-id="a"] .ns-graph-node-frame')).toHaveAttribute(
    'data-ns-run-phase',
    'running',
  );
  await expect(page.locator('.ns-graph-node-beam')).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(page.locator('.ns-graph-edge-progress')).toHaveCSS('animation-name', 'none');
});
