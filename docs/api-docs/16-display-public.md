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

