import type { Role } from "@/types/domain/enums";

export interface UserProfileData {
  id_user: number;
  nama_lengkap: string;
  name?: string;
  email: string;
  role: Role;
  foto?: string | null;
  foto_url?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  no_telepon?: string | null;
  nomor_telepon?: string | null;
  spesialisasi?: string | null;
  no_ijazah?: string | null;
  id_sekolah?: number | null;
  id_tenant?: number | null;
  is_verified?: boolean;
  has_halaqah?: boolean;
  id_halaqah?: number | null;
  halaqah?: {
    id_halaqah: number;
    name_halaqah: string;
    id_muhafiz?: number;
  } | null;
}

export interface UpdateProfilePayload {
  nama_lengkap?: string;
  name?: string;
  no_telepon?: string | null;
  nomor_telepon?: string | null;
  bio?: string | null;
  spesialisasi?: string | null;
  no_ijazah?: string | null;
  foto?: string | null;
  foto_url?: string | null;
}

export interface ProfilFormValues {
  name: string;
  nama_lengkap?: string;
  nomor_telepon: string;
  no_telepon?: string;
  bio?: string;
  spesialisasi?: string;
  no_ijazah?: string;
  foto?: string | null;
}

export interface GantiPasswordFormValues {
  password_lama: string;
  password_baru: string;
  konfirmasi_password: string;
}

export interface AvatarUploadResponse {
  url: string;
  secure_url?: string;
  public_id?: string;
}
