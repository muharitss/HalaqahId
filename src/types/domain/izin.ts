export const JenisIzin = {
  SAKIT: 'SAKIT',
  IZIN: 'IZIN',
  KELUARGA: 'KELUARGA',
  LAINNYA: 'LAINNYA',
} as const;
export type JenisIzin = (typeof JenisIzin)[keyof typeof JenisIzin];

export const JENIS_IZIN_LABELS: Record<JenisIzin, string> = {
  [JenisIzin.SAKIT]: 'Sakit',
  [JenisIzin.IZIN]: 'Izin Urusan',
  [JenisIzin.KELUARGA]: 'Keperluan Keluarga',
  [JenisIzin.LAINNYA]: 'Lainnya',
};

export const StatusIzin = {
  PENDING: 'PENDING',
  DISETUJUI: 'DISETUJUI',
  DITOLAK: 'DITOLAK',
} as const;
export type StatusIzin = (typeof StatusIzin)[keyof typeof StatusIzin];

export const STATUS_IZIN_LABELS: Record<StatusIzin, string> = {
  [StatusIzin.PENDING]: 'Menunggu Persetujuan',
  [StatusIzin.DISETUJUI]: 'Disetujui',
  [StatusIzin.DITOLAK]: 'Ditolak',
};

export interface IzinSantri {
  id_izin: number;
  id_santri: number;
  jenis: JenisIzin;
  alasan: string;
  status: StatusIzin;
  disetujui_oleh?: number | null;
  catatan_approval?: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  santri?: {
    id_santri: number;
    nama_santri: string;
    nomor_induk_santri: string;
    id_sekolah: number;
    id_halaqah?: number | null;
  };
  approver?: {
    id_user: number;
    name: string;
    role: string;
  } | null;
}

export interface AjukanIzinRequest {
  id_santri: number;
  jenis: JenisIzin;
  alasan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
}

export interface ApprovalIzinRequest {
  catatan_approval?: string;
}

export interface IzinFilterParams {
  status?: StatusIzin;
  santri?: number;
  tanggal?: string;
  page?: number;
  limit?: number;
}
