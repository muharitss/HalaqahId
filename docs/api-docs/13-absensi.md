### 8.5 Absensi

**Base path:** `/api/absensi`  
**Auth:** Semua endpoint memerlukan Bearer Token

#### `POST /api/absensi`

Mencatat absensi santri. **Upsert** - jika santri sudah diabsen di sesi + tanggal yang sama, data akan diupdate.

**Permission:** `absensi:santri:create-own` atau `absensi:santri:create-all`

**Validasi Integritas Sesi-Santri (Konsistensi Halaqah):**

Sistem akan memvalidasi bahwa sesi yang dipilih **sesuai dengan halaqah tempat siswa berada**. Aturan:

- Jika sesi sudah terikat ke sebuah halaqah (`sesi.id_halaqah != null`), maka `student.id_halaqah` WAJIB sama. Jika beda, request ditolak dengan status `400` "Santri dan sesi berada di halaqah yang berbeda."
- Untuk **MUHAFIZ**: sesi dan student keduanya harus berada di halaqah yang sama dengan halaqah muhafiz.
- Untuk **KOORDINATOR/ADMIN**: sesi dan student harus berada di sekolah yang sama dengan user.

> Tujuan: mencegah seorang muhafiz halaqah A "menyuntikkan" absensi untuk student halaqah B hanya karena ia mengetahui `id_sesi` yang valid di sekolahnya.

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
| `id_sesi`  | `number`| Yes      | ID sesi halaqah (**harus satu halaqah dengan siswa** — lihat Validasi di atas) |
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

**Errors:**
- `400` - `id_santri`/`id_sesi` tidak valid / `Santri dan sesi berada di halaqah yang berbeda` / `Santri belum ditempatkan di halaqah manapun`
- `403` - Santri berasal dari sekolah lain / sesi di luar sekolah / sesi bukan milik halaqah muhafiz / siswa bukan anggota halaqah muhafiz
- `404` - Santri tidak ditemukan / sesi halaqah tidak ditemukan

---

#### `GET /api/absensi/sesi/:id_sesi`

Mendapatkan **absensi sebuah sesi tertentu** pada tanggal tertentu. Endpoint ini adalah cara paling natural untuk menampilkan rekap absensi per-sesi, mendukung konsep "setiap sesi halaqah punya absensinya sendiri".

**Permission:** `absensi:santri:view-own` atau `absensi:santri:view-all`

**Path Parameters:**

| Parameter  | Type  | Keterangan        |
|-----------|-------|-------------------|
| `id_sesi` | `int` | ID sesi halaqah   |

**Query Parameters:**

| Parameter | Type    | Default     | Keterangan              |
|----------|--------|-------------|-------------------------|
| `date`   | `string`| Hari ini    | Tanggal (YYYY-MM-DD)    |

**Authorization scope:**
- **MUHAFIZ**: hanya bisa melihat sesi milik halaqahnya sendiri.
- **KOORDINATOR/ADMIN**: hanya bisa melihat sesi di sekolahnya.
- **SUPERADMIN**: bebas.

**Response (200):**

```json
{
  "success": true,
  "message": "Data absensi sesi berhasil diambil",
  "data": [
    {
      "id_absensi": 1,
      "id_santri": 1,
      "id_sesi": 1,
      "tanggal": "2026-06-15T00:00:00.000Z",
      "status": "HADIR",
      "keterangan": null,
      "sesi": {
        "id_sesi": 1,
        "nama_sesi": "Bada Subuh",
        "jam_mulai": "05:00",
        "jam_selesai": "06:15",
        "id_halaqah": 5
      },
      "santri": {
        "id_santri": 1,
        "nama_santri": "Budi",
        "id_halaqah": 5
      }
    },
    {
      "id_absensi": 2,
      "id_santri": 2,
      "id_sesi": 1,
      "tanggal": "2026-06-15T00:00:00.000Z",
      "status": "IZIN",
      "keterangan": "Sakit",
      "sesi": {
        "id_sesi": 1,
        "nama_sesi": "Bada Subuh",
        "jam_mulai": "05:00",
        "jam_selesai": "06:15",
        "id_halaqah": 5
      },
      "santri": {
        "id_santri": 2,
        "nama_santri": "Ahmad",
        "id_halaqah": 5
      }
    }
  ]
}
```

**Errors:**
- `400` - ID Sesi tidak valid
- `403` - Sesi di luar sekolah Anda / sesi bukan milik halaqah Anda (MUHAFIZ)
- `404` - Sesi halaqah tidak ditemukan

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
      "sesi": {
        "id_sesi": 1,
        "nama_sesi": "Bada Subuh",
        "jam_mulai": "05:00",
        "jam_selesai": "06:15",
        "id_halaqah": 5
      },
      "santri": {
        "id_santri": 1,
        "nama_santri": "Budi",
        "id_halaqah": 5
      }
    }
  ]
}
```

> **Catatan**: Response sudah termasuk relasi `sesi` (lengkap dengan `id_halaqah`) dan `santri` (lengkap dengan `id_halaqah`). Hasil hanya berisi absensi untuk sesi-sesi yang terikat ke halaqah yang diminta (atau sesi legacy dengan `id_halaqah = NULL`).

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

