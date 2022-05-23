import { test, expect } from '@playwright/test';
import { Common } from '../../helper/common'; // check if it works with helper classes

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  page.waitForResponse(response => 
      response.url().includes('sodra.com/static/img/sodra-logo.svg') && response.status() === 200
  ),
  // custom error message as a second argument to the expect function.
  await expect(page.locator('.c-compact-footer img'), 'should see footer image before snapshot').toBeVisible();
});

test.describe('snapshot on start page for desktop', () => {
  test.use({ viewport: { width: 1200, height: 900 } });
  test.only('width 1200px', async ({ page }) => {
    const common = new Common(page);
    await common.delay(2000);
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      'start-page.png'
    );
  });
});

test.describe('snapshot on start page for mobile', () => {
  test.use({ viewport: { width: 320, height: 600 } });
  test.only('width 320px', async ({ page }) => {
    const common = new Common(page);
    await common.delay(2000);
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(
      'start-page-sm.png',
    );
  });
});
