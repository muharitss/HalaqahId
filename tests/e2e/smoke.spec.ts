import { test, expect } from './fixtures';

test.describe('E2E Infrastructure & Multi-Role Fixtures Smoke Tests', () => {
  test('publicPage renders login form without credentials', async ({ publicPage }) => {
    await publicPage.goto('/login');
    await expect(publicPage).toHaveURL(/.*login.*/);

    const emailInput = publicPage.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    const passwordInput = publicPage.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
  });

  test('publicPage is redirected to login when attempting to access protected dashboard', async ({
    publicPage,
  }) => {
    await publicPage.goto('/dashboard');
    // Without authentication, guard must redirect to login
    await expect(publicPage).toHaveURL(/.*login.*/, { timeout: 10000 });
  });

  test('adminPage loads dashboard with admin session', async ({ adminPage }) => {
    await adminPage.goto('/dashboard');
    // Admin should navigate to dashboard / kepala-muhafidz without redirection to login
    await expect(adminPage).not.toHaveURL(/.*login.*/, { timeout: 10000 });
    await expect(adminPage).toHaveURL(/.*(kepala-muhafidz|dashboard).*/);
  });

  test('muhafizPage loads dashboard with muhafiz session', async ({ muhafizPage }) => {
    await muhafizPage.goto('/dashboard');
    // Muhafiz should navigate to dashboard / muhafidz without redirection to login
    await expect(muhafizPage).not.toHaveURL(/.*login.*/, { timeout: 10000 });
    await expect(muhafizPage).toHaveURL(/.*(muhafidz|dashboard).*/);
  });

  test('multi-role isolation: adminPage, muhafizPage, and publicPage maintain separate sessions', async ({
    adminPage,
    muhafizPage,
    publicPage,
  }) => {
    // Navigate concurrently to verify browser context isolation
    await Promise.all([
      adminPage.goto('/dashboard'),
      muhafizPage.goto('/dashboard'),
      publicPage.goto('/login'),
    ]);

    await expect(publicPage).toHaveURL(/.*login.*/);
    await expect(adminPage).not.toHaveURL(/.*login.*/, { timeout: 10000 });
    await expect(adminPage).toHaveURL(/.*(kepala-muhafidz|dashboard).*/);
    await expect(muhafizPage).not.toHaveURL(/.*login.*/, { timeout: 10000 });
    await expect(muhafizPage).toHaveURL(/.*(muhafidz|dashboard).*/);

    // Verify publicPage has zero auth state in localStorage and cookies
    const publicToken = await publicPage.evaluate(() => localStorage.getItem('token'));
    expect(publicToken).toBeNull();

    const publicCookies = await publicPage.context().cookies();
    const hasAuthCookie = publicCookies.some(
      (c) => c.name === 'halaqah_refresh' || c.name === 'portal_session'
    );
    expect(hasAuthCookie).toBe(false);
  });
});
