import { JenisHalaqah } from './enums';

export interface Halaqah {
  id_halaqah: number;
  name_halaqah: string;
  id_muhafiz: number;
  id_sekolah: number;
  jenis: JenisHalaqah;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  user?: {
    id_user: number;
    name: string;
    email: string;
  };
  muhafiz?: {
    id_user: number;
    name: string;
    email: string;
  };
  total_santri?: number;
  santri?: Array<{
    id_santri: number;
    nama_santri: string;
    nomor_telepon?: string;
    target: string;
  }>;
}

export interface CreateHalaqahRequest {
  name_halaqah: string;
  id_muhafiz: number;
  id_sekolah?: number;
}

export interface UpdateHalaqahRequest {
  name_halaqah?: string;
  id_muhafiz?: number;
  id_sekolah?: number;
}
