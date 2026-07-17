# 📋 IMPLEMENTATION PLAN — Frontend (HalaqahId)

> **Dokumen ini berisi rencana implementasi bertahap frontend untuk mendukung
> ERD multi-tenant SaaS Halaqah.id**, selaras dengan [Backend Implementation Plan](../halaqah_id-BE-main/IMPLEMENTATION_PLAN.md).
>
> **Prinsip utama**: Progresif, backward-compatible, UX tidak terganggu untuk user existing.

---

## 📊 Tech Stack Existing
| Technology | Version |
|---|---|
| React | 19 |
| Vite | 7 |
| TypeScript | 5.9 |
| TailwindCSS | 4 |
| React Router | 7 |
| TanStack React Query | 5 |
| Radix UI | Latest |
| Zod | 4 |
| Axios | 1.13 |
| Recharts | 2 |
| i18next | 25 |
| Lucide React | Icons |
| React Hook Form | 7 |
| Sonner | Toast |

---

## 📊 Gap Analysis: Current Frontend vs Target

### Yang Sudah Ada
| Feature/Page | Status |
|---|---|
| Landing page (public) | ✅ |
| Blog (public + admin) | ✅ |
| Auth (Login, Register, Verify Email) | ✅ |
| Dashboard (Superadmin, Kepala, Muhafiz) | ✅ |
| Kelola Sekolah (Superadmin) | ✅ |
| Kelola User (Superadmin) | ✅ |
| Kelola Halaqah + Sesi | ✅ |
| Kelola Muhafiz | ✅ |
| Kelola Santri | ✅ |
| Setoran + Mushaf + Laporan | ✅ |
| Absensi | ✅ |
| Ujian (Settings + maybe management) | ✅ |
| Target Settings | ✅ |
| Kategori Settings | ✅ |
| Display (Public screen) | ✅ |
| Profil (Muhafiz/Sekolah) | ✅ |
| Settings (Form Setoran, Info, Trash) | ✅ |
| TahfidzAI | ✅ |
| Audit Log | ✅ |
| Progres Santri | ✅ |

### Yang Perlu Dibuat
| Feature/Page | Phase |
|---|---|
| **Tenant resolver** (slug → brand → context) | Phase 1 |
| **Tenant branding** (logo, warna, nama app dinamis) | Phase 1 |
| **RBAC dynamic** UI (manage roles/permissions) | Phase 1 |
| **UserProfile** page (pisah dari profil sederhana) | Phase 1 |
| **Multi-muhafiz per halaqah** UI | Phase 1 |
| **SantriWali** management UI | Phase 1 |
| **NIS** field di form santri | Phase 1 |
| **Riwayat Halaqah Santri** UI | Phase 1 |
| **Rubrik Template** management UI | Phase 1 |
| **Rubrik scoring** di form setoran | Phase 1 |
| **Progress Hafalan** dashboard/chart | Phase 1 |
| **Portal Orang Tua** (standalone public page) | Phase 1 |
| **Onboarding flow** (tenant registration) | Phase 1 |
| Kalender Akademik (TahunAjaran, Semester) | Phase 2 |
| Hari Libur management | Phase 2 |
| Program & Level Tahfidz | Phase 2 |
| Riwayat Akademik Santri | Phase 2 |
| Izin Santri management | Phase 2 |
| Pengumuman system | Phase 2 |
| Notifikasi center | Phase 2 |
| Rapor generation & view | Phase 2 |
| Ijazah & Sanad management | Phase 2 |
| Subscription & Billing UI | Phase 3 |
| Event management | Phase 3 |
| Dokumen management | Phase 3 |
| API Client management | Phase 3 |
| Webhook management | Phase 3 |
| Approval workflow UI | Phase 3 |

---

## 🛡️ Strategi Migrasi Frontend Aman

1. **Feature flags** — Fitur baru ditampilkan berdasarkan `TenantFeature` dari API
2. **Progressive enhancement** — UI lama tetap berfungsi, UI baru ditambahkan
3. **Conditional rendering** — Komponen baru render hanya jika data tersedia
4. **Type union** — Type baru extend type lama, bukan replace
5. **Lazy loading** — Semua page baru di-lazy load agar bundle tidak membesar
6. **Backward-compatible API calls** — Jika API field baru tidak ada, gunakan default

---

# ═══════════════════════════════════════════════════════════════
# PHASE 1: Core Platform Multi-Tenancy (Minggu 1-8)
# ═══════════════════════════════════════════════════════════════

## 🗓️ Minggu 1: Fondasi Tenant & Context

### Hari 1 — Tenant Context & Provider
**Objektif**: App bisa resolve tenant dan menyimpan konteks tenant.

**Tasks**:
- [ ] Buat type `src/types/domain/tenant.ts`:
  ```ts
  export interface Tenant {
    id_tenant: number;
    nama_tenant: string;
    slug: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  }
  
  export interface TenantBrand {
    logo_url: string | null;
    favicon_url: string | null;
    warna_primer: string | null;
    warna_sekunder: string | null;
    nama_aplikasi: string | null;
    copyright_text: string | null;
    login_background_url: string | null;
  }
  
  export interface TenantTerminology {
    kode_entity: string;
    label_default: string;
    label_custom: string | null;
  }
  
  export interface TenantFeature {
    feature_code: string;
    enabled: boolean;
    config: Record<string, unknown> | null;
  }
  ```
- [ ] Buat `src/store/tenant-context.tsx`:
  ```tsx
  // TenantProvider: resolve tenant dari slug, simpan di context
  // useTenant(): { tenant, brand, terminology, features, isLoading }
  // useTerminology(code): return label_custom || label_default
  // useFeature(code): return boolean
  ```
- [ ] Buat `src/lib/api/tenant.api.ts`:
  ```ts
  export const tenantApi = {
    resolve: (slug: string) => axios.get(`/api/tenant/${slug}`),
    getBrand: (id: number) => axios.get(`/api/tenant/${id}/brand`),
    getTerminology: (id: number) => axios.get(`/api/tenant/${id}/terminology`),
    getFeatures: (id: number) => axios.get(`/api/tenant/${id}/features`),
  };
  ```
- [ ] Update `src/config/` (jika ada) untuk include tenant slug config
- [ ] Backward compat: jika TENANT_MODE=single, gunakan default tenant

**Files to create/modify**:
- `src/types/domain/tenant.ts` [NEW]
- `src/store/tenant-context.tsx` [NEW]
- `src/lib/api/tenant.api.ts` [NEW]
- `src/App.tsx` [MODIFY — wrap with TenantProvider]

---

### Hari 2 — Tenant Branding & Theming
**Objektif**: UI menggunakan branding tenant (logo, warna, nama).

**Tasks**:
- [ ] Buat `src/lib/hooks/useTenantTheme.ts`:
  - Terapkan warna primer/sekunder dari TenantBrand ke CSS variables
  ```ts
  useEffect(() => {
    if (brand?.warna_primer) {
      document.documentElement.style.setProperty('--color-primary', brand.warna_primer);
    }
    if (brand?.warna_sekunder) {
      document.documentElement.style.setProperty('--color-secondary', brand.warna_sekunder);
    }
  }, [brand]);
  ```
- [ ] Update `src/index.css`: tambah CSS variables untuk tenant theming
  ```css
  :root {
    --color-primary: #4F46E5;     /* default, overridden by tenant */
    --color-secondary: #7C3AED;   /* default, overridden by tenant */
  }
  ```
- [ ] Update `DashboardLayout`:
  - Logo dari `brand.logo_url` (fallback ke logo default)
  - Nama aplikasi dari `brand.nama_aplikasi` (fallback ke "Halaqah.id")
  - Copyright dari `brand.copyright_text`
- [ ] Update login page:
  - Background dari `brand.login_background_url`
  - Logo dari `brand.logo_url`
- [ ] Update favicon dinamis dari `brand.favicon_url`

**Files to create/modify**:
- `src/lib/hooks/useTenantTheme.ts` [NEW]
- `src/index.css` [MODIFY]
- `src/layouts/DashboardLayout.tsx` [MODIFY]
- `src/features/auth/pages/LoginPage.tsx` [MODIFY]

---

### Hari 3 — Tenant Terminology System
**Objektif**: Label entity bisa dikustomisasi per-tenant.

**Tasks**:
- [ ] Buat `src/lib/hooks/useTerminology.ts`:
  ```ts
  export function useTerminology(kode: string): string {
    const { terminology } = useTenant();
    const term = terminology.find(t => t.kode_entity === kode);
    return term?.label_custom || term?.label_default || kode;
  }
  
  // Contoh: useTerminology('SANTRI') → "Santri" atau "Murid" atau "Siswa"
  // useTerminology('HALAQAH') → "Halaqah" atau "Kelas" atau "Kelompok"
  // useTerminology('MUHAFIZ') → "Muhafiz" atau "Ustadz" atau "Guru"
  ```
- [ ] Buat komponen `src/components/ui/Term.tsx`:
  ```tsx
  export function Term({ code }: { code: string }) {
    const label = useTerminology(code);
    return <>{label}</>;
  }
  ```
- [ ] Update seluruh halaman yang punya label hardcoded:
  - "Santri" → `<Term code="SANTRI" />`
  - "Halaqah" → `<Term code="HALAQAH" />`
  - "Muhafiz" → `<Term code="MUHAFIZ" />`
  - "Sekolah" → `<Term code="SEKOLAH" />`
- [ ] **Catatan**: Tidak perlu sekaligus semua, mulai dari:
  - Sidebar/navigation labels
  - Page titles
  - Form labels utama

**Files to create/modify**:
- `src/lib/hooks/useTerminology.ts` [NEW]
- `src/components/ui/Term.tsx` [NEW]
- Multiple pages [MODIFY — gradual]

---

### Hari 4 — Update Auth Flow (Tenant-Aware)
**Objektif**: Login/Register mendukung tenant context.

**Tasks**:
- [ ] Update `src/features/auth/`:
  - Login form: kirim `X-Tenant-Slug` header
  - Register form: kirim `id_tenant` atau slug
  - Token storage: simpan `id_tenant` dari JWT
- [ ] Update `src/lib/api/` (axios instance):
  - Interceptor: otomatis tambahkan `X-Tenant-Slug` header dari tenant context
  ```ts
  axios.interceptors.request.use((config) => {
    const tenant = getTenantFromContext();
    if (tenant?.slug) {
      config.headers['X-Tenant-Slug'] = tenant.slug;
    }
    return config;
  });
  ```
- [ ] Update `useAuth` hook:
  - Tambah `id_tenant` ke user state
  - Handle tenant mismatch (user login ke tenant yang salah)
- [ ] Update type `src/types/domain/enums.ts`:
  - Ensure Role type masih compatible

**Files to modify**:
- `src/features/auth/hooks/useAuth.ts` [MODIFY]
- `src/features/auth/pages/LoginPage.tsx` [MODIFY]
- `src/features/auth/pages/RegisterPage.tsx` [MODIFY]
- `src/lib/api/` (axios config) [MODIFY]

---

### Hari 5 — Feature Flag System
**Objektif**: UI component render berdasarkan tenant features.

**Tasks**:
- [ ] Buat `src/lib/hooks/useFeature.ts`:
  ```ts
  export function useFeature(code: string): boolean {
    const { features } = useTenant();
    return features.find(f => f.feature_code === code)?.enabled ?? false;
  }
  
  export function useFeatureConfig<T = unknown>(code: string): T | null {
    const { features } = useTenant();
    return features.find(f => f.feature_code === code)?.config as T ?? null;
  }
  ```
- [ ] Buat komponen `src/components/ui/FeatureGate.tsx`:
  ```tsx
  export function FeatureGate({ code, children, fallback }: {
    code: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    const enabled = useFeature(code);
    return enabled ? <>{children}</> : (fallback ?? null);
  }
  ```
- [ ] Update sidebar/navigation: hide menu items untuk fitur yang disabled
  ```tsx
  <FeatureGate code="UJIAN">
    <SidebarItem label="Ujian" />
  </FeatureGate>
  ```
- [ ] Feature codes yang di-gate:
  - `UJIAN` — menu ujian
  - `RUBRIK` — rubrik scoring
  - `TARGET` — target hafalan
  - `BLOG` — blog management
  - `PORTAL_WALI` — portal orang tua

**Files to create/modify**:
- `src/lib/hooks/useFeature.ts` [NEW]
- `src/components/ui/FeatureGate.tsx` [NEW]
- `src/layouts/DashboardLayout.tsx` [MODIFY — sidebar items]

---

## 🗓️ Minggu 2: RBAC Dynamic UI

### Hari 6 — Permission-Based UI Rendering
**Objektif**: UI elements render berdasarkan permissions dari DB.

**Tasks**:
- [ ] Update `useAuth` hook: tambah `permissions: string[]` dan `roles: string[]`
- [ ] Buat `src/lib/hooks/usePermission.ts`:
  ```ts
  export function usePermission(code: string): boolean {
    const { user } = useAuth();
    return user?.permissions.includes(code) ?? false;
  }
  
  export function useAnyPermission(codes: string[]): boolean {
    const { user } = useAuth();
    return codes.some(code => user?.permissions.includes(code));
  }
  ```
- [ ] Buat komponen `src/components/ui/PermissionGate.tsx`:
  ```tsx
  export function PermissionGate({ permission, children }: {
    permission: string | string[];
    children: React.ReactNode;
  }) {
    const has = Array.isArray(permission)
      ? useAnyPermission(permission)
      : usePermission(permission);
    return has ? <>{children}</> : null;
  }
  ```
- [ ] Update UI elements yang perlu permission check:
  - Button "Tambah Santri" → `<PermissionGate permission="santri.create">`
  - Button "Edit Halaqah" → `<PermissionGate permission="halaqah.update">`
  - Menu "Kelola User" → `<PermissionGate permission="user.manage">`

**Files to create/modify**:
- `src/lib/hooks/usePermission.ts` [NEW]
- `src/components/ui/PermissionGate.tsx` [NEW]
- Various pages [MODIFY — wrap action buttons]

---

### Hari 7 — Role Management Page
**Objektif**: UI untuk manage roles & permissions per-tenant.

**Tasks**:
- [ ] Buat `src/features/role/`:
  - `pages/KelolaRolePage.tsx`
    - List roles (system vs custom)
    - Create custom role (dialog)
    - Edit role (dialog)
    - Delete custom role (dengan konfirmasi)
  - `components/RoleForm.tsx`
    - Form: nama_role, kode_role
  - `components/PermissionMatrix.tsx`
    - Checkbox matrix: rows = permissions grouped by module, columns = aksi
    - Example: module "SANTRI" → [create, read, update, delete]
  - `api/role.api.ts`
    - CRUD role
    - Get/Update permissions
  - `hooks/useRoles.ts`
    - React Query hooks for role data
- [ ] Tambah route di `src/routes/index.tsx`:
  ```tsx
  { path: "/superadmin/roles", element: <KelolaRolePage /> }
  { path: "/kepala-muhafidz/settings/roles", element: <KelolaRolePage /> }
  ```
- [ ] Tambah menu item di sidebar

**Files to create**:
- `src/features/role/` [NEW directory]
  - `pages/KelolaRolePage.tsx`
  - `components/RoleForm.tsx`
  - `components/PermissionMatrix.tsx`
  - `api/role.api.ts`
  - `hooks/useRoles.ts`
  - `index.ts`

---

### Hari 8 — User Role Assignment UI
**Objektif**: Assign roles ke users melalui UI.

**Tasks**:
- [ ] Update `src/features/auth/pages/KelolaUserPage.tsx`:
  - Tambah kolom "Roles" di tabel user
  - Dialog/sheet: assign role ke user (multi-select)
  - Badge untuk setiap role yang dimiliki user
- [ ] Update user detail/edit form:
  - Multi-select roles (dari daftar role tenant)
  - Primary role indicator
- [ ] Buat `src/features/auth/components/UserRoleManager.tsx`:
  - List current roles
  - Add role (select dropdown)
  - Remove role (with confirmation)

**Files to create/modify**:
- `src/features/auth/pages/KelolaUserPage.tsx` [MODIFY]
- `src/features/auth/components/UserRoleManager.tsx` [NEW]

---

### Hari 9 — UserProfile Page
**Objektif**: Halaman profil user yang lebih lengkap.

**Tasks**:
- [ ] Buat `src/features/profil/pages/UserProfilePage.tsx`:
  - Tampilkan data dari UserProfile (nama_lengkap, foto, bio, dll)
  - Form edit profil
  - Upload foto profil
  - Untuk muhafiz: field spesialisasi, no_ijazah
- [ ] Buat `src/features/profil/api/profile.api.ts`:
  - GET/PUT profile
  - Upload foto
- [ ] Update `src/features/profil/pages/ProfilMuhafizPage.tsx`:
  - Integrasi dengan UserProfile API baru
  - Backward compat: jika UserProfile belum ada, tampilkan dari User.name
- [ ] Buat komponen `src/features/profil/components/AvatarUpload.tsx`:
  - Preview foto
  - Upload dengan crop/resize

**Files to create/modify**:
- `src/features/profil/pages/UserProfilePage.tsx` [NEW or MODIFY existing]
- `src/features/profil/api/profile.api.ts` [NEW]
- `src/features/profil/components/AvatarUpload.tsx` [NEW]

---

### Hari 10 — Auth Enhancement (Refresh Token, Reset Password)
**Objektif**: UI untuk forgot password & refresh token handling.

**Tasks**:
- [ ] Buat `src/features/auth/pages/ForgotPasswordPage.tsx`:
  - Form: email
  - Kirim request ke `/api/halaqah/auth/forgot-password`
  - Success message: "Cek email Anda"
- [ ] Buat `src/features/auth/pages/ResetPasswordPage.tsx`:
  - Form: password baru, konfirmasi password
  - Token dari URL query parameter
  - Submit ke `/api/halaqah/auth/reset-password`
- [ ] Update axios interceptor untuk handle refresh token:
  ```ts
  // Jika response 401 (token expired):
  // 1. Call /api/halaqah/auth/refresh
  // 2. Update stored token
  // 3. Retry original request
  // 4. Jika refresh juga gagal → redirect ke login
  ```
- [ ] Tambah route:
  ```tsx
  { path: "/forgot-password", element: <ForgotPasswordPage /> }
  { path: "/reset-password", element: <ResetPasswordPage /> }
  ```
- [ ] Update LoginPage: tambah link "Lupa Password?"

**Files to create/modify**:
- `src/features/auth/pages/ForgotPasswordPage.tsx` [NEW]
- `src/features/auth/pages/ResetPasswordPage.tsx` [NEW]
- `src/features/auth/pages/LoginPage.tsx` [MODIFY — tambah link]
- `src/lib/api/` (axios interceptor) [MODIFY]
- `src/routes/index.tsx` [MODIFY]

---

## 🗓️ Minggu 3: Halaqah & Santri Enhancement UI

### Hari 11 — Multi-Muhafiz per Halaqah UI
**Objektif**: UI untuk manage multiple muhafiz per halaqah.

**Tasks**:
- [ ] Update `src/features/halaqah/pages/KelolaHalaqahPage.tsx`:
  - Ubah dari select 1 muhafiz → multi-select dengan peran
  - Tampilkan list muhafiz di detail halaqah
- [ ] Buat `src/features/halaqah/components/HalaqahMuhafizManager.tsx`:
  - List muhafiz yang aktif (dengan peran: UTAMA, PENDAMPING, PENGGANTI)
  - Add muhafiz (dialog: pilih user + peran)
  - Change peran muhafiz
  - Remove muhafiz (dengan konfirmasi)
  - Badge: "Utama", "Pendamping", "Pengganti"
- [ ] Update halaqah form:
  - Remove single muhafiz select
  - Tambah section "Muhafiz" dengan HalaqahMuhafizManager
- [ ] Update API calls:
  - `src/features/halaqah/api/halaqah.api.ts` — tambah endpoint muhafiz management
- [ ] Backward compat: jika API lama masih return `id_muhafiz`, tampilkan sebagai muhafiz utama

**Files to create/modify**:
- `src/features/halaqah/components/HalaqahMuhafizManager.tsx` [NEW]
- `src/features/halaqah/pages/KelolaHalaqahPage.tsx` [MODIFY]
- `src/features/halaqah/api/halaqah.api.ts` [MODIFY]

---

### Hari 12 — Santri Wali Management UI
**Objektif**: UI untuk manage data wali santri.

**Tasks**:
- [ ] Buat `src/features/santri/components/SantriWaliSection.tsx`:
  - List wali santri (nama, hubungan, no telp, email, primary contact badge)
  - Add wali (inline form / dialog)
  - Edit wali
  - Delete wali (dengan konfirmasi)
  - Set primary contact
- [ ] Update santri detail page: tambah tab/section "Data Wali"
- [ ] Buat `src/features/santri/api/santri-wali.api.ts`:
  - CRUD wali santri
- [ ] Buat type `src/types/domain/santri-wali.ts`:
  ```ts
  export interface SantriWali {
    id_wali: number;
    id_santri: number;
    nama_wali: string;
    hubungan: 'AYAH' | 'IBU' | 'KAKEK' | 'NENEK' | 'PAMAN' | 'WALI' | 'LAINNYA';
    no_telepon: string | null;
    email: string | null;
    is_primary_contact: boolean;
  }
  ```

**Files to create/modify**:
- `src/features/santri/components/SantriWaliSection.tsx` [NEW]
- `src/features/santri/api/santri-wali.api.ts` [NEW]
- `src/types/domain/santri-wali.ts` [NEW]
- `src/features/santri/pages/KelolaSantriPage.tsx` [MODIFY]

---

### Hari 13 — NIS & Status Santri di Form
**Objektif**: Tambah field NIS dan status ke form/tabel santri.

**Tasks**:
- [ ] Update santri form `src/features/santri/`:
  - Tambah field `nomor_induk_santri` (auto-generated atau manual input)
  - Tambah field `status` (AKTIF, LULUS, KELUAR, CUTI) — dropdown
  - Tampilkan NIS di tabel list santri
  - Filter by status
- [ ] Update type `src/types/domain/santri.ts` (atau yang sesuai):
  ```ts
  export interface Santri {
    // ...existing fields...
    nomor_induk_santri: string | null;
    status: 'AKTIF' | 'LULUS' | 'KELUAR' | 'CUTI';
  }
  ```
- [ ] Update tabel santri:
  - Kolom NIS
  - Status badge (warna berbeda per status)
  - Filter dropdown status

**Files to modify**:
- `src/features/santri/pages/KelolaSantriPage.tsx` [MODIFY]
- `src/features/santri/components/` (forms) [MODIFY]
- `src/types/domain/` [MODIFY]

---

### Hari 14 — Riwayat Halaqah Santri UI
**Objektif**: Tampilan riwayat perpindahan halaqah santri.

**Tasks**:
- [ ] Buat `src/features/santri/components/RiwayatHalaqahSection.tsx`:
  - Timeline view: tanggal, halaqah lama → halaqah baru, alasan, dipindahkan oleh
  - Chronological order (terbaru di atas)
- [ ] Update santri detail: tambah tab "Riwayat Halaqah"
- [ ] Buat aksi "Pindah Halaqah" di detail santri:
  - Dialog: pilih halaqah tujuan, alasan
  - Konfirmasi
  - Auto-update halaqah santri + buat record riwayat
- [ ] API calls:
  - `GET /api/santri/:id/riwayat-halaqah`
  - `POST /api/santri/:id/pindah-halaqah`

**Files to create/modify**:
- `src/features/santri/components/RiwayatHalaqahSection.tsx` [NEW]
- `src/features/santri/pages/KelolaSantriPage.tsx` [MODIFY]

---

### Hari 15 — Review & Fix Minggu 1-3
**Tasks**:
- [ ] Review semua komponen baru
- [ ] Fix responsive design
- [ ] Fix accessibility (keyboard nav, screen reader)
- [ ] Testing semua form validations
- [ ] Cross-browser testing
- [ ] Build verification: `npm run build` harus sukses tanpa error

---

## 🗓️ Minggu 4: Rubrik & Setoran Enhancement UI

### Hari 16 — Rubrik Template Management Page
**Objektif**: UI untuk manage rubrik penilaian.

**Tasks**:
- [ ] Buat `src/features/rubrik/`:
  - `pages/KelolaRubrikPage.tsx`:
    - List rubrik template (tabel: nama, tipe, jumlah kriteria, is_default)
    - Create rubrik (dialog/page)
    - Edit rubrik + kriteria
    - Delete rubrik (soft delete)
  - `components/RubrikForm.tsx`:
    - Nama rubrik, tipe (SETORAN/UJIAN), is_default
  - `components/KriteriaEditor.tsx`:
    - Dynamic form: add/remove/reorder kriteria
    - Per kriteria: nama, bobot (%), skala_min, skala_max
    - Total bobot indicator (harus = 100%)
    - Drag & drop reorder (optional, bisa urutan manual)
  - `api/rubrik.api.ts`
  - `hooks/useRubrik.ts`
  - `index.ts`
- [ ] Tambah route:
  ```tsx
  { path: "/kepala-muhafidz/settings/rubrik", element: <KelolaRubrikPage /> }
  ```
- [ ] Tambah menu di settings sidebar

**Files to create**:
- `src/features/rubrik/` [NEW directory — semua file]

---

### Hari 17 — Rubrik Scoring di Form Setoran
**Objektif**: Form setoran mendukung penilaian rubrik.

**Tasks**:
- [ ] Update form setoran:
  - Jika kategori setoran punya rubrik → tampilkan scoring form
  - Per kriteria: nama, slider/input nilai (dalam range skala_min - skala_max)
  - Auto-hitung nilai akhir (weighted average)
  - Tampilkan preview: "Tajwid: 3/4 (30%), Kelancaran: 3.5/4 (40%), ..."
- [ ] Buat komponen `src/features/setoran/components/RubrikScoring.tsx`:
  ```tsx
  interface Props {
    rubrikId: number;
    kriteria: RubrikKriteria[];
    values: Record<number, number>;
    onChange: (values: Record<number, number>) => void;
  }
  ```
- [ ] Update list/detail setoran:
  - Tampilkan nilai rubrik jika ada
  - Expand row: detail nilai per kriteria
- [ ] Backward compat: jika tidak ada rubrik, form tetap seperti sekarang (taqwim sederhana)

**Files to create/modify**:
- `src/features/setoran/components/RubrikScoring.tsx` [NEW]
- `src/features/setoran/pages/SetoranPage.tsx` [MODIFY]
- `src/features/setoran/` (form components) [MODIFY]

---

### Hari 18 — Progress Hafalan Dashboard
**Objektif**: Visualisasi progress hafalan santri.

**Tasks**:
- [ ] Buat `src/features/progress/`:
  - `pages/ProgressDashboard.tsx`:
    - Overview: total juz, total halaman, surat terbaru
    - Grid/list surat 1-114 dengan status warna:
      - Belum (gray), Proses (yellow), Selesai (green), Lancar (blue)
    - Filter: per santri, per halaqah
  - `components/QuranProgressGrid.tsx`:
    - Grid 114 surat
    - Hover: detail (ayat terakhir, terakhir setor, total pengulangan)
    - Click: detail progress surat
  - `components/ProgressChart.tsx`:
    - Line chart: progress over time (menggunakan Recharts)
    - Bar chart: setoran per hari/minggu
  - `api/progress.api.ts`
  - `hooks/useProgress.ts`
- [ ] Tambah route:
  ```tsx
  { path: "/kepala-muhafidz/progress", element: <ProgressDashboard /> }
  { path: "/muhafidz/progress-hafalan", element: <ProgressDashboard /> }
  ```
- [ ] Update dashboard: widget ringkasan progress

**Files to create**:
- `src/features/progress/` [NEW directory — semua file]

---

### Hari 19 — Portal Orang Tua (Frontend)
**Objektif**: Standalone page untuk orang tua melihat progress anak.

**Tasks**:
- [ ] Buat `src/features/portal/`:
  - `pages/PortalLoginPage.tsx`:
    - Form: Pilih sekolah (by slug), NIS, No Telepon Wali
    - Kirim verifikasi ke backend
    - Simpan JWT portal di localStorage
  - `pages/PortalDashboard.tsx`:
    - Tampilan progress anak (read-only)
    - Tab: Progress Hafalan, Riwayat Setoran, Absensi, Hasil Ujian
  - `components/PortalProgressView.tsx`
  - `components/PortalSetoranHistory.tsx`
  - `components/PortalAbsensiView.tsx`
  - `components/PortalUjianView.tsx`
  - `api/portal.api.ts`
  - `hooks/usePortal.ts`
  - `store/portal-context.tsx`
- [ ] Route (public, tanpa DashboardLayout):
  ```tsx
  { path: "/:slug/portal", element: <PortalLoginPage /> }
  { path: "/:slug/portal/dashboard", element: <PortalDashboard /> }
  ```
- [ ] Design: clean, mobile-first, sederhana untuk orang tua
- [ ] Tidak menggunakan DashboardLayout — standalone layout khusus portal

**Files to create**:
- `src/features/portal/` [NEW directory — semua file]

---

### Hari 20 — Review & Fix Minggu 4
**Tasks**:
- [ ] Rubrik form testing
- [ ] Progress grid testing
- [ ] Portal testing (mobile responsive)
- [ ] Build verification
- [ ] Performance check (bundle size)

---

## 🗓️ Minggu 5-6: Tenant Management & Onboarding UI

### Hari 21 — Tenant Management Page (Platform Superadmin)
**Objektif**: UI untuk manage tenants.

**Tasks**:
- [ ] Buat `src/features/tenant/`:
  - `pages/KelolaTenantPage.tsx`:
    - List tenants (tabel: nama, slug, status, jumlah sekolah, jumlah user)
    - Create tenant (dialog)
    - Edit tenant
    - Suspend/Activate tenant
  - `components/TenantForm.tsx`
  - `components/TenantBrandForm.tsx`:
    - Logo upload, warna picker, nama app
  - `components/TenantTerminologyForm.tsx`:
    - Tabel: kode_entity, label_default, label_custom (editable)
  - `components/TenantFeatureToggle.tsx`:
    - List fitur dengan toggle on/off
  - `api/tenant-admin.api.ts`
  - `hooks/useTenants.ts`
- [ ] Route:
  ```tsx
  { path: "/superadmin/tenants", element: <KelolaTenantPage /> }
  { path: "/superadmin/tenants/:id", element: <TenantDetailPage /> }
  { path: "/superadmin/tenants/:id/brand", element: <TenantBrandForm /> }
  ```

**Files to create**:
- `src/features/tenant/` [NEW directory]

---

### Hari 22-23 — Onboarding Flow (Multi-step Registration)
**Objektif**: Multi-step wizard untuk registrasi tenant baru.

**Tasks**:
- [ ] Buat `src/features/onboarding/`:
  - `pages/OnboardingPage.tsx`:
    - Step 1: Info Tenant (nama, slug — dengan slug checker)
    - Step 2: Info Admin (nama, email, password)
    - Step 3: Info Sekolah (nama, jenis lembaga, alamat)
    - Step 4: Pilih Plan (jika billing aktif, atau skip)
    - Step 5: Konfirmasi & Submit
    - Success page: link ke login
  - `components/OnboardingWizard.tsx`:
    - Step indicator
    - Next/Back buttons
    - Progress bar
  - `components/SlugChecker.tsx`:
    - Realtime check ketersediaan slug
    - Debounced API call
    - Green check / red X
  - `api/onboarding.api.ts`
- [ ] Route:
  ```tsx
  { path: "/register-tenant", element: <OnboardingPage /> }
  // Atau update existing /register
  ```
- [ ] Design: premium, modern, welcoming onboarding experience

**Files to create**:
- `src/features/onboarding/` [NEW directory]

---

### Hari 24-25 — User Multi-Sekolah & Sekolah Switcher
**Objektif**: User bisa di-assign ke banyak sekolah dan switch antar sekolah.

**Tasks**:
- [ ] Buat `src/components/ui/SekolahSwitcher.tsx`:
  - Dropdown di header/sidebar
  - List sekolah yang di-assign ke user
  - Active sekolah indicator
  - Switch sekolah → update context, refetch data
- [ ] Update `useAuth` hook:
  - `activeSekolah`: sekolah yang sedang aktif
  - `sekolahList`: list semua sekolah user
  - `switchSekolah(id)`: switch sekolah aktif
- [ ] Update semua data fetching hooks:
  - Include `id_sekolah` dari active sekolah
- [ ] Update `KelolaUserPage`:
  - Tambah section "Sekolah" di user detail
  - Assign/remove user dari sekolah

**Files to create/modify**:
- `src/components/ui/SekolahSwitcher.tsx` [NEW]
- `src/features/auth/hooks/useAuth.ts` [MODIFY]
- `src/layouts/DashboardLayout.tsx` [MODIFY — add switcher]

---

## 🗓️ Minggu 7-8: Enhancement & Polish Phase 1

### Hari 26 — JenisLembaga Enum Update
**Tasks**:
- [ ] Update type `JenisLembaga`:
  ```ts
  export type JenisLembaga = 
    | 'PESANTREN' | 'RUMAH_TAHFIDZ' | 'TPQ' | 'MASJID'
    | 'SEKOLAH_FORMAL' | 'KOMUNITAS' | 'PRIVAT' | 'YAYASAN' | 'LAINNYA';
  ```
- [ ] Update form sekolah: semua opsi baru tersedia
- [ ] Update display: mapping label yang proper
- [ ] Backward compat: handle value lama (MADRASAH, SEKOLAH_UMUM, TPA)

---

### Hari 27 — Dashboard Enhancement
**Tasks**:
- [ ] Update `SuperadminDashboard`:
  - Widget: jumlah tenant, total sekolah, total santri, total user
  - Chart: pertumbuhan tenant per bulan
  - Recent activity: tenant baru, login terbaru
- [ ] Update `KepalaMuhafidzDashboard`:
  - Widget: progress hafalan rata-rata
  - Widget: absensi hari ini ringkasan
  - Widget: setoran hari ini ringkasan
  - Chart: trend setoran minggu ini
- [ ] Update `MuhafizDashboard`:
  - Progress hafalan santri-santri
  - Quick action: catat setoran, catat absensi
  - Notifikasi/pengumuman terbaru (jika feature enabled)

---

### Hari 28 — Ujian Enhancement UI
**Tasks**:
- [ ] Update ujian form: support rubrik-based scoring
  - Jika template `metode_penilaian = 'RUBRIK'` → tampilkan rubrik scoring
- [ ] Update ujian hasil: tampilkan detail nilai rubrik
- [ ] Update ujian report: include perbandingan rubrik

---

### Hari 29 — Accessibility & Responsive Polish
**Tasks**:
- [ ] Review semua halaman baru: keyboard navigation
- [ ] Screen reader testing: aria labels, roles
- [ ] Mobile responsive: portal wali, form setoran rubrik
- [ ] Dark mode compatibility: semua warna tenant theme
- [ ] Performance: lazy load semua page baru
- [ ] Bundle analysis: pastikan bundle size masih reasonable

---

### Hari 30 — Phase 1 Final & Build Verification
**Tasks**:
- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Full user flow testing:
  - [ ] Onboarding → Login → Dashboard → Manage halaqah → Setoran dengan rubrik → Progress
  - [ ] Portal wali: verify → view progress
  - [ ] Role management: create role → assign → verify access
- [ ] Update README.md

---

# ═══════════════════════════════════════════════════════════════
# PHASE 2: Akademik & Komunikasi (Minggu 9-16)
# ═══════════════════════════════════════════════════════════════

## 🗓️ Minggu 9-10: Kalender Akademik & Program

### Hari 31-32 — Kalender Akademik UI
**Tasks**:
- [ ] Buat `src/features/akademik/`:
  - `pages/KalenderAkademikPage.tsx`:
    - Tahun ajaran: list, create, set aktif
    - Semester: list per tahun ajaran, create
    - Calendar view: visual kalender dengan hari libur, event
  - `pages/HariLiburPage.tsx`:
    - List hari libur, create, edit, delete
    - Import hari libur nasional
  - `components/TahunAjaranForm.tsx`
  - `components/SemesterForm.tsx`
  - `components/HariLiburForm.tsx`
  - `api/akademik.api.ts`
- [ ] Routes:
  ```tsx
  { path: "/kepala-muhafidz/akademik", element: <KalenderAkademikPage /> }
  { path: "/kepala-muhafidz/akademik/hari-libur", element: <HariLiburPage /> }
  ```

---

### Hari 33-34 — Program & Level Tahfidz UI
**Tasks**:
- [ ] Buat `src/features/program/`:
  - `pages/KelolaProgramPage.tsx`:
    - List program
    - Create/edit program
    - Manage levels (nested CRUD)
  - `components/LevelEditor.tsx`:
    - Sortable list of levels
    - Per level: nama, target juz min/max

---

### Hari 35-36 — Riwayat Akademik & Kenaikan Level
**Tasks**:
- [ ] Buat `src/features/santri/components/RiwayatAkademikSection.tsx`:
  - Timeline: tahun ajaran, halaqah, level, status
- [ ] Buat batch action: "Naik Tahun Ajaran":
  - Pilih santri (bulk select)
  - Tentukan status (NAIK, TETAP, LULUS, KELUAR)
  - Konfirmasi
  - Batch process

---

## 🗓️ Minggu 11: Izin & Pengumuman UI

### Hari 37-38 — Izin Santri Management
**Tasks**:
- [ ] Buat `src/features/izin/`:
  - `pages/KelolaIzinPage.tsx`:
    - List izin (filter: status, santri, tanggal)
    - Create izin
    - Approve/reject izin
  - Tab atau badge count: Pending, Disetujui, Ditolak
  - Integrasi: izin disetujui → auto update absensi

---

### Hari 39-40 — Pengumuman System
**Tasks**:
- [ ] Buat `src/features/pengumuman/`:
  - `pages/KelolaPengumumanPage.tsx`:
    - List pengumuman, create, edit, delete
    - Target: All, Halaqah tertentu, Level tertentu, Santri tertentu
    - Prioritas: Normal, Penting, Urgent (dengan warna)
    - Pin/unpin
  - `pages/PengumumanListPage.tsx` (untuk user biasa):
    - List pengumuman yang relevan (berdasarkan target)
    - Read/unread indicator
    - Mark as read
  - `components/PengumumanCard.tsx`:
    - Card dengan prioritas indicator
    - Badge unread
  - Notification bell di header: unread count

---

## 🗓️ Minggu 12: Notifikasi UI

### Hari 41-42 — Notification Center
**Tasks**:
- [ ] Buat `src/features/notifikasi/`:
  - `components/NotificationBell.tsx`:
    - Bell icon di header
    - Badge unread count
    - Dropdown: recent notifications
  - `pages/NotifikasiPage.tsx`:
    - Full list notifikasi
    - Filter: channel, status
    - Mark as read
    - Mark all as read
  - `components/NotificationItem.tsx`:
    - Icon by type
    - Time ago
    - Read/unread styling

---

## 🗓️ Minggu 13: Rapor & Snapshot UI

### Hari 43-44 — Rapor Generation & View
**Tasks**:
- [ ] Buat `src/features/rapor/`:
  - `pages/KelolaRaporPage.tsx`:
    - List rapor per semester
    - Generate rapor (single / batch)
    - View rapor detail
    - Publish rapor
    - Download PDF (via @react-pdf/renderer)
  - `components/RaporCard.tsx`
  - `components/RaporPdfTemplate.tsx`:
    - Template PDF rapor santri
    - Data: progress, nilai, kehadiran, catatan

---

### Hari 45-46 — Progress Snapshot & Charts
**Tasks**:
- [ ] Update `src/features/progress/`:
  - `components/ProgressTimelineChart.tsx`:
    - Line chart: progress hafalan over time (dari snapshots)
    - Multiple metrics: juz, halaman, rata-rata harian
  - `components/ProgressComparisonChart.tsx`:
    - Bandingkan progress antar santri (bar chart)
  - `components/AttendanceChart.tsx`:
    - Pie chart kehadiran: hadir vs izin vs alfa

---

## 🗓️ Minggu 14: Ijazah & Sanad UI

### Hari 47-48 — Ijazah Management
**Tasks**:
- [ ] Buat `src/features/ijazah/`:
  - `pages/KelolaIjazahPage.tsx`:
    - List ijazah, create dari hasil ujian, view
    - Generate nomor ijazah
    - Print/download sertifikat
  - `components/IjazahPdfTemplate.tsx`
  - `pages/VerifikasiIjazahPage.tsx` (public):
    - Input nomor ijazah → tampilkan info verifikasi

---

### Hari 49-50 — Sanad Management
**Tasks**:
- [ ] Buat `src/features/sanad/`:
  - `pages/KelolaSanadPage.tsx`:
    - List sanad santri
    - Input rantai sanad (text area / structured input)
    - Upload file sanad
    - View sanad detail

---

## 🗓️ Minggu 15-16: Phase 2 Stabilization

### Hari 51-60 — Stabilisasi Phase 2
**Tasks**:
- [ ] Full regression testing
- [ ] Portal wali: tambah rapor, pengumuman
- [ ] Build verification
- [ ] Performance optimization
- [ ] Bundle analysis & code splitting
- [ ] Accessibility review
- [ ] Mobile responsive review semua page baru
- [ ] Update routes/index.tsx dengan semua route baru
- [ ] Update sidebar navigation

---

# ═══════════════════════════════════════════════════════════════
# PHASE 3: Monetisasi & Integrasi (Minggu 17-24)
# ═══════════════════════════════════════════════════════════════

## 🗓️ Minggu 17-18: Subscription & Billing UI

### Hari 61-64 — Billing & Subscription Pages
**Tasks**:
- [ ] Buat `src/features/billing/`:
  - `pages/PricingPage.tsx` (public):
    - Tampilkan plans (card comparison)
    - CTA: pilih plan → onboarding
  - `pages/SubscriptionPage.tsx` (admin tenant):
    - Current plan info
    - Usage meters: santri used/limit, user used/limit, sekolah used/limit
    - Upgrade/downgrade plan
    - Cancel subscription (dengan konfirmasi warning)
  - `pages/InvoicePage.tsx`:
    - List invoices
    - Invoice detail
    - Payment status
    - Download invoice PDF
  - `components/PlanCard.tsx`
  - `components/UsageMeter.tsx`
  - `components/SubscriptionBanner.tsx`:
    - Warning banner: trial ending, past due, cancelled

---

### Hari 65-66 — Limit Enforcement UI
**Tasks**:
- [ ] Buat `src/components/ui/LimitGuard.tsx`:
  - Jika limit tercapai (e.g. max santri), disable button create dan tampilkan pesan upgrade
- [ ] Update create forms: cek limit sebelum allow submit
- [ ] Banner: "Anda telah mencapai batas 100 santri. Upgrade plan untuk menambah lebih banyak."

---

## 🗓️ Minggu 19-20: Event & Dokumen UI

### Hari 67-70 — Event Management
**Tasks**:
- [ ] Buat `src/features/event/`:
  - `pages/KelolaEventPage.tsx`:
    - Calendar view / list view events
    - Create event (dialog)
    - Edit event
    - Manage participants
  - `components/EventCard.tsx`
  - `components/EventForm.tsx`
  - `components/ParticipantManager.tsx`

---

### Hari 71-72 — Dokumen Management
**Tasks**:
- [ ] Buat `src/features/dokumen/`:
  - `components/DokumenUploader.tsx`:
    - Drag & drop upload
    - File type icon
    - Progress bar
  - `components/DokumenList.tsx`:
    - Attachable to any entity (santri, ijazah, event, dll)
    - Download, preview (image/pdf), delete
  - Re-usable: embed di halaman santri detail, ijazah, dll

---

## 🗓️ Minggu 21-22: API Client & Webhook UI

### Hari 73-76 — API & Webhook Management
**Tasks**:
- [ ] Buat `src/features/api-management/`:
  - `pages/ApiClientPage.tsx`:
    - List API clients, create, revoke
    - Show client_id, generate secret (shown once)
    - Scope management
  - `pages/WebhookPage.tsx`:
    - List webhooks, create, edit, toggle, delete
    - Webhook event selection
    - Test webhook button
    - Delivery logs viewer

---

## 🗓️ Minggu 23-24: Approval & Final

### Hari 77-78 — Approval Workflow UI
**Tasks**:
- [ ] Buat `src/features/approval/`:
  - `components/ApprovalBanner.tsx`:
    - Inline banner pada entity yang pending approval
  - `pages/ApprovalQueuePage.tsx`:
    - List pending approvals
    - Approve/reject with reason
  - Integrate ke: ijazah, sanad, izin

---

### Hari 79-84 — Final Stabilization
**Tasks**:
- [ ] Complete regression testing
- [ ] Performance optimization & code splitting
- [ ] Accessibility audit final
- [ ] SEO audit (meta tags semua page)
- [ ] Production build verification
- [ ] Cross-browser/device testing
- [ ] Documentation update

---

# ═══════════════════════════════════════════════════════════════
# CATATAN TEKNIS FRONTEND
# ═══════════════════════════════════════════════════════════════

## File Structure Baru (Target Akhir)
```
src/
├── App.tsx
├── main.tsx
├── index.css
├── assets/
├── components/
│   └── ui/
│       ├── ...existing (button, dialog, etc.)...
│       ├── FeatureGate.tsx       ← Phase 1
│       ├── LimitGuard.tsx        ← Phase 3
│       ├── PermissionGate.tsx    ← Phase 1
│       ├── SekolahSwitcher.tsx   ← Phase 1
│       ├── spinner.tsx
│       └── Term.tsx              ← Phase 1
├── config/
├── features/
│   ├── absensi/
│   ├── akademik/                ← Phase 2 [NEW]
│   ├── api-management/          ← Phase 3 [NEW]
│   ├── approval/                ← Phase 3 [NEW]
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── ForgotPasswordPage.tsx  ← Phase 1 [NEW]
│   │   │   └── ResetPasswordPage.tsx   ← Phase 1 [NEW]
│   ├── billing/                 ← Phase 3 [NEW]
│   ├── blog/
│   ├── dashboard/
│   ├── display/
│   ├── dokumen/                 ← Phase 3 [NEW]
│   ├── event/                   ← Phase 3 [NEW]
│   ├── halaqah/
│   │   ├── components/
│   │   │   └── HalaqahMuhafizManager.tsx ← Phase 1 [NEW]
│   ├── ijazah/                  ← Phase 2 [NEW]
│   ├── izin/                    ← Phase 2 [NEW]
│   ├── landing/
│   ├── muhafiz/
│   ├── notifikasi/              ← Phase 2 [NEW]
│   ├── onboarding/              ← Phase 1 [NEW]
│   ├── pengumuman/              ← Phase 2 [NEW]
│   ├── portal/                  ← Phase 1 [NEW]
│   ├── profil/
│   │   ├── components/
│   │   │   └── AvatarUpload.tsx  ← Phase 1 [NEW]
│   ├── program/                 ← Phase 2 [NEW]
│   ├── progress/                ← Phase 1 [NEW]
│   ├── rapor/                   ← Phase 2 [NEW]
│   ├── role/                    ← Phase 1 [NEW]
│   ├── rubrik/                  ← Phase 1 [NEW]
│   ├── sanad/                   ← Phase 2 [NEW]
│   ├── santri/
│   │   ├── components/
│   │   │   ├── SantriWaliSection.tsx      ← Phase 1 [NEW]
│   │   │   └── RiwayatHalaqahSection.tsx  ← Phase 1 [NEW]
│   ├── sekolah/
│   ├── setoran/
│   │   ├── components/
│   │   │   └── RubrikScoring.tsx  ← Phase 1 [NEW]
│   ├── settings/
│   ├── shared/
│   ├── tahfidz-ai/
│   └── tenant/                  ← Phase 1 [NEW]
├── layouts/
├── lib/
│   ├── api/
│   │   └── tenant.api.ts        ← Phase 1 [NEW]
│   └── hooks/
│       ├── useFeature.ts         ← Phase 1 [NEW]
│       ├── usePermission.ts      ← Phase 1 [NEW]
│       ├── useTenantTheme.ts     ← Phase 1 [NEW]
│       └── useTerminology.ts     ← Phase 1 [NEW]
├── routes/
│   └── index.tsx                 [MODIFY — tambah semua route baru]
├── store/
│   ├── tenant-context.tsx        ← Phase 1 [NEW]
│   └── portal-context.tsx        ← Phase 1 [NEW]
├── types/
│   └── domain/
│       ├── tenant.ts             ← Phase 1 [NEW]
│       ├── santri-wali.ts        ← Phase 1 [NEW]
│       └── enums.ts              [MODIFY]
└── utils/
```

## Konvensi Kode

### Feature Module Structure
```
src/features/<feature>/
├── pages/        # Page components (lazy loaded)
├── components/   # Feature-specific components
├── api/          # API calls (axios)
├── hooks/        # React Query hooks + custom hooks
├── types/        # Feature-specific types (optional, bisa di src/types)
└── index.ts      # Barrel export
```

### API Hook Pattern
```ts
// hooks/useSomething.ts
export function useSomethingList(params: Params) {
  return useQuery({
    queryKey: ['something', params],
    queryFn: () => somethingApi.list(params),
  });
}

export function useSomethingCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: somethingApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['something'] });
      toast.success('Berhasil ditambahkan');
    },
  });
}
```

### Form Pattern
```tsx
// Gunakan react-hook-form + zod
const schema = z.object({
  nama: z.string().min(1, 'Wajib diisi'),
  // ...
});

type FormValues = z.infer<typeof schema>;

function SomethingForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  // ...
}
```

## Route Map Lengkap (Target Akhir)
```
Public:
  /                          → Landing
  /about, /features, etc.    → Landing pages
  /blog, /blog/:slug         → Blog
  /login                     → Login
  /register                  → Register
  /register-tenant           → Onboarding (Phase 1)
  /forgot-password           → Forgot Password (Phase 1)
  /reset-password             → Reset Password (Phase 1)
  /verify-email              → Verify Email
  /display/:slug             → Public Display
  /:slug/portal              → Portal Wali Login (Phase 1)
  /:slug/portal/dashboard    → Portal Wali Dashboard (Phase 1)
  /ijazah/verify/:nomor      → Verifikasi Ijazah (Phase 2)

Protected — Superadmin:
  /superadmin                → Dashboard
  /superadmin/tenants        → Kelola Tenant (Phase 1)
  /superadmin/tenants/:id    → Detail Tenant (Phase 1)
  /superadmin/sekolah        → Kelola Sekolah
  /superadmin/users          → Kelola User
  /superadmin/roles          → Kelola Role (Phase 1)
  /superadmin/audit-logs     → Audit Logs
  /superadmin/settings       → Settings
  /superadmin/blog           → Blog

Protected — Kepala Muhafidz:
  /kepala-muhafidz              → Dashboard
  /kepala-muhafidz/muhafiz      → Kelola Muhafiz
  /kepala-muhafidz/halaqah      → Kelola Halaqah
  /kepala-muhafidz/sesi         → Kelola Sesi
  /kepala-muhafidz/absensi      → Absensi
  /kepala-muhafidz/setoran      → Setoran
  /kepala-muhafidz/laporan      → Laporan
  /kepala-muhafidz/progress     → Progress Dashboard (Phase 1)
  /kepala-muhafidz/akademik     → Kalender Akademik (Phase 2)
  /kepala-muhafidz/izin         → Izin Santri (Phase 2)
  /kepala-muhafidz/pengumuman   → Pengumuman (Phase 2)
  /kepala-muhafidz/rapor        → Rapor (Phase 2)
  /kepala-muhafidz/ijazah       → Ijazah (Phase 2)
  /kepala-muhafidz/event        → Event (Phase 3)
  /kepala-muhafidz/settings/... → Settings (existing + new)
    .../roles                   → Kelola Role (Phase 1)
    .../rubrik                  → Kelola Rubrik (Phase 1)
    .../program                 → Program Tahfidz (Phase 2)
    .../api-clients             → API Clients (Phase 3)
    .../webhooks                → Webhooks (Phase 3)
  /kepala-muhafidz/billing      → Subscription (Phase 3)

Protected — Muhafiz:
  /muhafidz                → Dashboard
  /muhafidz/absensi        → Absensi
  /muhafidz/setoran        → Setoran
  /muhafidz/santri         → Kelola Santri
  /muhafidz/progres        → Progres Santri
  /muhafidz/izin           → Izin Santri (Phase 2)
  /muhafidz/pengumuman     → Pengumuman (Phase 2)
  /muhafidz/settings       → Settings
  /muhafidz/profil         → Profil
```

## Dependencies Baru (Potential)
```json
{
  "dependencies": {
    // Tidak ada dependency baru yang wajib — semua bisa dilakukan dengan stack existing
    // Optional:
    "@dnd-kit/core": "^x.x.x",      // Drag & drop untuk rubrik kriteria reorder
    "@dnd-kit/sortable": "^x.x.x",  // Sortable list
    "react-colorful": "^x.x.x"       // Color picker untuk tenant branding
  }
}
```
