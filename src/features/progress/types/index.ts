export type StatusProgress = "BELUM" | "PROSES" | "SELESAI" | "LANCAR";

export interface SurahProgressItem {
  id_surat: number;
  nama_surat: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string | null;
  arti: string | null;
  status: StatusProgress;
  persentase: number;
  ayat_terakhir: number | null;
  halaman_terakhir: number | null;
  total_pengulangan: number;
  last_setoran: string | null;
  last_murajaah: string | null;
  updated_at: string | null;
}

export interface ProgressSummaryData {
  santri: {
    id_santri: number;
    nama_santri: string;
    halaqah: string | null;
  };
  summary: {
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
  };
}

export interface UpdateProgressPayload {
  status?: StatusProgress;
  persentase?: number;
  ayat_terakhir?: number | null;
  halaman_terakhir?: number | null;
  total_pengulangan?: number;
  last_setoran?: string | null;
  last_murajaah?: string | null;
}

export interface BackfillProgressResult {
  total_santri: number;
  total_surat_updated: number;
}
