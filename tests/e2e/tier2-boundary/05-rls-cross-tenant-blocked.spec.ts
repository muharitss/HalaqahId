import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 2: Boundary & Corner Cases - Multi-Tenant RLS & Cross-Tenant Blocked', () => {
  let adminTokenTenant1 = '';
  let adminTokenTenant2 = '';
  let realTenant2HalaqahId = 0;

  test.beforeAll(async ({ request }) => {
    // 1. Authenticate as Admin of Tenant 1 (Yayasan Bina Tahfidz Indonesia)
    const loginRes1 = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.admin.email,
        password: TEST_USERS.admin.password,
      },
      headers: {
        'x-tenant-slug': TEST_USERS.tenant.slug,
      },
    });

    if (loginRes1.ok()) {
      const body1 = await loginRes1.json();
      adminTokenTenant1 = body1.data?.token || body1.token || '';
    }

    // 2. Authenticate as Admin of Tenant 2 (Yayasan Tahfidz Rahmatan Lil Alamin)
    const loginRes2 = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.adminTenant2.email,
        password: TEST_USERS.adminTenant2.password,
      },
      headers: {
        'x-tenant-slug': TEST_USERS.tenant2.slug,
      },
    });

    if (loginRes2.ok()) {
      const body2 = await loginRes2.json();
      adminTokenTenant2 = body2.data?.token || body2.token || '';

      // Dynamically discover a real Halaqah entity belonging to Tenant 2
      const listRes2 = await request.get('/api/halaqah', {
        headers: {
          Authorization: `Bearer ${adminTokenTenant2}`,
          'x-tenant-slug': TEST_USERS.tenant2.slug,
        },
      });

      if (listRes2.ok()) {
        const listBody = await listRes2.json();
        const items = Array.isArray(listBody.data) ? listBody.data : [];
        if (items.length > 0) {
          realTenant2HalaqahId = items[0].id_halaqah || items[0].id;
        }
      }
    }

    // Fallback to seeded fixture ID if not dynamically fetched
    if (!realTenant2HalaqahId) {
      realTenant2HalaqahId = TEST_USERS.halaqahTenant2.id;
    }
  });

  test('Case 1: User from Tenant 1 cannot access foreign school display endpoint without token', async ({
    request,
  }) => {
    // Target real existing foreign school (Tenant 2: bina-quran) without valid display token
    const foreignSlug = TEST_USERS.sekolah2.slug;
    const res = await request.get(`/api/display/${foreignSlug}/santri`);

    // Must be rejected with 401 or 403 (unauthorized access to real foreign display)
    expect([401, 403]).toContain(res.status());
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test('Case 2: Admin from Tenant 1 cannot query or mutate real Tenant 2 halaqah/santri', async ({
    request,
  }) => {
    // Assert target entity exists
    expect(realTenant2HalaqahId).toBeGreaterThan(0);

    // 1. Attempt Read: Tenant 1 Admin queries Tenant 2 Halaqah
    const res = await request.get(`/api/halaqah/${realTenant2HalaqahId}`, {
      headers: {
        Authorization: `Bearer ${adminTokenTenant1}`,
        'x-tenant-slug': TEST_USERS.tenant.slug,
      },
    });

    // RLS / Tenant filter must block access (403 Forbidden or transparent 404)
    // CRITICAL INTEGRITY CHECK: Must NEVER return HTTP 200 OK
    expect(res.status()).not.toBe(200);
    expect([403, 404]).toContain(res.status());
    const body = await res.json();
    expect(body.success).toBe(false);

    // 2. Attempt Mutation: Tenant 1 Admin attempts to update Tenant 2 Halaqah
    const updateRes = await request.patch(`/api/halaqah/${realTenant2HalaqahId}`, {
      headers: {
        Authorization: `Bearer ${adminTokenTenant1}`,
        'x-tenant-slug': TEST_USERS.tenant.slug,
      },
      data: {
        name_halaqah: 'Cross-Tenant Mutated Name',
      },
    });

    expect(updateRes.status()).not.toBe(200);
    expect([403, 404]).toContain(updateRes.status());
    const updateBody = await updateRes.json();
    expect(updateBody.success).toBe(false);
  });

  test('Case 3: Cross-tenant headers (x-tenant-slug: other) with mismatched credentials return 403', async ({
    request,
  }) => {
    // Attempt login to REAL Tenant 2 ('tenant-dua') using credentials from Tenant 1
    const crossTenantLoginRes = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.admin.email,
        password: TEST_USERS.admin.password,
      },
      headers: {
        'x-tenant-slug': TEST_USERS.tenant2.slug, // Existing Tenant 2 slug
      },
    });

    // Must be rejected strictly with 403 Forbidden ("Akun Anda tidak terdaftar pada tenant ini")
    expect(crossTenantLoginRes.status()).toBe(403);
    const body = await crossTenantLoginRes.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/tidak terdaftar pada tenant ini/i);
  });

  test('Case 4: Portal Wali for Tenant 1 cannot access Tenant 2 portal endpoints', async ({
    request,
  }) => {
    const wali = TEST_USERS.wali;

    // Wali from 'al-hikmah' (Tenant 1) attempts verification against Tenant 2's real school ('bina-quran')
    const crossPortalRes = await request.post('/api/portal/verify', {
      data: {
        slug_sekolah: TEST_USERS.sekolah2.slug, // Existing School 2
        nis: wali.nis,
        no_telepon: wali.no_telepon,
      },
      headers: {
        'X-Forwarded-For': '198.51.100.91',
      },
    });

    // Must return 404 Not Found or 400 Bad Request
    expect([400, 404]).toContain(crossPortalRes.status());
    const body = await crossPortalRes.json();
    expect(body.success).toBe(false);
  });

  test('Case 5: Cross-tenant token substitution is rejected fail-closed', async ({ request }) => {
    // Send Tenant 1 admin token while asserting conflicting REAL x-tenant-slug header
    const conflictingTenantRes = await request.get('/api/halaqah', {
      headers: {
        Authorization: `Bearer ${adminTokenTenant1}`,
        'x-tenant-slug': TEST_USERS.tenant2.slug, // Real Tenant 2 slug
      },
    });

    // System must fail closed and MUST NOT return 200 OK
    expect(conflictingTenantRes.status()).not.toBe(200);
    expect([400, 401, 403, 404]).toContain(conflictingTenantRes.status());
    const body = await conflictingTenantRes.json();
    expect(body.success).toBe(false);
  });
});
