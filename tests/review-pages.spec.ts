import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.sodra.com/sv/se/');
});

// test('should see start page title', async ({ page }) => {
//   await page.goto('https://www.sodra.com/sv/se/');
//   expect(await page.title()).toBe(
//     'Södra är Sveriges största skogsägarförening.'
//   );
// });

//test.use({ storageState: 'storage-state/storageState.json' });
test('Navigate to pages to review', async ({ page }) => {
  //await browser.newContext({ storageState: 'storage-state/storageState.json' });

  expect(await page.title()).toBe(
    'Södra är Sveriges största skogsägarförening.'
  );
  // Click button:has-text("account_circle Nilsson, Roy")
  await page.locator('button:has-text("account_circle")').click();
  // Click text=För anställda Nya Kör som medlem Faktagranskare & Redaktörer Publiceringsguide D >> i
  // Click .c-sidebar-nav.c-sidebar-nav--yellow > ul > li > .c-sidebar-nav__open-submenu >> nth=0
  await page
    .locator(
      '.c-sidebar-nav.c-sidebar-nav--yellow > ul > li > .c-sidebar-nav__open-submenu'
    )
    .first()
    .click();

  await page.locator('[data-cid="faktagranskare-&-redaktorer"]').click();
  //await page.locator('text=Faktagranskare & Redaktörer').click(),
  // 0× click
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://www.sodra.com/sv/se/editor/faktagranskare/?source=usernav' }*/),
    //page.locator('text=Faktagranskare & Redaktörer').click(),
    await page.locator('[data-cid="faktagranskare-&-redaktorer"]').click(),
  ]);
});
