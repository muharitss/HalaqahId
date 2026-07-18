import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/components/auth-provider";
import { isKepalaRole } from "@/types/domain/enums";
import { halaqahService, type Halaqah } from "@/features/halaqah/api/halaqahService";
import { akunService, type Muhafiz } from "@/features/muhafiz";
import { sekolahService } from "@/features/sekolah";
import type { Sekolah } from "@/types/domain/sekolah";
import { toast } from "sonner";

export function useTrashSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperadmin = user?.role === "SUPERADMIN";
  const basePath = isSuperadmin
    ? "/superadmin/settings"
    : user && isKepalaRole(user.role)
      ? "/kepala-muhafidz/settings"
      : "/muhafidz/settings";
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  const [deletedHalaqah, setDeletedHalaqah] = useState<Halaqah[]>([]);
  const [deletedMuhafiz, setDeletedMuhafiz] = useState<Muhafiz[]>([]);
  const [deletedSchools, setDeletedSchools] = useState<Sekolah[]>([]);

  const fetchData = async () => {
    try {
      if (isSuperadmin) {
        const [resSchools, resMuhafiz] = await Promise.all([
          sekolahService.getDeletedSchools(),
          akunService.getDeletedMuhafiz()
        ]);
        setDeletedSchools(resSchools.data || []);
        setDeletedMuhafiz(resMuhafiz);
      } else {
        const [resHalaqah, resMuhafiz] = await Promise.all([
          halaqahService.getDeletedHalaqah(),
          akunService.getDeletedMuhafiz()
        ]);
        setDeletedHalaqah(resHalaqah.data || []);
        setDeletedMuhafiz(resMuhafiz);
      }
    } catch {
      toast.error("Gagal mengambil data sampah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRestoreHalaqah = async (id: number) => {
    setProcessingId(id);
    try {
      await halaqahService.restoreHalaqah(id);
      toast.success("Halaqah berhasil dipulihkan");
      await fetchData();
    } catch {
      toast.error("Gagal memulihkan halaqah");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestoreMuhafiz = async (id: number) => {
    setProcessingId(id);
    try {
      await akunService.restoreMuhafiz(id);
      toast.success("Akun berhasil dipulihkan");
      await fetchData();
    } catch {
      toast.error("Gagal memulihkan akun");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestoreSchool = async (id: number) => {
    setProcessingId(id);
    try {
      await sekolahService.restoreSekolah(id);
      toast.success("Sekolah berhasil dipulihkan");
      await fetchData();
    } catch {
      toast.error("Gagal memulihkan sekolah");
    } finally {
      setProcessingId(null);
    }
  };

  return {
    navigate,
    isSuperadmin,
    basePath,
    loading,
    processingId,
    deletedHalaqah,
    deletedMuhafiz,
    deletedSchools,
    handleRestoreHalaqah,
    handleRestoreMuhafiz,
    handleRestoreSchool,
  };
}
