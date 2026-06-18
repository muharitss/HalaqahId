## 2. Autentikasi

Semua endpoint yang dilindungi memerlukan header **Bearer Token**.

### Cara Menggunakan

```
Authorization: Bearer <JWT_TOKEN>
```

### Cara Mendapatkan Token

1. Login via `POST /api/halaqah/auth/login` dengan email & password
2. Response akan mengembalikan `data.token` (JWT) dan `data.user` (profil)
3. Simpan token dan gunakan di setiap request berikutnya

### Token Info

- **Expiry**: 7 hari
- **Payload JWT**: `{ id, role, id_sekolah }`
- **Refresh**: Belum tersedia, lakukan login ulang setelah token expired

### Verifikasi Email

- Setiap user baru (register muhafiz/admin) akan menerima email verifikasi dari Brevo
- User **tidak bisa login** sebelum email diverifikasi
- Link verifikasi berisi token JWT dengan masa berlaku 15 menit
- Endpoint verifikasi: `GET /api/halaqah/auth/verify-email?token=<TOKEN>`

---

