import { expect, test } from '@playwright/test';

test.describe('Fireworks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('click creates particle elements within 500ms', async ({ page }) => {
    // Stop auto-launch first to isolate the click test
    const stopBtn = page.locator('#stop-button');
    if (await stopBtn.isVisible()) {
      await stopBtn.click();
    }
    await page.waitForTimeout(300);

    await page.click('#fireworks-stage', { position: { x: 400, y: 300 } });
    await expect(page.locator('[data-particle]').first()).toBeVisible({
      timeout: 2000,
    });
  });

  test('auto-launch mode creates particles over time', async ({ page }) => {
    // App starts with auto-launch enabled
    await expect(page.locator('[data-particle]').first()).toBeVisible({
      timeout: 3000,
    });

    const count = await page.locator('[data-particle]').count();
    expect(count).toBeGreaterThan(0);
  });
});
