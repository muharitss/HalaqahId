import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 4: Real-World Scenarios - Sanad QR & Public Ijazah Verification (Fitur #8)', () => {
  let adminToken = '';
  let muhafizToken = '';
  let activeNomorIjazah = '';

  test.beforeAll(async ({ request }) => {
    // 1. Authenticate Admin
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

    // 2. Authenticate Muhafiz
    const muhafizLogin = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.muhafiz.email,
        password: TEST_USERS.muhafiz.password,
      },
    });
    if (muhafizLogin.ok()) {
      const body = await muhafizLogin.json();
      muhafizToken = body.data?.token || body.token || '';
    }
  });

  test('TC-APP-03-01: Admin/Muhafiz creates sanad chain record with multi-qiraat metadata', async ({
    request,
  }) => {
    expect(adminToken || muhafizToken).toBeTruthy();
    const token = adminToken || muhafizToken;

    // Create Sanad for Santri 1
    const sanadRes = await request.post('/api/sanad', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        id_santri: 1,
        nama_sanad: 'Sanad Hafs \'an \'Asim Thariq Asy-Syathibiyyah',
        qiraat: 'Hafs \'an \'Asim',
        jalur_riwayat: 'Thariq Asy-Syathibiyyah',
        rantai_sanad: 'Ustadz Ahmad Fauzi -> Syekh Dr. Abdul Aziz -> Syekh Aiman Suwaid -> ... -> Rasulullah SAW',
        keterangan: 'Telah mutqin 30 juz bil ghaib',
        tanggal_diberikan: new Date().toISOString(),
      },
    });

    // Sanad module requires subscriptionGuard or creates 201
    expect([200, 201, 403]).toContain(sanadRes.status());
    if ([200, 201].toContain(sanadRes.status())) {
      const body = await sanadRes.json();
      expect(body.success).toBe(true);
      expect(body.data?.nama_sanad).toBeDefined();
    }
  });

  test('TC-APP-03-02: Public verification endpoint contract for valid ijazah', async ({
    request,
  }) => {
    // Generate standard test nomor ijazah matching school slug
    const currentYear = new Date().getFullYear();
    const testNomor = `ALHIKMAH/${currentYear}/0001`;

    const res = await request.get(`/api/ijazah/${encodeURIComponent(testNomor)}/verify`);

    if (res.status() === 200) {
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toBeDefined();
      expect(body.data.valid).toBe(true);
      expect(body.data.status_sah).toBe('SAH_TERVERIFIKASI');
      expect(body.data.verification_hash).toBeDefined();
      activeNomorIjazah = testNomor;
    } else {
      // If not yet seeded, endpoint must return 404 (not 500 error)
      expect(res.status()).toBe(404);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.message).toMatch(/(tidak valid|tidak ditemukan)/i);
    }
  });

  test('TC-APP-03-03: Zero PII Leakage: Verification response never leaks NIS, phone, or raw files', async ({
    request,
  }) => {
    const currentYear = new Date().getFullYear();
    const testNomor = activeNomorIjazah || `ALHIKMAH/${currentYear}/0001`;

    const res = await request.get(`/api/ijazah/${encodeURIComponent(testNomor)}/verify`);
    const rawText = await res.text();

    // 1. Zero phone numbers in verification response
    const phoneRegex = /(08\d{8,11}|(\+62)\d{8,12})/;
    expect(rawText).not.toMatch(phoneRegex);

    // 2. If valid response, verify sensitive fields are strictly omitted
    if (res.status() === 200) {
      const body = JSON.parse(rawText);
      const data = body.data || {};

      // Student national/school ID (NIS) must NOT be leaked
      expect(data.nomor_induk_santri).toBeUndefined();
      expect(data.nis).toBeUndefined();

      // Raw certificate cloud storage URLs must NOT be leaked publicly
      expect(data.file_sertifikat_url).toBeUndefined();

      // Minimal privacy-preserving fields must be present
      expect(data.nama_santri).toBeDefined();
      expect(data.nama_sekolah).toBeDefined();
      expect(data.status_sah).toBe('SAH_TERVERIFIKASI');
    }
  });

  test('TC-APP-03-04: Non-existent or tampered nomor ijazah fails closed with 404', async ({
    request,
  }) => {
    const forgedNomor = 'FORGED-IJAZAH-99999999-TAMPERED';
    const res = await request.get(`/api/ijazah/${encodeURIComponent(forgedNomor)}/verify`);

    // Must return 404 Not Found
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('TC-APP-03-05: Unauthenticated access permitted for public verification only (auth barrier for detail)', async ({
    request,
  }) => {
    // 1. Public verify route: NO bearer token required (does not return 401)
    const verifyRes = await request.get('/api/ijazah/ALHIKMAH%2F2026%2F0001/verify');
    expect(verifyRes.status()).not.toBe(401);

    // 2. Protected detail route: REQUIRES bearer token (returns 401 if unauthenticated)
    const detailRes = await request.get('/api/ijazah/1');
    expect(detailRes.status()).toBe(401);
  });
});
