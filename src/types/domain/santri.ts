import type { TargetSekolah } from './target';
import { StatusSantri, STATUS_SANTRI_LABELS } from './enums';

export { StatusSantri, STATUS_SANTRI_LABELS };

export interface Santri {
  id_santri: number;
  nama_santri: string;
  nomor_induk_santri?: string | null;
  status?: StatusSantri;
  nomor_telepon?: string | null;
  id_sekolah: number;
  id_target: number | null;
  target?: TargetSekolah | null;
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
  nomor_induk_santri?: string | null;
  status?: StatusSantri;
  nomor_telepon?: string;
  id_target?: number | null;
  id_halaqah: number;
}

export interface UpdateSantriRequest {
  nama_santri?: string;
  nomor_induk_santri?: string | null;
  status?: StatusSantri;
  nomor_telepon?: string;
  id_target?: number | null;
  id_halaqah?: number;
}
