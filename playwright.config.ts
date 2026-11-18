import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Playwright E2E Configuration for Halaqah.id
 * Dual webServer: haalaqahid-be (3000) and HalaqahId (5173)
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    // 1. Setup Project: Authenticates roles and saves storage states
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // 2. Desktop Chromium: Primary project for smoke and general specs
    {
      name: 'chromium',
      testMatch: /.*smoke\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // 3. Mobile Chrome: Pixel 5 viewport for responsive & PWA testing
    {
      name: 'mobile-chrome',
      testMatch: /.*(smoke|mobile|pwa).*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Pixel 5'],
      },
    },

    // 4. Public / Unauthenticated project (clean context)
    // Matches all unauthenticated specs in tier1-feature and tier2-boundary
    {
      name: 'public',
      testMatch: /.*(public|unauth|display|01-cookies-auth|02-display|06-quran-reader|01-auth-lockout|02-display-unauthorized|03-otp-expiration|04-rate-limits|tier2-boundary).*\.spec\.ts/,
      testIgnore: /.*(tier3-pairwise|tier3-combination|tier4-scenarios|tier4-application).*/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // 5. Admin role authenticated project (single-role tier1 specs only)
    {
      name: 'admin',
      testMatch: /.*(tier1-feature[/\\])?04-admin.*\.spec\.ts/,
      testIgnore: /.*(tier3-pairwise|tier3-combination|tier4-scenarios|tier4-application).*/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, '.auth/admin.json'),
      },
    },

    // 6. Muhafiz role authenticated project (single-role tier1 specs only)
    {
      name: 'muhafiz',
      testMatch: /.*(tier1-feature[/\\])?05-muhafiz.*\.spec\.ts/,
      testIgnore: /.*(tier3-pairwise|tier3-combination|tier4-scenarios|tier4-application).*/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, '.auth/muhafiz.json'),
      },
    },

    // 7. Wali role authenticated project (single-role tier1 specs only)
    {
      name: 'wali',
      testMatch: /.*(tier1-feature[/\\])?(03-portal-otp|.*wali.*)\.spec\.ts/,
      testIgnore: /.*(tier3-pairwise|tier3-combination|tier4-scenarios|tier4-application).*/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, '.auth/wali.json'),
      },
    },

    // 8. Scenario & Combinatorial Pairwise project (Tiers 3 & 4)
    {
      name: 'scenarios',
      testMatch: /.*(tier3-pairwise|tier3-combination|tier4-scenarios|tier4-application).*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  /* Dual webServer orchestration: launches backend (3000) and frontend (5173) */
  webServer: [
    {
      command: 'pnpm dev',
      cwd: path.resolve(__dirname, '../haalaqahid-be'),
      url: 'http://localhost:3000/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'pnpm dev',
      cwd: path.resolve(__dirname, '.'),
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
});
