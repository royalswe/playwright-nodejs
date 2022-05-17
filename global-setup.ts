/**
 * This file runs before test suite and store authentication session and cookies in file.
 * This file generates storageState.json that can be used instead of this test.
 * To use storageState.json instead of this test to save time, comment out globalSetup in playwright.config.ts
 *
 * To use store file in specifik test: test.use({ storageState: 'storage-state/storageState.json' });
 */

import { chromium, FullConfig } from '@playwright/test';

const alias = process.env.LOGIN_ALIAS ?? '';
const username = process.env.LOGIN_USERNAME ?? '';
const password = process.env.LOGIN_PASSWORD ?? '';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL);

  // Click [aria-label="Godkänn alla"]
  await page.locator('[aria-label="Godkänn alla"]').click();

  // Open yellow menu
  await page.locator('button:has-text("account_circle")').click();

  // Click login button
  await Promise.all([
    page.waitForNavigation(),
    page.locator('text=lock').click(),
  ]);

  // if false then allready logged and redirect to start page
  if (page.url() !== baseURL) {
    try {
      // Fill [placeholder="Username"]
      await page.locator('id=userNameInput').fill(username);
      // Fill [placeholder="Password"]
      await page.locator('id=passwordInput').fill(password);

      // Click submit button
      await Promise.all([
        page.waitForNavigation({ url: baseURL }),
        page.locator('id=submitButton').click(),
      ]);
    } catch {
      // if catch the login page is only a login box without DOM elements, login via url instead.
      page.goto(alias + ':' + password + '@' + page.url().split('//')[1]);
    }
  }

  // Make sure the start page dom is loaded just to make sure everything is ok
  await page.waitForLoadState('domcontentloaded');

  // Save session in file so we keep logged in and cookies accepted.
  await page.context().storageState({ path: storageState as string });
}

export default globalSetup;
