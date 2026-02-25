// Export semua type yang dibutuhkan
export interface Santri {
  id_santri: number;
  nama_santri: string;
  nomor_telepon: string;
  target: "RINGAN" | "SEDANG" | "INTENSE";
  halaqah_id: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  nama_halaqah?: string;
}

export interface CreateSantriData {
  nama_santri: string;
  nomor_telepon: string;
  target: "RINGAN" | "SEDANG" | "INTENSE";
  halaqah_id: number;
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