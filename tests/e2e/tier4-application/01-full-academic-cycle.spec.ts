import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 4: Real-World Scenarios - Full Academic Tahfidz Lifecycle', () => {
  let adminToken = '';
  let muhafizToken = '';
  let portalToken = '';

  let createdHalaqahId: number;
  let createdSantriId: number;
  const uniqueSuffix = Date.now().toString().slice(-4);
  const cycleSantriNis = `2026${uniqueSuffix}`;
  const cycleSantriName = `Santri Cycle ${cycleSantriNis}`;
  const halaqahName = `Halaqah Cycle-${uniqueSuffix}`;

  test.beforeAll(async ({ request }) => {
    // 1. Admin Login
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

    // 2. Muhafiz Login
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

    // 3. Wali Portal OTP Login
    const wali = TEST_USERS.wali;
    const otpRes = await request.post('/api/portal/otp/verify', {
      data: {
        slug: wali.sekolah_slug,
        nis: wali.nis,
        otp: wali.otp,
      },
      headers: { 'X-Forwarded-For': '203.0.113.150' },
    });
    if (otpRes.ok()) {
      const body = await otpRes.json();
      portalToken = body.data?.token || body.token || '';
    } else {
      const direct = await request.post('/api/portal/verify', {
        data: {
          slug_sekolah: wali.sekolah_slug,
          nis: wali.nis,
          no_telepon: wali.no_telepon,
        },
        headers: { 'X-Forwarded-For': '203.0.113.150' },
      });
      if (direct.ok()) {
        const body = await direct.json();
        portalToken = body.data?.token || body.token || '';
      }
    }
  });

  test('TC-APP-01-01: [Stage 1 - Admin] Create halaqah and enroll santri with parental consent', async ({
    request,
  }) => {
    expect(adminToken).toBeTruthy();

    // 1. Create halaqah
    const createHalaqahRes = await request.post('/api/halaqah', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        name_halaqah: halaqahName,
        id_muhafiz: 4, // Ustadz Ahmad Fauzi
      },
    });
    expect([200, 201]).toContain(createHalaqahRes.status());
    const halaqahBody = await createHalaqahRes.json();
    createdHalaqahId = halaqahBody.data?.id_halaqah || halaqahBody.data?.id || 1;

    // 2. Enroll santri with UU PDP guardian consent
    const createSantriRes = await request.post('/api/santri', {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: {
        id_halaqah: createdHalaqahId,
        nama_santri: cycleSantriName,
        nomor_induk_santri: cycleSantriNis,
        jenis_kelamin: 'LAKI_LAKI',
        status: 'AKTIF',
        consent_guardian: true,
        consent_date: new Date().toISOString(),
      },
    });

    expect([200, 201]).toContain(createSantriRes.status());
    const santriBody = await createSantriRes.json();
    createdSantriId = santriBody.data?.id_santri || santriBody.data?.id;
    expect(createdSantriId).toBeDefined();
  });

  test('TC-APP-01-02: [Stage 2 - Muhafiz] Record attendance and tahfidz setoran', async ({
    request,
  }) => {
    expect(muhafizToken).toBeTruthy();
    const today = new Date().toISOString().slice(0, 10);
    const targetSantriId = createdSantriId || 1;

    // 1. Record attendance
    const absensiRes = await request.post('/api/absensi', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        id_santri: targetSantriId,
        id_sesi: 1,
        tanggal: today,
        status: 'HADIR',
        keterangan: 'Hadir halaqah pagi',
      },
    });
    expect([200, 201]).toContain(absensiRes.status());

    // 2. Record Murajaah setoran
    const setoranRes = await request.post('/api/setoran', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        id_santri: targetSantriId,
        id_sesi: 1,
        id_kategori: 2, // Murajaah
        juz: 30,
        surat: 'An-Naba',
        ayat: '1-15',
        start_surat_id: 78,
        start_ayat: 1,
        end_surat_id: 78,
        end_ayat: 15,
        tanggal_setoran: today,
        keterangan: 'Lancar, tajwid baik',
      },
    });
    expect([200, 201]).toContain(setoranRes.status());
  });

  test('TC-APP-01-03: [Stage 3 - Wali] Verify child attendance and setoran progress in portal', async ({
    request,
  }) => {
    expect(portalToken).toBeTruthy();

    // 1. Fetch child attendance in portal
    const absensiRes = await request.get('/api/portal/absensi', {
      headers: { Authorization: `Bearer ${portalToken}` },
    });
    expect(absensiRes.status()).toBe(200);
    const absensiBody = await absensiRes.json();
    expect(absensiBody.success).toBe(true);

    // 2. Fetch child setoran history in portal
    const setoranRes = await request.get('/api/portal/setoran', {
      headers: { Authorization: `Bearer ${portalToken}` },
    });
    expect(setoranRes.status()).toBe(200);
    const setoranBody = await setoranRes.json();
    expect(setoranBody.success).toBe(true);
  });

  test('TC-APP-01-04: [Stage 4 - Admin] Review halaqah progress report and statistics', async ({
    request,
  }) => {
    expect(adminToken).toBeTruthy();

    // Query academic reports / halaqah list
    const halaqahListRes = await request.get('/api/halaqah', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(halaqahListRes.status()).toBe(200);
    const body = await halaqahListRes.json();
    expect(body.success).toBe(true);
  });

  test('TC-APP-01-05: [Stage 5 - Lifecycle] Soft delete student and verify trash recovery', async ({
    request,
  }) => {
    expect(adminToken).toBeTruthy();
    const targetSantriId = createdSantriId;

    if (targetSantriId) {
      // Soft-delete
      const delRes = await request.delete(`/api/santri/${targetSantriId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect([200, 204]).toContain(delRes.status());

      // Restore
      const restoreRes = await request.patch(`/api/santri/${targetSantriId}/restore`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect([200, 204]).toContain(restoreRes.status());
    }
  });
});
