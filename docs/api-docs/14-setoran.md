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

