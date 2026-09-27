import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/tables.html');
});
test('a data table on a phone shows each row as labelled lines that wrap long values', async ({
  page,
}) => {
  const table = page.getByRole('table', { name: 'Webhook endpoints' });
  const urlCell = table.getByRole('cell', { name: /hooks\.example\.com\/incoming\/stripe/ });
  const scroll = table.locator('xpath=..');
  expect(await scroll.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  const stacked = page.viewportSize()!.width < 600;
  expect(await urlCell.evaluate((cell) => getComputedStyle(cell).display)).toBe(
    stacked ? 'grid' : 'table-cell',
  );
  if (!stacked) return;
  expect(
    await urlCell.evaluate((cell) => getComputedStyle(cell, '::before').content),
  ).toBe('"URL"');
  const actionCell = table.getByRole('cell', { name: 'Open stripe' });
  expect(
    await actionCell.evaluate((cell) => getComputedStyle(cell, '::before').content),
  ).toBe('none');
  await expect(table.getByRole('button', { name: /Endpoint/ })).toBeVisible();
  await table.getByRole('button', { name: /Endpoint/ }).click();
  await expect(table.getByRole('row').nth(1)).toContainText('GitHub');
});
test('the table footer keeps paging controls on one line on a phone', async ({ page }) => {
  const previous = (await page.getByRole('button', { name: 'Previous' }).boundingBox())!;
  const next = (await page.getByRole('button', { name: 'Next' }).boundingBox())!;
  const pageSize = (await page.getByRole('combobox', { name: 'Rows per page' }).boundingBox())!;
  expect(next.y).toBe(previous.y);
  expect(Math.abs(pageSize.y + pageSize.height / 2 - (next.y + next.height / 2))).toBeLessThan(4);
  expect(next.x + next.width).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test('the echopoint brand renders its own text, heading and code fonts', async ({ page }) => {
  const heading = page.getByRole('heading', { name: 'Echopoint brand' });
  const code = page.getByText('ep_live_key');
  const body = page.getByRole('table', { name: 'Webhook endpoints' });
  await expect(heading).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const family = (locator: typeof heading) =>
    locator.evaluate((element) => getComputedStyle(element).fontFamily);
  expect(await family(heading)).toMatch(/^"?Outfit Variable/);
  expect(await family(code)).toMatch(/^"?Geist Mono Variable/);
  expect(await family(heading.locator('xpath=..'))).toMatch(/^"?Plus Jakarta Sans Variable/);
  expect(await family(body)).toMatch(/-apple-system/);
  expect(
    await page.evaluate(() =>
      ['Outfit Variable', 'Geist Mono Variable', 'Plus Jakarta Sans Variable'].every((name) =>
        document.fonts.check(`16px "${name}"`),
      ),
    ),
  ).toBe(true);
});
