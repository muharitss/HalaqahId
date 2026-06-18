### 8.4 Sesi Halaqah

**Base path:** `/api/sesi-halaqah`  
**Auth:** Semua endpoint memerlukan Bearer Token

#### `POST /api/sesi-halaqah`

Membuat sesi halaqah baru. Untuk `MUHAFIZ`, `KOORDINATOR_TAHFIZ`, dan `ADMIN`, setiap sesi **wajib** terikat pada satu halaqah (`id_halaqah`) untuk menegakkan konsep "setiap sesi halaqah punya absensinya sendiri". `SUPERADMIN` dapat membuat sesi tanpa `id_halaqah` untuk kebutuhan legacy/migrasi.

**Permission:** `sesi-halaqah:create`

**Request Body:**

```json
{
  "nama_sesi": "Bada Subuh",
  "jam_mulai": "05:00",
  "jam_selesai": "06:15",
  "hari": [1, 2],
  "id_halaqah": 5,
  "id_sekolah": 1
}
```

| Field         | Type     | Required                                              | Keterangan                                      |
|--------------|---------|------------------------------------------------------|------------------------------------------------|
| `nama_sesi`  | `string`| Yes                                                   | Nama sesi                                       |
| `jam_mulai`  | `string`| Yes                                                   | Format "HH:mm"                                  |
| `jam_selesai`| `string`| Yes                                                   | Format "HH:mm" (harus `> jam_mulai`)            |
| `hari`       | `int[]` | No                                                    | Array of days (1=Senin, 7=Ahad)                 |
| `id_halaqah` | `number`| **Conditional** (lihat tabel perilaku role di bawah)  | Halaqah tempat sesi ini berada                 |
| `id_sekolah` | `number`| Conditional                                           | Wajib jika SUPERADMIN; diabaikan untuk role lain (otomatis dari session) |

**Perilaku `id_halaqah` per Role:**

| Role               | `id_halaqah` di body              | Validasi                                                                 |
|-------------------|-----------------------------------|--------------------------------------------------------------------------|
| `MUHAFIZ`          | **Diabaikan** (wajib di-override) | Otomatis diisi dengan halaqah yang diasuhnya. Error jika muhafiz belum punya halaqah. |
| `KOORDINATOR_TAHFIZ` / `ADMIN` | **Wajib diisi**            | Halaqah tujuan harus berada di sekolah user.                            |
| `SUPERADMIN`      | Opsional (untuk legacy/migrasi)   | Jika null, sesi dibuat tanpa binding halaqah (backward-compat data lama).|

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
    "hari": [1, 2],
    "id_sekolah": 1,
    "id_halaqah": 5,
    "created_at": "2026-06-15T05:00:00.000Z",
    "updated_at": "2026-06-15T05:00:00.000Z"
  }
}
```

**Errors:**
- `400` - `id_halaqah` wajib diisi (KOORDINATOR/ADMIN) / format jam tidak valid / muhafiz belum punya halaqah
- `403` - Halaqah yang dimaksud bukan milik sekolah Anda
- `404` - Halaqah tidak ditemukan

---

#### `GET /api/sesi-halaqah`

Mendapatkan daftar sesi halaqah. **Muhafiz otomatis hanya melihat sesi milik halaqahnya sendiri** (scope enforcement).

**Permission:** `sesi-halaqah:view`

**Query Parameters:**

| Parameter    | Type   | Keterangan                                    |
|-------------|--------|-----------------------------------------------|
| `id_sekolah`| `int`  | Hanya bisa ditentukan oleh SUPERADMIN         |
| `hari`      | `int`  | Filter sesi berdasarkan hari (1=Senin, 7=Ahad)|

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
      "id_sekolah": 1,
      "id_halaqah": 5
    },
    {
      "id_sesi": 2,
      "nama_sesi": "Halaqah Pagi",
      "jam_mulai": "08:00",
      "jam_selesai": "09:30",
      "id_sekolah": 1,
      "id_halaqah": 5
    }
  ]
}
```

> **Catatan:** Endpoint ini **tidak** menggunakan pagination, mengembalikan semua sesi sekaligus. Field `id_halaqah` bisa `null` untuk sesi legacy yang dibuat sebelum update Juni 2026.

---

#### `GET /api/sesi-halaqah/:id`

Mendapatkan detail sesi halaqah, termasuk relasi halaqah (jika ada).

**Permission:** `sesi-halaqah:view`

**Response (200):**

```json
{
  "success": true,
  "message": "Detail sesi halaqah berhasil diambil",
  "data": {
    "id_sesi": 1,
    "nama_sesi": "Bada Subuh",
    "jam_mulai": "05:00",
    "jam_selesai": "06:15",
    "id_sekolah": 1,
    "id_halaqah": 5,
    "halaqah": {
      "id_halaqah": 5,
      "name_halaqah": "Halaqah Subuh A",
      "id_sekolah": 1
    }
  }
}
```

**Errors:**
- `403` - Di luar sekolah Anda / sesi bukan milik halaqah Anda (untuk MUHAFIZ)
- `404` - Sesi tidak ditemukan

---

#### `PATCH /api/sesi-halaqah/:id`

Memperbarui data sesi halaqah. **Untuk menjaga integritas data absensi & setoran historis, `id_halaqah` dan `id_sekolah` tidak dapat diubah setelah sesi dibuat** (kecuali oleh SUPERADMIN untuk tujuan migrasi).

**Permission:** `sesi-halaqah:edit`

**Request Body (semua field opsional):**

```json
{
  "nama_sesi": "Sesi Baru",
  "jam_mulai": "07:00",
  "jam_selesai": "08:30",
  "hari": [3, 4]
}
```

| Field         | Type     | Keterangan                                                          |
|--------------|---------|---------------------------------------------------------------------|
| `nama_sesi`  | `string`| Nama sesi baru                                                       |
| `jam_mulai`  | `string`| Format "HH:mm"                                                       |
| `jam_selesai`| `string`| Format "HH:mm" (harus `> jam_mulai`)                                 |
| `hari`       | `int[]` | Array of days (1=Senin, 7=Ahad)                                      |
| `id_halaqah` | `number`| **Diabaikan** untuk non-SUPERADMIN. Hanya SUPERADMIN yang boleh mengubah-nya (untuk migrasi). |
| `id_sekolah` | `number`| **Diabaikan** untuk non-SUPERADMIN.                                  |

**Response (200):** Object sesi yang sudah diupdate.

**Errors:**
- `400` - Format jam tidak valid / halaqah baru bukan milik sekolah sesi (SUPERADMIN)
- `404` - Halaqah tujuan tidak ditemukan (SUPERADMIN)

---

#### `DELETE /api/sesi-halaqah/:id`

Menghapus sesi halaqah (soft delete). **Sesi yang masih dirujuk oleh absensi/setoran aktif TIDAK dapat dihapus** — admin harus membersihkan/mengarsipkan data terkait terlebih dahulu.

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
- `400` - Sesi tidak dapat dihapus karena masih digunakan oleh N data absensi dan M data setoran aktif. Hapus/arsipkan data terkait terlebih dahulu.
- `403` - Di luar sekolah Anda / sesi bukan milik halaqah Anda (untuk MUHAFIZ)
- `404` - Sesi tidak ditemukan

---

