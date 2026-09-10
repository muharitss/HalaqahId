import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { roleApi } from "../api/role.api";
import type { CreateRolePayload, UpdateRolePayload } from "../types";

export const ROLE_QUERY_KEYS = {
  all: ["roles"] as const,
  list: (tenantId?: number) => ["roles", tenantId] as const,
  permissions: (id_role: number | null) => ["role-permissions", id_role] as const,
};

export function useRoles(tenantId?: number) {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.list(tenantId),
    queryFn: () => roleApi.getRoles(tenantId),
  });
}

export function useRolePermissions(id_role: number | null) {
  return useQuery({
    queryKey: ROLE_QUERY_KEYS.permissions(id_role),
    queryFn: () => {
      if (!id_role) return [];
      return roleApi.getRolePermissions(id_role);
    },
    enabled: typeof id_role === "number" && id_role > 0,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) => roleApi.createRole(payload),
    onSuccess: (newRole) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.all });
      toast.success(`Role "${newRole.nama_role}" berhasil dibuat`);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "Gagal membuat role";
      toast.error(msg);
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id_role, payload }: { id_role: number; payload: UpdateRolePayload }) =>
      roleApi.updateRole(id_role, payload),
    onSuccess: (updatedRole) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.all });
      toast.success(`Role "${updatedRole.nama_role}" berhasil diperbarui`);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "Gagal memperbarui role";
      toast.error(msg);
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id_role: number) => roleApi.deleteRole(id_role),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.all });
      toast.success(res.message || "Role berhasil dihapus");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "Gagal menghapus role";
      toast.error(msg);
    },
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_role,
      permissions,
    }: {
      id_role: number;
      permissions: (string | number)[];
    }) => roleApi.updateRolePermissions(id_role, permissions),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ROLE_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: ROLE_QUERY_KEYS.permissions(variables.id_role),
      });
      toast.success("Hak akses role berhasil diperbarui");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "Gagal memperbarui hak akses role";
      toast.error(msg);
    },
  });
}
