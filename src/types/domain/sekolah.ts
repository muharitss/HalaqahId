export type JenisLembaga =
  | "PESANTREN"
  | "RUMAH_TAHFIDZ"
  | "TPQ"
  | "MASJID"
  | "SEKOLAH_FORMAL"
  | "KOMUNITAS"
  | "PRIVAT"
  | "YAYASAN"
  | "LAINNYA"
  // Backward compatibility
  | "MADRASAH"
  | "SEKOLAH_UMUM"
  | "TPA";

export const JENIS_LEMBAGA_OPTIONS = [
  { value: "PESANTREN", label: "Pesantren" },
  { value: "RUMAH_TAHFIDZ", label: "Rumah Tahfidz" },
  { value: "TPQ", label: "TPQ" },
  { value: "MASJID", label: "Masjid" },
  { value: "SEKOLAH_FORMAL", label: "Sekolah Formal" },
  { value: "KOMUNITAS", label: "Komunitas" },
  { value: "PRIVAT", label: "Privat" },
  { value: "YAYASAN", label: "Yayasan" },
  { value: "LAINNYA", label: "Lainnya" },
] as const;

export const JENIS_LEMBAGA_LABEL: Record<string, string> = {
  PESANTREN: "Pesantren",
  RUMAH_TAHFIDZ: "Rumah Tahfidz",
  TPQ: "TPQ",
  MASJID: "Masjid",
  SEKOLAH_FORMAL: "Sekolah Formal",
  KOMUNITAS: "Komunitas",
  PRIVAT: "Privat",
  YAYASAN: "Yayasan",
  LAINNYA: "Lainnya",
  // Backward compatibility
  MADRASAH: "Madrasah",
  SEKOLAH_UMUM: "Sekolah Umum",
  TPA: "TPA / TPQ",
};

export interface UserSekolahItem {
  id_user_sekolah?: number;
  id_user: number;
  id_sekolah: number;
  is_primary: boolean;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
  created_at?: string;
  sekolah: {
    id_sekolah: number;
    nama_sekolah: string;
    nama_singkat?: string | null;
    logo_url?: string | null;
    slug?: string | null;
    alamat?: string | null;
    kota?: string | null;
    provinsi?: string | null;
  };
}

export interface AssignUserSekolahPayload {
  id_sekolah: number;
  is_primary?: boolean;
  tanggal_mulai?: string;
  tanggal_selesai?: string | null;
}

// ─── SOP Config Types ──────────────────────────────────────────────────────

export type SOPItemType = "bullet_list" | "numbered_list" | "text";

export interface SOPItem {
  id: string;
  subtitle?: string;
  type: SOPItemType;
  /** Untuk bullet_list / numbered_list: array string. Untuk text: satu string dalam array */
  content: string[];
}

export interface SOPSection {
  id: string;
  title: string;
  order: number;
  items: SOPItem[];
}

export interface SOPConfig {
  sections: SOPSection[];
}

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
  sop_config?: SOPConfig | null;
  form_setoran_config?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SekolahCount {
  users: number;
  halaqah: number;
  santri: number;
}

export interface SekolahWithCount extends Sekolah {
  _count: SekolahCount;
}

export interface SekolahListResponse {
  data: SekolahWithCount[];
  total: number;
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
  sop_config?: SOPConfig | null;
  form_setoran_config?: any;
}

