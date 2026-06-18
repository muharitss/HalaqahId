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

