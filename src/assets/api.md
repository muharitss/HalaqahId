## 📚 Dokumentasi API Halaqah ID - Update Day 2

Berikut adalah dokumentasi teknis fitur **RBAC (Role-Based Access Control)** dan **Manajemen Akun Muhafiz** yang telah aktif.

### 🛠️ Ringkasan Sistem

Sistem sekarang menggunakan **JWT Authentication** dengan pembagian role yang ketat. User tidak bisa melakukan registrasi mandiri; semua akun muhafiz dibuat oleh admin.

* **Base URL:** `https://halaqahid-backend.vercel.app`
* **Prefix:** `/api/halaqah`

---

### 🔐 Keamanan (Middleware)

Setiap request ke endpoint bertanda 🔐 wajib menyertakan header:
`Authorization: Bearer <your_jwt_token>`

---

### 📡 Endpoint Authentication

#### 1. Login (Public)

Digunakan untuk autentikasi awal dan mendapatkan token.

* **URL:** `POST /auth/login`
* **Body:**

```json
{
  "email": "admin@mail.com",
  "password": "admin123"
}

```

* **Success Response:** Menghasilkan token JWT dan info role user.

#### 2. Get Profile (`/me`) 🔐

Mengecek validitas token dan mengambil data user yang sedang login.

* **URL:** `GET /auth/me`
* **Akses:** Semua Role (Superadmin & Muhafiz)

---

### 👥 Manajemen User (Admin Only)

#### 1. Register Muhafiz 🔐🔐

Membuatkan akun baru untuk Muhafiz. Hanya bisa dilakukan oleh Superadmin.

* **URL:** `POST /auth/register`
* **Akses:** **Superadmin Saja**
* **Body:**

```json
{
  "email": "muhafiz_baru@mail.com",
  "password": "password123"
}

```

* **Security Note:** Password otomatis di-hash. Response hanya akan mengembalikan `id_user`, `email`, dan `role`.

---

### ⚠️ Tabel Response Error (Untuk FE)

| HTTP Status | Pesan Error | Penjelasan |
| --- | --- | --- |
| **401** | `Akses ditolak, token tidak ada` | Token tidak dikirim atau sudah kedaluwarsa. |
| **403** | `Akses ditolak: Role muhafiz tidak diizinkan` | User mencoba akses fitur admin (misal: Register). |
| **400** | `Email sudah terdaftar` | Email yang diinput sudah ada di database. |

---

### 💡 Catatan Implementasi Frontend

1. **Role Guard:** Pastikan menu "Tambah Akun" hanya muncul jika `user.role === 'superadmin'`.
2. **Auto Redirect:** Jika API mengembalikan status **401**, otomatis arahkan user ke halaman `/login`.
3. **Persistence:** Simpan token di `localStorage` dan gunakan di setiap header request API berikutnya.

---

**Status:** 🟢 **Production Ready**