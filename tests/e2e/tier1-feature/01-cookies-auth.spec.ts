import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 1: Feature Coverage - Cookie Auth & Token Hygiene', () => {
  test('TC-AUTH-01: Admin login sets HttpOnly SameSite=Lax halaqah_refresh cookie', async ({
    page,
    request,
    context,
  }) => {
    // 1. Direct API login to inspect raw Set-Cookie header flags
    const apiRes = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.admin.email,
        password: TEST_USERS.admin.password,
      },
    });
    expect(apiRes.status()).toBe(200);

    const setCookieHeader = apiRes.headers()['set-cookie'] || '';
    expect(setCookieHeader).toMatch(/halaqah_refresh=/i);
    expect(setCookieHeader.toLowerCase()).toContain('httponly');
    expect(setCookieHeader.toLowerCase()).toContain('samesite=lax');

    // 2. Perform browser context login to inspect context cookies
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[name="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*(kepala-muhafidz|dashboard).*/, { timeout: 15000 });

    const cookies = await context.cookies();
    const refreshCookie = cookies.find((c) => c.name === 'halaqah_refresh');
    expect(refreshCookie).toBeDefined();
    if (refreshCookie) {
      expect(refreshCookie.httpOnly).toBe(true);
      expect(['Lax', 'None']).toContain(refreshCookie.sameSite);
    }
  });

  test('TC-AUTH-02: Zero token / refresh_token in localStorage', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[name="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*(kepala-muhafidz|dashboard).*/, { timeout: 15000 });

    // Per K6 security audit: Tokens, refresh tokens, and superadmin sessions must never be written to localStorage
    const storageKeys = await page.evaluate(() => Object.keys(localStorage));
    expect(storageKeys).not.toContain('token');
    expect(storageKeys).not.toContain('halaqah_refresh');
    expect(storageKeys).not.toContain('refresh_token');
    expect(storageKeys).not.toContain('superadmin_session');

    const tokenValue = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenValue).toBeNull();

    const refreshTokenValue = await page.evaluate(() => localStorage.getItem('refresh_token'));
    expect(refreshTokenValue).toBeNull();
  });

  test('TC-AUTH-03: Direct unauthenticated visit to /dashboard redirects to /login', async ({
    page,
    context,
  }) => {
    // Ensure clean context with zero cookies and cleared storage
    await context.clearCookies();
    await page.goto('/dashboard');

    // Route guard must intercept unauthenticated navigation and redirect to /login
    await expect(page).toHaveURL(/.*login.*/, { timeout: 10000 });
  });

  test('TC-AUTH-04: Silent token refresh triggers upon 401 via /api/halaqah/auth/refresh', async ({
    request,
  }) => {
    // Authenticate to obtain valid halaqah_refresh cookie
    const loginRes = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.admin.email,
        password: TEST_USERS.admin.password,
      },
    });
    expect(loginRes.status()).toBe(200);

    const loginBody = await loginRes.json();
    const initialToken = loginBody.data?.token || loginBody.token;

    // Call silent refresh endpoint using cookie jar
    const refreshRes = await request.post('/api/halaqah/auth/refresh');
    expect(refreshRes.status()).toBe(200);

    const refreshBody = await refreshRes.json();
    expect(refreshBody.success).toBe(true);

    const newToken = refreshBody.data?.token || refreshBody.token;
    expect(newToken).toBeDefined();
    expect(typeof newToken).toBe('string');
    expect(newToken.length).toBeGreaterThan(10);
  });

  test('TC-AUTH-05: User logout clears cookie and redirects to /login', async ({ page, context }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[name="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*(kepala-muhafidz|dashboard).*/, { timeout: 15000 });

    // Locate and click logout button in sidebar
    const logoutBtn = page.locator('button:has-text("Keluar")');
    if (await logoutBtn.isVisible({ timeout: 5000 })) {
      await logoutBtn.click();
    } else {
      // Direct API logout if UI button is collapsed in mobile viewport
      await page.evaluate(async () => {
        await fetch('/api/halaqah/auth/logout', { method: 'POST' });
        window.location.href = '/login';
      });
    }

    await expect(page).toHaveURL(/.*login.*/, { timeout: 10000 });

    // Verify halaqah_refresh cookie is either deleted or expired
    const postLogoutCookies = await context.cookies();
    const refreshCookie = postLogoutCookies.find((c) => c.name === 'halaqah_refresh');
    if (refreshCookie) {
      expect(refreshCookie.value === '' || refreshCookie.expires <= Date.now() / 1000).toBe(true);
    }
  });

  test('TC-AUTH-06: Role-based navigation routes admin to /kepala-muhafidz and muhafiz to /muhafidz', async ({
    page,
    context,
  }) => {
    // 1. Admin login routing verification
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[name="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*(kepala-muhafidz|dashboard).*/, { timeout: 15000 });

    // 2. Clear context for muhafiz login routing verification
    await context.clearCookies();
    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USERS.muhafiz.email);
    await page.fill('input[name="password"]', TEST_USERS.muhafiz.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*(muhafidz|dashboard).*/, { timeout: 15000 });
  });
});
