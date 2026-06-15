# Halaqah.id - API Documentation

> **Base URL:** `http://localhost:3000` atau `https://halaqahid-be.vercel.app` (development)  
> **Health Check:** `GET /health` atau `GET /api/health`  
> **Swagger UI:** `http://localhost:3000/api-docs` atau `https://halaqahid-be.vercel.app/api-docs`

---

## Daftar Isi

- [1. Gambaran Umum](#1-gambaran-umum)
- [2. Autentikasi](#2-autentikasi)
- [3. Response Format](#3-response-format)
- [4. Pagination](#4-pagination)
- [5. Error Handling](#5-error-handling)
- [6. Role & Permission](#6-role--permission)
- [7. Data Models](#7-data-models)
- [8. API Endpoints](#8-api-endpoints)
  - [8.1 Auth](#81-auth)
  - [8.2 Halaqah](#82-halaqah)
  - [8.3 Santri](#83-santri)
  - [8.4 Sesi Halaqah](#84-sesi-halaqah)
  - [8.5 Absensi](#85-absensi)
  - [8.6 Setoran](#86-setoran)
  - [8.7 Sekolah](#87-sekolah)
  - [8.8 Display (Public)](#88-display-public)

---

## 1. Gambaran Umum

Halaqah.id adalah sistem manajemen tahfidz berbasis multi-tenant (per sekolah). Sistem ini mengelola:

- **User/Asatidz** (Muhafiz, Koordinator Tahfiz, Admin, Superadmin)
- **Halaqah** (kelompok tahfidz yang dibimbing seorang Muhafiz)
- **Santri** (peserta tahfidz yang terdaftar di halaqah)
- **Sesi Halaqah** (jadwal sesi pertemuan, contoh: "Bada Subuh", "Halaqah Pagi")
- **Absensi** (kehadiran santri dan muhafiz per sesi/tanggal)
- **Setoran** (catatan hafalan santri: juz, surat, ayat, kategori)
- **Sekolah** (institusi yang menaungi semua entitas di atas)

### Konsep Penting

- **Multi-tenancy**: Setiap data selalu terikat ke `id_sekolah`. User dari sekolah A tidak bisa melihat data sekolah B.
- **Soft Delete**: Semua entitas menggunakan `deleted_at` (nullable `DateTime`). Data yang dihapus masih bisa di-restore.
- **Upsert pada Absensi**: Jika santri sudah diabsen di sesi + tanggal yang sama, data akan diupdate, bukan duplikat.

---

## 2. Autentikasi

Semua endpoint yang dilindungi memerlukan header **Bearer Token**.

### Cara Menggunakan

```
Authorization: Bearer <JWT_TOKEN>
```

### Cara Mendapatkan Token

1. Login via `POST /api/halaqah/auth/login` dengan email & password
2. Response akan mengembalikan `data.token` (JWT) dan `data.user` (profil)
3. Simpan token dan gunakan di setiap request berikutnya

### Token Info

- **Expiry**: 7 hari
- **Payload JWT**: `{ id, role, id_sekolah }`
- **Refresh**: Belum tersedia, lakukan login ulang setelah token expired

### Verifikasi Email

- Setiap user baru (register muhafiz/admin) akan menerima email verifikasi dari Brevo
- User **tidak bisa login** sebelum email diverifikasi
- Link verifikasi berisi token JWT dengan masa berlaku 15 menit
- Endpoint verifikasi: `GET /api/halaqah/auth/verify-email?token=<TOKEN>`

---

## 3. Response Format

### Success Response

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

| Field        | Type            | Keterangan                                      |
|-------------|----------------|------------------------------------------------|
| `success`    | `boolean`      | Selalu `true` untuk response berhasil           |
| `message`    | `string`       | Pesan deskriptif                                |
| `data`       | `any`          | Data utama (object, array, atau null)           |
| `pagination` | `object|null`  | Hanya ada pada endpoint yang mendukung pagination|

### Error Response

```json
{
  "success": false,
  "message": "Email atau password salah",
  "errors": null
}
```

| Field    | Type          | Keterangan                          |
|---------|--------------|-------------------------------------|
| `success` | `boolean`   | Selalu `false` untuk error          |
| `message` | `string`    | Pesan error                         |
| `errors`  | `any`       | Detail error (bisa null)            |

---

## 4. Pagination

Endpoint yang mendukung pagination menerima query parameter:

| Parameter | Type      | Default | Keterangan                    |
|----------|----------|---------|-------------------------------|
| `page`   | `integer` | `1`     | Nomor halaman (min 1)         |
| `limit`  | `integer` | `10`    | Jumlah data per halaman (max 100) |

### Contoh Request

```
GET /api/halaqah?page=2&limit=15
```

### Pagination Metadata (di response)

```json
{
  "page": 2,
  "limit": 15,
  "total": 42,
  "totalPages": 3
}
```

---

## 5. Error Handling

### HTTP Status Codes

| Code | Keterangan |
|------|-----------|
| `200` | Sukses (GET, PATCH, DELETE, restore) |
| `201` | Sukses (POST/create) |
| `400` | Bad Request (validasi gagal, input tidak valid) |
| `401` | Unauthorized (token invalid/expired/tidak ada) |
| `403` | Forbidden (tidak punya permission) |
| `404` | Not Found (resource tidak ditemukan) |
| `409` | Conflict (resource sudah ada, misal email duplikat) |
| `422` | Unprocessable Entity |
| `429` | Too Many Requests (rate limit terlampaui) |
| `500` | Internal Server Error |

### CORS Configuration

Backend menggunakan CORS dengan aturan berikut:

| Kondisi | Perilaku |
|---------|----------|
| `ALLOWED_ORIGINS=*` | Semua origin diizinkan |
| `ALLOWED_ORIGINS=http://a.com,http://b.com` | Hanya origin terdaftar yang diizinkan |
| Development mode | `localhost` dan `127.0.0.1` diizinkan otomatis |
| Production mode | Hanya origin di `ALLOWED_ORIGINS` yang diizinkan |

> **Catatan untuk Frontend**: Credentials (`cookies`, `Authorization` header) sudah diizinkan (`credentials: true`). Pastikan frontend mengirim `credentials: 'include'` jika menggunakan cookie-based auth.
>
> **Body limit**: Maksimal 100KB per request (`express.json({ limit: '100kb' })`).

### Rate Limiting

| Scope          | Limit                          |
|---------------|-------------------------------|
| Global        | 100 requests/menit per IP      |
| Login         | Rate limit khusus (lebih ketat)|
| Register      | Rate limit khusus (lebih ketat)|
| Verification  | Rate limit khusus (lebih ketat)|

### Development vs Production Error Behavior

| Mode          | Perilaku Error                                                |
|--------------|----------------------------------------------------------------|
| Development  | `errors.detail` berisi stack trace untuk debugging             |
| Production   | `errors.detail` disembunyikan, hanya `message` yang ditampilkan|

---

## 6. Role & Permission

### Roles (Enum PostgreSQL)

| Role                | Keterangan                                    |
|--------------------|-----------------------------------------------|
| `SUPERADMIN`       | Akses penuh ke semua fitur di semua sekolah    |
| `ADMIN`            | Admin sekolah, kelola muhafiz + semua fitur    |
| `KOORDINATOR_TAHFIZ` | Koordinator, kelola semua halaqah di sekolah |
| `MUHAFIZ`          | Pengajar tahfidz, kelola halaqah sendiri       |

### Permission Matrix

| Permission                  | SUPERADMIN | ADMIN | KOORDINATOR | MUHAFIZ |
|----------------------------|------------|-------|-------------|---------|
| **Halaqah**                |            |       |             |         |
| `halaqah:create`           | Yes        | Yes   | Yes         | -       |
| `halaqah:view-all`         | Yes        | Yes   | Yes         | -       |
| `halaqah:view-own`         | Yes        | -     | -           | Yes     |
| `halaqah:edit-all`         | Yes        | Yes   | Yes         | -       |
| `halaqah:delete-all`       | Yes        | Yes   | Yes         | -       |
| **Santri**                 |            |       |             |         |
| `santri:create-own`        | Yes        | -     | -           | Yes     |
| `santri:create-all`        | Yes        | Yes   | Yes         | -       |
| `santri:view-own`          | Yes        | -     | -           | Yes     |
| `santri:view-all`          | Yes        | Yes   | Yes         | -       |
| `santri:edit-own`          | Yes        | -     | -           | Yes     |
| `santri:edit-all`          | Yes        | Yes   | Yes         | -       |
| `santri:delete-own`        | Yes        | -     | -           | Yes     |
| `santri:delete-all`        | Yes        | Yes   | Yes         | -       |
| **Absensi Santri**         |            |       |             |         |
| `absensi:santri:create-own`| Yes        | -     | -           | Yes     |
| `absensi:santri:create-all`| Yes        | Yes   | Yes         | -       |
| `absensi:santri:view-own`  | Yes        | -     | -           | Yes     |
| `absensi:santri:view-all`  | Yes        | Yes   | Yes         | -       |
| `absensi:santri:edit-own`  | Yes        | -     | -           | Yes     |
| `absensi:santri:edit-all`  | Yes        | Yes   | Yes         | -       |
| **Absensi Muhafiz**        |            |       |             |         |
| `absensi:muhafiz:manage`   | Yes        | Yes   | Yes         | -       |
| **Setoran**                |            |       |             |         |
| `setoran:create-own`       | Yes        | -     | -           | Yes     |
| `setoran:create-all`       | Yes        | Yes   | Yes         | -       |
| `setoran:view-own`         | Yes        | -     | -           | Yes     |
| `setoran:view-all`         | Yes        | Yes   | Yes         | -       |
| **Sesi Halaqah**           |            |       |             |         |
| `sesi-halaqah:create`      | Yes        | Yes   | Yes         | -       |
| `sesi-halaqah:view`        | Yes        | Yes   | Yes         | Yes     |
| `sesi-halaqah:edit`        | Yes        | Yes   | Yes         | -       |
| `sesi-halaqah:delete`      | Yes        | Yes   | Yes         | -       |
| **User Management**        |            |       |             |         |
| `muhafiz:manage`           | Yes        | Yes   | -           | -       |

> **Catatan**: SUPERADMIN memiliki semua permission secara otomatis.

---

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
| `id_sekolah` | `int`      | FK ke Sekolah                 |
| `created_at` | `datetime` | Timestamp pembuatan           |
| `updated_at` | `datetime` | Timestamp update              |
| `deleted_at` | `datetime?`| Soft delete timestamp         |

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

## 8. API Endpoints

---

### 8.1 Auth

**Base path:** `/api/halaqah/auth`

#### `POST /api/halaqah/auth/login`

Login ke sistem. **Email harus sudah diverifikasi.**

**Auth:** Tidak perlu

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id_user": 1,
      "name": "Ahmad",
      "email": "user@example.com",
      "role": "MUHAFIZ",
      "id_sekolah": 1,
      "has_halaqah": true,
      "id_halaqah": 5,
      "deleted_at": null,
      "is_verified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
- `401` - Email atau password salah
- `403` - Email belum diverifikasi

---

#### `GET /api/halaqah/auth/me`

Mendapatkan profil user yang sedang login.

**Auth:** Bearer Token

**Response (200):**

```json
{
  "success": true,
  "message": "Data profil berhasil diambil",
  "data": {
    "id_user": 1,
    "name": "Ahmad",
    "email": "user@example.com",
    "role": "MUHAFIZ",
    "id_sekolah": 1,
    "has_halaqah": true,
    "id_halaqah": 5,
    "is_verified": true
  }
}
```

---

#### `POST /api/halaqah/auth/register`

Mendaftarkan akun Muhafiz baru. Hanya bisa diakses oleh **Koordinator Tahfiz** atau **Admin** atau **Superadmin**. Email verifikasi akan dikirim otomatis.

**Auth:** Bearer Token  
**Permission:** `muhafiz:manage`

**Request Body:**

```json
{
  "name": "Ustadz Fulan",
  "email": "muhaftiz@example.com",
  "password": "password123",
  "role": "MUHAFIZ",
  "id_sekolah": 1
}
```

| Field       | Type     | Required | Keterangan                                      |
|------------|---------|----------|------------------------------------------------|
| `name`     | `string`| Yes      | Nama lengkap muhafiz                            |
| `email`    | `string`| Yes      | Email (harus unik)                              |
| `password` | `string`| Yes      | Password                                        |
| `role`     | `string`| No       | Default: `MUHAFIZ`. Bisa juga `KOORDINATOR_TAHFIZ` |
| `id_sekolah`| `number`| Conditional | **Wajib** jika caller adalah SUPERADMIN       |

**Response (200):**

```json
{
  "success": true,
  "message": "Register berhasil",
  "data": {
    "id_user": 10,
    "name": "Ustadz Fulan",
    "email": "muhaftiz@example.com",
    "role": "MUHAFIZ",
    "is_verified": false
  }
}
```

**Errors:**
- `400` - Email sudah digunakan / id_sekolah wajib (superadmin)
- `403` - Akses ditolak

---

#### `POST /api/halaqah/auth/register-admin`

Mendaftarkan akun Admin baru **sekaligus membuat entitas Sekolah**. Endpoint publik (tidak perlu login).

**Auth:** Tidak perlu

**Request Body:**

```json
{
  "name": "Admin Sekolah",
  "email": "admin@sekolah.com",
  "password": "password123",
  "nama_sekolah": "Ponpes Al-Hikmah",
  "alamat": "Jl. Merdeka No. 10"
}
```

| Field         | Type     | Required | Keterangan           |
|--------------|---------|----------|---------------------|
| `name`       | `string`| Yes      | Nama admin           |
| `email`      | `string`| Yes      | Email (harus unik)   |
| `password`   | `string`| Yes      | Password             |
| `nama_sekolah`| `string`| Yes     | Nama sekolah baru    |
| `alamat`     | `string`| No       | Alamat sekolah       |

**Response (200):**

```json
{
  "success": true,
  "message": "Register Admin dan Sekolah berhasil",
  "data": {
    "user": {
      "id_user": 15,
      "name": "Admin Sekolah",
      "email": "admin@sekolah.com",
      "role": "ADMIN",
      "is_verified": false,
      "id_sekolah": 1,
      "has_halaqah": false,
      "id_halaqah": null
    },
    "sekolah": {
      "id_sekolah": 1,
      "nama_sekolah": "Ponpes Al-Hikmah",
      "alamat": "Jl. Merdeka No. 10"
    }
  }
}
```

> **Catatan**: Response berisi dua objek: `user` (data akun admin) dan `sekolah` (data sekolah yang baru dibuat). Email verifikasi dikirimkan otomatis ke alamat email admin.

**Errors:**
- `400` - Email sudah digunakan

---

#### `GET /api/halaqah/auth/verify-email`

Memverifikasi email user dengan token JWT yang dikirim via email.

**Auth:** Tidak perlu

**Query Parameters:**

| Parameter | Type     | Required | Keterangan                    |
|----------|---------|----------|-------------------------------|
| `token`  | `string`| Yes      | Token verifikasi dari email   |

**Response (200):**

```json
{
  "success": true,
  "message": "Email berhasil diverifikasi. Silakan login.",
  "data": {
    "id_user": 10,
    "name": "Ustadz Fulan",
    "email": "muhaftiz@example.com",
    "is_verified": true
  }
}
```

**Errors:**
- `400` - Token tidak valid atau kedaluwarsa
- `404` - User tidak ditemukan

---

#### `POST /api/halaqah/auth/resend-verification`

Mengirim ulang email verifikasi.

**Auth:** Tidak perlu

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Email verifikasi telah dikirim. Silakan periksa email Anda.",
  "data": null
}
```

**Errors:**
- `400` - Email tidak valid atau sudah diverifikasi
- `404` - User tidak ditemukan

---

#### `GET /api/halaqah/auth/muhafiz`

Mendapatkan daftar semua muhafiz di sekolah yang sama.

**Auth:** Bearer Token  
**Permission:** `muhafiz:manage`

**Query Parameters:**

| Parameter | Type      | Default | Keterangan          |
|----------|----------|---------|---------------------|
| `page`   | `integer`| `1`     | Nomor halaman       |
| `limit`  | `integer`| `10`    | Data per halaman    |

**Response (200):**

```json
{
  "success": true,
  "message": "Data muhafiz berhasil diambil",
  "data": [
    {
      "id_user": 5,
      "name": "Ustadz Ahmad",
      "email": "ahmad@example.com",
      "role": "MUHAFIZ",
      "id_sekolah": 1,
      "is_verified": true,
      "deleted_at": null
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 }
}
```

---

#### `PATCH /api/halaqah/auth/muhafiz/:id`

Update data akun muhafiz (name/email).

**Auth:** Bearer Token  
**Permission:** `muhafiz:manage`

**Path Parameters:**

| Parameter | Type  | Keterangan                |
|----------|-------|---------------------------|
| `id`     | `int` | ID user muhafiz           |

**Request Body:**

```json
{
  "name": "Nama Baru",
  "email": "emailbaru@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Data muhafiz berhasil diupdate",
  "data": {
    "id_user": 5,
    "name": "Nama Baru",
    "email": "emailbaru@example.com"
  }
}
```

**Errors:**
- `400` - Email sudah digunakan
- `404` - User tidak ditemukan

---

#### `DELETE /api/halaqah/auth/muhafiz/:id`

Soft delete akun muhafiz.

**Auth:** Bearer Token  
**Permission:** `muhafiz:manage`

**Path Parameters:**

| Parameter | Type  | Keterangan                |
|----------|-------|---------------------------|
| `id`     | `int` | ID user muhafiz           |

**Response (200):**

```json
{
  "success": true,
  "message": "Data muhafiz berhasil dihapus",
  "data": { "id_user": 5 }
}
```

**Errors:**
- `400` - User bukan Muhafiz (tidak bisa menghapus KOORDINATOR/ADMIN)
- `403` - User berada di sekolah yang berbeda
- `404` - User tidak ditemukan

---

#### `GET /api/halaqah/auth/muhafiz/deleted`

Mendapatkan daftar muhafiz yang telah di-soft-delete.

**Auth:** Bearer Token  
**Permission:** `muhafiz:manage`

**Query Parameters:** `page`, `limit` (standard pagination)

**Response (200):**

```json
{
  "success": true,
  "message": "Daftar muhafiz terhapus berhasil diambil",
  "data": [ ... ],
  "pagination": { ... }
}
```

---

#### `PATCH /api/halaqah/auth/muhafiz/restore/:id`

Memulihkan akun muhafiz yang telah di-soft-delete.

**Auth:** Bearer Token  
**Permission:** `muhafiz:manage`

**Response (200):**

```json
{
  "success": true,
  "message": "Akun muhafiz berhasil diaktifkan kembali",
  "data": { "id_user": 5 }
}
```

**Errors:**
- `400` - User sudah aktif / bukan muhafiz
- `404` - User tidak ditemukan

---

#### `POST /api/halaqah/auth/impersonate/:id`

Login sebagai muhafiz tertentu (impersonate). Menghasilkan token JWT baru.

**Auth:** Bearer Token  
**Permission:** `muhafiz:manage`

**Response (200):**

```json
{
  "success": true,
  "message": "Impersonate berhasil",
  "data": {
    "user": {
      "id_user": 5,
      "name": "Ustadz Ahmad",
      "email": "ahmad@example.com",
      "role": "MUHAFIZ",
      "id_sekolah": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
- `404` - Muhafiz tidak ditemukan

---

### 8.2 Halaqah

**Base path:** `/api/halaqah`  
**Auth:** Semua endpoint memerlukan Bearer Token

#### `POST /api/halaqah`

Membuat halaqah baru.

**Permission:** `halaqah:create` (Koordinator Tahfiz, Admin, Superadmin)

**Request Body:**

```json
{
  "name_halaqah": "Halaqah Subuh A",
  "id_muhafiz": 5,
  "id_sekolah": 1
}
```

| Field          | Type     | Required | Keterangan                                      |
|---------------|---------|----------|------------------------------------------------|
| `name_halaqah`| `string`| Yes      | Nama halaqah                                    |
| `id_muhafiz`  | `number`| Yes      | ID User muhafiz yang ditugaskan                 |
| `id_sekolah`  | `number`| Conditional | Wajib jika user belum punya `id_sekolah`. Diabaikan jika user sudah punya `id_sekolah`. |

> **Catatan**: Field `jenis` **tidak bisa** diatur saat create. Halaqah baru selalu menggunakan default `TAHFIDZ`. Untuk mengubah jenis, gunakan endpoint update (PATCH) secara terpisah melalui database.

**Response (200):**

```json
{
  "success": true,
  "message": "Halaqah berhasil dibuat",
  "data": {
    "id_halaqah": 1,
    "name_halaqah": "Halaqah Subuh A",
    "id_muhafiz": 5,
    "id_sekolah": 1,
    "jenis": "TAHFIDZ",
    "created_at": "2026-06-15T05:00:00.000Z",
    "updated_at": "2026-06-15T05:00:00.000Z",
    "deleted_at": null,
    "user": {
      "id_user": 5,
      "name": "Ustadz Ahmad",
      "email": "ahmad@example.com"
    }
  }
}
```

---

#### `GET /api/halaqah`

Mendapatkan daftar halaqah. Muhafiz melihat halaqah sendiri, Koordinator/Admin/Superadmin melihat semua.

**Permission:** `halaqah:view-all` atau `halaqah:view-own`

**Query Parameters:** `page`, `limit`

**Response (200):**

```json
{
  "success": true,
  "message": "Data halaqah berhasil diambil",
  "data": [
    {
      "id_halaqah": 1,
      "name_halaqah": "Halaqah Subuh A",
      "id_muhafiz": 5,
      "id_sekolah": 1,
      "jenis": "TAHFIDZ",
      "created_at": "2026-06-15T05:00:00.000Z",
      "updated_at": "2026-06-15T05:00:00.000Z",
      "deleted_at": null,
      "muhafiz": {
        "id_user": 5,
        "name": "Ustadz Ahmad",
        "email": "ahmad@example.com"
      },
      "total_santri": 12,
      "santri": [
        {
          "id_santri": 1,
          "nama_santri": "Budi",
          "nomor_telepon": "08123456789",
          "target": "SEDANG"
        }
      ]
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```

---

#### `GET /api/halaqah/deleted`

Mendapatkan daftar halaqah yang telah di-soft-delete.

**Permission:** `halaqah:view-all`

**Query Parameters:** `page`, `limit`

**Response (200):** 

```json
{
  "success": true,
  "message": "Data halaqah berhasil diambil",
  "data": [
    {
      "id_halaqah": 1,
      "name_halaqah": "Halaqah Subuh A",
      "id_muhafiz": 5,
      "id_sekolah": 1,
      "jenis": "TAHFIDZ",
      "created_at": "2026-06-15T05:00:00.000Z",
      "updated_at": "2026-06-15T05:00:00.000Z",
      "deleted_at": "2026-06-15T08:00:00.000Z",
      "user": {
        "id_user": 5,
        "name": "Ustadz Ahmad",
        "email": "ahmad@example.com"
      }
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

> **Catatan**: Endpoint ini hanya mengembalikan data dasar halaqah (tanpa array santri dan jumlah santri).

---

#### `GET /api/halaqah/:id`

Mendapatkan detail halaqah berdasarkan ID.

**Permission:** `halaqah:view-all` atau `halaqah:view-own`

**Response (200):**

```json
{
  "success": true,
  "message": "Detail halaqah berhasil diambil",
  "data": {
    "id_halaqah": 1,
    "name_halaqah": "Halaqah Subuh A",
    "id_muhafiz": 5,
    "id_sekolah": 1,
    "jenis": "TAHFIDZ",
    "created_at": "2026-06-15T05:00:00.000Z",
    "updated_at": "2026-06-15T05:00:00.000Z",
    "deleted_at": null,
    "muhafiz": {
      "id_user": 5,
      "name": "Ustadz Ahmad",
      "email": "ahmad@example.com"
    },
    "santri": [ ... ]
  }
}
```

**Errors:**
- `403` - Akses ditolak (bukan halaqah Anda / bukan sekolah Anda)
- `404` - Halaqah tidak ditemukan

---

#### `PATCH /api/halaqah/:id`

Update data halaqah.

**Permission:** `halaqah:edit-all`

**Request Body:**

```json
{
  "name_halaqah": "Nama Baru",
  "id_muhafiz": 7,
  "id_sekolah": 2
}
```

| Field          | Type     | Required | Keterangan              |
|---------------|---------|----------|-------------------------|
| `name_halaqah`| `string`| No       | Nama halaqah baru       |
| `id_muhafiz`  | `number`| No       | ID muhafiz baru         |
| `id_sekolah`  | `number`| No       | ID sekolah baru         |

> **Catatan**: Minimal satu field harus disertakan. Field `jenis` tidak bisa diubah via endpoint ini.

**Response (200):** Object halaqah yang sudah diupdate.

---

#### `DELETE /api/halaqah/:id`

Soft delete halaqah.

**Permission:** `halaqah:delete-all`

**Response (200):**

```json
{
  "success": true,
  "message": "Halaqah berhasil dihapus",
  "data": { "id_halaqah": 1 }
}
```

---

#### `PATCH /api/halaqah/restore/:id`

Memulihkan halaqah yang telah di-soft-delete.

**Permission:** `halaqah:delete-all`

**Response (200):**

```json
{
  "success": true,
  "message": "Halaqah berhasil di-restore",
  "data": { "id_halaqah": 1 }
}
```

---

### 8.3 Santri

**Base path:** `/api/santri`  
**Auth:** Semua endpoint memerlukan Bearer Token

#### `GET /api/santri`

Mendapatkan daftar santri. Muhafiz melihat santri di halaqah sendiri, Koordinator/Admin melihat semua.

**Permission:** `santri:view-all` atau `santri:view-own`

**Query Parameters:** `page`, `limit`

**Response (200):**

```json
{
  "success": true,
  "message": "Daftar santri berhasil di ambil",
  "data": [
    {
      "id_santri": 1,
      "nama_santri": "Budi Santoso",
      "nomor_telepon": "08123456789",
      "target": "SEDANG",
      "id_halaqah": 1,
      "id_sekolah": 1,
      "created_at": "2026-06-15T05:00:00.000Z",
      "updated_at": "2026-06-15T05:00:00.000Z",
      "halaqah": {
        "id_halaqah": 1,
        "name_halaqah": "Halaqah Subuh A"
      }
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

---

#### `POST /api/santri`

Menambahkan santri baru.

**Permission:** `santri:create-own` atau `santri:create-all`

**Request Body:**

```json
{
  "nama_santri": "Ahmad Zaki",
  "nomor_telepon": "08987654321",
  "target": "RINGAN",
  "id_halaqah": 1
}
```

| Field          | Type     | Required | Keterangan                                      |
|---------------|---------|----------|------------------------------------------------|
| `nama_santri` | `string`| Yes      | Nama santri                                     |
| `nomor_telepon`| `string`| No      | Nomor telepon                                   |
| `target`      | `enum`  | No       | `RINGAN` (default), `SEDANG`, `INTENSE`, `BACAAN` |
| `id_halaqah`  | `number`| Yes      | ID halaqah tempat santri didaftarkan             |

**Response (200):**

```json
{
  "success": true,
  "message": "Santri berhasil ditambahkan",
  "data": {
    "id_santri": 10,
    "nama_santri": "Ahmad Zaki",
    "nomor_telepon": "08987654321",
    "target": "RINGAN",
    "id_halaqah": 1,
    "id_sekolah": 1
  }
}
```

**Errors:**
- `403` - Halaqah di luar sekolah Anda
- `404` - Halaqah tidak ditemukan

---

#### `PATCH /api/santri/:id`

Update data santri.

**Permission:** `santri:edit-own` atau `santri:edit-all`

**Request Body (semua field opsional):**

```json
{
  "nama_santri": "Nama Baru",
  "nomor_telepon": "08111111111",
  "target": "INTENSE",
  "id_halaqah": 2
}
```

**Response (200):** Object santri yang sudah diupdate.

---

#### `DELETE /api/santri/:id`

Soft delete santri.

**Permission:** `santri:delete-own` atau `santri:delete-all`

**Response (200):**

```json
{
  "success": true,
  "message": "Santri berhasil dihapus",
  "data": { "id_santri": 1 }
}
```

---

#### `PATCH /api/santri/:id/restore`

Memulihkan santri yang telah di-soft-delete.

**Permission:** `santri:delete-own` atau `santri:delete-all`

**Response (200):**

```json
{
  "success": true,
  "message": "Santri berhasil di-restore",
  "data": { "id_santri": 1 }
}
```

---

### 8.4 Sesi Halaqah

**Base path:** `/api/sesi-halaqah`  
**Auth:** Semua endpoint memerlukan Bearer Token

#### `POST /api/sesi-halaqah`

Membuat sesi halaqah baru.

**Permission:** `sesi-halaqah:create`

**Request Body:**

```json
{
  "nama_sesi": "Bada Subuh",
  "jam_mulai": "05:00",
  "jam_selesai": "06:15",
  "id_sekolah": 1
}
```

| Field         | Type     | Required | Keterangan                                      |
|--------------|---------|----------|------------------------------------------------|
| `nama_sesi`  | `string`| Yes      | Nama sesi                                       |
| `jam_mulai`  | `string`| Yes      | Format "HH:mm"                                  |
| `jam_selesai`| `string`| Yes      | Format "HH:mm"                                  |
| `id_sekolah` | `number`| Conditional | Wajib jika SUPERADMIN                         |

**Response (201):**

```json
{
  "success": true,
  "message": "Sesi halaqah berhasil dibuat",
  "data": {
    "id_sesi": 1,
    "nama_sesi": "Bada Subuh",
    "jam_mulai": "05:00",
    "jam_selesai": "06:15",
    "id_sekolah": 1,
    "created_at": "2026-06-15T05:00:00.000Z",
    "updated_at": "2026-06-15T05:00:00.000Z"
  }
}
```

---

#### `GET /api/sesi-halaqah`

Mendapatkan daftar sesi halaqah di sekolah user.

**Permission:** `sesi-halaqah:view`

**Query Parameters:**

| Parameter    | Type   | Keterangan                                    |
|-------------|--------|-----------------------------------------------|
| `id_sekolah`| `int`  | Hanya bisa ditentukan oleh SUPERADMIN         |

**Response (200):**

```json
{
  "success": true,
  "message": "Daftar sesi halaqah berhasil diambil",
  "data": [
    {
      "id_sesi": 1,
      "nama_sesi": "Bada Subuh",
      "jam_mulai": "05:00",
      "jam_selesai": "06:15",
      "id_sekolah": 1
    },
    {
      "id_sesi": 2,
      "nama_sesi": "Halaqah Pagi",
      "jam_mulai": "08:00",
      "jam_selesai": "09:30",
      "id_sekolah": 1
    }
  ]
}
```

> **Catatan:** Endpoint ini **tidak** menggunakan pagination, mengembalikan semua sesi sekaligus.

---

#### `GET /api/sesi-halaqah/:id`

Mendapatkan detail sesi halaqah.

**Permission:** `sesi-halaqah:view`

**Response (200):** Object sesi halaqah lengkap.

**Errors:**
- `403` - Di luar sekolah Anda
- `404` - Sesi tidak ditemukan

---

#### `PATCH /api/sesi-halaqah/:id`

Memperbarui data sesi halaqah.

**Permission:** `sesi-halaqah:edit`

**Request Body (semua field opsional):**

```json
{
  "nama_sesi": "Sesi Baru",
  "jam_mulai": "07:00",
  "jam_selesai": "08:30"
}
```

**Response (200):** Object sesi yang sudah diupdate.

---

#### `DELETE /api/sesi-halaqah/:id`

Menghapus sesi halaqah.

**Permission:** `sesi-halaqah:delete`

**Response (200):**

```json
{
  "success": true,
  "message": "Sesi halaqah berhasil dihapus",
  "data": { "id_sesi": 1 }
}
```

**Errors:**
- `400` - Sesi tidak dapat dihapus karena sedang digunakan (ada relasi absensi/setoran)

---

### 8.5 Absensi

**Base path:** `/api/absensi`  
**Auth:** Semua endpoint memerlukan Bearer Token

#### `POST /api/absensi`

Mencatat absensi santri. **Upsert** - jika santri sudah diabsen di sesi + tanggal yang sama, data akan diupdate.

**Permission:** `absensi:santri:create-own` atau `absensi:santri:create-all`

**Request Body:**

```json
{
  "id_santri": 1,
  "id_sesi": 1,
  "status": "HADIR",
  "keterangan": "Tepat waktu",
  "tanggal": "2026-06-15"
}
```

| Field       | Type     | Required | Keterangan                                      |
|------------|---------|----------|------------------------------------------------|
| `id_santri`| `number`| Yes      | ID santri                                       |
| `id_sesi`  | `number`| Yes      | ID sesi halaqah                                 |
| `status`   | `enum`  | Yes      | `HADIR`, `IZIN`, `SAKIT`, `ALFA`, `TERLAMBAT`  |
| `keterangan`| `string`| No      | Keterangan tambahan                            |
| `tanggal`  | `string`| Yes      | Tanggal absensi (ISO date)                      |

**Response (201):**

```json
{
  "success": true,
  "message": "Absensi berhasil dicatat",
  "data": {
    "id_absensi": 1,
    "id_santri": 1,
    "id_sesi": 1,
    "tanggal": "2026-06-15T00:00:00.000Z",
    "status": "HADIR",
    "keterangan": "Tepat waktu"
  }
}
```

---

#### `POST /api/absensi/muhafiz`

Mencatat absensi asatidz/muhafiz. **Upsert**.

**Permission:** `absensi:muhafiz:manage`

**Request Body:**

```json
{
  "id_user": 5,
  "status": "HADIR",
  "keterangan": "",
  "tanggal": "2026-06-15"
}
```

| Field       | Type     | Required | Keterangan                                      |
|------------|---------|----------|------------------------------------------------|
| `id_user`  | `number`| Yes      | ID user muhafiz                                 |
| `status`   | `enum`  | Yes      | `HADIR`, `IZIN`, `SAKIT`, `ALFA`, `TERLAMBAT`  |
| `keterangan`| `string`| No      | Keterangan tambahan                            |
| `tanggal`  | `string`| Yes      | Tanggal absensi                                 |

**Response (201):**

```json
{
  "success": true,
  "message": "Absensi asatidz berhasil dicatat",
  "data": {
    "id_absensi": 1,
    "id_user": 5,
    "tanggal_absensi": "2026-06-15T00:00:00.000Z",
    "status": "HADIR",
    "keterangan": ""
  }
}
```

---

#### `GET /api/absensi/halaqah/:halaqahId`

Mendapatkan absensi halaqah. Bisa **harian** atau **rekap bulanan**.

**Permission:** `absensi:santri:view-own` atau `absensi:santri:view-all`

**Path Parameters:**

| Parameter    | Type  | Keterangan    |
|-------------|-------|---------------|
| `halaqahId` | `int` | ID halaqah    |

**Query Parameters (Harian):**

| Parameter | Type    | Default     | Keterangan              |
|----------|--------|-------------|-------------------------|
| `date`   | `string`| Hari ini    | Tanggal (YYYY-MM-DD)    |

**Query Parameters (Bulanan - Rekap):**

| Parameter | Type     | Keterangan         |
|----------|---------|---------------------|
| `month`  | `integer`| Bulan (1-12)       |
| `year`   | `integer`| Tahun (contoh 2026)|

**Response Harian (200):**

```json
{
  "success": true,
  "message": "Data absensi halaqah harian berhasil diambil",
  "data": [
    {
      "id_absensi": 1,
      "id_santri": 1,
      "id_sesi": 1,
      "tanggal": "2026-06-15T00:00:00.000Z",
      "status": "HADIR",
      "keterangan": null,
      "santri": {
        "id_santri": 1,
        "nama_santri": "Budi"
      }
    }
  ]
}
```

**Response Bulanan (200):**

```json
{
  "success": true,
  "message": "Rekap absensi bulanan berhasil diambil",
  "data": [
    {
      "tanggal": "2026-06-01",
      "data": [
        {
          "id_absensi": 1,
          "id_santri": 1,
          "nama_santri": "Budi",
          "status": "HADIR",
          "keterangan": null
        }
      ]
    },
    {
      "tanggal": "2026-06-02",
      "data": [ ... ]
    }
  ]
}
```

---

#### `GET /api/absensi/santri/:id_santri`

Mendapatkan riwayat absensi seorang santri.

**Permission:** `absensi:santri:view-own` atau `absensi:santri:view-all`

**Query Parameters:** `page`, `limit`

**Response (200):**

```json
{
  "success": true,
  "message": "History absensi santri berhasil diambil",
  "data": [
    {
      "id_absensi": 1,
      "id_santri": 1,
      "id_sesi": 1,
      "tanggal": "2026-06-15T00:00:00.000Z",
      "status": "HADIR",
      "keterangan": null
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 30, "totalPages": 3 }
}
```

---

#### `GET /api/absensi/rekap-santri`

Rekap absensi bulanan semua santri (dibatasi per sekolah).

**Permission:** `absensi:santri:view-all`

**Query Parameters:**

| Parameter | Type     | Required | Keterangan         |
|----------|---------|----------|---------------------|
| `month`  | `integer`| Yes      | Bulan (1-12)       |
| `year`   | `integer`| Yes      | Tahun              |

**Response (200):**

```json
{
  "success": true,
  "message": "Rekap semua absensi santri berhasil diambil",
  "data": [
    {
      "tanggal": "2026-06-01",
      "data": [
        {
          "id_absensi": 1,
          "id_santri": 1,
          "nama_santri": "Budi",
          "name_halaqah": "Halaqah Subuh A",
          "status": "HADIR",
          "keterangan": null
        }
      ]
    }
  ]
}
```

**Errors:**
- `400` - Month dan Year harus disertakan

---

#### `GET /api/absensi/rekap-muhafiz`

Rekap absensi bulanan asatidz/muhafiz.

**Permission:** `absensi:muhafiz:manage`

**Query Parameters:**

| Parameter | Type     | Required | Keterangan         |
|----------|---------|----------|---------------------|
| `month`  | `integer`| Yes      | Bulan (1-12)       |
| `year`   | `integer`| Yes      | Tahun              |

**Response (200):**

```json
{
  "success": true,
  "message": "Rekap absensi bulanan asatidz berhasil diambil",
  "data": [
    {
      "tanggal": "2026-06-01",
      "data": [
        {
          "id_absensi": 1,
          "id_user": 5,
          "nama_asatidz": "Ustadz Ahmad",
          "status": "HADIR",
          "keterangan": null
        }
      ]
    }
  ]
}
```

---

#### `PATCH /api/absensi/:id`

Update absensi santri.

**Permission:** `absensi:santri:edit-own` atau `absensi:santri:edit-all`

**Request Body (semua field opsional):**

```json
{
  "status": "IZIN",
  "keterangan": "Sakit demam",
  "tanggal": "2026-06-15"
}
```

**Response (200):** Object absensi yang sudah diupdate.

---

#### `PATCH /api/absensi/muhafiz/:id`

Update absensi asatidz/muhafiz.

**Permission:** `absensi:muhafiz:manage`

**Request Body (semua field opsional):**

```json
{
  "status": "SAKIT",
  "keterangan": "Demam",
  "tanggal_absensi": "2026-06-15"
}
```

**Response (200):** Object absensi muhafiz yang sudah diupdate.

---

#### `DELETE /api/absensi/:id`

Menghapus absensi santri (soft delete).

**Permission:** `absensi:santri:edit-own` atau `absensi:santri:edit-all`

> **Catatan**: DELETE absensi santri menggunakan permission `absensi:santri:edit-own/all` (bukan permission delete terpisah).

**Response (200):**

```json
{
  "success": true,
  "message": "Absensi berhasil dihapus",
  "data": { "id_absensi": 1 }
}
```

---

#### `DELETE /api/absensi/muhafiz/:id`

Menghapus absensi asatidz/muhafiz.

**Permission:** `absensi:muhafiz:manage`

**Response (200):**

```json
{
  "success": true,
  "message": "Absensi asatidz berhasil dihapus",
  "data": { "id_absensi": 1 }
}
```

---

### 8.6 Setoran

**Base path:** `/api/setoran`  
**Auth:** Semua endpoint memerlukan Bearer Token

#### `POST /api/setoran`

Mencatat setoran hafalan santri.

**Permission:** `setoran:create-own` atau `setoran:create-all`

**Request Body:**

```json
{
  "id_santri": 1,
  "id_sesi": 1,
  "tanggal_setoran": "2026-06-15",
  "juz": 30,
  "surat": "An-Naba",
  "ayat": "1-5",
  "kategori": "ZIYADAH",
  "taqwim": 1,
  "keterangan": "Lancar dengan 1 kesalahan"
}
```

| Field            | Type     | Required | Keterangan                                      |
|-----------------|---------|----------|------------------------------------------------|
| `id_santri`     | `number`| Yes      | ID santri                                       |
| `id_sesi`       | `number`| No       | ID sesi (nullable)                              |
| `tanggal_setoran`| `string`| No      | Tanggal (default: sekarang)                     |
| `juz`           | `number`| Yes      | Juz ke-berapa                                   |
| `surat`         | `string`| Yes      | Nama surat                                      |
| `ayat`          | `string`| Yes      | Range ayat (contoh: "1-5")                      |
| `kategori`      | `enum`  | Yes      | `MURAJAAH`, `ZIYADAH`, `INTENS`, `BACAAN`, `HAFALAN` |
| `taqwim`        | `number`| No       | Nilai/taqwim                                    |
| `keterangan`    | `string`| No       | Keterangan tambahan                             |

**Response (201):**

```json
{
  "success": true,
  "message": "Setoran berhasil dicatat",
  "data": {
    "id_setoran": 1,
    "id_santri": 1,
    "id_sesi": 1,
    "tanggal_setoran": "2026-06-15T00:00:00.000Z",
    "juz": 30,
    "surat": "An-Naba",
    "ayat": "1-5",
    "kategori": "ZIYADAH",
    "taqwim": 1,
    "keterangan": "Lancar dengan 1 kesalahan"
  }
}
```

---

#### `GET /api/setoran/all`

Mendapatkan semua data setoran (dengan filter tanggal opsional). Hanya Koordinator/Admin/Superadmin.

**Permission:** `setoran:view-all`

**Query Parameters:**

| Parameter   | Type     | Default | Keterangan                    |
|------------|---------|---------|-------------------------------|
| `startDate`| `string` | -       | Filter tanggal mulai (ISO datetime) |
| `endDate`  | `string` | -       | Filter tanggal akhir (ISO datetime) |
| `page`     | `integer`| `1`     | Nomor halaman                 |
| `limit`    | `integer`| `10`    | Data per halaman              |

**Response (200):**

```json
{
  "success": true,
  "message": "Semua data setoran berhasil diambil",
  "data": [
    {
      "id_setoran": 1,
      "id_santri": 1,
      "id_sesi": 1,
      "tanggal_setoran": "2026-06-15T00:00:00.000Z",
      "juz": 30,
      "surat": "An-Naba",
      "ayat": "1-5",
      "kategori": "ZIYADAH",
      "taqwim": 1,
      "keterangan": "Lancar",
      "santri": { "nama_santri": "Budi" },
      "sesi": { "nama_sesi": "Bada Subuh" }
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

---

#### `GET /api/setoran/santri/:id_santri`

Mendapatkan riwayat setoran seorang santri.

**Permission:** `setoran:view-all` atau `setoran:view-own`

**Query Parameters:** `page`, `limit`

**Response (200):**

```json
{
  "success": true,
  "message": "History setoran santri berhasil diambil",
  "data": [ ... ],
  "pagination": { ... }
}
```

---

#### `PATCH /api/setoran/:id`

Memperbarui data setoran hafalan santri.

**Permission:** `setoran:create-own` atau `setoran:create-all`

> **Catatan**: Endpoint update dan delete setoran menggunakan permission `setoran:create-own/all` (bukan permission terpisah). Ini berarti siapa yang bisa mencatat setoran, juga bisa mengubah dan menghapus.

**Request Body (semua field opsional):**

```json
{
  "id_santri": 1,
  "id_sesi": 1,
  "tanggal_setoran": "2026-06-15",
  "juz": 30,
  "surat": "An-Naba",
  "ayat": "1-5",
  "kategori": "ZIYADAH",
  "taqwim": 1,
  "keterangan": "Lancar dengan 1 kesalahan"
}
```

**Response (200):** Object setoran yang sudah diupdate.

---

#### `DELETE /api/setoran/:id`

Soft delete data setoran.

**Permission:** `setoran:create-own` atau `setoran:create-all`

> **Catatan**: Menggunakan permission `setoran:create-own/all` (sama dengan create/update).

**Response (200):**

```json
{
  "success": true,
  "message": "Setoran berhasil dihapus",
  "data": { "id_setoran": 1 }
}
```

---

#### `PATCH /api/setoran/:id/restore`

Memulihkan data setoran yang telah di-soft-delete.

**Permission:** `setoran:create-own` atau `setoran:create-all`

> **Catatan**: Menggunakan permission `setoran:create-own/all` (sama dengan create/update/delete).

**Response (200):**

```json
{
  "success": true,
  "message": "Setoran berhasil di-restore",
  "data": { "id_setoran": 1 }
}
```

---

### 8.7 Sekolah

**Base path:** `/api/sekolah`  
**Auth:** Semua endpoint memerlukan Bearer Token

#### `GET /api/sekolah`

Mendapatkan profil sekolah pengguna yang sedang login.

**Response (200):**

```json
{
  "success": true,
  "message": "Profil sekolah berhasil diambil",
  "data": {
    "id_sekolah": 1,
    "nama_sekolah": "Ponpes Al-Hikmah",
    "alamat": "Jl. Merdeka No. 10",
    "display_token": "3f8b9e4a-1c5d-4f7b-8a9d-0e1f2a3b4c5d",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `403` - Pengguna tidak memiliki afiliasi sekolah
- `404` - Profil sekolah tidak ditemukan

---

#### `PATCH /api/sekolah`

Memperbarui profil sekolah. Hanya Admin atau Superadmin.

**Request Body:**

```json
{
  "nama_sekolah": "Nama Baru",
  "alamat": "Alamat Baru"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profil sekolah berhasil diperbarui",
  "data": {
    "id_sekolah": 1,
    "nama_sekolah": "Nama Baru",
    "alamat": "Alamat Baru",
    "display_token": "3f8b9e4a-1c5d-4f7b-8a9d-0e1f2a3b4c5d"
  }
}
```

**Errors:**
- `400` - Input data tidak valid
- `403` - Akses ditolak (bukan Admin)

---

### 8.8 Display (Public)

**Base path:** `/api/display`  
**Auth:** **TIDAK perlu** Bearer Token. Akses menggunakan `display_token` (UUID) dari sekolah.

> Endpoint ini dirancang untuk layar display publik di sekolah (TV/monitor).  
> `display_token` bisa didapatkan dari response `GET /api/sekolah`.

---

#### `GET /api/display/:display_token/halaqah`

Mendapatkan daftar semua halaqah per sekolah.

**Response (200):**

```json
{
  "success": true,
  "message": "Data halaqah berhasil diambil",
  "data": [
    {
      "id_halaqah": 1,
      "nama_halaqah": "Halaqah Subuh A",
      "nama_muhafiz": "Ustadz Ahmad",
      "jumlah_santri": 12
    }
  ]
}
```

> **Field mapping** (dari mapper):
> - `nama_halaqah` → dari `name_halaqah` di database
> - `nama_muhafiz` → dari `user.name` relasi, fallback: `"Tanpa Muhafiz"`
> - `jumlah_santri` → dari `_count.santri` (hanya santri aktif / non-deleted)

---

#### `GET /api/display/:display_token/absensi/halaqah/:halaqahId`

Mendapatkan absensi harian sebuah halaqah (publik).

**Query Parameters:**

| Parameter | Type    | Default     | Keterangan              |
|----------|--------|-------------|-------------------------|
| `date`   | `string`| Hari ini    | Tanggal (YYYY-MM-DD)    |

**Response (200):**

```json
{
  "success": true,
  "message": "Data absensi halaqah berhasil diambil",
  "data": [
    {
      "id_absensi": 1,
      "nama_santri": "Budi",
      "status": "HADIR",
      "keterangan": "-",
      "tanggal": "2026-06-15T05:00:00.000Z"
    }
  ]
}
```

> **Field mapping** (dari mapper):
> - `nama_santri` → dari `santri.nama_santri`, fallback: `"Anonim"`
> - `keterangan` → fallback `"-"` jika null
> - `tanggal` → tanggal absensi (ISO datetime)

---

#### `GET /api/display/:display_token/setoran/all`

Mendapatkan semua data setoran (publik) per sekolah.

**Response (200):**

```json
{
  "success": true,
  "message": "Berhasil mengambil semua data setoran",
  "data": [
    {
      "id_setoran": 1,
      "nama_santri": "Budi",
      "nama_halaqah": "Halaqah Subuh A",
      "surat": "An-Naba",
      "ayat": "1-5",
      "juz": 30,
      "kategori": "ZIYADAH",
      "tanggal": "2026-06-15T00:00:00.000Z"
    }
  ]
}
```

> **Field mapping** (dari mapper):
> - `nama_santri` → dari `santri.nama_santri`, fallback: `"Anonim"`
> - `nama_halaqah` → dari `santri.halaqah.name_halaqah`, fallback: `"Tanpa Halaqah"`
> - `juz` → bisa `null`
> - `tanggal` → dari `tanggal_setoran`
>
> **Catatan**: Endpoint ini **tidak** mengembalikan field `taqwim` dan `keterangan`.

---

#### `GET /api/display/:display_token/santri`

Mendapatkan daftar semua santri (publik) per sekolah.

**Response (200):**

```json
{
  "success": true,
  "message": "Daftar santri berhasil diambil",
  "data": [
    {
      "id_santri": 1,
      "nama_santri": "Budi",
      "nomor_telepon": "08123456789",
      "nama_halaqah": "Halaqah Subuh A"
    }
  ]
}
```

> **Field mapping** (dari mapper):
> - `nomor_telepon` → fallback `"-"` jika null
> - `nama_halaqah` → dari `halaqah.name_halaqah`, fallback: `"Tanpa Halaqah"`

---

#### `GET /api/display/:display_token/santri/:id`

Mendapatkan detail lengkap santri beserta statistik bulanan (profil, kehadiran, absensi, setoran).

**Query Parameters:**

| Parameter | Type      | Default         | Keterangan              |
|----------|----------|----------------|-------------------------|
| `month`  | `integer`| Bulan sekarang  | Bulan (1-12)           |
| `year`   | `integer`| Tahun sekarang  | Tahun                   |

**Response (200):**

```json
{
  "success": true,
  "message": "Detail data santri berhasil diambil",
  "data": {
    "profil": {
      "id_santri": 1,
      "nama_santri": "Budi",
      "nomor_telepon": "08123456789",
      "target": "SEDANG",
      "nama_halaqah": "Halaqah Subuh A",
      "nama_muhafiz": "Ustadz Ahmad"
    },
    "statistik_bulanan": {
      "bulan": 6,
      "tahun": 2026,
      "total_hadir": 20,
      "total_setoran": 15
    },
    "riwayat_absensi": [
      {
        "id_absensi": 1,
        "tanggal": "2026-06-01T05:00:00.000Z",
        "status": "HADIR",
        "keterangan": "-"
      }
    ],
    "riwayat_setoran": [
      {
        "id_setoran": 1,
        "tanggal": "2026-06-01T00:00:00.000Z",
        "juz": 30,
        "surat": "An-Naba",
        "ayat": "1-5",
        "kategori": "ZIYADAH",
        "keterangan": "-"
      }
    ]
  }
}
```

> **Struktur response detail**:
> - `profil` — Informasi dasar santri termasuk nama halaqah dan muhafiz
>   - `nomor_telepon` → fallback `"-"` jika null
>   - `nama_halaqah` → fallback `"Tanpa Halaqah"`
>   - `nama_muhafiz` → fallback `"Belum ditentukan"`
> - `statistik_bulanan` — Ringkasan kehadiran dan setoran untuk bulan/tahun yang diminta
>   - `total_hadir` — Jumlah absensi dengan status `HADIR`
>   - `total_setoran` — Jumlah record setoran di bulan tersebut
> - `riwayat_absensi` — Array semua absensi santri di bulan tersebut
>   - `keterangan` → fallback `"-"` jika null
> - `riwayat_setoran` — Array semua setoran santri di bulan tersebut
>   - `juz` → bisa `null`
>   - `keterangan` → fallback `"-"` jika null

**Errors:**
- `404` - Santri tidak ditemukan

---

## Quick Reference: Endpoint Summary

| Method   | Endpoint                                              | Auth  | Keterangan                            |
|---------|------------------------------------------------------|-------|---------------------------------------|
| POST    | `/api/halaqah/auth/login`                            | -     | Login                                 |
| GET     | `/api/halaqah/auth/me`                               | Yes   | Profil user login                     |
| POST    | `/api/halaqah/auth/register`                         | Yes   | Register muhafiz                      |
| POST    | `/api/halaqah/auth/register-admin`                   | -     | Register admin + sekolah              |
| GET     | `/api/halaqah/auth/verify-email`                     | -     | Verifikasi email                      |
| POST    | `/api/halaqah/auth/resend-verification`              | -     | Kirim ulang verifikasi                |
| GET     | `/api/halaqah/auth/muhafiz`                          | Yes   | List muhafiz                          |
| PATCH   | `/api/halaqah/auth/muhafiz/:id`                      | Yes   | Update muhafiz                        |
| DELETE  | `/api/halaqah/auth/muhafiz/:id`                      | Yes   | Soft delete muhafiz                   |
| GET     | `/api/halaqah/auth/muhafiz/deleted`                  | Yes   | List deleted muhafiz                  |
| PATCH   | `/api/halaqah/auth/muhafiz/restore/:id`              | Yes   | Restore muhafiz                       |
| POST    | `/api/halaqah/auth/impersonate/:id`                  | Yes   | Impersonate muhafiz                   |
| POST    | `/api/halaqah`                                       | Yes   | Create halaqah                        |
| GET     | `/api/halaqah`                                       | Yes   | List halaqah                          |
| GET     | `/api/halaqah/deleted`                               | Yes   | List deleted halaqah                  |
| GET     | `/api/halaqah/:id`                                   | Yes   | Detail halaqah                        |
| PATCH   | `/api/halaqah/:id`                                   | Yes   | Update halaqah                        |
| DELETE  | `/api/halaqah/:id`                                   | Yes   | Soft delete halaqah                   |
| PATCH   | `/api/halaqah/restore/:id`                           | Yes   | Restore halaqah                       |
| GET     | `/api/santri`                                        | Yes   | List santri                           |
| POST    | `/api/santri`                                        | Yes   | Create santri                         |
| PATCH   | `/api/santri/:id`                                    | Yes   | Update santri                         |
| DELETE  | `/api/santri/:id`                                    | Yes   | Soft delete santri                    |
| PATCH   | `/api/santri/:id/restore`                            | Yes   | Restore santri                        |
| POST    | `/api/sesi-halaqah`                                  | Yes   | Create sesi                           |
| GET     | `/api/sesi-halaqah`                                  | Yes   | List sesi (no pagination)             |
| GET     | `/api/sesi-halaqah/:id`                              | Yes   | Detail sesi                           |
| PATCH   | `/api/sesi-halaqah/:id`                              | Yes   | Update sesi                           |
| DELETE  | `/api/sesi-halaqah/:id`                              | Yes   | Delete sesi                           |
| POST    | `/api/absensi`                                       | Yes   | Create absensi santri (upsert)        |
| POST    | `/api/absensi/muhafiz`                               | Yes   | Create absensi muhafiz (upsert)       |
| GET     | `/api/absensi/halaqah/:halaqahId`                    | Yes   | Absensi harian/bulanan halaqah        |
| GET     | `/api/absensi/santri/:id_santri`                     | Yes   | Riwayat absensi santri                |
| GET     | `/api/absensi/rekap-santri`                          | Yes   | Rekap bulanan semua santri            |
| GET     | `/api/absensi/rekap-muhafiz`                         | Yes   | Rekap bulanan muhafiz                 |
| PATCH   | `/api/absensi/:id`                                   | Yes   | Update absensi santri                 |
| PATCH   | `/api/absensi/muhafiz/:id`                           | Yes   | Update absensi muhafiz                |
| DELETE  | `/api/absensi/:id`                                   | Yes   | Delete absensi santri                 |
| DELETE  | `/api/absensi/muhafiz/:id`                           | Yes   | Delete absensi muhafiz                |
| POST    | `/api/setoran`                                       | Yes   | Create setoran                        |
| GET     | `/api/setoran/all`                                   | Yes   | List semua setoran                    |
| GET     | `/api/setoran/santri/:id_santri`                     | Yes   | Riwayat setoran santri                |
| PATCH   | `/api/setoran/:id`                                   | Yes   | Update setoran                        |
| DELETE  | `/api/setoran/:id`                                   | Yes   | Soft delete setoran                   |
| PATCH   | `/api/setoran/:id/restore`                           | Yes   | Restore setoran                       |
| GET     | `/api/sekolah`                                       | Yes   | Profil sekolah                        |
| PATCH   | `/api/sekolah`                                       | Yes   | Update profil sekolah                 |
| GET     | `/api/display/:token/halaqah`                        | -     | Public: list halaqah                  |
| GET     | `/api/display/:token/absensi/halaqah/:halaqahId`     | -     | Public: absensi halaqah              |
| GET     | `/api/display/:token/setoran/all`                    | -     | Public: semua setoran                 |
| GET     | `/api/display/:token/santri`                         | -     | Public: list santri                   |
| GET     | `/api/display/:token/santri/:id`                     | -     | Public: detail santri + statistik    |
| GET     | `/health` atau `/api/health`                         | -     | Health check                          |

---

## Tips untuk Frontend

1. **Simpan token JWT** di `localStorage` atau `sessionStorage`, kirim di setiap request via header `Authorization: Bearer <token>`.
2. **Handle 401**: Jika menerima status 401, redirect ke halaman login. Token mungkin sudah expired.
3. **Handle 403**: Tampilkan pesan "Akses ditolak" jika user mencoba mengakses fitur di luar role-nya.
4. **Pagination**: Selalu cek field `pagination` di response untuk membangun UI pagination.
5. **Soft Delete**: Gunakan endpoint `deleted` dan `restore` untuk fitur trash/recycle bin.
6. **Display Token**: Gunakan `display_token` dari endpoint `GET /api/sekolah` untuk membangun halaman display publik.
7. **Upsert Absensi**: Tidak perlu cek apakah absensi sudah ada. Cukup POST, sistem akan otomatis upsert.
8. **Tanggal**: Semua tanggal menggunakan format ISO 8601. Gunakan `Date` object atau library seperti `dayjs`/`date-fns`.
9. **Enum Values**: Pastikan dropdown/select di frontend menggunakan value enum yang tepat (lihat bagian Enum Reference).
10. **Error Display**: Selalu tampilkan `message` dari response error kepada user.
11. **CORS**: Jika menggunakan `fetch` atau `axios`, pastikan `baseURL` sudah benar. Origin frontend harus terdaftar di `ALLOWED_ORIGINS` backend (atau gunakan localhost saat development).
12. **Body Limit**: Maksimal 100KB per request. Jangan kirim payload yang terlalu besar.
13. **Field `jenis` pada Halaqah**: Tidak bisa diset saat create maupun update via API. Selalu default `TAHFIDZ`.
14. **Display Endpoint Mapper**: Perhatikan bahwa field-field di display endpoint mengalami transformasi (contoh: `name_halaqah` → `nama_halaqah`, null → fallback string seperti `"-"` atau `"Tanpa Muhafiz"`).
15. **Sesi Halaqah List**: Endpoint `GET /api/sesi-halaqah` mengembalikan semua sesi sekaligus (tanpa pagination). Cocok untuk dropdown select.
16. **User `has_halaqah`**: Field `has_halaqah` dan `id_halaqah` di response login berguna untuk menentukan apakah muhafiz sudah memiliki halaqah atau belum (untuk conditional UI).
17. **Nomor Telepon Santri**: Bisa berupa `string` kosong/null di database, tapi di response selalu berupa string (fallback `"-"` untuk display endpoint).
18. **Setoran `juz` bisa null**: Pada response display setoran, field `juz` bisa bernilai `null`.
