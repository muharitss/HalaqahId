## 7. Data Models

### 7.1 User

| Field        | Type        | Keterangan                    |
|-------------|------------|-------------------------------|
| `id_user`   | `int`      | Primary key, auto increment   |
| `name`      | `string`   | Nama lengkap                  |
| `email`     | `string`   | Unique                        |
| `password`  | `string`   | Hashed (bcrypt)               |
| `role`      | `enum`     | `SUPERADMIN`, `ADMIN`, `KOORDINATOR_TAHFIZ`, `MUHAFIZ` |
| `is_verified`| `boolean` | Apakah email sudah diverifikasi |
| `id_sekolah`| `int?`     | FK ke Sekolah (nullable)      |
| `deleted_at`| `datetime?`| Soft delete timestamp         |

> **Catatan**: Model `User` **tidak** memiliki field `created_at` / `updated_at`.

### 7.2 Sekolah

| Field          | Type        | Keterangan                    |
|---------------|------------|-------------------------------|
| `id_sekolah`  | `int`      | Primary key, auto increment   |
| `nama_sekolah`| `string`   | Nama sekolah                  |
| `email`       | `string`   | Email sekolah (unique)        |
| `alamat`      | `string?`  | Alamat (opsional)             |
| `display_token`| `string`  | UUID unik untuk akses display publik |
| `created_at`  | `datetime` | Timestamp pembuatan           |
| `updated_at`  | `datetime` | Timestamp update              |
| `deleted_at`  | `datetime?`| Soft delete timestamp         |

### 7.3 Halaqah

| Field          | Type        | Keterangan                    |
|---------------|------------|-------------------------------|
| `id_halaqah`  | `int`      | Primary key, auto increment   |
| `name_halaqah`| `string`   | Nama halaqah                  |
| `id_muhafiz`  | `int`      | FK ke User (unique, 1 muhafiz = 1 halaqah) |
| `id_sekolah`  | `int`      | FK ke Sekolah                 |
| `jenis`       | `enum`     | `TAHFIDZ`, `BACAAN`, `INTENSIF` (default: `TAHFIDZ`, tidak bisa diubah via API) |
| `created_at`  | `datetime` | Timestamp pembuatan           |
| `updated_at`  | `datetime` | Timestamp update              |
| `deleted_at`  | `datetime?`| Soft delete timestamp         |

### 7.4 Santri

| Field          | Type        | Keterangan                    |
|---------------|------------|-------------------------------|
| `id_santri`   | `int`      | Primary key, auto increment   |
| `nama_santri` | `string`   | Nama santri                  |
| `nomor_telepon`| `string?` | Nomor telepon (opsional)      |
| `id_sekolah`  | `int`      | FK ke Sekolah                 |
| `target`      | `enum`     | `RINGAN`, `SEDANG`, `INTENSE`, `BACAAN` |
| `id_halaqah`  | `int`      | FK ke Halaqah                |
| `created_at`  | `datetime` | Timestamp pembuatan           |
| `updated_at`  | `datetime` | Timestamp update              |
| `deleted_at`  | `datetime?`| Soft delete timestamp         |

### 7.5 Sesi Halaqah

| Field         | Type        | Keterangan                    |
|--------------|------------|-------------------------------|
| `id_sesi`    | `int`      | Primary key, auto increment   |
| `nama_sesi`  | `string`   | Nama sesi (contoh: "Bada Subuh") |
| `jam_mulai`  | `string`   | Format "HH:mm" (contoh: "05:00") |
| `jam_selesai`| `string`   | Format "HH:mm" (contoh: "06:15") |
| `hari`       | `int[]`    | Array hari sesi aktif (1=Senin, 7=Ahad) |
| `id_sekolah` | `int`      | FK ke Sekolah                 |
| `id_halaqah` | `int?`     | FK ke Halaqah (nullable untuk backward-compat data lama; sesi baru WAJIB mengisinya) |
| `created_at` | `datetime` | Timestamp pembuatan           |
| `updated_at` | `datetime` | Timestamp update              |
| `deleted_at` | `datetime?`| Soft delete timestamp         |

> **Konsep "Setiap sesi punya halaqahnya sendiri"**: Sejak update Juni 2026, sebuah sesi terikat pada satu halaqah (`id_halaqah`). Konsekuensinya:
> - **Absensi per-sesi**: Setiap sesi halaqah memiliki absensinya sendiri (lihat `GET /api/absensi/sesi/:id_sesi`).
> - **Muhafiz scope**: Seorang muhafiz hanya bisa membuat/melihat sesi yang terikat ke halaqah yang diasuhnya.
> - **Anti-cross-halaqah input**: Saat input absensi, sistem menolak jika `sesi.id_halaqah != student.id_halaqah`.
> - **Legacy data**: Sesi lama yang `id_halaqah = NULL` tetap dapat dibaca (untuk backward compatibility), namun sesi baru tidak boleh dibuat tanpa `id_halaqah`.

### 7.6 Absensi (Santri)

| Field         | Type        | Keterangan                    |
|--------------|------------|-------------------------------|
| `id_absensi` | `int`      | Primary key, auto increment   |
| `id_santri`  | `int`      | FK ke Santri                  |
| `id_sesi`    | `int`      | FK ke SesiHalaqah             |
| `tanggal`    | `datetime` | Tanggal absensi               |
| `status`     | `enum`     | `HADIR`, `IZIN`, `SAKIT`, `ALFA`, `TERLAMBAT` |
| `keterangan` | `string?`  | Keterangan tambahan           |
| `deleted_at` | `datetime?`| Soft delete timestamp         |
| `created_at` | `datetime` | Timestamp pembuatan           |
| `updated_at` | `datetime` | Timestamp update              |

> **Constraint**: Unique pada `(id_santri, id_sesi, tanggal)` - satu santri hanya punya 1 status per sesi per hari (upsert).

### 7.7 Absensi Muhafiz

| Field            | Type        | Keterangan                    |
|-----------------|------------|-------------------------------|
| `id_absensi`    | `int`      | Primary key, auto increment   |
| `id_user`       | `int`      | FK ke User                    |
| `tanggal_absensi`| `datetime`| Tanggal absensi               |
| `status`        | `enum`     | `HADIR`, `IZIN`, `SAKIT`, `ALFA`, `TERLAMBAT` |
| `keterangan`    | `string?`  | Keterangan tambahan           |
| `deleted_at`    | `datetime?`| Soft delete timestamp         |
| `created_at`    | `datetime` | Timestamp pembuatan           |
| `updated_at`    | `datetime` | Timestamp update              |

> **Upsert**: Jika sudah ada absensi untuk `id_user` di tanggal yang sama, data akan diupdate (bukan insert baru).

### 7.8 Setoran

| Field            | Type        | Keterangan                    |
|-----------------|------------|-------------------------------|
| `id_setoran`    | `int`      | Primary key, auto increment   |
| `id_santri`     | `int`      | FK ke Santri                  |
| `id_sesi`       | `int?`     | FK ke SesiHalaqah (nullable)  |
| `tanggal_setoran`| `datetime`| Tanggal setoran              |
| `juz`           | `int`      | Juz ke-berapa                 |
| `surat`         | `string`   | Nama surat                   |
| `ayat`          | `string`   | Range ayat (contoh: "1-5")   |
| `kategori`      | `enum`     | `MURAJAAH`, `ZIYADAH`, `INTENS`, `BACAAN`, `HAFALAN` |
| `taqwim`        | `int?`     | Nilai/taqwim (opsional)      |
| `keterangan`    | `string?`  | Keterangan tambahan          |
| `deleted_at`    | `datetime?`| Soft delete timestamp         |
| `created_at`    | `datetime` | Timestamp pembuatan           |
| `updated_at`    | `datetime` | Timestamp update              |

### Enum Reference

| Enum              | Values                                         |
|-------------------|-----------------------------------------------|
| `Role`            | `SUPERADMIN`, `ADMIN`, `KOORDINATOR_TAHFIZ`, `MUHAFIZ` |
| `JenisHalaqah`   | `TAHFIDZ`, `BACAAN`, `INTENSIF`               |
| `KategoriTarget` | `RINGAN`, `SEDANG`, `INTENSE`, `BACAAN`       |
| `StatusKehadiran`| `HADIR`, `IZIN`, `SAKIT`, `ALFA`, `TERLAMBAT` |
| `KategoriSetoran`| `MURAJAAH`, `ZIYADAH`, `INTENS`, `BACAAN`, `HAFALAN` |

---

