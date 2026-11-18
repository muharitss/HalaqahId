import { test as setup } from '@playwright/test';
import fs from 'fs';
import { TEST_USERS, STORAGE_STATE, AUTH_DIR } from './test-users';

setup.beforeAll(async () => {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
});

setup('authenticate as admin', async ({ page, request }) => {
  let authenticated = false;

  // 1. Attempt UI login via form submission
  try {
    await page.goto('/login', { timeout: 8000 });
    const emailInput = page.locator('input[type="email"]');
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(TEST_USERS.admin.email);
    await page.fill('input[name="password"]', TEST_USERS.admin.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(
      (url) => url.pathname.includes('/kepala-muhafidz') || url.pathname.includes('/dashboard'),
      { timeout: 8000 }
    );
    await page.context().storageState({ path: STORAGE_STATE.admin });
    authenticated = true;
  } catch {
    // UI login attempt timed out or failed; fallback to direct API
  }

  // 2. Direct API login fallback
  if (!authenticated) {
    try {
      const res = await request.post('/api/halaqah/auth/login', {
        data: {
          email: TEST_USERS.admin.email,
          password: TEST_USERS.admin.password,
        },
        timeout: 8000,
      });

      if (res.ok()) {
        const body = await res.json();
        const token = body.data?.token || body.token;
        const user = body.data?.user || body.user;
        const refreshToken = body.data?.refresh_token || body.refresh_token;

        await page.goto('/login');
        await page.evaluate(
          ({ u, t }) => {
            if (u) localStorage.setItem('user', JSON.stringify(u));
            if (t) localStorage.setItem('token', t);
          },
          { u: user, t: token }
        );

        if (refreshToken) {
          await page.context().addCookies([
            {
              name: 'halaqah_refresh',
              value: refreshToken,
              domain: 'localhost',
              path: '/',
              httpOnly: true,
              sameSite: 'Lax',
            },
          ]);
        }

        await page.context().storageState({ path: STORAGE_STATE.admin });
        authenticated = true;
      }
    } catch {
      // API fallback failed
    }
  }

  // 3. Fail-fast: throw explicit error if authentication could not be established
  if (!authenticated) {
    throw new Error(
      `Failed to authenticate as admin (${TEST_USERS.admin.email}): both UI login and API fallback (/api/halaqah/auth/login) failed. Ensure backend is running and database is seeded.`
    );
  }
});

setup('authenticate as muhafiz', async ({ page, request }) => {
  let authenticated = false;

  // 1. Attempt UI login via form submission
  try {
    await page.goto('/login', { timeout: 8000 });
    const emailInput = page.locator('input[type="email"]');
    await emailInput.waitFor({ state: 'visible', timeout: 5000 });
    await emailInput.fill(TEST_USERS.muhafiz.email);
    await page.fill('input[name="password"]', TEST_USERS.muhafiz.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(
      (url) => url.pathname.includes('/muhafidz') || url.pathname.includes('/dashboard'),
      { timeout: 8000 }
    );
    await page.context().storageState({ path: STORAGE_STATE.muhafiz });
    authenticated = true;
  } catch {
    // UI login attempt timed out or failed; fallback to direct API
  }

  // 2. Direct API login fallback
  if (!authenticated) {
    try {
      const res = await request.post('/api/halaqah/auth/login', {
        data: {
          email: TEST_USERS.muhafiz.email,
          password: TEST_USERS.muhafiz.password,
        },
        timeout: 8000,
      });

      if (res.ok()) {
        const body = await res.json();
        const token = body.data?.token || body.token;
        const user = body.data?.user || body.user;
        const refreshToken = body.data?.refresh_token || body.refresh_token;

        await page.goto('/login');
        await page.evaluate(
          ({ u, t }) => {
            if (u) localStorage.setItem('user', JSON.stringify(u));
            if (t) localStorage.setItem('token', t);
          },
          { u: user, t: token }
        );

        if (refreshToken) {
          await page.context().addCookies([
            {
              name: 'halaqah_refresh',
              value: refreshToken,
              domain: 'localhost',
              path: '/',
              httpOnly: true,
              sameSite: 'Lax',
            },
          ]);
        }

        await page.context().storageState({ path: STORAGE_STATE.muhafiz });
        authenticated = true;
      }
    } catch {
      // API fallback failed
    }
  }

  // 3. Fail-fast: throw explicit error if authentication could not be established
  if (!authenticated) {
    throw new Error(
      `Failed to authenticate as muhafiz (${TEST_USERS.muhafiz.email}): both UI login and API fallback (/api/halaqah/auth/login) failed. Ensure backend is running and database is seeded.`
    );
  }
});

setup('authenticate as wali', async ({ page, request }) => {
  const wali = TEST_USERS.wali;
  let authenticated = false;

  // 1. Attempt UI portal login if portal page exists
  try {
    const res = await page.goto(`/portal/${wali.sekolah_slug}`, { timeout: 5000 });
    if (res && res.status() < 400 && !page.url().includes('/login')) {
      const nisInput = page.locator('input[name="nis"]');
      if (await nisInput.isVisible({ timeout: 3000 })) {
        await nisInput.fill(wali.nis);
        await page.fill('input[name="no_telepon"], input[name="nomor_telepon"]', wali.no_telepon);
        await page.click('button[type="submit"]');

        const otpInput = page.locator('input[name="otp"]');
        if (await otpInput.isVisible({ timeout: 4000 })) {
          await otpInput.fill(wali.otp);
          await page.click('button[type="submit"]');
        }

        await page.waitForURL(
          (url) => url.pathname.includes('/portal') && !url.pathname.includes('/login'),
          { timeout: 5000 }
        );
        await page.context().storageState({ path: STORAGE_STATE.wali });
        authenticated = true;
      }
    }
  } catch {
    // UI not yet mounted; fallback to direct API
  }

  // 2. Direct API verification fallback
  if (!authenticated) {
    let token = '';

    // Try K2-K4 OTP endpoint
    try {
      const otpRes = await request.post('/api/portal/otp/verify', {
        data: { slug: wali.sekolah_slug, nis: wali.nis, otp: wali.otp },
        timeout: 5000,
      });
      if (otpRes.ok()) {
        const body = await otpRes.json();
        token = body.data?.token || body.token || '';
      }
    } catch {
      // Ignore network errors in fallback attempt
    }

    if (!token) {
      // Fallback to direct verify endpoint
      try {
        const directRes = await request.post('/api/portal/verify', {
          data: { slug_sekolah: wali.sekolah_slug, nis: wali.nis, no_telepon: wali.no_telepon },
          timeout: 5000,
        });
        if (directRes.ok()) {
          const body = await directRes.json();
          token = body.data?.token || body.token || '';
        }
      } catch {
        // Ignore network errors in fallback attempt
      }
    }

    if (token) {
      await page.goto('/login');
      // Inject cookie and token into context
      await page.context().addCookies([
        {
          name: 'portal_session',
          value: token,
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          sameSite: 'Lax',
        },
      ]);
      await page.context().storageState({ path: STORAGE_STATE.wali });
      authenticated = true;
    }
  }

  // 3. Fail-fast: throw explicit error if authentication could not be established
  if (!authenticated) {
    throw new Error(
      `Failed to authenticate as wali (NIS: ${wali.nis}, slug: ${wali.sekolah_slug}): both UI portal verification and API fallback (/api/portal/otp/verify, /api/portal/verify) failed. Ensure backend is running and database is seeded.`
    );
  }
});
