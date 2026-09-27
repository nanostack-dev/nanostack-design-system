import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { chooseAppearance, expectFitsAndAccessible, openPage } from './site-helpers';

const { version } = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string };
const pages = [
  { path: '/', title: 'Nanostack design system' },
  { path: '/?page=guidelines&tab=contract', title: 'Guidelines' },
  { path: '/?page=guidelines&tab=contributing', title: 'Guidelines' },
  { path: '/?page=guidelines&tab=design', title: 'Guidelines' },
  { path: '/?page=guidelines&tab=reference', title: 'Guidelines' },
  { path: '/?page=changelog', title: 'Changelog' },
  { path: '/?page=not-a-page', title: 'Page not found' },
];

for (const colorScheme of ['light', 'dark']) {
  test(`${colorScheme} pages have one title, fit the viewport and pass axe`, async ({ page }) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await chooseAppearance(page, 'Color scheme', colorScheme);
    await expect(page.locator('.ns-theme').first()).toHaveAttribute('data-ns-theme', colorScheme);
    for (const { path, title } of pages) {
      await page.evaluate((href) => {
        window.history.pushState(null, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      await expect(page.locator('h1')).toHaveCount(1);
      await expectFitsAndAccessible(page, `${path}, ${colorScheme}`);
    }
    expect(errors).toEqual([]);
  });
}

test('navigation links change the page, the title and the history', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Nanostack design system');
  await openPage(page, 'Guidelines');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Guidelines');
  await expect(page).toHaveURL(/\?page=guidelines$/);
  await expect(page).toHaveTitle('Guidelines · Nanostack design system');
  await openPage(page, 'Changelog');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Changelog');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Guidelines');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nanostack design system');
  await page.getByRole('link', { name: 'Open forms' }).click();
  await expect(page).toHaveURL(/\?page=components&tab=forms$/);
  await expect(page.getByRole('tab', { name: 'Forms', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('deep links open the section and scroll to the heading', async ({ page }) => {
  await page.goto('/?page=guidelines&tab=contributing#library-scope');
  await expect(page.getByRole('tab', { name: 'Contributing', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('heading', { name: 'Library scope' })).toBeInViewport();
  await page.goto('/?page=components&tab=collections');
  await expect(page.getByRole('tabpanel', { name: 'Collections' })).toBeVisible();
  await page.goto('/?catalog');
  await expect(page).toHaveURL(/\?page=components$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Components');
});

test('guidelines render the repository documents as library parts', async ({ page }) => {
  await page.goto('/?page=guidelines');
  const panel = page.getByRole('tabpanel', { name: 'Scope and contract' });
  await expect(panel.getByRole('heading', { level: 2, name: 'Scope' })).toBeVisible();
  await expect(panel.getByRole('heading', { level: 2, name: 'Public contract' })).toBeVisible();
  await expect(panel.getByText('Library:', { exact: true })).toHaveJSProperty('tagName', 'STRONG');
  await expect(panel).not.toContainText('**');
  await page.getByRole('tab', { name: 'Design decisions', exact: true }).click();
  await expect(page).toHaveURL(/tab=design$/);
  await expect(page.getByRole('heading', { level: 2, name: 'Foundations' })).toBeVisible();
  await page.getByRole('tab', { name: 'Component reference', exact: true }).click();
  const reference = page.getByRole('tabpanel', { name: 'Component reference' });
  await expect(reference.getByRole('table', { name: 'Scope and foundations' })).toBeVisible();
  await expect(reference.getByRole('textbox', { name: 'tsx example' })).toContainText(
    'ResourceRowLink',
  );
  await reference.getByRole('link', { name: 'contributing.md' }).first().click();
  await expect(page).toHaveURL(/\?page=guidelines&tab=contributing$/);
  await expect(
    page.getByRole('heading', { level: 2, name: 'Choose the correct layer' }),
  ).toBeVisible();
  const outline = page.getByRole('navigation', { name: 'On this page' });
  await outline.getByRole('link', { name: 'Validate the change' }).click();
  await expect(page).toHaveURL(/tab=contributing#validate-the-change$/);
  await expect(page.getByRole('heading', { name: 'Validate the change' })).toBeInViewport();
});

test('overview and changelog show the current release', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('textbox', { name: 'Install commands' })).toContainText(
    `@nanostackorg/design-system@${version}`,
  );
  await openPage(page, 'Changelog');
  await expect(page.getByRole('heading', { level: 2, name: version })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Upgrade:');
});

test('the skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/?page=changelog');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Changelog');
});

test('an unknown page offers the way back', async ({ page }) => {
  await page.goto('/?page=not-a-page');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await page.getByRole('link', { name: 'Go to the overview' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nanostack design system');
});

test('mobile navigation closes after a choice and returns focus', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Drawer navigation');
  await page.goto('/');
  const open = page.getByRole('button', { name: 'Open navigation' });
  await open.click();
  const drawer = page.getByRole('dialog', { name: 'Site navigation' });
  await expect(drawer).toBeVisible();
  await drawer.getByRole('link', { name: 'Guidelines', exact: true }).click();
  await expect(drawer).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Guidelines');
  await open.click();
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
});

test('mobile navigation stays closed after returning from a desktop viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Open navigation' });
  const drawer = page.getByRole('dialog', { name: 'Site navigation' });
  await trigger.click();
  await expect(drawer).toBeVisible();

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(trigger).not.toBeVisible();
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Documentation' })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(trigger).toBeVisible();
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Documentation' })).not.toBeVisible();
  await trigger.click();
  await expect(drawer).toBeVisible();
});

test('touch controls retain their target size', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'desktop', 'Coarse pointer contract');
  await page.goto('/?page=components');
  expect(
    await page
      .getByRole('tab', { name: 'Forms', exact: true })
      .evaluate((node) => node.getBoundingClientRect().height),
  ).toBeGreaterThanOrEqual(44);
  const trigger = page.getByRole('button', { name: 'Open navigation' });
  if (await trigger.isVisible()) await trigger.click();
  const select = page.getByRole('combobox', { name: 'Color scheme', exact: true });
  expect(
    await select.evaluate((node) => node.getBoundingClientRect().height),
  ).toBeGreaterThanOrEqual(44);
  expect(
    await select.evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
  ).toBeGreaterThanOrEqual(16);
  expect(
    await page
      .getByRole('link', { name: 'Changelog', exact: true })
      .first()
      .evaluate((node) => node.getBoundingClientRect().height),
  ).toBeGreaterThanOrEqual(44);
});
