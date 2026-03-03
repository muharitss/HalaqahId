// Export semua type yang dibutuhkan
import { type Santri } from '@/features/muhafidz/kelola-santri/types';

export interface Muhafiz {
  id_user: number;
  email: string;
  username: string;
  role: "muhafiz";
  id_muhafiz?: string; 
  nama_lengkap?: string;
  nama?: string;
  no_telp?: string;
  status?: string;
  foto_profil?: string;
  halaqah?: {
    id_halaqah: number;
    name_halaqah: string;
    muhafiz_id: number;
  } | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Halaqah {
  id_halaqah: number;
  name_halaqah: string;
  muhafiz_id: number;
  deleted_at: string | null;
  user: {
    id_user: number;
    username: string;
    email: string;
  };
  santry: Santri[]; // Sesuai dengan typo di API Anda
  _count: {
    santri: number;
  };
}

// ... sisanya tetap sama seperti interface yang Anda kirimkan

export interface MuhafizFormData {
  username: string;
  email: string;
  password?: string;
}

export interface MuhafizTableProps {
  muhafizList: Muhafiz[];
  isLoading: boolean;
  onEditClick: (muhafiz: Muhafiz) => void;
  onDeleteClick: (muhafiz: Muhafiz) => void;
  onImpersonateClick: (muhafiz: Muhafiz) => void;
  onCreateClick: () => void;
  activeMuhafizIds?: Set<number>;
}

export interface EditAkunProps {
  muhafiz: Muhafiz | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface DeleteAkunProps {
  muhafiz: Muhafiz | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface BuatAkunProps {
  onSuccess: () => void;
}