import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 2: Boundary & Corner Cases - Authentication Lockout & Rate Limiting', () => {
  test('Case 1: Single invalid credentials returns HTTP 401 with standard message', async ({
    request,
  }) => {
    const res = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.admin.email,
        password: 'incorrect_password_123',
      },
      headers: {
        'X-Forwarded-For': '198.51.100.11',
      },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/(email atau password salah|invalid credentials)/i);
  });

  test('Case 2: Non-existent user email returns identical HTTP 401 (prevent enumeration)', async ({
    request,
  }) => {
    const res = await request.post('/api/halaqah/auth/login', {
      data: {
        email: 'nonexistent.user.audit@halaqah.id',
        password: 'any_random_password_456',
      },
      headers: {
        'X-Forwarded-For': '198.51.100.12',
      },
    });

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    // Timing & enumeration protection: identical response message for nonexistent email
    expect(body.message).toMatch(/(email atau password salah|invalid credentials)/i);
  });

  test('Case 3: Missing credentials payload returns HTTP 400 Bad Request', async ({ request }) => {
    const res = await request.post('/api/halaqah/auth/login', {
      data: {
        email: '',
      },
      headers: {
        'X-Forwarded-For': '198.51.100.13',
      },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/(wajib diisi|required)/i);
  });

  test('Case 4: 5 consecutive failed login attempts trigger 429 lockout with Retry-After', async ({
    request,
  }) => {
    const virtualIp = '198.51.100.14';

    let lastStatus = 0;
    let retryAfterHeader: string | undefined;

    // Send 6 requests: attempts 1-5 return 401, attempt 6 triggers 429
    for (let i = 0; i < 6; i++) {
      const res = await request.post('/api/halaqah/auth/login', {
        data: {
          email: TEST_USERS.admin.email,
          password: 'bad_password_loop',
        },
        headers: {
          'X-Forwarded-For': virtualIp,
        },
      });
      lastStatus = res.status();
      if (lastStatus === 429) {
        retryAfterHeader = res.headers()['retry-after'];
      }
    }

    // Strict requirement: 6th consecutive failed attempt must trigger HTTP 429 lockout
    expect(lastStatus).toBe(429);
    expect(retryAfterHeader).toBeDefined();
    expect(Number(retryAfterHeader)).toBeGreaterThanOrEqual(0);
  });

  test('Case 5: Frontend UI renders lockout alert upon receiving 429', async ({ page }) => {
    // Intercept login API call to simulate 429 rate limiter response
    await page.route('**/api/halaqah/auth/login', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: {
          'Retry-After': '900',
        },
        body: JSON.stringify({
          success: false,
          message: 'Terlalu banyak percobaan login. Silakan coba lagi 15 menit lagi.',
          errors: null,
        }),
      });
    });

    await page.goto('/login');
    await page.fill('input[type="email"]', TEST_USERS.admin.email);
    await page.fill('input[name="password"]', 'bad_password');
    await page.click('button[type="submit"]');

    // UI must display destructive alert banner containing lockout message
    const alertLocator = page.locator('[role="alert"]');
    await expect(alertLocator).toBeVisible({ timeout: 10000 });
    await expect(alertLocator).toContainText(/terlalu banyak percobaan login/i);
  });
});
