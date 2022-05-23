import { expect, Locator, Page } from '@playwright/test';

export class Common {
  readonly page: Page;
  readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.baseUrl);
  }

  async delay(ms: number) {
    new Promise(resolve => setTimeout(resolve, ms))
  }

}