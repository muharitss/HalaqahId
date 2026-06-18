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

#### `GET /api/halaqah/auth/muhafiz/:id`

Mendapatkan detail muhafiz.

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
  "message": "Detail muhafiz berhasil diambil",
  "data": {
    "id_user": 5,
    "name": "Ustadz Ahmad",
    "email": "ahmad@example.com",
    "role": "MUHAFIZ",
    "id_sekolah": 1,
    "is_verified": true,
    "deleted_at": null
  }
}
```

**Errors:**
- `404` - User tidak ditemukan

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

