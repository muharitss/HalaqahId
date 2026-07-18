# Walkthrough - Settings Refactoring

Struktur modul `src/features/settings` telah disesuaikan agar mematuhi arsitektur modular berbasis fitur yang ditetapkan di [.agents/AGENTS.md](file:///c:/Users/Muharits/programmer/halaqahid/HalaqahId/.agents/AGENTS.md). 

Semua logic (hooks), components, validation schema, dan types yang sebelumnya tersebar di tingkat atas feature folder kini dikelompokkan secara rapi ke sub-modules masing-masing.

---

## Perubahan Struktur Folder

Modul `settings` sekarang terstruktur sebagai berikut:
- **`api/services/`**: Berisi HTTP client wrapper untuk API settings.
- **`components/`**: Berisi shared presenter component (`SettingItem.tsx`).
- **`hooks/`**: Berisi root-level settings logic (`useSettingsPage.ts` & `useTrashSection.ts`).
- **`modules/`**:
  - `form-setoran/`
  - `kategori/`
  - `sop/`
  - `superadmin/`
  - `target/`
  - `ujian/`
- **`pages/`**: Hanya berisi file halaman (entry points routing) yang bersih dari inline logic monolitik.

---

## Rincian Perubahan Berdasarkan Modul

### 1. API Restructuring
- Pindahan `api/systemSettingsService.ts` & `api/targetService.ts` ke subfolder `api/services/`.
- Perbarui `api/index.ts` sebagai barrel export untuk API services.

### 2. Kategori Setoran (`modules/kategori`)
- Pindahan component table dan dialog dari `components/Kategori/` ke `modules/kategori/components/`.
- Pindahan hook dari `hooks/useKategoriSettings.ts` ke `modules/kategori/hooks/`.
- Ekstrak type `KategoriSetoran` ke file model terpisah.

### 3. Target Setoran (`modules/target`)
- Pindahan list, dialog, dan picker component dari `components/Target/` ke `modules/target/components/`.
- Pindahan schema Zod dari `validation/target.schema.ts` ke `modules/target/validation/target.schema.ts`.
- Pindahan hook `useTargetSettings.ts` & `useTarget.ts` ke `modules/target/hooks/`.

### 4. Pelaksanaan Ujian (`modules/ujian`)
- Pindahan calendar, dialogs, form, dan table components ke `modules/ujian/components/`.
- Pindahan hook `useUjianSettings.ts` ke `modules/ujian/hooks/`.
- Ekstrak helper function `evaluateFormula` dan tipe schema input ke `modules/ujian/utils/evaluateFormula.ts`.

### 5. Form Setoran (`modules/form-setoran`)
- Pindahan custom fields, list, dan preview components ke `modules/form-setoran/components/`.
- Pindahan hook `useFormSetoranSettings.ts` ke `modules/form-setoran/hooks/`.

### 6. Superadmin Settings (`modules/superadmin`)
- Pindahan platform, integrasi, seo, redirect, landing page, dan keamanan cards ke `modules/superadmin/components/`.
- Pindahan hook `useSuperadminSettings.ts` ke `modules/superadmin/hooks/`.

### 7. Pages Rename & Clean Up
- Ubah `InfoSection.tsx` menjadi `InfoPage.tsx`.
- Ubah `TrashSection.tsx` menjadi `TrashPage.tsx`.
- Perbarui seluruh routes di `src/routes/index.tsx` agar mengarah ke nama page yang baru.
- Hapus direktori kosong lama (`validation/`, `hooks/` selain file tersisa, `components/` subfolder).

---

## Verifikasi & Validasi
- Jalankan perintah `npm run build` dan berhasil tanpa adanya compile errors/type warnings.
