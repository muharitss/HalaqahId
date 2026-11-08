import { useNavigate } from "react-router-dom";
import { ChevronLeft, UserCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isKepalaRole } from "@/types/domain/enums";
import { useProfilMuhafiz } from "../hooks/useProfilMuhafiz";
import { AvatarCard } from "../components/AvatarCard";
import { AvatarUpload } from "../components/AvatarUpload";
import { EditProfilForm } from "../components/EditProfilForm";
import { InfoHalaqahCard } from "../components/InfoHalaqahCard";
import { GantiPasswordForm } from "../components/GantiPasswordForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

export function UserProfilePage() {
  const navigate = useNavigate();
  const {
    user,
    isLoadingProfile,
    isEditingProfil,
    isSubmittingProfil,
    setIsEditingProfil,
    handleUpdateProfil,
    handleCancelEditProfil,
    handleUploadAvatar,
    handleRemoveAvatar,
    isEditingPassword,
    isSubmittingPassword,
    setIsEditingPassword,
    handleGantiPassword,
    handleCancelEditPassword,
  } = useProfilMuhafiz();

  if (isLoadingProfile && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-3">
        <Spinner className="w-8 h-8 text-primary" />
        <p className="text-sm text-muted-foreground">Memuat data profil...</p>
      </div>
    );
  }

  if (!user) return null;

  const basePath =
    user.role === "SUPERADMIN"
      ? "/superadmin/settings"
      : isKepalaRole(user.role)
      ? "/kepala-muhafidz/settings"
      : "/muhafidz/settings";

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(basePath)}
          className="rounded-full h-10 w-10 shrink-0 shadow-sm"
          title="Kembali ke Pengaturan"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Profil Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Kelola foto profil, data pribadi, dan keamanan akun Anda.
          </p>
        </div>
      </div>

      {/* 1. Avatar Card with Integrated AvatarUpload */}
      <AvatarCard
        user={user}
        avatarSlot={
          <AvatarUpload
            name={user.nama_lengkap || user.name || "User"}
            currentPhotoUrl={user.foto || user.foto_url || user.avatarUrl}
            onUpload={handleUploadAvatar}
            onRemove={handleRemoveAvatar}
          />
        }
      />

      {/* 2. Tabs Navigation for Profile and Security */}
      <Tabs defaultValue="profil" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 h-11 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger
            value="profil"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold rounded-lg"
          >
            <UserCircle2 className="h-4 w-4" />
            Informasi Pribadi
          </TabsTrigger>
          <TabsTrigger
            value="keamanan"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold rounded-lg"
          >
            <KeyRound className="h-4 w-4" />
            Keamanan & Password
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Profil */}
        <TabsContent value="profil" className="space-y-6 focus-visible:outline-none">
          {/* Edit Profil Form */}
          <EditProfilForm
            user={user}
            isEditing={isEditingProfil}
            isSubmitting={isSubmittingProfil}
            onEdit={() => setIsEditingProfil(true)}
            onCancel={handleCancelEditProfil}
            onSave={handleUpdateProfil}
          />

          {/* Info Halaqah Card (Read-Only) */}
          <InfoHalaqahCard user={user} />
        </TabsContent>

        {/* TAB 2: Keamanan */}
        <TabsContent value="keamanan" className="space-y-6 focus-visible:outline-none">
          <GantiPasswordForm
            isExpanded={isEditingPassword}
            isSubmitting={isSubmittingPassword}
            onToggle={() => setIsEditingPassword((v) => !v)}
            onCancel={handleCancelEditPassword}
            onSave={handleGantiPassword}
          />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center pt-6 border-t border-dashed">
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
          HalaqahId System &bull; Manajemen Profil
        </p>
      </div>
    </div>
  );
}

export default UserProfilePage;
