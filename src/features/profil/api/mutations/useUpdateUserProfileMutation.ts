import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileService } from "../services/profile.service";
import { PROFILE_QUERY_KEYS } from "../query-keys";
import { useAuthStore } from "@/store/useAuthStore";
import type { UpdateProfilePayload } from "../../types";

export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient();
  const refreshUser = useAuthStore((s) => s.refreshUser);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileService.updateProfile(payload),
    onSuccess: async (updatedData) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.current(), updatedData);
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all });

      await refreshUser();
      toast.success("Profil berhasil diperbarui!");
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Gagal memperbarui profil";
      toast.error(msg);
    },
  });
}
