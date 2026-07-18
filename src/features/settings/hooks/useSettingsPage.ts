import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/components/auth-provider";
import { isKepalaRole, Role } from "@/types/domain/enums";
import { sekolahService } from "@/features/sekolah";
import { toast } from "sonner";

export function useSettingsPage() {
  const navigate = useNavigate();
  const { user, logout, isImpersonating, stopImpersonating } = useAuth();
  const isKepala = user ? isKepalaRole(user.role) : false;

  const basePath = isKepala ? "/kepala-muhafidz/settings" : "/muhafidz/settings";
  const dashboardPath = isKepala ? "/kepala-muhafidz" : "/muhafidz";

  const handleBackToSuperadmin = async () => {
    if (stopImpersonating) {
      const originalRole = user?.originalUser?.role;
      await stopImpersonating();
      
      if (originalRole === Role.SUPERADMIN) {
        navigate("/superadmin");
      } else {
        navigate("/kepala-muhafidz");
      }
    }
  };

  const handleCopyDisplayLink = async () => {
    try {
      const profile = await sekolahService.getProfile();
      const slug = profile.data?.slug;
      
      if (!slug) {
        toast.error("Slug belum diatur. Perbarui profil sekolah terlebih dahulu untuk mendapatkan link publik.");
        return;
      }

      const publicLink = `${window.location.origin}/display/${slug}`;
      await navigator.clipboard.writeText(publicLink);
      toast.success("Link portal publik berhasil disalin ke clipboard!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(`Terjadi kesalahan saat menyalin link: ${message}`);
    }
  };

  return {
    navigate,
    user,
    logout,
    isImpersonating,
    isKepala,
    basePath,
    dashboardPath,
    handleBackToSuperadmin,
    handleCopyDisplayLink,
  };
}
