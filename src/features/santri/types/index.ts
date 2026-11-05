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
