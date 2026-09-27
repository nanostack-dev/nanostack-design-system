import { expect, test, type Locator } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fixtures/overlays.html');
});

async function expectPaintedOnTop(popup: Locator) {
  await expect(popup).toBeVisible();
  await expect
    .poll(() =>
      popup.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
        return hit !== null && element.contains(hit);
      }),
    )
    .toBe(true);
}

async function exerciseAnchoredOverlays(scope: Locator) {
  const page = scope.page();
  const status = scope.getByRole('status');

  await scope.getByRole('button', { name: 'Flow actions' }).click();
  await expectPaintedOnTop(page.getByRole('menu'));
  await page.getByRole('menuitem', { name: 'Duplicate' }).click();
  await expect(status).toHaveText('Last action: duplicate');

  await scope.getByRole('button', { name: 'Schedule' }).click();
  await expectPaintedOnTop(page.getByRole('dialog', { name: 'Schedule' }));
  await page.getByRole('button', { name: 'Save schedule' }).click();
  await expect(status).toHaveText('Last action: schedule');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Schedule' })).toBeHidden();

  await scope.getByRole('button', { name: 'Help' }).hover();
  await expectPaintedOnTop(page.getByText('Runs on every push'));

  await scope.getByRole('button', { name: 'Show toast' }).click();
  await expectPaintedOnTop(page.getByText('Flow saved'));

  const environment = scope.getByRole('combobox', { name: 'Environment' });
  await environment.fill('stag');
  const staging = page.getByRole('option', { name: 'staging' });
  await expectPaintedOnTop(page.getByRole('listbox').filter({ has: staging }));
  await staging.click();
  await expect(environment).toHaveValue('staging');

  await scope.getByRole('combobox', { name: 'Tags' }).fill('pay');
  const payments = page.getByRole('option', { name: 'payments' });
  await expectPaintedOnTop(page.getByRole('listbox').filter({ has: payments }));
  await payments.click();
  await expect(scope.getByRole('button', { name: 'Remove payments' })).toBeVisible();
}

test('anchored overlays and toasts paint above a modal dialog and stay clickable', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Open dialog' }).click();
  const dialog = page.getByRole('dialog', { name: 'Edit flow' });
  await exerciseAnchoredOverlays(dialog);
  await expect(dialog).toBeVisible();
});

test('anchored overlays paint above the mobile responsive panel sheet', async ({ page }) => {
  test.skip(page.viewportSize()!.width >= 768, 'The panel is docked, not modal, on wide screens.');
  await page.getByRole('button', { name: 'Open panel' }).click();
  const panel = page.getByRole('dialog', { name: 'Flow details' });
  await exerciseAnchoredOverlays(panel);
  await expect(panel).toBeVisible();
});
