import type { PaginationMeta } from "@/types/api/pagination";

export type PrioritasPengumuman = "NORMAL" | "PENTING" | "URGENT";

export type TargetTypePengumuman =
  | "ALL"
  | "HALAQAH"
  | "LEVEL"
  | "SANTRI"
  | "ROLE"
  | "USER";

export interface PengumumanTarget {
  id_pengumuman_target?: number;
  id_pengumuman?: number;
  target_type: TargetTypePengumuman;
  target_id?: number | null;
}

export interface PengumumanCreator {
  id_user: number;
  name: string;
  email: string;
  role: string;
}

export interface PengumumanItem {
  id_pengumuman: number;
  id_tenant: number;
  id_sekolah?: number | null;
  judul: string;
  isi: string;
  prioritas: PrioritasPengumuman;
  is_pinned: boolean;
  created_by: number;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  creator?: PengumumanCreator | null;
  sekolah?: {
    id_sekolah: number;
    nama_sekolah: string;
  } | null;
  targets?: PengumumanTarget[];
  is_read?: boolean;
  read_count?: number;
}

export interface CreatePengumumanPayload {
  judul: string;
  isi: string;
  prioritas?: PrioritasPengumuman;
  is_pinned?: boolean;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
  id_sekolah?: number | null;
  targets?: Array<{
    target_type: TargetTypePengumuman;
    target_id?: number | null;
  }>;
}

export interface UpdatePengumumanPayload {
  judul?: string;
  isi?: string;
  prioritas?: PrioritasPengumuman;
  is_pinned?: boolean;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
  id_sekolah?: number | null;
  targets?: Array<{
    target_type: TargetTypePengumuman;
    target_id?: number | null;
  }>;
}

export interface PengumumanFilterQuery {
  prioritas?: PrioritasPengumuman;
  target?: TargetTypePengumuman;
  target_id?: number;
  is_pinned?: boolean;
  active_only?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PengumumanListResponseData {
  data: PengumumanItem[];
  pagination?: PaginationMeta;
}

export interface UnreadCountResponseData {
  unread_count: number;
}
