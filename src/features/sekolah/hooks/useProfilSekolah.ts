import { useState, useEffect } from "react";
import { sekolahService } from "@/features/sekolah/api/sekolahService";
import { type Sekolah, type UpdateSekolahRequest } from "@/types/domain/sekolah";
import { toast } from "sonner";

export const useProfilSekolah = () => {
  const [sekolah, setSekolah] = useState<Sekolah | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await sekolahService.getProfile();
      setSekolah(res.data ?? null);
    } catch (error: any) {
      toast.error(error.message || "Gagal memuat profil sekolah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (data: UpdateSekolahRequest) => {
    try {
      setSaving(true);
      const res = await sekolahService.updateProfile(data);
      setSekolah(res.data ?? null);
      toast.success("Profil sekolah berhasil diperbarui");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil sekolah");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    sekolah,
    loading,
    saving,
    updateProfile,
    refetch: fetchProfile,
  };
};
