import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 2: Boundary & Corner Cases - Setoran Sequence & Parameter Validation', () => {
  let muhafizToken = '';

  test.beforeAll(async ({ request }) => {
    const loginRes = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.muhafiz.email,
        password: TEST_USERS.muhafiz.password,
      },
    });
    // Fail fast if authentication fails
    expect(loginRes.ok()).toBe(true);
    const body = await loginRes.json();
    muhafizToken = body.data?.token || body.token || '';
    expect(muhafizToken).toBeTruthy();
  });

  test('Case 1: Valid consecutive setoran passes', async ({ request }) => {
    // Murajaah setoran with valid range
    const today = new Date().toISOString().slice(0, 10);
    const validRes = await request.post('/api/setoran', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        id_santri: 3, // Ali bin Abi Thalib
        id_sesi: 1,
        id_kategori: 2, // Murajaah
        juz: 1,
        surat: 'Al-Baqarah',
        ayat: '21-30',
        start_surat_id: 2,
        start_ayat: 21,
        end_surat_id: 2,
        end_ayat: 30,
        tanggal_setoran: today,
        keterangan: 'Lancar',
      },
    });

    // Valid setoran must succeed with 200 or 201; 400 Bad Request is not acceptable
    expect([200, 201]).toContain(validRes.status());
    const body = await validRes.json();
    expect(body.success).toBe(true);
  });

  test('Case 2: Non-consecutive setoran (skipping ayahs) rejected with 400', async ({ request }) => {
    // Attempt Ziyadah setoran that skips verses
    const skipRes = await request.post('/api/setoran', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        id_santri: 1, // Muhammad Fatih (finished An-Naba 1-40)
        id_kategori: 1, // Ziyadah
        juz: 30,
        surat: "An-Nazi'at",
        ayat: '20-30',
        start_surat_id: 79,
        start_ayat: 20, // Skipping verses 1-19!
        end_surat_id: 79,
        end_ayat: 30,
      },
    });

    // Per SETORAN_ARCHITECTURE.md: Sequence violation must return 400 Bad Request
    expect(skipRes.status()).toBe(400);
    const body = await skipRes.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/(urutan|tidak sesuai|melompati|validasi)/i);
  });

  test('Case 3: Negative or 0 ayah number rejected with 400', async ({ request }) => {
    const invalidAyahRes = await request.post('/api/setoran', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        id_santri: 2,
        id_sesi: 1,
        id_kategori: 2,
        juz: 30,
        surat: "An-Naba'",
        ayat: '0-5',
        start_surat_id: 78,
        start_ayat: 0, // Ayah 0 is invalid (ayah numbers start at 1)
        end_surat_id: 78,
        end_ayat: 5,
      },
    });

    expect(invalidAyahRes.status()).toBe(400);
    const body = await invalidAyahRes.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/(ayat|minimal 1|valid|tidak valid)/i);
  });

  test('Case 4: End ayah smaller than start ayah in same surah rejected with 400', async ({
    request,
  }) => {
    const invertedRangeRes = await request.post('/api/setoran', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        id_santri: 2,
        id_sesi: 1,
        id_kategori: 2,
        juz: 30,
        surat: "An-Naba'",
        ayat: '25-10',
        start_surat_id: 78,
        start_ayat: 25,
        end_surat_id: 78,
        end_ayat: 10, // Inverted: end < start!
      },
    });

    expect(invertedRangeRes.status()).toBe(400);
    const body = await invertedRangeRes.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/(rentang|ayat|lebih besar|tidak valid)/i);
  });

  test('Case 5: Non-existent surah number (> 114) rejected with 400', async ({ request }) => {
    const invalidSurahRes = await request.post('/api/setoran', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        id_santri: 2,
        id_sesi: 1,
        id_kategori: 2,
        juz: 30,
        surat: 'Surah Palsu',
        ayat: '1-10',
        start_surat_id: 115, // Max Quran surahs = 114!
        start_ayat: 1,
        end_surat_id: 115,
        end_ayat: 10,
      },
    });

    expect(invalidSurahRes.status()).toBe(400);
    const body = await invalidSurahRes.json();
    expect(body.success).toBe(false);
  });
});
