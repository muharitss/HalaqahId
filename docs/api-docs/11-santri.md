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

#### `GET /api/santri/:id`

Mendapatkan detail santri.

**Permission:** `santri:view-own` atau `santri:view-all`

**Path Parameters:**

| Parameter | Type  | Keterangan        |
|-----------|-------|-------------------|
| `id`      | `int` | ID santri         |

**Response (200):**

```json
{
  "success": true,
  "message": "Detail santri berhasil diambil",
  "data": {
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

