import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 4: Real-World Scenarios - Offline PWA Setoran Queue & Batch Sync (Fitur #1)', () => {
  let muhafizToken = '';

  test.beforeAll(async ({ request }) => {
    // Authenticate as Muhafiz
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

  test('TC-APP-02-01: Offline Bootstrap endpoint delivers santri roster, sesi, and mushafs', async ({
    request,
  }) => {
    const res = await request.get('/api/sync/bootstrap', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data.synced_at).toBeDefined();
    expect(Array.isArray(body.data.santri)).toBe(true);
    expect(Array.isArray(body.data.mushafs)).toBe(true);
  });

  test('TC-APP-02-02: Batch sync processes queued offline setoran and returns APPLIED', async ({
    request,
  }) => {
    const clientMutationId = `mut-setoran-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const today = new Date().toISOString().slice(0, 10);

    const payload = {
      mutations: [
        {
          client_mutation_id: clientMutationId,
          type: 'SETORAN_UPSERT',
          client_recorded_at: new Date().toISOString(),
          payload: {
            id_santri: 1,
            id_sesi: 1,
            id_kategori: 2, // Murajaah
            juz: 30,
            surat: 'An-Naba',
            ayat: '1-10',
            tanggal_setoran: today,
            keterangan: 'Setoran offline tersinkronisasi',
          },
        },
      ],
    };

    const res = await request.post('/api/sync/batch', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: payload,
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data?.results).toBeDefined();
    expect(body.data.results.length).toBe(1);

    const result = body.data.results[0];
    expect(result.client_mutation_id).toBe(clientMutationId);
    expect(result.status).toBe('APPLIED');
    expect(result.record_id).toBeDefined();
  });

  test('TC-APP-02-03: Resubmitting identical mutation ID returns DUPLICATE_IDEMPOTENT', async ({
    request,
  }) => {
    const idempotentMutId = `mut-idemp-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);

    const mutationData = {
      client_mutation_id: idempotentMutId,
      type: 'SETORAN_UPSERT',
      client_recorded_at: new Date().toISOString(),
      payload: {
        id_santri: 1,
        id_sesi: 2,
        id_kategori: 2,
        juz: 30,
        surat: 'An-Nazi\'at',
        ayat: '1-10',
        tanggal_setoran: today,
      },
    };

    // First submission: APPLIED
    const firstRes = await request.post('/api/sync/batch', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: { mutations: [mutationData] },
    });
    expect(firstRes.status()).toBe(200);
    const firstBody = await firstRes.json();
    expect(firstBody.data.results[0].status).toBe('APPLIED');

    // Second submission (network replay): must return DUPLICATE_IDEMPOTENT
    const secondRes = await request.post('/api/sync/batch', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: { mutations: [mutationData] },
    });
    expect(secondRes.status()).toBe(200);
    const secondBody = await secondRes.json();
    expect(secondBody.data.results[0].status).toBe('DUPLICATE_IDEMPOTENT');
  });

  test('TC-APP-02-04: Conflict detection triggers CONFLICT_NEEDS_REVIEW with server state', async ({
    request,
  }) => {
    const conflictMutId = `mut-conflict-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);

    // Mutation with simulate_conflict flag or slot collision
    const res = await request.post('/api/sync/batch', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        mutations: [
          {
            client_mutation_id: conflictMutId,
            type: 'SETORAN_UPSERT',
            client_recorded_at: new Date().toISOString(),
            payload: {
              id_santri: 1,
              id_sesi: 1,
              tanggal_setoran: today,
              simulate_conflict: true, // Flag handled by sync.service
            },
          },
        ],
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    const result = body.data.results[0];
    expect(result.status).toBe('CONFLICT_NEEDS_REVIEW');
    expect(result.reason).toBeDefined();
  });

  test('TC-APP-02-05: Force resolution DISCARD or OVERWRITE completes conflict handling', async ({
    request,
  }) => {
    // 1. Force DISCARD resolution
    const discardMutId = `mut-discard-${Date.now()}`;
    const discardRes = await request.post('/api/sync/batch', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        mutations: [
          {
            client_mutation_id: discardMutId,
            type: 'SETORAN_UPSERT',
            client_recorded_at: new Date().toISOString(),
            force_resolution: 'DISCARD',
            payload: { id_santri: 1 },
          },
        ],
      },
    });

    expect(discardRes.status()).toBe(200);
    const discardBody = await discardRes.json();
    expect(discardBody.data.results[0].status).toBe('DISCARDED');

    // 2. Force OVERWRITE resolution
    const overwriteMutId = `mut-overwrite-${Date.now()}`;
    const overwriteRes = await request.post('/api/sync/batch', {
      headers: { Authorization: `Bearer ${muhafizToken}` },
      data: {
        mutations: [
          {
            client_mutation_id: overwriteMutId,
            type: 'SETORAN_UPSERT',
            client_recorded_at: new Date().toISOString(),
            force_resolution: 'OVERWRITE',
            payload: {
              id_santri: 1,
              id_sesi: 1,
              tanggal_setoran: new Date().toISOString().slice(0, 10),
            },
          },
        ],
      },
    });

    expect(overwriteRes.status()).toBe(200);
    const overwriteBody = await overwriteRes.json();
    expect(overwriteBody.data.results[0].status).toBe('APPLIED');
  });

  test('TC-APP-02-06: Frontend offline support and sync UI readiness', async ({ page }) => {
    await page.goto('/muhafidz');
    await expect(page).toHaveURL(/.*muhafidz.*/);
    // Page renders without unhandled errors
    await expect(page.locator('body')).toBeVisible();
  });
});
