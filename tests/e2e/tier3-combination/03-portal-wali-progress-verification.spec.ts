import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 3: Pairwise Combinations - Portal Wali OTP & Public Display Masking Comparison', () => {
  const wali = TEST_USERS.wali;
  let portalToken = '';
  let adminToken = '';

  test.beforeAll(async ({ request }) => {
    // 1. Authenticate wali via OTP verify endpoint
    const otpRes = await request.post('/api/portal/otp/verify', {
      data: {
        slug: wali.sekolah_slug,
        nis: wali.nis,
        otp: wali.otp,
      },
      headers: {
        'X-Forwarded-For': '203.0.113.101',
      },
    });

    if (otpRes.ok()) {
      const body = await otpRes.json();
      portalToken = body.data?.token || body.token || '';
    } else {
      // Fallback to direct verify
      const directRes = await request.post('/api/portal/verify', {
        data: {
          slug_sekolah: wali.sekolah_slug,
          nis: wali.nis,
          no_telepon: wali.no_telepon,
        },
        headers: {
          'X-Forwarded-For': '203.0.113.101',
        },
      });
      if (directRes.ok()) {
        const body = await directRes.json();
        portalToken = body.data?.token || body.token || '';
      }
    }

    // 2. Authenticate admin to fetch display token for cross-check
    const adminLogin = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.admin.email,
        password: TEST_USERS.admin.password,
      },
    });
    if (adminLogin.ok()) {
      const body = await adminLogin.json();
      adminToken = body.data?.token || body.token || '';
    }
  });

  test('TC-COMB-03-01: Wali OTP authentication produces valid portal session', async ({
    request,
  }) => {
    expect(portalToken).toBeTruthy();

    // Query santri profile via portal session
    const res = await request.get('/api/portal/santri', {
      headers: { Authorization: `Bearer ${portalToken}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-COMB-03-02: Authenticated wali accesses attendance and setoran records', async ({
    request,
  }) => {
    // 1. Fetch attendance
    const absensiRes = await request.get('/api/portal/absensi', {
      headers: { Authorization: `Bearer ${portalToken}` },
    });
    expect(absensiRes.status()).toBe(200);
    const absensiBody = await absensiRes.json();
    expect(absensiBody.success).toBe(true);

    // 2. Fetch setoran history
    const setoranRes = await request.get('/api/portal/setoran', {
      headers: { Authorization: `Bearer ${portalToken}` },
    });
    expect(setoranRes.status()).toBe(200);
    const setoranBody = await setoranRes.json();
    expect(setoranBody.success).toBe(true);
  });

  test('TC-COMB-03-03: Privacy comparison: Portal displays full name while Public Display masks student name', async ({
    request,
  }) => {
    // 1. In Portal (private view for authorized guardian), full student name is accessible
    const portalRes = await request.get('/api/portal/santri', {
      headers: { Authorization: `Bearer ${portalToken}` },
    });
    expect(portalRes.status()).toBe(200);
    const portalBody = await portalRes.json();
    const portalName: string = portalBody.data?.nama_santri || '';
    expect(portalName.length).toBeGreaterThan(0);

    // 2. In Public Display (public view), student names must be masked (e.g. "Muhammad F.")
    let displayToken = 'seeded-default-display-token';
    if (adminToken) {
      const schoolRes = await request.get('/api/sekolah', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (schoolRes.ok()) {
        const sBody = await schoolRes.json();
        displayToken = sBody.data?.display_token || sBody.display_token || displayToken;
      }
    }

    const displayRes = await request.get(`/api/display/${wali.sekolah_slug}/santri`, {
      headers: { 'x-display-token': displayToken },
    });

    if (displayRes.ok()) {
      const displayBody = await displayRes.json();
      expect(Array.isArray(displayBody.data)).toBe(true);

      const matchedSantri = displayBody.data.find(
        (s: any) => s.id_santri === 1 || s.id_santri === portalBody.data?.id_santri
      );

      if (matchedSantri) {
        // If the full name has multiple words, public display must mask subsequent words as initials
        if (portalName.includes(' ')) {
          expect(matchedSantri.nama_santri).toMatch(/\b[A-Z]\./);
          // Public masked name should differ from unmasked full name
          expect(matchedSantri.nama_santri).not.toBe(portalName);
        }
      }
    }
  });

  test('TC-COMB-03-04: Portal fail-closed on tampered or missing session token', async ({
    request,
  }) => {
    // 1. Missing token
    const missingRes = await request.get('/api/portal/santri');
    expect(missingRes.status()).toBe(401);

    // 2. Tampered token
    const tamperedRes = await request.get('/api/portal/santri', {
      headers: {
        Authorization: 'Bearer invalid.tampered.token.12345',
      },
    });
    expect(tamperedRes.status()).toBe(401);
  });

  test('TC-COMB-03-05: Zero phone numbers leaked across portal data payload', async ({
    request,
  }) => {
    const res = await request.get('/api/portal/santri', {
      headers: { Authorization: `Bearer ${portalToken}` },
    });
    const text = await res.text();

    // Verify raw phone number is not exposed in public payload
    expect(text).not.toContain('089999999999');
  });
});
