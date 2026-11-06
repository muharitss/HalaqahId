import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sekolahService } from "../services/sekolahService";
import { USER_SCHOOLS_QUERY_KEY } from "../queries/useUserSchoolsQuery";
import type { AssignUserSekolahPayload } from "@/types/domain/sekolah";

export function useAssignUserSchoolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: number; payload: AssignUserSekolahPayload }) =>
      sekolahService.assignUserSchool(userId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_SCHOOLS_QUERY_KEY(variables.userId) });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Pengguna berhasil ditugaskan ke sekolah");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menugaskan pengguna ke sekolah");
    },
  });
}

export function useSetPrimarySchoolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, sekolahId }: { userId: number; sekolahId: number }) =>
      sekolahService.setPrimarySchool(userId, sekolahId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_SCHOOLS_QUERY_KEY(variables.userId) });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Sekolah utama berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengubah sekolah utama");
    },
  });
}

export function useRemoveUserSchoolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, sekolahId }: { userId: number; sekolahId: number }) =>
      sekolahService.removeUserSchool(userId, sekolahId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_SCHOOLS_QUERY_KEY(variables.userId) });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Penugasan sekolah berhasil dihapus");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus penugasan sekolah");
    },
  });
}
