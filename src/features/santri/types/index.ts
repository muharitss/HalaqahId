export type { Santri } from '@/types/domain/santri';
export { StatusSantri, STATUS_SANTRI_LABELS } from '@/types/domain/santri';
export type { TargetSekolah } from '@/types/domain/target';
export type {
  SantriWali,
  HubunganWali,
  CreateSantriWaliRequest,
  UpdateSantriWaliRequest,
} from '@/types/domain/santri-wali';
export { HubunganWali as HubunganWaliEnum, HUBUNGAN_WALI_LABELS } from '@/types/domain/santri-wali';

export interface ProgresSantri {
  id: number;
  nama: string;
  target: {
    id_target: number;
    nama_target: string;
    tipe: string;
    nilai_target: number;
    satuan: string;
  } | null;
  progres: {
    capaian: number;
    satuan: string;
    jumlah_setoran: number;
    persentase: number;
    status: "TERCAPAI" | "DALAM_PROSES" | "BELUM_MULAI" | "BEBAS";
    periode_label: string;
    dari: string;
    sampai: string;
    tanggal_setoran_terakhir?: string | null;
  };
  id_santri: number;
  nama_santri: string;
  id_halaqah: number;
  nama_halaqah: string;
}

export interface ProgresResponse {
  success: boolean;
  message: string;
  data: ProgresSantri[];
}

export interface CreateSantriData {
  nama_santri: string;
  nomor_induk_santri?: string | null;
  status?: import('@/types/domain/santri').StatusSantri;
  nomor_telepon?: string;
  id_target?: number | null;
  id_halaqah: number;
}

export type UpdateSantriData = Partial<CreateSantriData>;

export interface RiwayatHalaqahItem {
  id_riwayat: number;
  id_santri: number;
  id_halaqah_lama: number;
  id_halaqah_baru: number;
  id_user_pemindah?: number | null;
  dipindahkan_oleh?: number | null;
  tanggal_pindah: string;
  alasan?: string | null;
  created_at?: string;
  halaqah_lama?: {
    id_halaqah: number;
    name_halaqah?: string;
    nama_halaqah?: string;
  } | null;
  halaqah_baru?: {
    id_halaqah: number;
    name_halaqah?: string;
    nama_halaqah?: string;
  } | null;
  user?: {
    id_user: number;
    name: string;
    email: string;
    role: string;
  } | null;
}

export interface PindahHalaqahRequest {
  id_halaqah_baru: number;
  alasan?: string;
  tanggal_pindah?: string;
}

export type PindahHalaqahPayload = PindahHalaqahRequest;

export type StatusAkademik = "AKTIF" | "NAIK" | "TETAP" | "LULUS" | "KELUAR";

export const STATUS_AKADEMIK_LABELS: Record<StatusAkademik, string> = {
  AKTIF: "Aktif",
  NAIK: "Naik Level / Tahun",
  TETAP: "Tetap / Mengulang",
  LULUS: "Lulus",
  KELUAR: "Keluar",
};

export interface RiwayatAkademikItem {
  id_riwayat: number;
  id_santri: number;
  id_tahun_ajaran: number;
  id_halaqah?: number | null;
  id_level?: number | null;
  status: StatusAkademik;
  alasan?: string | null;
  disetujui_oleh?: number | null;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
  created_at?: string;
  updated_at?: string;
  tahun_ajaran?: {
    id_tahun_ajaran: number;
    nama: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    is_aktif?: boolean;
  } | null;
  level?: {
    id_level: number;
    nama_level: string;
    urutan?: number;
    id_program?: number;
    target_juz_min?: number;
    target_juz_max?: number;
    program?: {
      id_program: number;
      nama_program: string;
    } | null;
  } | null;
  halaqah?: {
    id_halaqah: number;
    name_halaqah?: string;
    nama_halaqah?: string;
  } | null;
  user?: {
    id_user: number;
    name: string;
    email: string;
    role: string;
  } | null;
}

export interface NaikLevelRequest {
  id_level: number;
  id_tahun_ajaran?: number;
  id_halaqah?: number;
  status?: StatusAkademik;
  alasan?: string;
  tanggal_mulai?: string;
}

export interface BatchNaikTahunSantriItem {
  id_santri: number;
  action?: "NAIK" | "TETAP" | "LULUS" | "KELUAR";
  id_level_baru?: number;
  id_halaqah_baru?: number;
  alasan?: string;
}

export interface BatchNaikTahunRequest {
  id_tahun_ajaran_baru: number;
  santri_list?: BatchNaikTahunSantriItem[];
}

export interface BatchNaikTahunResponse {
  total_processed: number;
  id_tahun_ajaran: number;
  nama_tahun_ajaran: string;
  santri: unknown[];
}

