## 5. Error Handling

### HTTP Status Codes

| Code | Keterangan |
|------|-----------|
| `200` | Sukses (GET, PATCH, DELETE, restore) |
| `201` | Sukses (POST/create) |
| `400` | Bad Request (validasi gagal, input tidak valid) |
| `401` | Unauthorized (token invalid/expired/tidak ada) |
| `403` | Forbidden (tidak punya permission) |
| `404` | Not Found (resource tidak ditemukan) |
| `409` | Conflict (resource sudah ada, misal email duplikat) |
| `422` | Unprocessable Entity |
| `429` | Too Many Requests (rate limit terlampaui) |
| `500` | Internal Server Error |

### CORS Configuration

Backend menggunakan CORS dengan aturan berikut:

| Kondisi | Perilaku |
|---------|----------|
| `ALLOWED_ORIGINS=*` | Semua origin diizinkan |
| `ALLOWED_ORIGINS=http://a.com,http://b.com` | Hanya origin terdaftar yang diizinkan |
| Development mode | `localhost` dan `127.0.0.1` diizinkan otomatis |
| Production mode | Hanya origin di `ALLOWED_ORIGINS` yang diizinkan |

> **Catatan untuk Frontend**: Credentials (`cookies`, `Authorization` header) sudah diizinkan (`credentials: true`). Pastikan frontend mengirim `credentials: 'include'` jika menggunakan cookie-based auth.
>
> **Body limit**: Maksimal 100KB per request (`express.json({ limit: '100kb' })`).

### Rate Limiting

| Scope          | Limit                          |
|---------------|-------------------------------|
| Global        | 100 requests/menit per IP      |
| Login         | Rate limit khusus (lebih ketat)|
| Register      | Rate limit khusus (lebih ketat)|
| Verification  | Rate limit khusus (lebih ketat)|

### Development vs Production Error Behavior

| Mode          | Perilaku Error                                                |
|--------------|----------------------------------------------------------------|
| Development  | `errors.detail` berisi stack trace untuk debugging             |
| Production   | `errors.detail` disembunyikan, hanya `message` yang ditampilkan|

---

