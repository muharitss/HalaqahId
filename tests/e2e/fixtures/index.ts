import { test as base, Page } from '@playwright/test';
import fs from 'fs';
import { STORAGE_STATE } from './test-users';

export type CustomRoleFixtures = {
  adminPage: Page;
  muhafizPage: Page;
  waliPage: Page;
  publicPage: Page;
};

export const test = base.extend<CustomRoleFixtures>({
  adminPage: async ({ browser, contextOptions }, use) => {
    const storageState = fs.existsSync(STORAGE_STATE.admin) ? STORAGE_STATE.admin : undefined;
    const context = await browser.newContext({
      ...contextOptions,
      ...(storageState ? { storageState } : {}),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  muhafizPage: async ({ browser, contextOptions }, use) => {
    const storageState = fs.existsSync(STORAGE_STATE.muhafiz) ? STORAGE_STATE.muhafiz : undefined;
    const context = await browser.newContext({
      ...contextOptions,
      ...(storageState ? { storageState } : {}),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  waliPage: async ({ browser, contextOptions }, use) => {
    const storageState = fs.existsSync(STORAGE_STATE.wali) ? STORAGE_STATE.wali : undefined;
    const context = await browser.newContext({
      ...contextOptions,
      ...(storageState ? { storageState } : {}),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  publicPage: async ({ browser, contextOptions }, use) => {
    const context = await browser.newContext({
      ...contextOptions,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
export * from './test-users';
