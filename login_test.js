import { chromium } from '@playwright/test';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("=== DIAGNOSTIC LOGIN TEST ===");

  // Capture console logs
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] [${msg.type()}] ${msg.text()}`);
  });

  // Capture page errors
  page.on('pageerror', err => {
    console.error('[BROWSER EXCEPTION]', err);
  });

  // Capture network requests & responses
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log(`[NETWORK REQ] ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`[NETWORK RES] ${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log("Navigating to login page...");
    await page.goto('http://localhost:5173/login');
    console.log("URL after navigation:", page.url());

    // Wait for the form to be ready
    await page.waitForSelector('input[type="email"]');

    console.log("Filling login credentials...");
    await page.fill('input[type="email"]', 'muharitss@outlook.com');
    await page.fill('input[type="password"]', 'muhafiz123');

    console.log("Clicking Sign In...");
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ timeout: 10000 }).catch(e => console.log("Navigation timeout or finished")),
    ]);

    console.log("URL after clicking Sign In:", page.url());
    
    // Wait an extra 3 seconds to see if it redirects or updates
    console.log("Waiting 3 seconds for post-navigation actions...");
    await page.waitForTimeout(3000);
    console.log("Final URL:", page.url());

  } catch (err) {
    console.error("Test failed with error:", err);
  } finally {
    await browser.close();
    console.log("=== TEST FINISHED ===");
  }
}

run();
