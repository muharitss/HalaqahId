export interface SesiHalaqah {
  id_sesi: number;
  nama_sesi: string;
  jam_mulai: string;
  jam_selesai: string;
  id_sekolah: number;
  id_halaqah?: number | null;
  halaqah?: {
    name_halaqah: string;
  };
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateSesiHalaqahRequest {
  nama_sesi: string;
  jam_mulai: string;
  jam_selesai: string;
  id_sekolah?: number;
  id_halaqah?: number;
}

export interface UpdateSesiHalaqahRequest {
  nama_sesi?: string;
  jam_mulai?: string;
  jam_selesai?: string;
}
