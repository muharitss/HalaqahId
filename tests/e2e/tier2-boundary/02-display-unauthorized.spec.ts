import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 2: Boundary & Corner Cases - Display Unauthorized & Privacy Boundary', () => {
  const slug = TEST_USERS.sekolah.slug;

  test('Case 1: Missing x-display-token header rejected with 401/403', async ({ request }) => {
    const res = await request.get(`/api/display/${slug}/santri`);
    expect([401, 403]).toContain(res.status());
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('Case 2: Malformed x-display-token rejected', async ({ request }) => {
    const res = await request.get(`/api/display/${slug}/santri`, {
      headers: {
        'x-display-token': 'not-a-valid-uuid-token-string',
      },
    });
    expect([401, 403]).toContain(res.status());
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('Case 3: Santri detail endpoint rejects unauthorized requests', async ({ request }) => {
    const res = await request.get(`/api/display/${slug}/santri/1`, {
      headers: {
        'x-display-token': 'forged-token-xyz',
      },
    });
    expect([401, 403]).toContain(res.status());
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('Case 4: Response payloads contain zero phone numbers and masked names', async ({
    request,
  }) => {
    // 1. Obtain valid display token as school admin
    const loginRes = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.admin.email,
        password: TEST_USERS.admin.password,
      },
    });
    expect(loginRes.ok()).toBe(true);
    const loginBody = await loginRes.json();
    const adminToken = loginBody.data?.token || loginBody.token;

    const schoolRes = await request.get('/api/sekolah', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(schoolRes.ok()).toBe(true);
    const schoolData = await schoolRes.json();
    const displayToken = schoolData.data?.display_token || schoolData.display_token;
    expect(displayToken).toBeDefined();

    // 2. Query santri display endpoint with authorized display token
    const res = await request.get(`/api/display/${slug}/santri`, {
      headers: {
        'x-display-token': displayToken,
      },
    });
    expect(res.status()).toBe(200);
    const rawText = await res.text();

    // Sensitive phone numbers must never be exposed (K1 requirement)
    expect(rawText).not.toContain('081234567890');
    expect(rawText).not.toContain('081298765432');
    expect(rawText).not.toMatch(/(08\d{8,11}|(\+62)\d{8,12})/);

    // Full unmasked names must NOT be exposed
    expect(rawText).not.toContain(TEST_USERS.wali.nama_santri); // 'Muhammad Fatih'
    expect(rawText).not.toContain(TEST_USERS.wali2.nama_santri); // 'Zaid bin Tsabit'

    // Verify student names follow first name + uppercase initials masking (K1 requirement)
    const body = JSON.parse(rawText);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    for (const item of body.data) {
      expect(item.nomor_telepon).toBeUndefined();
      expect(item.nama_santri).toBeDefined();
      expect(typeof item.nama_santri).toBe('string');

      // Masking contract: First name followed by uppercase initials with dot (e.g. "Muhammad F." or single name "Budi")
      expect(item.nama_santri).toMatch(/^[A-Za-z]+(\s+[A-Z]\.)*$/);
    }
  });

  test('Case 5: Non-existent school slug returns 404 without leaking stack trace', async ({
    request,
  }) => {
    const res = await request.get('/api/display/non-existent-school-slug-404-test/santri');

    // Expected 404 (or 401/403 if token validation runs first)
    expect([401, 403, 404]).toContain(res.status());
    const body = await res.json();
    expect(body.success).toBe(false);

    // Verify response does not leak internal SQL queries or server stack trace
    const responseString = JSON.stringify(body);
    expect(responseString).not.toContain('SELECT ');
    expect(responseString).not.toContain('node_modules');
  });
});
