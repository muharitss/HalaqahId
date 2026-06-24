export interface Sekolah {
  id_sekolah: number;
  nama_sekolah: string;
  alamat?: string | null;
  email?: string | null;
  display_token: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface UpdateSekolahRequest {
  nama_sekolah?: string;
  alamat?: string;
}
