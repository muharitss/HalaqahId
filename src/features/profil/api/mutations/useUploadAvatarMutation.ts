import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileService } from "../services/profile.service";
import { PROFILE_QUERY_KEYS } from "../query-keys";

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      return await profileService.uploadFoto(file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all });
      toast.success("Foto profil berhasil diunggah!");
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Gagal mengunggah foto";
      toast.error(msg);
    },
  });
}
