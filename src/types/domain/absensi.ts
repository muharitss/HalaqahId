import { StatusKehadiran } from './enums';

export interface AbsensiSantri {
  id_absensi: number;
  id_santri: number;
  id_sesi: number;
  tanggal: string;
  status: StatusKehadiran;
  keterangan?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  santri?: {
    id_santri: number;
    nama_santri: string;
  };
}

export interface AbsensiMuhafiz {
  id_absensi: number;
  id_user: number;
  tanggal_absensi: string;
  status: StatusKehadiran;
  keterangan?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAbsensiSantriRequest {
  id_santri: number;
  id_sesi: number;
  status: StatusKehadiran;
  keterangan?: string;
  tanggal: string;
}

export interface CreateAbsensiMuhafizRequest {
  id_user: number;
  status: StatusKehadiran;
  keterangan?: string;
  tanggal: string;
}

export interface UpdateAbsensiSantriRequest {
  status?: StatusKehadiran;
  keterangan?: string;
  tanggal?: string;
}

export interface UpdateAbsensiMuhafizRequest {
  status?: StatusKehadiran;
  keterangan?: string;
  tanggal_absensi?: string;
}

export interface RekapAbsensiSantri {
  tanggal: string;
  data: Array<{
    id_absensi: number;
    id_santri: number;
    nama_santri: string;
    status: StatusKehadiran;
    keterangan?: string | null;
  }>;
}

export interface RekapAbsensiMuhafiz {
  tanggal: string;
  data: Array<{
    id_absensi: number;
    id_user: number;
    nama_asatidz: string;
    status: StatusKehadiran;
    keterangan?: string | null;
  }>;
}

export interface RekapAbsensiSantriAll {
  tanggal: string;
  data: Array<{
    id_absensi: number;
    id_santri: number;
    nama_santri: string;
    name_halaqah: string;
    status: StatusKehadiran;
    keterangan?: string | null;
  }>;
}
