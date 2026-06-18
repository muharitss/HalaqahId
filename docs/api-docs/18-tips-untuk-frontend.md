## Tips untuk Frontend

1. **Simpan token JWT** di `localStorage` atau `sessionStorage`, kirim di setiap request via header `Authorization: Bearer <token>`.
2. **Handle 401**: Jika menerima status 401, redirect ke halaman login. Token mungkin sudah expired.
3. **Handle 403**: Tampilkan pesan "Akses ditolak" jika user mencoba mengakses fitur di luar role-nya.
4. **Pagination**: Selalu cek field `pagination` di response untuk membangun UI pagination.
5. **Soft Delete**: Gunakan endpoint `deleted` dan `restore` untuk fitur trash/recycle bin.
6. **Display Token**: Gunakan `display_token` dari endpoint `GET /api/sekolah` untuk membangun halaman display publik.
7. **Upsert Absensi**: Tidak perlu cek apakah absensi sudah ada. Cukup POST, sistem akan otomatis upsert.
8. **Tanggal**: Semua tanggal menggunakan format ISO 8601. Gunakan `Date` object atau library seperti `dayjs`/`date-fns`.
9. **Enum Values**: Pastikan dropdown/select di frontend menggunakan value enum yang tepat (lihat bagian Enum Reference).
10. **Error Display**: Selalu tampilkan `message` dari response error kepada user.
11. **CORS**: Jika menggunakan `fetch` atau `axios`, pastikan `baseURL` sudah benar. Origin frontend harus terdaftar di `ALLOWED_ORIGINS` backend (atau gunakan localhost saat development).
12. **Body Limit**: Maksimal 100KB per request. Jangan kirim payload yang terlalu besar.
13. **Field `jenis` pada Halaqah**: Tidak bisa diset saat create maupun update via API. Selalu default `TAHFIDZ`.
14. **Display Endpoint Mapper**: Perhatikan bahwa field-field di display endpoint mengalami transformasi (contoh: `name_halaqah` → `nama_halaqah`, null → fallback string seperti `"-"` atau `"Tanpa Muhafiz"`).
15. **Sesi Halaqah List**: Endpoint `GET /api/sesi-halaqah` mengembalikan semua sesi sekaligus (tanpa pagination). Cocok untuk dropdown select.
16. **User `has_halaqah`**: Field `has_halaqah` dan `id_halaqah` di response login berguna untuk menentukan apakah muhafiz sudah memiliki halaqah atau belum (untuk conditional UI).
17. **Nomor Telepon Santri**: Bisa berupa `string` kosong/null di database, tapi di response selalu berupa string (fallback `"-"` untuk display endpoint).
18. **Setoran `juz` bisa null**: Pada response display setoran, field `juz` bisa bernilai `null`.
19. **Sesi terikat Halaqah**: Sejak update Juni 2026, setiap sesi halaqah memiliki `id_halaqah`. Beberapa implikasi untuk UI:
    - Saat membuat sesi (POST `/api/sesi-halaqah`), frontend **wajib** mengirim `id_halaqah` untuk role KOORDINATOR/ADMIN. Untuk MUHAFIZ, field ini diabaikan dan otomatis terikat ke halaqah yang diasuhnya.
    - Saat input absensi (POST `/api/absensi`), pilih sesi dari daftar sesi yang **satu halaqah dengan siswa** untuk menghindari error 400 "Santri dan sesi berada di halaqah yang berbeda".
    - Untuk menampilkan "absensi milik sesi ini" gunakan `GET /api/absensi/sesi/:id_sesi?date=YYYY-MM-DD`.
    - Jangan tampilkan opsi `id_halaqah` di form update sesi (PATCH) untuk role non-SUPERADMIN — field ini diabaikan untuk menjaga integritas data historis.
