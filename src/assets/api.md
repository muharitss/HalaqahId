## 📚 Dokumentasi API Halaqah ID - Update Day 3

Berikut adalah dokumentasi teknis fitur **RBAC (Role-Based Access Control)**, **Username Identity**, dan **Manajemen Akun Muhafiz** yang telah aktif di `main` branch.

### 🛠️ Ringkasan Sistem

Sistem menggunakan **JWT Authentication** dengan pembagian role yang ketat.

* **Base URL:** `https://halaqahid-backend.vercel.app`
* **Prefix:** `/api/halaqah`

---

### 🔐 Keamanan (Middleware)

Setiap request ke endpoint bertanda 🔐 wajib menyertakan header:
`Authorization: Bearer <your_jwt_token>`

---

### 📡 Endpoint Authentication

#### 1. Login (Public)

Digunakan untuk mendapatkan token. Sekarang mendukung login via **Email**.

* **URL:** `POST /auth/login`
* **Body:**

```json
{
  "email": "admin@mail.com",
  "password": "admin123"
}

```

#### 2. Get Profile (`/me`) 🔐

Mendapatkan data user yang sedang login dari token.

* **URL:** `GET /auth/me`
* **Akses:** Semua Role (Superadmin & Muhafiz)

---

### 👥 Manajemen User (Admin Only 🔐)

#### 1. Register Muhafiz

Membuat akun Muhafiz baru dengan identitas **Username**.

* **URL:** `POST /auth/register`
* **Body:**

```json
{
  "username": "muhafiz_kece",
  "email": "muhafiz@mail.com",
  "password": "password123"
}

```

#### 2. Get All Muhafiz List

Mengambil semua daftar Muhafiz yang aktif (tidak terhapus).

* **URL:** `GET /auth/muhafiz`
* **Akses:** Superadmin Saja.

#### 3. Update Muhafiz (Partial Update)

Mengubah data Muhafiz (Username/Email) secara spesifik.

* **URL:** `PATCH /auth/muhafiz/:id`
* **Body (Opsional):**

```json
{
  "username": "username_baru"
}

```

#### 4. Delete Muhafiz (Soft Delete)

Menghapus akun Muhafiz secara halus (data tetap ada di DB tapi tidak muncul di aplikasi).

* **URL:** `DELETE /auth/muhafiz/:id`

---

### ⚠️ Tabel Response Error

| HTTP Status | Pesan Error | Penjelasan |
| --- | --- | --- |
| **401** | `Akses ditolak, token tidak ada` | Token tidak valid atau tidak dikirim. |
| **403** | `Akses ditolak: Role muhafiz tidak diizinkan` | User login sebagai muhafiz mencoba akses fitur admin. |
| **400** | `Email sudah terdaftar` | Email sudah ada di database. |
| **400** | `Username sudah digunakan` | Username sudah dipakai oleh user lain. |
| **404** | `Muhafiz tidak ditemukan` | ID user tidak ada atau user tersebut bukan role muhafiz. |

---

### 💡 Catatan Implementasi Frontend

1. **Username Display:** Menampilkan `username` di dashboard sebagai identitas utama.
2. **PATCH Method:** Gunakan `PATCH` untuk edit profil agar hanya mengirim field yang berubah.
3. **Soft Delete Handling:** User yang sudah dihapus akan hilang dari list `GET /muhafiz`.
4. **Validation Error:** Jika dapet status `400` dengan pesan "Username sudah digunakan", beri peringatan pada input username di UI.

---

**Status:** 🟢 **Production Ready (Main Branch)**