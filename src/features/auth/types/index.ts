export interface AuditLog {
  id_log: number;
  action: string;
  actor_id: number | null;
  actor_name: string;
  actor_email: string;
  actor_role: string;
  ip_address: string | null;
  user_agent: string | null;
  details: string | null;
  id_sekolah: number | null;
  created_at: string;
}

export interface GlobalUser {
  id_user: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  id_sekolah: number | null;
  nomor_telepon?: string | null;
  sekolah: {
    nama_sekolah: string;
  } | null;
}

export interface AllUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  id_sekolah?: number;
}

export interface AuditLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  id_sekolah?: number;
}
