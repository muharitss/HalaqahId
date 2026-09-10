export interface PermissionItem {
  id_permission: number;
  code: string;
  module: string;
  deskripsi: string | null;
}

export interface RolePermissionRelation {
  id_role: number;
  id_permission: number;
  permission: PermissionItem;
}

export interface RoleItem {
  id_role: number;
  nama_role: string;
  kode_role: string;
  is_system: boolean;
  id_tenant: number;
  permissions?: RolePermissionRelation[];
  _count?: {
    user_roles: number;
  };
}

export interface CreateRolePayload {
  nama_role: string;
  kode_role: string;
  permissions?: string[];
  id_tenant?: number;
}

export interface UpdateRolePayload {
  nama_role?: string;
  kode_role?: string;
}

export interface UpdateRolePermissionsPayload {
  permissions: (string | number)[];
}

export type PermissionActionCategory = "CREATE" | "READ" | "UPDATE" | "DELETE" | "MANAGE";

export interface PermissionDefinition {
  code: string;
  module: string;
  moduleLabel: string;
  action: PermissionActionCategory;
  actionLabel: string;
  deskripsi: string;
}
