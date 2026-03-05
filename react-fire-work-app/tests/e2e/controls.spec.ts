import { expect, test } from '@playwright/test';

test.describe('Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for auto-launch to produce some particles
    await expect(page.locator('[data-particle]').first()).toBeVisible({
      timeout: 3000,
    });
  });

  test('Stop button stops new particle creation', async ({ page }) => {
    await page.click('#stop-button');

    // Wait for in-flight particles to fade out
    await page.waitForTimeout(300);

    const countBefore = await page.locator('[data-particle]').count();
    await page.waitForTimeout(500);
    const countAfter = await page.locator('[data-particle]').count();

    // After stop, existing particles fade out — count should not increase
    expect(countAfter).toBeLessThanOrEqual(countBefore);
  });

  test('Start button resumes auto-launch after stop', async ({ page }) => {
    await page.click('#stop-button');
    await page.waitForTimeout(500);

    await page.click('#start-button');
    await expect(page.locator('[data-particle]').first()).toBeVisible({
      timeout: 3000,
    });
  });

  test('fullscreen button is visible and clickable', async ({ page }) => {
    const fullscreenBtn = page.getByTitle('フルスクリーン');
    await expect(fullscreenBtn).toBeVisible();
    // Just verify it's interactive (fullscreen API may not work in headless)
    await expect(fullscreenBtn).toBeEnabled();
  });
});
