export interface VerifyPortalPayload {
  slug_sekolah: string;
  nis: string;
  no_telepon: string;
}

export interface PortalSessionSantri {
  id_santri: number;
  nama_santri: string;
  nomor_induk_santri: string;
}

export interface PortalSessionWali {
  id_wali: number;
  nama_wali: string;
  hubungan: string;
}

export interface PortalSessionSekolah {
  id_sekolah: number;
  nama_sekolah: string;
  slug: string;
}

export interface PortalSessionData {
  token: string;
  santri: PortalSessionSantri;
  wali: PortalSessionWali;
  sekolah: PortalSessionSekolah;
}

export interface PortalSantriProfile {
  id_santri: number;
  nama_santri: string;
  nomor_induk_santri: string;
  nomor_telepon?: string | null;
  jenis_kelamin?: string | null;
  halaqah?: {
    id_halaqah: number;
    nama_halaqah: string;
  } | null;
  sekolah?: {
    id_sekolah: number;
    nama_sekolah: string;
    slug: string;
    logo_url?: string | null;
  } | null;
  target?: {
    id_target: number;
    nama_target: string;
    tipe: string;
    nilai_target: number;
    satuan: string;
    start_juz?: number | null;
    end_juz?: number | null;
  } | null;
  wali?: Array<{
    id_wali: number;
    nama_wali: string;
    hubungan: string;
    no_telepon?: string | null;
  }>;
}

export interface PortalProgressSummary {
  total_surat_selesai: number;
  total_surat_lancar: number;
  total_surat_proses: number;
  total_surat_belum: number;
  total_juz_selesai: number;
  daftar_juz_selesai: number[];
  total_halaman_selesai: number;
  total_ayat_selesai: number;
  persentase_keseluruhan: number;
  last_setoran: string | null;
  last_murajaah: string | null;
}

export interface PortalProgressRecord {
  id_progress: number;
  id_santri: number;
  surat_ke: number;
  nama_surat: string;
  status: "BELUM" | "PROSES" | "SELESAI" | "LANCAR" | string;
  ayat_terakhir: number;
  total_pengulangan: number;
  last_setoran: string | null;
  last_murajaah: string | null;
}

export interface PortalProgressResponse {
  summary: PortalProgressSummary;
  daftar_progress: PortalProgressRecord[];
}

export interface PortalSetoranKriteriaNilai {
  id_nilai: number;
  nilai: number;
  kriteria?: {
    nama_kriteria: string;
    bobot?: number;
  };
}

export interface PortalSetoranRecord {
  id_setoran: number;
  tanggal: string;
  surat_mulai: number;
  nama_surat_mulai?: string;
  ayat_mulai: number;
  surat_selesai: number;
  nama_surat_selesai?: string;
  ayat_selesai: number;
  nilai?: string | null;
  keterangan?: string | null;
  kategori?: {
    id_kategori: number;
    nama_kategori: string;
  } | null;
  muhafiz?: {
    id_user: number;
    name: string;
  } | null;
  nilai_kriteria?: PortalSetoranKriteriaNilai[];
}

export interface PortalPagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PortalSetoranResponse {
  data: PortalSetoranRecord[];
  pagination: PortalPagination;
}

export interface PortalAbsensiRecord {
  id_absensi: number;
  tanggal: string;
  status: "HADIR" | "IZIN" | "SAKIT" | "ALFA" | string;
  keterangan?: string | null;
  sesi?: {
    id_sesi?: number;
    nama_sesi: string;
  } | null;
}

export interface PortalAbsensiSummary {
  hadir: number;
  izin: number;
  sakit: number;
  alfa: number;
  total: number;
}

export interface PortalAbsensiResponse {
  data: PortalAbsensiRecord[];
  summary: PortalAbsensiSummary;
  pagination: PortalPagination;
}

export interface PortalUjianRecord {
  id_hasil: number;
  nilai_akhir?: number | null;
  status_kelulusan?: string | null;
  catatan?: string | null;
  created_at: string;
  jadwal?: {
    id_jadwal: number;
    judul_jadwal: string;
    tanggal_ujian: string;
    status: string;
    template?: {
      nama_template: string;
      tipe_ujian: string;
    } | null;
  } | null;
  muhafiz?: {
    id_user: number;
    name: string;
  } | null;
  nilai_rubrik?: Array<{
    id_nilai: number;
    nilai: number;
    kriteria?: {
      nama_kriteria: string;
    } | null;
  }>;
}
