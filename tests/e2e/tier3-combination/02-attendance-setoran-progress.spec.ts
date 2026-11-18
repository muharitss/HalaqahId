import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 3: Pairwise Combinations - Attendance, Setoran Sequence & Leaderboard', () => {
  let muhafizToken = '';
  const santriId = 1; // Muhammad Fatih (Halaqah 1)

  test.beforeAll(async ({ request }) => {
    // Authenticate as Muhafiz 1 (Ustadz Ahmad Fauzi)
    const loginRes = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.muhafiz.email,
        password: TEST_USERS.muhafiz.password,
      },
    });
    expect(loginRes.ok()).toBe(true);
    const body = await loginRes.json();
    muhafizToken = body.data?.token || body.token || '';
    expect(muhafizToken).toBeTruthy();
  });

  test('TC-COMB-02-01: Bulk attendance marking for halaqah session', async ({
    request,
    page,
  }) => {
    const today = new Date().toISOString().slice(0, 10);

    // 1. Mark attendance for Santri 1 as HADIR
    const res = await request.post('/api/absensi', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        id_santri: santriId,
        id_sesi: 1, // Sesi Subuh
        tanggal: today,
        status: 'HADIR',
        keterangan: 'Hadir tepat waktu sesi subuh',
      },
    });

    expect([200, 201]).toContain(res.status());
    const body = await res.json();
    expect(body.success).toBe(true);

    // 2. Verify in UI absensi page
    await page.goto('/muhafidz/absensi');
    await expect(page).toHaveURL(/.*muhafidz\/absensi.*/);
  });

  test('TC-COMB-02-02: Consecutive sequence check and Murajaah/Ziyadah setoran recording', async ({
    request,
  }) => {
    const today = new Date().toISOString().slice(0, 10);

    // 1. Verify sequence check endpoint responds
    const checkRes = await request.get('/api/setoran/check', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      params: {
        id_santri: String(santriId),
        id_sesi: '1',
        id_kategori: '1',
        tanggal: today,
      },
    });
    expect(checkRes.status()).toBe(200);

    // 2. Submit valid Murajaah setoran (flexible sequence for revision)
    const setoranRes = await request.post('/api/setoran', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        id_santri: santriId,
        id_sesi: 1,
        id_kategori: 2, // Murajaah
        juz: 30,
        surat: 'An-Naba',
        ayat: '1-20',
        start_surat_id: 78,
        start_ayat: 1,
        end_surat_id: 78,
        end_ayat: 20,
        tanggal_setoran: today,
        keterangan: 'Murajaah lancar makharijul huruf baik',
      },
    });

    expect([200, 201]).toContain(setoranRes.status());
    const setoranBody = await setoranRes.json();
    expect(setoranBody.success).toBe(true);
  });

  test('TC-COMB-02-03: Invalid Ziyadah verse sequence is strictly rejected', async ({
    request,
  }) => {
    // Attempt to submit Ziyadah setoran skipping verse ranges (e.g. verse 25-30 skipping 1-24)
    const invalidRes = await request.post('/api/setoran', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        id_santri: santriId,
        id_kategori: 1, // Ziyadah (enforces strict sequence)
        juz: 30,
        start_surat_id: 80, // 'Abasa
        start_ayat: 25, // Skipping ayahs 1-24
        end_surat_id: 80,
        end_ayat: 30,
        surat: "'Abasa",
        ayat: '25-30',
        tanggal_setoran: new Date().toISOString().slice(0, 10),
      },
    });

    expect(invalidRes.status()).toBe(400);
    const body = await invalidRes.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/(urutan|tidak sesuai|melompati|validasi)/i);
  });

  test('TC-COMB-02-04: Leaderboard calculation reflects recorded progress and consistency', async ({
    request,
  }) => {
    // Query leaderboard for pekan_ini with consistency mode
    const res = await request.get('/api/setoran/leaderboard', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      params: {
        period: 'pekan_ini',
        mode: 'consistency',
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);

    if (body.data.length > 0) {
      const topEntry = body.data[0];
      expect(topEntry.rank).toBe(1);
      expect(topEntry.nama_santri).toBeDefined();
      expect(typeof topEntry.total_setoran_count).toBe('number');
    }
  });

  test('TC-COMB-02-05: Santri hafalan progress and report aggregation', async ({ request }) => {
    // Query individual hafalan report
    const res = await request.get(`/api/setoran/santri/${santriId}/laporan`, {
      headers: { Authorization: `Bearer ${muhafizToken}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
  });
});
