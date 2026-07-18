import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sekolahService } from "../services/sekolahService";
import { type UpdateSekolahRequest } from "@/types/domain/sekolah";
import { toast } from "sonner";

export function useUpdateProfilSekolah() {
  const queryClient = useQueryClient();
  const queryKey = ["profil-sekolah"];

  return useMutation({
    mutationFn: (data: UpdateSekolahRequest) => sekolahService.updateProfile(data),
    onSuccess: (res) => {
      toast.success("Profil sekolah berhasil diperbarui");
      queryClient.setQueryData(queryKey, res.data ?? null);
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui profil sekolah");
    }
  });
}
