// Export semua type yang dibutuhkan
export interface Muhafiz {
  id_user: number;
  email: string;
  username: string;
  role: "muhafiz";
  nama?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

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