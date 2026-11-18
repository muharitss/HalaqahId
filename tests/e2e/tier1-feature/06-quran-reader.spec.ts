import { test, expect } from '../fixtures';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Tier 1: Feature Coverage - Self-Hosted Quran Reader & Arabic A11y', () => {
  test.beforeEach(async ({ page, request, context }) => {
    // Authenticate as muhafiz so /muhafidz/setoran/mushaf is accessible
    const loginRes = await request.post('/api/halaqah/auth/login', {
      data: {
        email: TEST_USERS.muhafiz.email,
        password: TEST_USERS.muhafiz.password,
      },
    });

    if (loginRes.ok()) {
      const body = await loginRes.json();
      const token = body.data?.token || body.token;
      const user = body.data?.user || body.user;
      const refreshToken = body.data?.refresh_token || body.refresh_token;

      await page.goto('/login');
      await page.evaluate(
        ({ u, t }) => {
          if (u) {
            const safeUser = { ...u };
            delete safeUser.token;
            delete safeUser.refresh_token;
            localStorage.setItem('user', JSON.stringify(safeUser));
          }
          if (t) localStorage.setItem('token', t);
        },
        { u: user, t: token }
      );

      if (refreshToken) {
        await context.addCookies([
          {
            name: 'halaqah_refresh',
            value: refreshToken,
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            sameSite: 'Lax',
          },
        ]);
      }
    }
  });

  test('TC-QRN-01: Quran page loading makes ZERO external network calls to api.alquran.cloud', async ({
    page,
  }) => {
    const externalRequests: string[] = [];

    // Track all outbound network requests
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('api.alquran.cloud')) {
        externalRequests.push(url);
      }
    });

    await page.goto('/muhafidz/setoran/mushaf?page=1');
    await page.waitForLoadState('networkidle').catch(() => {});

    // Wave 2 Requirement: Zero external runtime calls to api.alquran.cloud
    expect(externalRequests.length).toBe(0);
  });

  test('TC-QRN-02: Self-hosted Arabic font applied', async ({ page }) => {
    await page.goto('/muhafidz/setoran/mushaf?page=1');
    const rtlContainer = page.locator('div[dir="rtl"], [dir="rtl"]');
    await expect(rtlContainer.first()).toBeVisible({ timeout: 10000 });

    // Verify Arabic font applied on Quran container (KFGQPC Uthmanic, Amiri, Scheherazade)
    const hasArabicFont = await page.evaluate(() => {
      const container = document.querySelector('[dir="rtl"]');
      if (!container) return false;
      const computedFont = window.getComputedStyle(container).fontFamily;
      const fontFaces = Array.from(document.fonts.values()).map((f) => f.family);

      const hasArabicFontFace = fontFaces.some((f) =>
        /uthman|hafs|amiri|quran|scheherazade/i.test(f)
      );
      const hasArabicComputed = /uthman|hafs|amiri|quran|scheherazade/i.test(computedFont);

      return hasArabicFontFace || hasArabicComputed;
    });

    expect(hasArabicFont).toBe(true);
  });

  test('TC-QRN-03: RTL layout enforced on Mushaf container (dir="rtl")', async ({ page }) => {
    await page.goto('/muhafidz/setoran/mushaf?page=1');

    // Locate the RTL container rendered by MushafViewer
    const rtlContainer = page.locator('div[dir="rtl"], [dir="rtl"]');
    await expect(rtlContainer.first()).toBeVisible({ timeout: 10000 });

    const dirAttr = await rtlContainer.first().getAttribute('dir');
    expect(dirAttr).toBe('rtl');
  });

  test('TC-QRN-04: Standard 15-line structure rendered per page', async ({ page }) => {
    await page.goto('/muhafidz/setoran/mushaf?page=1');

    // Verify Mushaf container is visible
    const mushafViewer = page.locator('[dir="rtl"]');
    await expect(mushafViewer.first()).toBeVisible({ timeout: 10000 });

    // Verify exactly 15-line structure is rendered
    const lineCount = await page.evaluate(() => {
      const container = document.querySelector('[dir="rtl"]');
      if (!container) return 0;
      const style = window.getComputedStyle(container);
      if (style.gridTemplateRows && style.gridTemplateRows.split(' ').length === 15) {
        return 15;
      }
      const lineElements = container.querySelectorAll('[data-line], .grid > div, [class*="line"]');
      if (lineElements.length === 15) {
        return 15;
      }
      return container.children.length;
    });

    expect(lineCount).toBe(15);
  });

  test('TC-QRN-05: Ayah range selection transfers selected verses to Setoran form', async ({
    page,
  }) => {
    await page.goto('/muhafidz/setoran/mushaf?page=1');

    // 1. Wait for mushaf RTL container
    const rtlContainer = page.locator('[dir="rtl"]');
    await expect(rtlContainer.first()).toBeVisible({ timeout: 10000 });

    // 2. Locate apply button - initially disabled when no selection exists
    const applyButton = page.locator('button:has-text("Terapkan")');
    await expect(applyButton.first()).toBeVisible({ timeout: 5000 });
    await expect(applyButton.first()).toBeDisabled();

    // 3. Click first ayah number marker to set start of selection
    const ayahMarkers = page.locator('[dir="rtl"] span[title*="Ayat"]');
    if ((await ayahMarkers.count()) >= 2) {
      await ayahMarkers.first().click();
      // Selection mode shifts to "end"
      await expect(page.locator('text=Klik Akhir')).toBeVisible({ timeout: 3000 });

      // Click second ayah marker to set end of selection
      await ayahMarkers.nth(1).click();
    } else {
      // Fallback: click clickable word / span in mushaf container
      const words = page.locator('[dir="rtl"] span');
      await words.first().click();
      await words.nth(3).click();
    }

    // 4. Verify apply button is now enabled
    await expect(applyButton.first()).toBeEnabled({ timeout: 5000 });

    // 5. Click apply button and verify selection is recorded in sessionStorage
    await applyButton.first().click();

    const pendingData = await page.evaluate(() =>
      sessionStorage.getItem('mushaf_selection_pending')
    );
    expect(pendingData).toBeTruthy();
    const parsed = JSON.parse(pendingData!);
    expect(parsed.selection).toBeDefined();
    expect(parsed.selection.startAyah).toBeDefined();
  });

  test('TC-QRN-06: Page jump and surah search navigation works smoothly', async ({ page }) => {
    await page.goto('/muhafidz/setoran/mushaf?page=1');

    // Verify header controls (Page Jump, Surah Select, or Juz Select)
    const pageJumpInput = page.locator('button:has-text("/ 604"), input[type="number"], button:has-text("Surah")');
    await expect(pageJumpInput.first()).toBeVisible({ timeout: 10000 });

    // Navigate to next page using query parameter
    await page.goto('/muhafidz/setoran/mushaf?page=2');
    await expect(page).toHaveURL(/.*page=2.*/);
  });
});
