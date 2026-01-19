# 📚 Dokumentasi API Halaqah ID

**Update Day 4**

Dokumentasi ini mencakup fitur **RBAC (Role-Based Access Control)**, **Username Identity**, **Manajemen Akun Muhafiz**, **Manajemen Halaqah**, **Manajemen Santri**, dan **Modul Setoran Hafalan** yang sudah aktif dan terverifikasi di `main` branch.

---

## 🛠️ Ringkasan Sistem

Sistem menggunakan **JWT Authentication** dengan pembagian role yang ketat.

* **Base URL:** `https://halaqah-id-be.vercel.app`
* **Prefix API:** `/api`
* **Prefix Auth:** `/api/halaqah/auth`
* **Security:** JWT (Role-Based Access)

---

## 🔐 Keamanan (Middleware)

Setiap request ke endpoint bertanda 🔐 **wajib** menyertakan header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 📡 Endpoint Authentication

### 1. Login (Public)

Mendukung login via **Email** atau **Username**.
User yang sudah di-*soft delete* tidak bisa login.

* **URL:** `POST /auth/login`
* **Body:**

```json
{
  "email": "admin@mail.com",
  "password": "admin123"
}
```

---

### 2. Get Profile (`/me`) 🔐

Mengambil data user berdasarkan token login.

* **URL:** `GET /auth/me`
* **Akses:** Superadmin, Muhafiz

---

### 3. Impersonate (Login As) 🔐

Superadmin login sebagai Muhafiz tanpa password.

* **URL:** `POST /auth/impersonate/:id`
* **Akses:** Superadmin
* **Response:** Token baru dengan identitas Muhafiz

---

## 👥 Manajemen User (Admin Only 🔐)

### 1. Register Muhafiz

* **URL:** `POST /auth/register`
* **Body:**

```json
{
  "username": "muhafiz_kece",
  "email": "muhafiz@mail.com",
  "password": "password123"
}
```

---

### 2. Get All Muhafiz

Daftar Muhafiz aktif (belum di-*soft delete*).

* **URL:** `GET /auth/muhafiz`

---

### 3. Update Muhafiz (Partial)

* **URL:** `PATCH /auth/muhafiz/:id`

---

### 4. Soft Delete Muhafiz

* **URL:** `DELETE /auth/muhafiz/:id`

---

### 5. Trash Muhafiz (Deleted)

* **URL:** `GET /halaqah/auth/muhafiz/deleted`

---

### 6. Restore Muhafiz

* **URL:** `PATCH /halaqah/auth/muhafiz/restore/:id`

---

## 🏛️ Manajemen Halaqah (Admin Only 🔐)

### 1. Create Halaqah

Satu Muhafiz hanya boleh memiliki satu Halaqah.

* **URL:** `POST /api/halaqah`
* **Body:**

```json
{
  "name_halaqah": "Nama Kelompok",
  "muhafiz_id": 5
}
```

---

### 2. List Halaqah (Active)

* **URL:** `GET /api/halaqah`

---

### 3. Soft Delete Halaqah

* **URL:** `DELETE /api/halaqah/:id`

---

### 4. Trash Halaqah

* **URL:** `GET /api/halaqah/deleted`

---

### 5. Restore Halaqah

* **URL:** `PATCH /api/halaqah/restore/:id`

---

## 📖 Manajemen Santri (Core Feature 🔐)

Sistem menggunakan **Ownership Filter**:
Muhafiz hanya bisa mengakses santri di halaqahnya sendiri.

---

### 1. Create Santri

* **URL:** `POST /api/santri`
* **Body:**

```json
{
  "nama_santri": "Zaid bin Haritsah",
  "nomor_telepon": "081299001122",
  "target": "INTENSE",
  "halaqah_id": 25
}
```

---

### 2. Get Santri List (Auto Filter)

* **URL:** `GET /api/santri`
* **Behavior:**

  * **Admin:** Semua santri
  * **Muhafiz:** Santri di halaqah sendiri

---

### 3. Update Santri

* **URL:** `PATCH /api/santri/:id`
* **Note:** Muhafiz akan terkena `403` jika bukan miliknya

---

### 4. Soft Delete & Restore Santri

* **Delete:** `DELETE /api/santri/:id`
* **Restore:** `PATCH /api/santri/:id/restore` (Admin)

---

## 📘 Modul Setoran Hafalan 🔐

### 1. Simpan Setoran Baru

* **Endpoint:** `POST /setoran`
* **Role:** `superadmin`, `muhafiz`

**Payload:**

| Field      | Tipe   | Wajib | Keterangan         |
| ---------- | ------ | ----- | ------------------ |
| santri_id  | Number | Ya    | ID Santri          |
| juz        | Number | Ya    | 1–30               |
| surat      | String | Ya    | Nama Surah         |
| ayat       | String | Ya    | Rentang ayat       |
| kategori   | String | Ya    | HAFALAN / MURAJAAH |
| taqwim     | String | Tidak | Nilai              |
| keterangan | String | Tidak | Catatan            |

**Response:**

```json
{
  "success": true,
  "message": "Setoran berhasil dicatat",
  "data": { "id_setoran": 18 }
}
```

---

### 2. Riwayat Setoran Per Santri

* **Endpoint:** `GET /setoran/santri/:santriId`

---

### 3. Laporan Global (Admin Only)

* **Endpoint:** `GET /setoran/all`

---

## ⚠️ Error Handling (Global)

| Status | Pesan                | Keterangan       |
| ------ | -------------------- | ---------------- |
| 400    | Input tidak valid    | Validasi gagal   |
| 401    | Unauthorized         | Token invalid    |
| 403    | Akses ditolak        | Bukan hak akses  |
| 404    | Data tidak ditemukan | ID salah         |
| 500    | Server error         | Konfigurasi / DB |

---

## 💡 Catatan Frontend

1. Ganti token saat **Impersonate**
2. Data *soft delete* tidak muncul di list utama
3. Validasi enum & field unik di client

---

## ✅ Status

🟢 **Production Ready**
🟢 **Stable & Verified (Zero 500 Errors)**

---
👌
