// Export semua type yang dibutuhkan
export type AbsensiStatus = "HADIR" | "IZIN" | "SAKIT" | "ALFA" | "TERLAMBAT";

export interface AbsensiPayload {
  santri_id: number;
  status: AbsensiStatus;
  keterangan?: string;
  tanggal?: string;
}

export interface AbsensiRecord {
  id_absensi: number;
  santri_id: number;
  status: AbsensiStatus;
  keterangan: string | null;
  tanggal: string;
  created_at: string;
  updated_at: string;
}