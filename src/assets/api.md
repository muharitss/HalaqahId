## 📚 Dokumentasi API Halaqah ID - Update Day 4

Berikut adalah dokumentasi teknis fitur **RBAC (Role-Based Access Control)**, **Username Identity**, **Manajemen Akun Muhafiz**, dan **Manajemen Halaqah** yang telah aktif di `main` branch.

### 🛠️ Ringkasan Sistem

Sistem menggunakan **JWT Authentication** dengan pembagian role yang ketat.

* **Base URL:** `https://halaqah-id-be.vercel.app`
* **Prefix API:** `/api`
* **Prefix Auth:** `/api/halaqah/auth`

---

### 🔐 Keamanan (Middleware)

Setiap request ke endpoint bertanda 🔐 wajib menyertakan header:
`Authorization: Bearer <your_jwt_token>`

---

### 📡 Endpoint Authentication

#### 1. Login (Public)

Sekarang mendukung login via **Email** atau **Username**. User yang sudah di-soft delete tidak bisa login.

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

#### 3. Impersonate (Login As) 🔐

Admin "masuk" sebagai Muhafiz untuk pengecekan data tanpa perlu password muhafiz.

* **URL:** `POST /auth/impersonate/:id`
* **Akses:** Superadmin Saja.
* **Response:** Mengembalikan token baru dengan identitas Muhafiz terkait.

---

### 👥 Manajemen User (Admin Only 🔐)

#### 1. Register Muhafiz

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

Daftar muhafiz yang aktif (belum di-soft delete).

* **URL:** `GET /auth/muhafiz`

#### 3. Update Muhafiz (Partial)

* **URL:** `PATCH /auth/muhafiz/:id`

#### 4. Delete Muhafiz (Soft Delete)

* **URL:** `DELETE /auth/muhafiz/:id`

---

### 🏛️ Manajemen Halaqah (Admin Only 🔐)

#### 1. Create Halaqah

Menghubungkan kelompok baru ke satu Muhafiz (Unique).

* **URL:** `POST /api/halaqah`
* **Body:** `{"name_halaqah": "Nama Kelompok", "muhafiz_id": 5}`

#### 2. List Halaqah (Active)

* **URL:** `GET /api/halaqah`

``` json
{
    "success": true,
    "message": "Data halaqah berhasil diambil",
    "data": [
        {
            "id_halaqah": 1,
            "name_halaqah": "TES\n",
            "muhafiz_id": 8,
            "deleted_at": null,
            "muhafiz": {
                "id_user": 8,
                "username": "Muhammad",
                "email": "muhafiz_baru1@mail.com"
            },
            "_count": {
                "santri": 0
            }
        }
    ]
}
```

#### 3. Soft Delete Halaqah

* **URL:** `DELETE /api/halaqah/:id`

#### 4. Trash List (Deleted Only)

* **URL:** `GET /api/halaqah/deleted`

#### 5. Restore Halaqah

* **URL:** `PATCH /api/halaqah/restore/:id`

---

### ⚠️ Tabel Response Error

| HTTP Status | Pesan Error | Penjelasan |
| --- | --- | --- |
| **401** | `Invalid email or password` | Password salah atau akun sudah di-soft delete. |
| **403** | `Akses ditolak: Role muhafiz...` | Muhafiz mencoba akses fitur khusus Admin. |
| **400** | `Username/Email sudah digunakan` | Duplikasi data pada field unik. |
| **400** | `muhafiz_id sudah digunakan` | Muhafiz sudah memiliki halaqah lain. |
| **500** | `JWT_SECRET is missing` | Konfigurasi server belum lengkap (Environment Variable). |

---

### 💡 Catatan Implementasi Frontend

1. **Token Replacement:** Saat menggunakan fitur Impersonate, segera ganti token di LocalStorage dengan token baru dari response agar role berubah.
2. **Soft Delete Logic:** User/Halaqah yang dihapus tidak akan muncul di `GET` utama, gunakan endpoint `/deleted` untuk melihat data di "Sampah".

---

**Status:** 🟢 **Production Ready**