export type { Santri } from '@/types/domain/santri';

export interface ProgresSantri {
  id: number;
  nama: string;
  target: string;
  capaian: number;
  status: string;
  terakhirSetor: string;
  totalAyat: number;
}

export interface ProgresResponse {
  success: boolean;
  message: string;
  data: ProgresSantri[];
}

export interface CreateSantriData {
  nama_santri: string;
  nomor_telepon: string;
  target: "RINGAN" | "SEDANG" | "INTENSE";
  id_halaqah: number;
}

export type UpdateSantriData = Partial<CreateSantriData>;

export interface SantriStats {
  total: number;
  active: number;
  inactive: number;
  ringan: number;
  sedang: number;
  intense: number;
}
