import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sekolahService } from "@/features/sekolah/api/sekolahService";
import { type UpdateSekolahRequest } from "@/types/domain/sekolah";
import { toast } from "sonner";

export const useProfilSekolah = () => {
  const queryClient = useQueryClient();
  const queryKey = ["profil-sekolah"];

  const { data: sekolah = null, isFetching: loading, refetch: fetchProfile } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const res = await sekolahService.getProfile();
        return res.data ?? null;
      } catch (error: any) {
        toast.error(error.message || "Gagal memuat profil sekolah");
        throw error;
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSekolahRequest) => sekolahService.updateProfile(data),
    onSuccess: (res) => {
      toast.success("Profil sekolah berhasil diperbarui");
      queryClient.setQueryData(queryKey, res.data ?? null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal memperbarui profil sekolah");
    }
  });

  const updateProfile = async (data: UpdateSekolahRequest) => {
    try {
      await updateMutation.mutateAsync(data);
      return true;
    } catch {
      return false;
    }
  };

  return {
    sekolah,
    loading,
    saving: updateMutation.isPending,
    updateProfile,
    refetch: fetchProfile,
  };
};
