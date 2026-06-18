## 1. Gambaran Umum

Halaqah.id adalah sistem manajemen tahfidz berbasis multi-tenant (per sekolah). Sistem ini mengelola:

- **User/Asatidz** (Muhafiz, Koordinator Tahfiz, Admin, Superadmin)
- **Halaqah** (kelompok tahfidz yang dibimbing seorang Muhafiz)
- **Santri** (peserta tahfidz yang terdaftar di halaqah)
- **Sesi Halaqah** (jadwal sesi pertemuan, contoh: "Bada Subuh", "Halaqah Pagi")
- **Absensi** (kehadiran santri dan muhafiz per sesi/tanggal)
- **Setoran** (catatan hafalan santri: juz, surat, ayat, kategori)
- **Sekolah** (institusi yang menaungi semua entitas di atas)

### Konsep Penting

- **Multi-tenancy**: Setiap data selalu terikat ke `id_sekolah`. User dari sekolah A tidak bisa melihat data sekolah B.
- **Soft Delete**: Semua entitas menggunakan `deleted_at` (nullable `DateTime`). Data yang dihapus masih bisa di-restore.
- **Upsert pada Absensi**: Jika santri sudah diabsen di sesi + tanggal yang sama, data akan diupdate, bukan duplikat.
- **Sesi Halaqah terikat Halaqah**: Sejak update Juni 2026, setiap sesi halaqah memiliki `id_halaqah` (FK ke Halaqah). Konsekuensinya:
  - Setiap sesi halaqah memiliki absensinya sendiri (lihat `GET /api/absensi/sesi/:id_sesi`).
  - Input absensi divalidasi agar `sesi.id_halaqah == student.id_halaqah` (mencegah cross-halaqah injection).
  - Muhafiz otomatis hanya melihat sesi/absensi di halaqahnya sendiri.
  - Sesi baru WAJIB memiliki `id_halaqah`; sesi lama (`id_halaqah = null`) tetap dapat dibaca untuk backward-compat.

---

