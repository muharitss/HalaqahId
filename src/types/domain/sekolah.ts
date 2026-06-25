export type JenisLembaga = "PESANTREN" | "MADRASAH" | "SEKOLAH_UMUM" | "TPA";

export interface Sekolah {
  id_sekolah: number;
  // Identitas
  nama_sekolah: string;
  nama_singkat?: string | null;
  email?: string | null;
  no_telepon?: string | null;
  whatsapp?: string | null;
  // Visual
  logo_url?: string | null;
  // Lokasi
  alamat?: string | null;
  kelurahan?: string | null;
  kecamatan?: string | null;
  kota?: string | null;
  provinsi?: string | null;
  kode_pos?: string | null;
  negara?: string | null;
  // Kepemimpinan
  kepala_sekolah?: string | null;
  jabatan_kepala?: string | null;
  foto_kepala_url?: string | null;
  // Profil lembaga
  jenis_lembaga?: JenisLembaga | null;
  jenjang?: string | null;
  deskripsi?: string | null;
  visi?: string | null;
  misi?: string | null;
  // Display & timestamps
  display_token: string;
  slug?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface UpdateSekolahRequest {
  nama_sekolah?: string;
  nama_singkat?: string;
  email?: string;
  no_telepon?: string;
  whatsapp?: string;
  logo_url?: string;
  alamat?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  kode_pos?: string;
  negara?: string;
  kepala_sekolah?: string;
  jabatan_kepala?: string;
  foto_kepala_url?: string;
  jenis_lembaga?: JenisLembaga | "";
  jenjang?: string;
  deskripsi?: string;
  visi?: string;
  misi?: string;
  slug?: string;
}

