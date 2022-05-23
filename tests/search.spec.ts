import { test, expect } from '@playwright/test';

test('should create a search phrase', async ({ page, baseURL }) => {
  await page.goto(baseURL);

  // click on the search input
  await page.locator('.c-compact-header__content--right >> form >> .o-search-input >> [placeholder="Sök..."]').click();
  // Fill input text with kontakt
  await page.locator('.c-compact-header__content--right >> form >> .o-search-input >> [placeholder="Sök..."]').fill('kontakt');
  // Press enter and wait for the search results
  await Promise.all([
    page.waitForNavigation({ url: baseURL + 'sok/?page=0&query=kontakt' }),
    page.keyboard.press('Enter'),
  ]);

  // expect the page to have the text "träffar på....."
  await expect(page.locator('.t-body-preamble >> text=träffar på "kontakt". Sortera på datum eller relevans.')).toBeVisible();

  // get all tabs and click on them to see if is-active class is added
  const tabs = page.locator('nav .c-tabs-nav > a.c-tabs-item');
  const count = await tabs.count();
  
  for (let i = 1; i <= count; i++) {
    if(i === count) {
      await tabs.nth(0).click();
      await expect(tabs.nth(0)).toHaveClass('c-tabs-item is-active', { timeout: 2000 });
      console.log('return to first tab');
      return;  
    }
    console.log(i, page.url());
    
    await expect(tabs.nth(i)).toHaveClass('c-tabs-item', { timeout: 2000 });
    await tabs.nth(i).click(),
    await expect(tabs.nth(i)).toHaveClass('c-tabs-item is-active', { timeout: 2000 });

  }

  // click on the first list item in search results
  const firstItemInlist = page.locator('.c-tabs-content article h3 a').nth(0);
  // get the href of the first list item in search results
  const pageURL = (await page.$eval('.c-tabs-content article h3 a', a => a.getAttribute('href')));


  // Click first item in search results and wait for page to load
  await Promise.all([
    page.waitForNavigation({ url: pageURL }),
    firstItemInlist.click(),
  ]);
});