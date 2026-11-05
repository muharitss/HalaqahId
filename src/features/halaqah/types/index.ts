import type {
  Halaqah as DomainHalaqah,
  Santri as DomainSantri,
  HalaqahMuhafiz,
  HalaqahMuhafizItem,
  PeranMuhafiz,
  AssignHalaqahMuhafizRequest,
  UpdateHalaqahMuhafizRequest,
} from '@/types';

export type {
  HalaqahMuhafiz,
  HalaqahMuhafizItem,
  PeranMuhafiz,
  AssignHalaqahMuhafizRequest,
  UpdateHalaqahMuhafizRequest,
};

export interface Halaqah extends DomainHalaqah {
  _count?: {
    santri: number;
  };
}

export type Santri = DomainSantri;

export interface HalaqahResponse {
  data: Halaqah[];
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
  isLoading: boolean;
  onAddSantri: (halaqah: Halaqah) => void;
  onEdit: (halaqah: Halaqah) => void;
  onDelete: (halaqah: Halaqah) => void;
  onMoveSantri: (santri: Santri) => void;
  onEditSantri: (santri: Santri) => void;
  onDeleteSantri: (santri: Santri) => void;
  onManageMuhafiz?: (halaqah: Halaqah) => void;
}

export interface EmptyStateProps {
  message: string;
}
