import { useProfilSekolahQuery, useUpdateProfilSekolah } from "../api";
import { type UpdateSekolahRequest } from "@/types/domain/sekolah";

export const useProfilSekolah = () => {
  const { data: sekolah = null, isLoading: loading, refetch: fetchProfile } = useProfilSekolahQuery();
  const updateMutation = useUpdateProfilSekolah();

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
