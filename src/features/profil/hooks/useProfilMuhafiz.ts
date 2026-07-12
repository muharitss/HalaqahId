import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/components/auth-provider";
import { profilService } from "../api/profilService";
import type { ProfilFormValues, GantiPasswordFormValues } from "../types";

export function useProfilMuhafiz() {
  const { user, refreshUser } = useAuth();

  // Memuat data profil terbaru dari backend saat halaman dibuka
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // ── Edit Profil State ────────────────────────────────────────────────────
  const [isEditingProfil, setIsEditingProfil] = useState(false);
  const [isSubmittingProfil, setIsSubmittingProfil] = useState(false);

  // ── Ganti Password State ─────────────────────────────────────────────────
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // ── Actions: Profil ──────────────────────────────────────────────────────

  const handleUpdateProfil = async (values: ProfilFormValues) => {
    if (!user?.id_user) return;

    setIsSubmittingProfil(true);
    try {
      await profilService.updateProfil(user.id_user, {
        name: values.name,
        nomor_telepon: values.nomor_telepon || undefined,
      });
      toast.success("Profil berhasil diperbarui!");
      await refreshUser(); // sinkronisasi ke auth context & navbar
      setIsEditingProfil(false);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(msg);
    } finally {
      setIsSubmittingProfil(false);
    }
  };

  const handleCancelEditProfil = () => {
    setIsEditingProfil(false);
  };

  // ── Actions: Password ────────────────────────────────────────────────────

  const handleGantiPassword = async (values: GantiPasswordFormValues) => {
    if (!user?.id_user) return;

    if (values.password_baru !== values.konfirmasi_password) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      await profilService.gantiPassword(user.id_user, {
        password_lama: values.password_lama,
        password_baru: values.password_baru,
      });
      toast.success("Password berhasil diganti!");
      setIsEditingPassword(false);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(msg);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleCancelEditPassword = () => {
    setIsEditingPassword(false);
  };

  return {
    user,

    // Profil
    isEditingProfil,
    isSubmittingProfil,
    setIsEditingProfil,
    handleUpdateProfil,
    handleCancelEditProfil,

    // Password
    isEditingPassword,
    isSubmittingPassword,
    setIsEditingPassword,
    handleGantiPassword,
    handleCancelEditPassword,
  };
}
