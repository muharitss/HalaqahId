import type { PermissionDefinition, PermissionActionCategory } from "../types";

export const ACTION_COLUMNS: { key: PermissionActionCategory; label: string; badgeVariant: "default" | "secondary" | "outline" | "destructive" }[] = [
  { key: "CREATE", label: "Buat / Tambah", badgeVariant: "default" },
  { key: "READ", label: "Lihat / Baca", badgeVariant: "secondary" },
  { key: "UPDATE", label: "Ubah / Edit", badgeVariant: "outline" },
  { key: "DELETE", label: "Hapus", badgeVariant: "destructive" },
  { key: "MANAGE", label: "Kelola / Khusus", badgeVariant: "default" },
];

export const SYSTEM_PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  // SANTRI
  {
    code: "santri:create-own",
    module: "SANTRI",
    moduleLabel: "Santri",
    action: "CREATE",
    actionLabel: "Tambah di Halaqah",
    deskripsi: "Menambahkan santri ke halaqah sendiri",
  },
  {
    code: "santri:create-all",
    module: "SANTRI",
    moduleLabel: "Santri",
    action: "CREATE",
    actionLabel: "Tambah Semua Santri",
    deskripsi: "Menambahkan santri ke semua halaqah di lembaga",
  },
  {
    code: "santri:view-own",
    module: "SANTRI",
    moduleLabel: "Santri",
    action: "READ",
    actionLabel: "Lihat di Halaqah",
    deskripsi: "Melihat daftar santri di halaqah sendiri",
  },
  {
    code: "santri:view-all",
    module: "SANTRI",
    moduleLabel: "Santri",
    action: "READ",
    actionLabel: "Lihat Semua Santri",
    deskripsi: "Melihat seluruh daftar santri",
  },
  {
    code: "santri:edit-own",
    module: "SANTRI",
    moduleLabel: "Santri",
    action: "UPDATE",
    actionLabel: "Edit di Halaqah",
    deskripsi: "Mengedit data santri di halaqah sendiri",
  },
  {
    code: "santri:edit-all",
    module: "SANTRI",
    moduleLabel: "Santri",
    action: "UPDATE",
    actionLabel: "Edit Semua Santri",
    deskripsi: "Mengedit seluruh data santri lembaga",
  },
  {
    code: "santri:delete-own",
    module: "SANTRI",
    moduleLabel: "Santri",
    action: "DELETE",
    actionLabel: "Hapus di Halaqah",
    deskripsi: "Menghapus santri di halaqah sendiri",
  },
  {
    code: "santri:delete-all",
    module: "SANTRI",
    moduleLabel: "Santri",
    action: "DELETE",
    actionLabel: "Hapus Semua Santri",
    deskripsi: "Menghapus data semua santri",
  },

  // HALAQAH
  {
    code: "halaqah:create",
    module: "HALAQAH",
    moduleLabel: "Halaqah",
    action: "CREATE",
    actionLabel: "Buat Halaqah",
    deskripsi: "Membuat kelompok halaqah baru",
  },
  {
    code: "halaqah:view-own",
    module: "HALAQAH",
    moduleLabel: "Halaqah",
    action: "READ",
    actionLabel: "Lihat Halaqah Sendiri",
    deskripsi: "Melihat halaqah yang diampu",
  },
  {
    code: "halaqah:view-all",
    module: "HALAQAH",
    moduleLabel: "Halaqah",
    action: "READ",
    actionLabel: "Lihat Semua Halaqah",
    deskripsi: "Melihat semua kelompok halaqah di sekolah",
  },
  {
    code: "halaqah:edit-all",
    module: "HALAQAH",
    moduleLabel: "Halaqah",
    action: "UPDATE",
    actionLabel: "Edit Halaqah",
    deskripsi: "Mengubah detail & muhafiz halaqah",
  },
  {
    code: "halaqah:delete-all",
    module: "HALAQAH",
    moduleLabel: "Halaqah",
    action: "DELETE",
    actionLabel: "Hapus Halaqah",
    deskripsi: "Menghapus atau me-restore kelompok halaqah",
  },

  // ABSENSI
  {
    code: "absensi:santri:create-own",
    module: "ABSENSI",
    moduleLabel: "Absensi",
    action: "CREATE",
    actionLabel: "Input Absen Halaqah",
    deskripsi: "Mengabsen santri di halaqah sendiri",
  },
  {
    code: "absensi:santri:create-all",
    module: "ABSENSI",
    moduleLabel: "Absensi",
    action: "CREATE",
    actionLabel: "Input Absen Semua",
    deskripsi: "Mengabsen semua kelompok halaqah",
  },
  {
    code: "absensi:santri:view-own",
    module: "ABSENSI",
    moduleLabel: "Absensi",
    action: "READ",
    actionLabel: "Rekap Halaqah",
    deskripsi: "Melihat rekap absensi halaqah sendiri",
  },
  {
    code: "absensi:santri:view-all",
    module: "ABSENSI",
    moduleLabel: "Absensi",
    action: "READ",
    actionLabel: "Rekap Semua Halaqah",
    deskripsi: "Melihat seluruh rekapitulasi absensi sekolah",
  },
  {
    code: "absensi:santri:edit-own",
    module: "ABSENSI",
    moduleLabel: "Absensi",
    action: "UPDATE",
    actionLabel: "Ubah Absen Halaqah",
    deskripsi: "Mengubah data absensi halaqah sendiri",
  },
  {
    code: "absensi:santri:edit-all",
    module: "ABSENSI",
    moduleLabel: "Absensi",
    action: "UPDATE",
    actionLabel: "Ubah Semua Absen",
    deskripsi: "Mengubah data absensi semua santri",
  },
  {
    code: "absensi:muhafiz:manage",
    module: "ABSENSI",
    moduleLabel: "Absensi",
    action: "MANAGE",
    actionLabel: "Kelola Absensi Muhafiz",
    deskripsi: "Menginput dan merekap absensi asatidz/pengajar",
  },

  // SETORAN
  {
    code: "setoran:create-own",
    module: "SETORAN",
    moduleLabel: "Setoran Hafalan",
    action: "CREATE",
    actionLabel: "Input Setoran Halaqah",
    deskripsi: "Menginput setoran santri di halaqah sendiri",
  },
  {
    code: "setoran:create-all",
    module: "SETORAN",
    moduleLabel: "Setoran Hafalan",
    action: "CREATE",
    actionLabel: "Input Semua Setoran",
    deskripsi: "Menginput setoran semua santri di sekolah",
  },
  {
    code: "setoran:view-own",
    module: "SETORAN",
    moduleLabel: "Setoran Hafalan",
    action: "READ",
    actionLabel: "Riwayat Halaqah",
    deskripsi: "Melihat riwayat setoran halaqah sendiri",
  },
  {
    code: "setoran:view-all",
    module: "SETORAN",
    moduleLabel: "Setoran Hafalan",
    action: "READ",
    actionLabel: "Riwayat Semua",
    deskripsi: "Melihat seluruh riwayat setoran hafalan",
  },

  // SESI HALAQAH
  {
    code: "sesi-halaqah:create",
    module: "SESI_HALAQAH",
    moduleLabel: "Sesi Halaqah",
    action: "CREATE",
    actionLabel: "Buat Sesi",
    deskripsi: "Membuat jadwal sesi halaqah baru",
  },
  {
    code: "sesi-halaqah:view",
    module: "SESI_HALAQAH",
    moduleLabel: "Sesi Halaqah",
    action: "READ",
    actionLabel: "Lihat Sesi",
    deskripsi: "Melihat daftar waktu sesi halaqah",
  },
  {
    code: "sesi-halaqah:edit",
    module: "SESI_HALAQAH",
    moduleLabel: "Sesi Halaqah",
    action: "UPDATE",
    actionLabel: "Edit Sesi",
    deskripsi: "Mengubah waktu dan detail sesi halaqah",
  },
  {
    code: "sesi-halaqah:delete",
    module: "SESI_HALAQAH",
    moduleLabel: "Sesi Halaqah",
    action: "DELETE",
    actionLabel: "Hapus Sesi",
    deskripsi: "Menghapus sesi halaqah",
  },

  // RAPOR
  {
    code: "rapor:create",
    module: "RAPOR",
    moduleLabel: "Rapor & Penilaian",
    action: "CREATE",
    actionLabel: "Buat Rapor",
    deskripsi: "Generate atau membuat draf rapor santri",
  },
  {
    code: "rapor:view-own",
    module: "RAPOR",
    moduleLabel: "Rapor & Penilaian",
    action: "READ",
    actionLabel: "Lihat Rapor Halaqah",
    deskripsi: "Melihat rapor santri di halaqah sendiri",
  },
  {
    code: "rapor:view-all",
    module: "RAPOR",
    moduleLabel: "Rapor & Penilaian",
    action: "READ",
    actionLabel: "Lihat Semua Rapor",
    deskripsi: "Melihat rapor seluruh santri di sekolah",
  },
  {
    code: "rapor:publish",
    module: "RAPOR",
    moduleLabel: "Rapor & Penilaian",
    action: "MANAGE",
    actionLabel: "Publish Rapor",
    deskripsi: "Mempublikasikan rapor agar terlihat wali santri",
  },

  // IJAZAH
  {
    code: "ijazah:create",
    module: "IJAZAH",
    moduleLabel: "Ijazah Hafalan",
    action: "CREATE",
    actionLabel: "Terbitkan Ijazah",
    deskripsi: "Menerbitkan lembar sertifikat/ijazah hafalan",
  },
  {
    code: "ijazah:view-own",
    module: "IJAZAH",
    moduleLabel: "Ijazah Hafalan",
    action: "READ",
    actionLabel: "Lihat Ijazah Halaqah",
    deskripsi: "Melihat ijazah santri di halaqah sendiri",
  },
  {
    code: "ijazah:view-all",
    module: "IJAZAH",
    moduleLabel: "Ijazah Hafalan",
    action: "READ",
    actionLabel: "Lihat Semua Ijazah",
    deskripsi: "Melihat semua ijazah hafalan sekolah",
  },
  {
    code: "ijazah:delete",
    module: "IJAZAH",
    moduleLabel: "Ijazah Hafalan",
    action: "DELETE",
    actionLabel: "Batalkan Ijazah",
    deskripsi: "Menghapus atau membatalkan status ijazah",
  },

  // SANAD
  {
    code: "sanad:create",
    module: "SANAD",
    moduleLabel: "Silsilah Sanad",
    action: "CREATE",
    actionLabel: "Input Silsilah",
    deskripsi: "Menginput riwayat silsilah sanad quran",
  },
  {
    code: "sanad:view-own",
    module: "SANAD",
    moduleLabel: "Silsilah Sanad",
    action: "READ",
    actionLabel: "Lihat Sanad Halaqah",
    deskripsi: "Melihat sanad santri di halaqah sendiri",
  },
  {
    code: "sanad:view-all",
    module: "SANAD",
    moduleLabel: "Silsilah Sanad",
    action: "READ",
    actionLabel: "Lihat Semua Sanad",
    deskripsi: "Melihat seluruh data sanad di sekolah",
  },
  {
    code: "sanad:edit",
    module: "SANAD",
    moduleLabel: "Silsilah Sanad",
    action: "UPDATE",
    actionLabel: "Edit Sanad",
    deskripsi: "Mengubah bagan atau data sanad",
  },
  {
    code: "sanad:delete",
    module: "SANAD",
    moduleLabel: "Silsilah Sanad",
    action: "DELETE",
    actionLabel: "Hapus Sanad",
    deskripsi: "Menghapus data silsilah sanad",
  },

  // AKADEMIK
  {
    code: "tahun-ajaran:create",
    module: "AKADEMIK",
    moduleLabel: "Akademik & Periode",
    action: "CREATE",
    actionLabel: "Tambah Tahun Ajaran",
    deskripsi: "Membuat periode tahun ajaran baru",
  },
  {
    code: "akademik:view",
    module: "AKADEMIK",
    moduleLabel: "Akademik & Periode",
    action: "READ",
    actionLabel: "Lihat Data Akademik",
    deskripsi: "Melihat tahun ajaran, semester, kalender",
  },
  {
    code: "tahun-ajaran:edit",
    module: "AKADEMIK",
    moduleLabel: "Akademik & Periode",
    action: "UPDATE",
    actionLabel: "Edit Tahun Ajaran",
    deskripsi: "Mengubah data dan tanggal tahun ajaran",
  },
  {
    code: "tahun-ajaran:delete",
    module: "AKADEMIK",
    moduleLabel: "Akademik & Periode",
    action: "DELETE",
    actionLabel: "Hapus Tahun Ajaran",
    deskripsi: "Menghapus periode tahun ajaran",
  },
  {
    code: "akademik:manage",
    module: "AKADEMIK",
    moduleLabel: "Akademik & Periode",
    action: "MANAGE",
    actionLabel: "Kelola Penuh Akademik",
    deskripsi: "Mengelola kurikulum, semester, dan konfigurasi",
  },

  // TARGET & RUBRIK
  {
    code: "target:view",
    module: "TARGET",
    moduleLabel: "Target Hafalan",
    action: "READ",
    actionLabel: "Lihat Target",
    deskripsi: "Melihat data target hafalan sekolah",
  },
  {
    code: "target:manage",
    module: "TARGET",
    moduleLabel: "Target Hafalan",
    action: "MANAGE",
    actionLabel: "Kelola Target",
    deskripsi: "Mengatur parameter dan target hafalan per jenjang",
  },
  {
    code: "rubrik:view",
    module: "RUBRIK",
    moduleLabel: "Rubrik Penilaian",
    action: "READ",
    actionLabel: "Lihat Rubrik",
    deskripsi: "Melihat format rubrik penilaian",
  },
  {
    code: "rubrik:manage",
    module: "RUBRIK",
    moduleLabel: "Rubrik Penilaian",
    action: "MANAGE",
    actionLabel: "Kelola Rubrik",
    deskripsi: "Membuat dan mengubah parameter rubrik ujian",
  },

  // PENGUMUMAN
  {
    code: "pengumuman:create",
    module: "PENGUMUMAN",
    moduleLabel: "Pengumuman",
    action: "CREATE",
    actionLabel: "Buat Pengumuman",
    deskripsi: "Membuat pengumuman baru untuk santri / asatidz",
  },
  {
    code: "pengumuman:view",
    module: "PENGUMUMAN",
    moduleLabel: "Pengumuman",
    action: "READ",
    actionLabel: "Lihat Pengumuman",
    deskripsi: "Melihat daftar siaran pengumuman",
  },
  {
    code: "pengumuman:manage",
    module: "PENGUMUMAN",
    moduleLabel: "Pengumuman",
    action: "MANAGE",
    actionLabel: "Kelola Pengumuman",
    deskripsi: "Mengatur publikasi, arsip, dan jadwal pengumuman",
  },

  // IZIN SANTRI
  {
    code: "izin:apply",
    module: "IZIN",
    moduleLabel: "Perizinan Santri",
    action: "CREATE",
    actionLabel: "Ajukan Izin",
    deskripsi: "Mengajukan izin sakit atau pulang bagi santri",
  },
  {
    code: "izin:view",
    module: "IZIN",
    moduleLabel: "Perizinan Santri",
    action: "READ",
    actionLabel: "Lihat Izin",
    deskripsi: "Melihat daftar permohonan izin santri",
  },
  {
    code: "izin:approve",
    module: "IZIN",
    moduleLabel: "Perizinan Santri",
    action: "MANAGE",
    actionLabel: "Verifikasi / Persetujuan",
    deskripsi: "Menyetujui atau menolak permohonan izin santri",
  },

  // USER & AUDIT LOG
  {
    code: "muhafiz:manage",
    module: "MUHAFIZ",
    moduleLabel: "Pengguna & Asatidz",
    action: "MANAGE",
    actionLabel: "Kelola Akun Asatidz",
    deskripsi: "Mengatur kredensial dan hak akses muhafiz",
  },
  {
    code: "audit_log:read",
    module: "AUDIT_LOG",
    moduleLabel: "Audit Log",
    action: "READ",
    actionLabel: "Lihat Rekam Jejak",
    deskripsi: "Melihat rekam audit keamanan dan aktivitas sistem",
  },
];

export interface ModuleGroup {
  module: string;
  moduleLabel: string;
  permissions: PermissionDefinition[];
}

export function getGroupedPermissions(): ModuleGroup[] {
  const map = new Map<string, ModuleGroup>();

  for (const item of SYSTEM_PERMISSION_DEFINITIONS) {
    if (!map.has(item.module)) {
      map.set(item.module, {
        module: item.module,
        moduleLabel: item.moduleLabel,
        permissions: [],
      });
    }
    map.get(item.module)!.permissions.push(item);
  }

  return Array.from(map.values());
}
