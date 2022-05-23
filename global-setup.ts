/**
 * This file runs before test suite and store authentication session and cookies in file.
 * This file generates storageState.json that can be used instead of this test.
 * To use storageState.json instead of this test to save time, comment out globalSetup in playwright.config.ts
 *
 * To use store file in specifik test: test.use({ storageState: 'storage-state/storageState.json' });
 *
 * OBS: chromium browser will cache credentials even in incognito mode because it is stored in windows.
 * To make this work in non chromium browser this setup is more complicated what it has to be.
 */

import { chromium, FullConfig } from '@playwright/test';

const _username_alias = process.env.LOGIN_ALIAS ?? '';
const _username = process.env.LOGIN_USERNAME ?? '';
const _password = process.env.LOGIN_PASSWORD ?? '';

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
  let adfsURL = '';
  await Promise.all([
    page.waitForResponse((response) => {
      adfsURL = response.url(); // need this url if ADFS promt occurs
      return (
        response.url().includes('adfs.sodra.com/adfs') &&
        response.status() === 200
      );
    }),
    //page.waitForNavigation(),
    page.locator('text=lock').click(),
  ]);

  // chromium store credentials in windows, if false then allready logged and redirect to start page.
  if (page.url() !== baseURL) {
    try {
      await page.screenshot({ path: 'screenshots/2.png' });

      // Fill [placeholder="Username"]
      await page.locator('id=userNameInput').fill(_username);
      // Fill [placeholder="Password"]
      await page.locator('id=passwordInput').fill(_password);
      await page.screenshot({ path: 'screenshots/22.png' });
      // Click submit button
      await Promise.all([
        page.waitForNavigation({ url: baseURL }),
        page.locator('id=submitButton').click(),
      ]);
    } catch {
      // this runs when the login page is only a ADFS prompt without DOM elements, login via url instead of form.
      page.goto(
        _username_alias + ':' + password + '@' + adfsURL.split('//')[1]
      );
    }
  }
  await page.screenshot({ path: 'screenshots/44.png' });

  // Probably do not need dom loaded, but just to be sure.
  //await page.waitForLoadState('domcontentloaded');

  // Save session in file so we keep logged in and cookies accepted.
  await page.context().storageState({ path: storageState as string });
}

export default globalSetup;
