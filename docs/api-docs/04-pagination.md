## 4. Pagination

Endpoint yang mendukung pagination menerima query parameter:

| Parameter | Type      | Default | Keterangan                    |
|----------|----------|---------|-------------------------------|
| `page`   | `integer` | `1`     | Nomor halaman (min 1)         |
| `limit`  | `integer` | `10`    | Jumlah data per halaman (max 100) |

### Contoh Request

```
GET /api/halaqah?page=2&limit=15
```

### Pagination Metadata (di response)

```json
{
  "page": 2,
  "limit": 15,
  "total": 42,
  "totalPages": 3
}
```

---

