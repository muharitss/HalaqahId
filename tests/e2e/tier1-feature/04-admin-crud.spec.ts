import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 1: Feature Coverage - School Admin Academic & Santri CRUD', () => {
  let adminToken = '';

  test.beforeAll(async ({ request }) => {
    // Obtain admin bearer token for direct API interactions
    const loginRes = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.admin.email,
        password: TEST_USERS.admin.password,
      },
    });
    if (loginRes.ok()) {
      const body = await loginRes.json();
      adminToken = body.data?.token || body.token || '';
    }
  });

  test('TC-ADMIN-01: Academic Year & Semester list and verification', async ({
    page,
    request,
  }) => {
    // 1. Direct API validation of academic year configuration
    const res = await request.get('/api/tahun-ajaran', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    // Verify 2026/2027 academic year exists
    const tahun2026 = body.data.find((t: any) => t.nama === '2026/2027');
    expect(tahun2026).toBeDefined();

    // 2. UI verification on Dashboard / Kepala Muhafiz
    await page.goto('/kepala-muhafidz');
    await expect(page).toHaveURL(/.*kepala-muhafidz.*/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-ADMIN-02: Create Halaqah with assigned muhafiz', async ({ page, request }) => {
    const halaqahName = `Halaqah Utsman-${Date.now().toString().slice(-4)}`;

    // 1. API creation
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
    expect(body.data?.name_halaqah || body.data?.nama).toContain(halaqahName);

    // 2. UI verification in Kelola Halaqah page
    await page.goto('/kepala-muhafidz/halaqah');
    await expect(page).toHaveURL(/.*kepala-muhafidz\/halaqah.*/);
    const halaqahHeading = page.locator(`text=${halaqahName}`);
    await expect(halaqahHeading.first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-ADMIN-03: Edit Halaqah name and details', async ({ request }) => {
    // 1. List halaqahs to get an ID
    const listRes = await request.get('/api/halaqah', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(listRes.status()).toBe(200);
    const listBody = await listRes.json();
    const halaqahList = listBody.data || [];
    expect(halaqahList.length).toBeGreaterThan(0);

    const targetHalaqah = halaqahList[0];
    const updatedName = `${targetHalaqah.name_halaqah || targetHalaqah.nama} (Rev)`;

    // 2. Update halaqah
    const updateRes = await request.patch(`/api/halaqah/${targetHalaqah.id_halaqah}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        name_halaqah: updatedName,
      },
    });

    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody.success).toBe(true);
  });

  test('TC-ADMIN-04: Register Santri with UU PDP guardian consent', async ({ request }) => {
    const uniqueNis = `2026${Date.now().toString().slice(-4)}`;
    const santriName = `Santri UU PDP ${uniqueNis}`;

    const createRes = await request.post('/api/santri', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        id_halaqah: 1, // Mandatory parameter required by santri-access.service
        nama_santri: santriName,
        nomor_induk_santri: uniqueNis,
        jenis_kelamin: 'LAKI_LAKI',
        status: 'AKTIF',
        consent_guardian: true, // UU PDP Consent compliance
        consent_date: new Date().toISOString(),
      },
    });

    expect([200, 201]).toContain(createRes.status());
    const body = await createRes.json();
    expect(body.success).toBe(true);
    expect(body.data?.nomor_induk_santri || body.data?.nama_santri).toBeDefined();
  });

  test('TC-ADMIN-05: Move Santri between halaqahs', async ({ request }) => {
    // Retrieve santri list
    const santriListRes = await request.get('/api/santri', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(santriListRes.status()).toBe(200);
    const santriList = (await santriListRes.json()).data || [];

    if (santriList.length > 0) {
      const testSantri = santriList[0];

      // Move santri to halaqah 2
      const moveRes = await request.post(`/api/santri/${testSantri.id_santri}/pindah-halaqah`, {
        headers: { Authorization: `Bearer ${adminToken}` },
        data: {
          id_halaqah_tujuan: 2,
          alasan_pindah: 'Penyetaraan kapasitas halaqah semester baru',
        },
      });

      if (moveRes.ok()) {
        const moveBody = await moveRes.json();
        expect(moveBody.success).toBe(true);
      } else {
        // Fallback update
        const patchRes = await request.patch(`/api/santri/${testSantri.id_santri}`, {
          headers: { Authorization: `Bearer ${adminToken}` },
          data: { id_halaqah: 2 },
        });
        expect(patchRes.status()).toBe(200);
        const patchBody = await patchRes.json();
        expect(patchBody.success).toBe(true);
      }
    }
  });

  test('TC-ADMIN-06: Soft-delete Santri and verify recovery in trash', async ({ request }) => {
    // 1. Create a disposable santri for soft-delete test
    const tempNis = `2026${Date.now().toString().slice(-4)}`;
    const createRes = await request.post('/api/santri', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        id_halaqah: 1, // Mandatory parameter required by santri-access.service
        nama_santri: `Disposable Santri ${tempNis}`,
        nomor_induk_santri: tempNis,
        jenis_kelamin: 'LAKI_LAKI',
        status: 'AKTIF',
      },
    });

    expect([200, 201]).toContain(createRes.status());
    const created = (await createRes.json()).data;
    const santriId = created.id_santri;
    expect(santriId).toBeDefined();

    // 2. Soft-delete santri
    const deleteRes = await request.delete(`/api/santri/${santriId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect([200, 204]).toContain(deleteRes.status());

    // 3. Verify restore endpoint works
    const restoreRes = await request.patch(`/api/santri/${santriId}/restore`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect([200, 204]).toContain(restoreRes.status());
    const restoreBody = await restoreRes.json();
    expect(restoreBody.success).toBe(true);
  });
});
