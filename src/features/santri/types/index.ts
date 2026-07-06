export type { Santri } from '@/types/domain/santri';
export type { TargetSekolah } from '@/types/domain/target';

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
  nomor_telepon: string;
  id_target?: number | null;
  id_halaqah: number;
}

export type UpdateSantriData = Partial<CreateSantriData>;

export interface SantriStats {
  total: number;
  active: number;
  inactive: number;
}
