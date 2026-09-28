import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileService } from "../services/profile.service";
import { PROFILE_QUERY_KEYS } from "../query-keys";
import { useUpdateUserProfileMutation } from "./useUpdateUserProfileMutation";

export function useUploadAvatarMutation() {
  const queryClient = useQueryClient();
  const updateProfileMutation = useUpdateUserProfileMutation();

  return useMutation({
    mutationFn: async (file: File) => {
      const res = await profileService.uploadFoto(file);
      const updated = await updateProfileMutation.mutateAsync({
        foto: res.secure_url || res.url,
        foto_url: res.secure_url || res.url,
      });
      return { upload: res, profile: updated };
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
