import {type Santri} from '@/features/muhafidz/kelola-santri/types'

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
  santri: SantriInHalaqah[]; 
  _count: {
    santri: number;
  };
}

export interface SantriInHalaqah {
  id_santri: number;
  nama_santri: string;
  nomor_telepon: string;
  target: "INTENSE" | "RINGAN" | "SEDANG" | string;
  halaqah_id?: number;
}

export interface SantriPayload {
  nama_santri: string;
  nomor_telepon: string;
  target: "RINGAN" | "SEDANG" | "INTENSE";
  halaqah_id?: number;
}

export interface HalaqahFormData {
  name_halaqah: string;
  muhafiz_id: number;
}

export interface BuatHalaqahProps {
  onSuccess: () => void;
}

export interface EditHalaqahProps {
  halaqah: Halaqah | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface DeleteHalaqahProps {
  halaqah: Halaqah | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface DaftarHalaqahProps {
  halaqahs: Halaqah[];
  santriMap: Record<number, Santri[]>; 
  onEdit: (h: Halaqah) => void;
  onDelete: (h: Halaqah) => void;
  onMoveSantri: (s: Santri) => void; 
  onEditSantri: (s: Santri) => void;
  onDeleteSantri: (s: Santri) => void;
  isLoading?: boolean;
  onAddSantri: (h: Halaqah) => void;
}

export interface EmptyStateProps {
  message: string;
}

export interface HalaqahResponse {
  success: boolean;
  message: string;
  data: Halaqah[];
}