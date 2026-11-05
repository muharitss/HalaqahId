import { JenisHalaqah, PeranMuhafiz } from './enums';

export interface HalaqahMuhafizItem {
  id: number;
  id_user: number;
  name: string;
  email: string;
  peran: PeranMuhafiz;
  is_active: boolean;
  tanggal_mulai: string | Date;
  tanggal_selesai?: string | Date | null;
}

export interface HalaqahMuhafiz {
  id: number;
  id_halaqah: number;
  id_user: number;
  peran: PeranMuhafiz;
  is_active: boolean;
  tanggal_mulai: string | Date;
  tanggal_selesai?: string | Date | null;
  created_at?: string;
  user?: {
    id_user: number;
    name: string;
    email: string;
    nomor_telepon?: string | null;
  };
}

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
  muhafiz_list?: HalaqahMuhafizItem[];
  total_santri?: number;
  santri?: Array<{
    id_santri: number;
    nama_santri: string;
    nomor_telepon?: string;
    target: string;
  }>;
  sesi_halaqahs?: Array<{
    id_sesi: number;
    nama_sesi: string;
  }>;
}

export interface CreateHalaqahRequest {
  name_halaqah: string;
  id_muhafiz: number;
  id_sekolah?: number;
  id_sesis?: number[];
}

export interface UpdateHalaqahRequest {
  name_halaqah?: string;
  id_muhafiz?: number;
  id_sekolah?: number;
  id_sesis?: number[];
}

export interface AssignHalaqahMuhafizRequest {
  id_user: number;
  peran?: PeranMuhafiz;
  is_active?: boolean;
  tanggal_mulai?: string;
}

export interface UpdateHalaqahMuhafizRequest {
  peran?: PeranMuhafiz;
  is_active?: boolean;
  tanggal_selesai?: string | null;
}
