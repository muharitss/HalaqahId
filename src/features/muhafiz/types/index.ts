import type { User as DomainUser } from '@/types';
import type { StatusKehadiran } from '@/types/domain/enums';

export interface Muhafiz extends DomainUser {
  halaqah?: {
    id_halaqah: number;
    name_halaqah: string;
  } | null;
}

export type AbsensiStatus = StatusKehadiran;

export interface MuhafizTableProps {
  muhafizList: Muhafiz[];
  isLoading: boolean;
  onEditClick: (muhafiz: Muhafiz) => void;
  onDeleteClick: (muhafiz: Muhafiz) => void;
  onImpersonateClick: (muhafiz: Muhafiz) => void;
  onCreateClick: () => void;
}

export interface BuatAkunProps {
  onSuccess: () => void;
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
