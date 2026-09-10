import axiosClient from "@/lib/axiosClient";
import type {
  RoleItem,
  PermissionItem,
  CreateRolePayload,
  UpdateRolePayload,
} from "../types";

export const roleApi = {
  getRoles: async (tenantId?: number): Promise<RoleItem[]> => {
    const params = tenantId ? { id_tenant: tenantId } : undefined;
    const res = await axiosClient.get("/roles", { params });
    const data = res.data?.data ?? res.data;
    return Array.isArray(data) ? data : [];
  },

  getRolePermissions: async (id_role: number): Promise<PermissionItem[]> => {
    const res = await axiosClient.get(`/roles/${id_role}/permissions`);
    const data = res.data?.data ?? res.data;
    return Array.isArray(data) ? data : [];
  },

  createRole: async (payload: CreateRolePayload): Promise<RoleItem> => {
    const res = await axiosClient.post("/roles", payload);
    return res.data?.data ?? res.data;
  },

  updateRole: async (id_role: number, payload: UpdateRolePayload): Promise<RoleItem> => {
    const res = await axiosClient.put(`/roles/${id_role}`, payload);
    return res.data?.data ?? res.data;
  },

  deleteRole: async (id_role: number): Promise<{ id_role: number; message: string }> => {
    const res = await axiosClient.delete(`/roles/${id_role}`);
    return res.data?.data ?? res.data;
  },

  updateRolePermissions: async (
    id_role: number,
    permissions: (string | number)[]
  ): Promise<PermissionItem[]> => {
    const res = await axiosClient.put(`/roles/${id_role}/permissions`, { permissions });
    const data = res.data?.data ?? res.data;
    return Array.isArray(data) ? data : [];
  },
};
