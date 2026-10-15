import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const review = process.argv.includes('--review');
const baseline = process.argv.includes('--baseline');
const external = process.env.MOTION_STORYBOOK_URL;
const directory = resolve(process.env.MOTION_OUTPUT ?? '.ui-craft/motion-review');
const site = resolve('site');
const profiles = {
  mobile: { width: 392, height: 850 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
let server;
if (!external) {
  server = createServer(async (request, response) => {
    try {
      const path = resolve(
        site,
        '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname),
      );
      if (path !== site && !path.startsWith(site + sep)) {
        response.writeHead(403).end();
        return;
      }
      const file = path === site ? resolve(site, 'index.html') : path;
      const body = await readFile(file);
      response
        .writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' })
        .end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
}
const url = external ?? `http://127.0.0.1:${server.address().port}`;
await mkdir(directory, { recursive: true });
let browser;
const results = [];
function sourceFingerprint() {
  const paths = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], {
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean)
    .sort();
  const hash = createHash('sha256');
  for (const path of paths) {
    hash.update(path + '\0');
    hash.update(readFileSync(path));
  }
  return hash.digest('hex');
}
const testedFingerprint = sourceFingerprint();
async function style(locator, property) {
  return locator.evaluate((element, name) => getComputedStyle(element)[name], property);
}
async function expectStyle(locator, property, expected, id) {
  await locator
    .page()
    .waitForFunction(
      ([element, name, value]) => getComputedStyle(element)[name] === value,
      [await locator.elementHandle(), property, expected],
      { timeout: 5000 },
    );
  assert.equal(await style(locator, property), expected, id);
}
async function settle(locator) {
  await locator
    .page()
    .waitForFunction(
      (element) =>
        !element.hasAttribute('data-starting-style') &&
        !element.hasAttribute('data-ending-style') &&
        getComputedStyle(element).opacity === '1',
      await locator.elementHandle(),
      { timeout: 5000 },
    );
  await locator.evaluate(async (element) => {
    await Promise.all(
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
}
try {
  browser = await chromium.launch({ headless: true });
  for (const [profile, viewport] of Object.entries(profiles))
    for (const theme of ['light', 'dark'])
      for (const reducedMotion of baseline ? ['no-preference'] : ['no-preference', 'reduce']) {
        const id = `${profile}-${theme}-${reducedMotion}`;
        const record = review && theme === 'dark' && reducedMotion === 'no-preference';
        const context = await browser.newContext({
          viewport,
          isMobile: profile === 'mobile',
          hasTouch: profile !== 'desktop',
          colorScheme: theme,
          reducedMotion,
          ...(record ? { recordVideo: { dir: directory, size: viewport } } : {}),
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        const budget = reducedMotion === 'reduce' ? '0.12s' : '0.24s';
        const checkpoint = async (name, locator) => {
          await settle(locator);
          if (review) await page.waitForTimeout(record ? 1000 : 120); // Review-only reading/paint hold, after correctness assertions.
          if (review)
            await page.screenshot({
              path: resolve(directory, `${baseline ? 'before' : 'after'}-${id}-${name}.png`),
            });
        };
        try {
          await page.goto(
            `${url}/iframe.html?id=foundations-motion--showcase&viewMode=story&globals=theme:${theme}`,
          );
          const trigger = page.getByRole('button', { name: 'Review settings', exact: true });
          await trigger.waitFor({ state: 'visible' });
          assert.equal(
            await page.getByRole('button', { name: 'Unavailable action' }).isDisabled(),
            true,
          );
          await trigger.click();
          let dialog = page.getByRole('dialog', { name: 'Workspace settings', exact: true });
          await dialog.waitFor({ state: 'visible' });
          if (!baseline) {
            await expectStyle(dialog, 'transitionDuration', budget, id);
            assert.equal(
              await style(dialog, 'transitionProperty'),
              reducedMotion === 'reduce' ? 'opacity' : 'opacity, scale',
              id,
            );
            await expectStyle(dialog, 'animationName', 'none', id);
          }
          await checkpoint('dialog', dialog);
          const bounds = await dialog.boundingBox();
          assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= viewport.width + 1, id);
          await page.keyboard.press('Escape');
          await dialog.waitFor({ state: 'detached' });
          assert.equal(
            await trigger.evaluate((element) => element === document.activeElement),
            true,
            id,
          );
          await trigger.press('Enter');
          await dialog.waitFor({ state: 'visible' });
          if (!baseline) {
            await expectStyle(dialog, 'transitionDuration', '0s', id);
            assert.equal(await dialog.evaluate((element) => element.getAnimations().length), 0, id);
          }
          await page.keyboard.press('Escape');
          await dialog.waitFor({ state: 'detached' });
          for (const [button, title] of [
            ['Open sheet', 'Project details'],
            ['Open drawer', 'Daily summary'],
          ]) {
            await page.getByRole('button', { name: button, exact: true }).click();
            dialog = page.getByRole('dialog', { name: title, exact: true });
            await dialog.waitFor({ state: 'visible' });
            if (!baseline) await expectStyle(dialog, 'transitionDuration', budget, id);
            await checkpoint(button === 'Open sheet' ? 'sheet' : 'drawer', dialog);
            await page.keyboard.press('Escape');
            await dialog.waitFor({ state: 'detached' });
          }
          await page.getByRole('button', { name: 'Project actions', exact: true }).click();
          const menu = page.getByRole('menu');
          await menu.waitFor({ state: 'visible' });
          if (!baseline)
            await expectStyle(
              menu,
              'transitionDuration',
              reducedMotion === 'reduce' ? '0.12s' : '0.18s',
              id,
            );
          await checkpoint('menu', menu);
          await page.keyboard.press('Escape');
          await menu.waitFor({ state: 'detached' });
          const disclosure = page.getByRole('button', { name: 'Advanced settings', exact: true });
          for (let i = 0; i < 3; i++) {
            await disclosure.click();
            assert.equal(await disclosure.getAttribute('aria-expanded'), 'true');
            await disclosure.click();
            assert.equal(await disclosure.getAttribute('aria-expanded'), 'false');
          }
          await disclosure.click();
          await page
            .getByText('Optional configuration is ready as soon as the section opens.')
            .waitFor({ state: 'visible' });
          const toggle = page.getByRole('switch', { name: 'Email notifications' });
          await toggle.click();
          assert.equal(await toggle.isChecked(), true);
          await toggle.press('Space');
          assert.equal(await toggle.isChecked(), false);
          if (!baseline) await expectStyle(toggle, 'transitionDuration', '0s', id);
          const tab = page.getByRole('tab', { name: 'Headers', exact: true });
          await tab.click();
          assert.equal(await tab.getAttribute('aria-selected'), 'true');
          await page
            .getByText('Response headers are available immediately.')
            .waitFor({ state: 'visible' });
          if (!baseline) await expectStyle(tab, 'transitionProperty', 'none', id);
          await page.getByRole('button', { name: 'Save settings', exact: true }).click();
          const toast = page.locator('[data-slot="toast"]');
          await toast.waitFor({ state: 'visible' });
          if (!baseline)
            await expectStyle(
              toast,
              'transitionDuration',
              reducedMotion === 'reduce' ? '0.12s' : '0.18s',
              id,
            );
          await checkpoint('toast', toast);
          await toast.hover();
          await toast.getByRole('button', { name: 'Close toast' }).click();
          await toast.waitFor({ state: 'detached' });
          await page.getByRole('button', { name: 'Search commands', exact: true }).click();
          const palette = page.getByRole('dialog', { name: 'Search workspace' });
          await palette.waitFor({ state: 'visible' });
          await expectStyle(palette, 'transitionDuration', '0s', id);
          await page.keyboard.press('Escape');
          await palette.waitFor({ state: 'detached' });
          assert.deepEqual(errors, [], id);
          await checkpoint('showcase', trigger);
          await page.goto(
            `${url}/iframe.html?id=foundations-motion--showcase&viewMode=story&globals=theme:${theme}&args=worstCase:true`,
          );
          await page.getByRole('button', { name: 'Review settings', exact: true }).click();
          const longDialog = page.getByRole('dialog', { name: 'Workspace settings', exact: true });
          await longDialog.waitFor({ state: 'visible' });
          await settle(longDialog);
          const geometry = await longDialog
            .locator('[data-slot="dialog-body"]')
            .evaluate((element) => ({
              width: element.clientWidth,
              scrollWidth: element.scrollWidth,
              height: element.clientHeight,
              scrollHeight: element.scrollHeight,
            }));
          assert.ok(geometry.scrollWidth <= geometry.width + 1, id);
          assert.ok(geometry.scrollHeight > geometry.height, id);
          await checkpoint('worst-case', longDialog);
          await page.keyboard.press('Escape');
          await longDialog.waitFor({ state: 'detached' });
          assert.deepEqual(errors, [], id);

          if (!baseline) {
            await page.goto(
              `${url}/iframe.html?id=foundations-motion--sidebar-showcase&viewMode=story&globals=theme:${theme}`,
            );
            await page
              .getByRole('heading', { name: 'Navigation stays immediate' })
              .waitFor({ state: 'visible' });
            const sidebarTrigger = page.getByRole('button', { name: 'Toggle Sidebar' });
            await sidebarTrigger.click();
            const mobileSidebar = viewport.width < 768;
            const navButton = page.getByRole('button', { name: 'Home', exact: true });
            await navButton.waitFor({ state: 'visible' });
            await expectStyle(navButton, 'transitionProperty', 'none', id);
            if (mobileSidebar) {
              const sidebar = page.getByRole('dialog', { name: 'Sidebar', exact: true });
              await sidebar.waitFor({ state: 'visible' });
              const backdrop = page.locator('[data-slot="sidebar-overlay"]');
              await expectStyle(backdrop, 'transitionProperty', 'none', id);
              await expectStyle(backdrop, 'transitionDuration', '0s', id);
              await page.keyboard.press('Escape');
              await sidebar.waitFor({ state: 'detached' });
              await sidebarTrigger.press('Enter');
              await sidebar.waitFor({ state: 'visible' });
              await expectStyle(backdrop, 'transitionDuration', '0s', id);
              await page.keyboard.press('Escape');
              await sidebar.waitFor({ state: 'detached' });
              assert.equal(
                await sidebarTrigger.evaluate((element) => element === document.activeElement),
                true,
                id,
              );
            }
            const region = page.getByRole('combobox', { name: 'Default region' });
            await region.click();
            await expectStyle(region, 'transitionDuration', '0s', id);
            const options = page.getByRole('listbox', { name: 'Regions' });
            await options.waitFor({ state: 'visible' });
            await page.keyboard.press('Escape');
            await options.waitFor({ state: 'detached' });
            await region.press('Enter');
            await options.waitFor({ state: 'visible' });
            await expectStyle(region, 'transitionDuration', '0s', id);
            await page.keyboard.press('Escape');
            await options.waitFor({ state: 'detached' });
            await page.goto(
              `${url}/iframe.html?id=components-drawer--swipe-handle-and-hidden-header&viewMode=story&globals=theme:${theme}`,
            );
            const swipeDrawer = page.getByRole('dialog');
            await swipeDrawer.waitFor({ state: 'visible' });
            await settle(swipeDrawer);
            const handle = await page.locator('[data-slot="drawer-swipe-handle"]').boundingBox();
            assert.ok(handle, id);
            const cx = handle.x + handle.width / 2,
              cy = handle.y + handle.height / 2;
            await page.mouse.move(cx, cy);
            await page.mouse.down();
            await page.mouse.move(cx, cy + 55, { steps: 10 });
            assert.equal(await swipeDrawer.getAttribute('data-swiping'), '', id);
            await expectStyle(swipeDrawer, 'transitionDuration', '0s', id);
            const distance = await swipeDrawer.evaluate((element) =>
              parseFloat(getComputedStyle(element).getPropertyValue('--drawer-swipe-movement-y')),
            );
            assert.ok(distance > 0 && distance <= 55, id);
            await page.mouse.up();
            if (await swipeDrawer.isVisible()) await page.keyboard.press('Escape');
            await swipeDrawer.waitFor({ state: 'detached' });
            assert.deepEqual(errors, [], id);
          }
          results.push({ id, status: 'passed', viewport, theme, reducedMotion, errors });
          console.log(`PASS ${id}`);
        } catch (error) {
          await page.screenshot({ path: resolve(directory, `failure-${id}.png`) });
          results.push({ id, status: 'failed', error: String(error) });
          throw error;
        } finally {
          const video = page.video();
          await context.close();
          if (record && video)
            await video.saveAs(
              resolve(directory, `${baseline ? 'before' : 'after'}-${profile}-review.webm`),
            );
        }
      }
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((done) => server.close(done));
  await writeFile(
    resolve(directory, baseline ? 'before-results.json' : 'results.json'),
    JSON.stringify(
      {
        source: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
        dirty: execFileSync('git', ['diff', '--stat'], { encoding: 'utf8' }),
        baseline,
        sourceFingerprint: testedFingerprint,
        unchangedDuringRun: sourceFingerprint() === testedFingerprint,
        results,
      },
      null,
      2,
    ),
  );
}
assert.equal(results.length, baseline ? 6 : 12);
assert.ok(results.every((result) => result.status === 'passed'));
console.log(
  `All ${results.length} responsive motion journeys passed; browser and owned server closed.`,
);

assert.equal(sourceFingerprint(), testedFingerprint, 'Source changed during the motion run');
