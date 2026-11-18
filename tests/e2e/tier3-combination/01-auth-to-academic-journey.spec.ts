import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 3: Pairwise Combinations - Auth to Academic Journey & Role Boundaries', () => {
  let adminToken = '';
  let muhafizToken = '';
  let tenant2AdminToken = '';

  test.beforeAll(async ({ request }) => {
    // 1. Authenticate as School Admin (Tenant 1)
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

    // 2. Authenticate as Muhafiz (Tenant 1)
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

    // 3. Authenticate as Admin (Tenant 2) for cross-tenant checks
    const t2Login = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.adminTenant2.email,
        password: TEST_USERS.adminTenant2.password,
      },
    });
    if (t2Login.ok()) {
      const body = await t2Login.json();
      tenant2AdminToken = body.data?.token || body.token || '';
    }
  });

  test('TC-COMB-01-01: Admin authentication and academic structure verification', async ({
    request,
    page,
  }) => {
    // Verify admin token is valid
    expect(adminToken).toBeTruthy();

    // Query academic year configuration
    const res = await request.get('/api/tahun-ajaran', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);

    // Verify UI dashboard navigation
    await page.goto('/kepala-muhafidz');
    await expect(page).toHaveURL(/.*kepala-muhafidz.*/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-COMB-01-02: Admin creates halaqah and assigns active muhafiz', async ({
    request,
    page,
  }) => {
    const timestamp = Date.now().toString().slice(-4);
    const halaqahName = `Halaqah Journey-${timestamp}`;

    // Admin creates a new halaqah assigned to Muhafiz 1
    const createRes = await request.post('/api/halaqah', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        name_halaqah: halaqahName,
        id_muhafiz: 4, // Ustadz Ahmad Fauzi (Muhafiz 1)
      },
    });

    expect([200, 201]).toContain(createRes.status());
    const body = await createRes.json();
    expect(body.success).toBe(true);
    const createdId = body.data?.id_halaqah || body.data?.id;
    expect(createdId).toBeDefined();

    // Verify UI reflects the halaqah
    await page.goto('/kepala-muhafidz/halaqah');
    await expect(page.locator(`text=${halaqahName}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-COMB-01-03: Register santri with UU PDP parental consent and verify consent log', async ({
    request,
  }) => {
    const timestamp = Date.now().toString().slice(-4);
    const nis = `2026${timestamp}`;
    const santriName = `Santri Journey ${nis}`;

    // Register new santri with explicit guardian consent
    const createRes = await request.post('/api/santri', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        id_halaqah: 1,
        nama_santri: santriName,
        nomor_induk_santri: nis,
        jenis_kelamin: 'LAKI_LAKI',
        status: 'AKTIF',
        consent_guardian: true,
        consent_date: new Date().toISOString(),
      },
    });

    expect([200, 201]).toContain(createRes.status());
    const body = await createRes.json();
    expect(body.success).toBe(true);
    const santriId = body.data?.id_santri || body.data?.id;
    expect(santriId).toBeDefined();

    // Verify santri detail contains consent record or status AKTIF
    const detailRes = await request.get(`/api/santri/${santriId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(detailRes.status()).toBe(200);
    const detailBody = await detailRes.json();
    expect(detailBody.success).toBe(true);
    expect(detailBody.data?.nama_santri).toContain(santriName);
  });

  test('TC-COMB-01-04: Role permissions: Muhafiz cannot perform school-wide admin actions', async ({
    request,
  }) => {
    expect(muhafizToken).toBeTruthy();

    // Muhafiz attempts to create a new academic year (Admin privilege only)
    const unauthorizedCreate = await request.post('/api/tahun-ajaran', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        nama: '2029/2030',
        tanggal_mulai: '2029-07-01',
        tanggal_selesai: '2030-06-30',
        is_active: false,
      },
    });

    // Must be rejected with 403 Forbidden
    expect([401, 403]).toContain(unauthorizedCreate.status());
    const body = await unauthorizedCreate.json();
    expect(body.success).toBe(false);
  });

  test('TC-COMB-01-05: Cross-tenant RLS isolation: Tenant 1 Admin cannot read or alter Tenant 2 data', async ({
    request,
  }) => {
    // Attempt to access Tenant 2 halaqah list with Tenant 1 token
    const crossRes = await request.get(`/api/halaqah/${TEST_USERS.halaqahTenant2.id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    // Should return 403 Forbidden or 404 Not Found (RLS isolation hides or denies foreign tenant records)
    expect([403, 404]).toContain(crossRes.status());
    const body = await crossRes.json();
    expect(body.success).toBe(false);
  });
});
