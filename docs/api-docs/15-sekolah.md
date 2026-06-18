### 8.7 Sekolah

**Base path:** `/api/sekolah`  
**Auth:** Semua endpoint memerlukan Bearer Token

#### `GET /api/sekolah/all`

Mendapatkan daftar semua sekolah. Hanya Superadmin. Mendukung pencarian berdasarkan nama sekolah dan pagination.

**Query Parameters:**

| Parameter | Type      | Default | Keterangan                                   |
|-----------|-----------|---------|----------------------------------------------|
| `page`    | `integer` | `1`     | Nomor halaman                                |
| `limit`   | `integer` | `10`    | Data per halaman                             |
| `search`  | `string`  | -       | Filter berdasarkan nama sekolah              |

**Response (200):**

```json
{
  "success": true,
  "message": "Daftar sekolah berhasil diambil",
  "data": [
    {
      "id_sekolah": 1,
      "nama_sekolah": "Ponpes Al-Hikmah",
      "email": "admin@alhikmah.sch.id",
      "alamat": "Jl. Merdeka No. 10",
      "display_token": "3f8b9e4a-1c5d-4f7b-8a9d-0e1f2a3b4c5d",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
      "_count": {
        "users": 3,
        "halaqah": 5,
        "santri": 120
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

**Errors:**
- `403` - Akses ditolak (hanya Superadmin)

---

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
    "email": "admin@alhikmah.sch.id",
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
  "email": "admin-baru@alhikmah.sch.id",
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
    "email": "admin-baru@alhikmah.sch.id",
    "alamat": "Alamat Baru",
    "display_token": "3f8b9e4a-1c5d-4f7b-8a9d-0e1f2a3b4c5d",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Input data tidak valid
- `403` - Akses ditolak (bukan Admin atau tidak memiliki afiliasi sekolah)

---

