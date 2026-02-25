// Export semua type yang dibutuhkan
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
  _count: {
    santri: number;
  };
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
  santriMap: Record<number, any[]>;
  onEdit: (h: Halaqah) => void;
  onDelete: (h: Halaqah) => void;
  onMoveSantri: (s: any) => void;
  onEditSantri: (s: any) => void;
  onDeleteSantri: (s: any) => void;
  isLoading?: boolean;
  onAddSantri: (h: Halaqah) => void;
}

export interface EmptyStateProps {
  message: string;
}