import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/components/auth-provider";
import {
  useUserProfile,
  useUpdateUserProfile,
  useUploadAvatar,
  useGantiPassword,
} from "./useUserProfile";
import type { ProfilFormValues, GantiPasswordFormValues, UserProfileData } from "../types";

export function useProfilMuhafiz() {
  const { user: authUser, refreshUser } = useAuth();
  const { data: profileData, isLoading: isLoadingProfile, refetch } = useUserProfile();

  const updateProfileMutation = useUpdateUserProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const gantiPasswordMutation = useGantiPassword();

  // Sinkronisasi user data saat hook dimuat
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Merge profile data with auth user fallback
  const user: UserProfileData | null = profileData
    ? {
        ...profileData,
        nama_lengkap: profileData.nama_lengkap || profileData.name || authUser?.name || "",
        name: profileData.name || profileData.nama_lengkap || authUser?.name || "",
        email: profileData.email || authUser?.email || "",
        role: profileData.role || authUser?.role || "MUHAFIZ",
        foto: profileData.foto || profileData.foto_url || profileData.avatarUrl || authUser?.avatarUrl || null,
        foto_url: profileData.foto_url || profileData.foto || profileData.avatarUrl || authUser?.avatarUrl || null,
        bio: profileData.bio ?? authUser?.bio ?? null,
        nomor_telepon: profileData.nomor_telepon ?? authUser?.nomor_telepon ?? null,
        spesialisasi: profileData.spesialisasi ?? authUser?.spesialisasi ?? null,
        no_ijazah: profileData.no_ijazah ?? authUser?.no_ijazah ?? null,
        id_sekolah: profileData.id_sekolah ?? authUser?.id_sekolah ?? null,
        id_tenant: profileData.id_tenant ?? authUser?.id_tenant ?? null,
        is_verified: profileData.is_verified ?? authUser?.is_verified ?? false,
        has_halaqah: profileData.has_halaqah ?? authUser?.has_halaqah ?? false,
        id_halaqah: profileData.id_halaqah ?? authUser?.id_halaqah ?? null,
        halaqah: profileData.halaqah ?? authUser?.halaqah ?? null,
      }
    : authUser
    ? {
        id_user: authUser.id_user,
        nama_lengkap: authUser.name || "",
        name: authUser.name || "",
        email: authUser.email || "",
        role: authUser.role,
        foto: authUser.foto || authUser.foto_url || authUser.avatarUrl || null,
        foto_url: authUser.foto_url || authUser.foto || authUser.avatarUrl || null,
        avatarUrl: authUser.avatarUrl || authUser.foto_url || authUser.foto || null,
        bio: authUser.bio || null,
        nomor_telepon: authUser.nomor_telepon || null,
        spesialisasi: authUser.spesialisasi || null,
        no_ijazah: authUser.no_ijazah || null,
        id_sekolah: authUser.id_sekolah || null,
        id_tenant: authUser.id_tenant || null,
        is_verified: authUser.is_verified,
        has_halaqah: authUser.has_halaqah,
        id_halaqah: authUser.id_halaqah,
        halaqah: authUser.halaqah,
      }
    : null;

  // ── Edit Profil State ────────────────────────────────────────────────────
  const [isEditingProfil, setIsEditingProfil] = useState(false);

  // ── Ganti Password State ─────────────────────────────────────────────────
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // ── Actions: Profil ──────────────────────────────────────────────────────
  const handleUpdateProfil = async (values: ProfilFormValues) => {
    if (!user?.id_user) return;

    try {
      await updateProfileMutation.mutateAsync({
        name: values.name,
        nama_lengkap: values.nama_lengkap || values.name,
        nomor_telepon: values.nomor_telepon || null,
        bio: values.bio || null,
        spesialisasi: values.spesialisasi || null,
        no_ijazah: values.no_ijazah || null,
      });
      setIsEditingProfil(false);
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleCancelEditProfil = () => {
    setIsEditingProfil(false);
  };

  // ── Actions: Avatar ──────────────────────────────────────────────────────
  const handleUploadAvatar = async (file: File) => {
    try {
      await uploadAvatarMutation.mutateAsync(file);
      await refetch();
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        foto: null,
        foto_url: null,
      });
      toast.success("Foto profil berhasil dihapus");
      await refetch();
    } catch {
      // Error handled by mutation toast
    }
  };

  // ── Actions: Password ────────────────────────────────────────────────────
  const handleGantiPassword = async (values: GantiPasswordFormValues) => {
    if (!user?.id_user) return;

    if (values.password_baru !== values.konfirmasi_password) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      await gantiPasswordMutation.mutateAsync(values);
      setIsEditingPassword(false);
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleCancelEditPassword = () => {
    setIsEditingPassword(false);
  };

  return {
    user,
    isLoadingProfile,

    // Profil state & actions
    isEditingProfil,
    isSubmittingProfil: updateProfileMutation.isPending,
    setIsEditingProfil,
    handleUpdateProfil,
    handleCancelEditProfil,

    // Avatar actions
    isUploadingAvatar: uploadAvatarMutation.isPending,
    handleUploadAvatar,
    handleRemoveAvatar,

    // Password state & actions
    isEditingPassword,
    isSubmittingPassword: gantiPasswordMutation.isPending,
    setIsEditingPassword,
    handleGantiPassword,
    handleCancelEditPassword,
  };
}
