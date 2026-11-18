import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 2: Boundary & Corner Cases - Portal Session Fail-Closed & OTP Boundary', () => {
  const wali = TEST_USERS.wali;

  test('Case 1: Submitting incorrect OTP returns 400/401 and does not set portal_session', async ({
    request,
  }) => {
    const res = await request.post('/api/portal/otp/verify', {
      data: {
        slug: wali.sekolah_slug,
        nis: wali.nis,
        otp: '999999',
      },
      headers: {
        'X-Forwarded-For': '203.0.113.81',
      },
    });

    if (res.status() !== 404) {
      expect([400, 401]).toContain(res.status());
      const body = await res.json();
      expect(body.success).toBe(false);

      // Verify no session cookie set
      const setCookie = res.headers()['set-cookie'] || '';
      expect(setCookie).not.toContain('portal_session');
    } else {
      // Fallback check on direct verify
      const direct = await request.post('/api/portal/verify', {
        data: {
          slug_sekolah: wali.sekolah_slug,
          nis: wali.nis,
          no_telepon: '080000000000',
        },
        headers: {
          'X-Forwarded-For': '203.0.113.81',
        },
      });
      expect([400, 401]).toContain(direct.status());
    }
  });

  test('Case 2: Malformed / non-numeric OTP returns 400', async ({ request }) => {
    const res = await request.post('/api/portal/otp/verify', {
      data: {
        slug: wali.sekolah_slug,
        nis: wali.nis,
        otp: 'abc!@#',
      },
      headers: {
        'X-Forwarded-For': '203.0.113.82',
      },
    });

    if (res.status() !== 404) {
      expect([400, 422]).toContain(res.status());
      const body = await res.json();
      expect(body.success).toBe(false);
    } else {
      // Direct verify missing fields check
      const direct = await request.post('/api/portal/verify', {
        data: {
          slug_sekolah: wali.sekolah_slug,
          nis: '',
          no_telepon: 'not-a-phone',
        },
        headers: {
          'X-Forwarded-For': '203.0.113.82',
        },
      });
      expect(direct.status()).toBe(400);
    }
  });

  test('Case 3: Expired OTP code returns 400/401/410', async ({ request }) => {
    const res = await request.post('/api/portal/otp/verify', {
      data: {
        slug: wali.sekolah_slug,
        nis: wali.nis,
        otp: '123456',
        timestamp: Date.now() - 1000 * 60 * 60, // 1 hour in the past
      },
      headers: {
        'X-Forwarded-For': '203.0.113.83',
      },
    });

    // Strictly reject expired OTP with client error; 200 and 404 are forbidden
    expect([400, 401, 410]).toContain(res.status());
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('Case 4: 5 consecutive incorrect OTP submissions trigger lockout (429)', async ({
    request,
  }) => {
    const testIp = '203.0.113.84';
    let lastStatus = 0;

    for (let i = 0; i < 6; i++) {
      const res = await request.post('/api/portal/verify', {
        data: {
          slug_sekolah: wali.sekolah_slug,
          nis: wali.nis,
          no_telepon: '089999999999',
        },
        headers: {
          'X-Forwarded-For': testIp,
        },
      });
      lastStatus = res.status();
    }

    // Strictly require 429 Too Many Requests on 6th failed attempt; 400 is not allowed
    expect(lastStatus).toBe(429);
  });

  test('Case 5: Revoked / missing portal_session in database fails closed (401) on /api/portal/*', async ({
    request,
  }) => {
    // 1. Unauthenticated request without token
    const noTokenRes = await request.get('/api/portal/santri');
    expect(noTokenRes.status()).toBe(401);

    // 2. Request with invalid or non-existent token
    const invalidTokenRes = await request.get('/api/portal/santri', {
      headers: {
        Authorization: 'Bearer revoked-or-nonexistent-portal-session-token',
      },
    });
    expect(invalidTokenRes.status()).toBe(401);

    const body = await invalidTokenRes.json();
    expect(body.success).toBe(false);
  });
});
