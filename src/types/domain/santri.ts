import { KategoriTarget } from './enums';

export interface Santri {
  id_santri: number;
  nama_santri: string;
  nomor_telepon?: string | null;
  id_sekolah: number;
  target: KategoriTarget;
  id_halaqah: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  halaqah?: {
    id_halaqah: number;
    name_halaqah: string;
  };
}

export interface CreateSantriRequest {
  nama_santri: string;
  nomor_telepon?: string;
  target?: KategoriTarget;
  id_halaqah: number;
}

export interface UpdateSantriRequest {
  nama_santri?: string;
  nomor_telepon?: string;
  target?: KategoriTarget;
  id_halaqah?: number;
}
