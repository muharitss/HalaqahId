## 3. Response Format

### Success Response

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

| Field        | Type            | Keterangan                                      |
|-------------|----------------|------------------------------------------------|
| `success`    | `boolean`      | Selalu `true` untuk response berhasil           |
| `message`    | `string`       | Pesan deskriptif                                |
| `data`       | `any`          | Data utama (object, array, atau null)           |
| `pagination` | `object|null`  | Hanya ada pada endpoint yang mendukung pagination|

### Error Response

```json
{
  "success": false,
  "message": "Email atau password salah",
  "errors": null
}
```

| Field    | Type          | Keterangan                          |
|---------|--------------|-------------------------------------|
| `success` | `boolean`   | Selalu `false` untuk error          |
| `message` | `string`    | Pesan error                         |
| `errors`  | `any`       | Detail error (bisa null)            |

---

