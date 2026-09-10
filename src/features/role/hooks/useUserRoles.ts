import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { roleApi } from "../api/role.api";
import type { AssignUserRolePayload } from "../types";

export const USER_ROLE_QUERY_KEYS = {
  all: ["user-roles"] as const,
  list: (userId: number | null | undefined) => ["user-roles", userId] as const,
};

export function useUserRoles(userId?: number | null) {
  return useQuery({
    queryKey: USER_ROLE_QUERY_KEYS.list(userId),
    queryFn: () => {
      if (!userId) return [];
      return roleApi.getUserRoles(userId);
    },
    enabled: typeof userId === "number" && userId > 0,
  });
}

export function useAssignUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number;
      payload: AssignUserRolePayload;
    }) => roleApi.assignUserRole(userId, payload),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: USER_ROLE_QUERY_KEYS.list(userId) });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Role berhasil ditugaskan ke pengguna");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "Gagal menugaskan role";
      toast.error(msg);
    },
  });
}

export function useRemoveUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) =>
      roleApi.removeUserRole(userId, roleId),
    onSuccess: (data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: USER_ROLE_QUERY_KEYS.list(userId) });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success(data?.message || "Role berhasil dicabut dari pengguna");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "Gagal mencabut role";
      toast.error(msg);
    },
  });
}
