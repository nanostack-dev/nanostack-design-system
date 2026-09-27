import { expect, test, type Locator, type Page } from '@playwright/test';

const fixture = '/tests/browser/fixtures/shell-overlays.html';

function paintedLayerAt(page: Page, x: number, y: number) {
  return page.evaluate(
    ([pointX, pointY]) => {
      const alphaOf = (element: Element) => {
        const color = getComputedStyle(element).backgroundColor;
        return color.startsWith('rgba') ? Number(color.slice(color.lastIndexOf(',') + 1, -1)) : 1;
      };
      const layer = document
        .elementsFromPoint(pointX ?? 0, pointY ?? 0)
        .find((element) => alphaOf(element) > 0);
      if (!layer) return { overPage: false, alpha: 0 };
      return {
        overPage: !document.getElementById('root')?.contains(layer),
        alpha: alphaOf(layer),
      };
    },
    [x, y],
  );
}

async function expectDimmedPage(page: Page) {
  const { height } = page.viewportSize()!;
  await expect
    .poll(async () => {
      const layer = await paintedLayerAt(page, 8, height - 8);
      return layer.overPage && layer.alpha >= 0.3;
    })
    .toBe(true);
}

function backgroundContrast(text: Locator) {
  return text.evaluate((element) => {
    const channels = (color: string) =>
      (color.match(/[\d.]+/g) ?? []).slice(0, 4).map((value) => Number(value));
    const luminance = (color: string) => {
      const [red = 0, green = 0, blue = 0] = channels(color).map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return red * 0.2126 + green * 0.7152 + blue * 0.0722;
    };
    let painted: Element | null = element;
    while (painted && (channels(getComputedStyle(painted).backgroundColor)[3] ?? 1) === 0)
      painted = painted.parentElement;
    const background = painted ? getComputedStyle(painted).backgroundColor : 'rgb(255, 255, 255)';
    const values = [luminance(getComputedStyle(element).color), luminance(background)];
    return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
  });
}

for (const theme of ['light', 'dark'] as const) {
  test(`dialogs inside the application shell dim the page (${theme})`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${fixture}${theme === 'dark' ? '?dark' : ''}`);

    const trigger = page.getByRole('button', { name: 'Open dialog' });
    await trigger.click();
    await expect(page.getByRole('dialog', { name: 'Plain dialog' })).toBeVisible();
    await expectDimmedPage(page);
    await expect(page.getByRole('dialog', { name: 'Espace de travail' })).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await page.getByRole('button', { name: 'Delete record' }).click();
    await expect(page.getByRole('alertdialog', { name: 'Delete record?' })).toBeVisible();
    await expectDimmedPage(page);
    await page.getByRole('button', { name: 'Keep record' }).click();
    await expect(page.getByRole('alertdialog')).toHaveCount(0);
  });

  test(`a scoped ${theme} theme paints its own canvas on a white host`, async ({ page }) => {
    await page.goto(`${fixture}?scoped${theme === 'dark' ? '&dark' : ''}`);
    const title = page.getByRole('heading', { name: 'Scoped header' });
    await expect(title).toBeVisible();
    expect(await backgroundContrast(title)).toBeGreaterThanOrEqual(4.5);
    expect(
      await backgroundContrast(page.getByText('A themed region on a white host page.')),
    ).toBeGreaterThanOrEqual(4.5);
  });
}

test('a responsive panel sheet inside the shell dims the page', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 800 });
  await page.goto(fixture);
  await page.getByRole('button', { name: 'Show details' }).click();
  await expect(page.getByRole('dialog', { name: 'Record details' })).toBeVisible();
  await expectDimmedPage(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('portal theme scopes do not paint a layer or change page height', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(fixture);
  const pageHeight = () => page.evaluate(() => document.documentElement.scrollHeight);
  const heightBefore = await pageHeight();
  await page.getByRole('button', { name: 'Open dialog' }).click();
  const dialog = page.getByRole('dialog', { name: 'Plain dialog' });
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate((popup) => popup.parentElement?.getBoundingClientRect().height),
  ).toBe(0);
  expect(await pageHeight()).toBe(heightBefore);
});

test('announces the accessible names supplied for shell and dialog controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(fixture);
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveCount(0);
  const open = page.getByRole('button', { name: 'Ouvrir la navigation' });
  await open.click();
  const drawer = page.getByRole('dialog', { name: 'Espace de travail' });
  await expect(drawer).toBeVisible();
  await drawer.getByRole('button', { name: 'Fermer la navigation' }).click();
  await expect(drawer).toHaveCount(0);
  await expect(open).toBeFocused();

  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page
    .getByRole('dialog', { name: 'Plain dialog' })
    .getByRole('button', { name: 'Fermer la fenêtre' })
    .click();
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.getByRole('button', { name: 'Delete record' }).click();
  await page
    .getByRole('alertdialog', { name: 'Delete record?' })
    .getByRole('button', { name: 'Fermer la confirmation' })
    .click();
  await expect(page.getByRole('alertdialog')).toHaveCount(0);
});

test('the hidden attribute hides library elements on the page and in portals', async ({ page }) => {
  await page.goto(fixture);
  await expect(page.getByRole('button', { name: 'Open dialog' })).toBeVisible();
  await expect(page.getByText('Hidden stack content')).toBeHidden();
  await expect(page.getByText('Hidden action', { exact: true })).toBeHidden();
  await expect(page.getByLabel('Hidden input')).toBeHidden();
  await expect(page.getByText('Hidden empty state')).toBeHidden();
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog', { name: 'Plain dialog' })).toBeVisible();
  await expect(page.getByText('Hidden portal action')).toBeHidden();
});

test('static and linked activity rows share the narrow layout', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(fixture);
  const rows = page.getByRole('list', { name: 'Recent activity' }).getByRole('listitem');
  await expect(rows).toHaveCount(2);
  const titleWidths: number[] = [];
  for (const row of [rows.nth(0), rows.nth(1)]) {
    const title = (await row.getByText('Checkout confirmation flow').boundingBox())!;
    const meta = (await row.getByText('2 minutes ago').boundingBox())!;
    expect(meta.y).toBeGreaterThanOrEqual(title.y + title.height);
    titleWidths.push(title.width);
  }
  expect(titleWidths[0]).toBeCloseTo(titleWidths[1] ?? 0, 0);
});
