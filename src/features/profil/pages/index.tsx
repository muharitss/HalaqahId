import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isKepalaRole } from "@/types/domain/enums";

import { useProfilMuhafiz } from "../hooks/useProfilMuhafiz";
import { AvatarCard } from "../components/AvatarCard";
import { EditProfilForm } from "../components/EditProfilForm";
import { InfoHalaqahCard } from "../components/InfoHalaqahCard";
import { GantiPasswordForm } from "../components/GantiPasswordForm";

export default function ProfilMuhafizPage() {
  const navigate = useNavigate();
  const {
    user,
    isEditingProfil,
    isSubmittingProfil,
    setIsEditingProfil,
    handleUpdateProfil,
    handleCancelEditProfil,
    isEditingPassword,
    isSubmittingPassword,
    setIsEditingPassword,
    handleGantiPassword,
    handleCancelEditPassword,
  } = useProfilMuhafiz();

  if (!user) return null;

  const basePath = isKepalaRole(user.role)
    ? "/kepala-muhafidz/settings"
    : "/muhafidz/settings";

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(basePath)}
          className="rounded-full h-10 w-10 shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-0.5">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Profil Saya</h1>
          <p className="text-xs text-muted-foreground">
            Kelola informasi pribadi akun Anda.
          </p>
        </div>
      </div>

      {/* 1. Avatar Card */}
      <AvatarCard user={user} />

      {/* 2. Edit Info Pribadi */}
      <EditProfilForm
        user={user}
        isEditing={isEditingProfil}
        isSubmitting={isSubmittingProfil}
        onEdit={() => setIsEditingProfil(true)}
        onCancel={handleCancelEditProfil}
        onSave={handleUpdateProfil}
      />

      {/* 3. Info Halaqah (Read-Only) */}
      <InfoHalaqahCard user={user} />

      {/* 4. Ganti Password (Collapsible) */}
      <GantiPasswordForm
        isExpanded={isEditingPassword}
        isSubmitting={isSubmittingPassword}
        onToggle={() => setIsEditingPassword((v) => !v)}
        onCancel={handleCancelEditPassword}
        onSave={handleGantiPassword}
      />

      {/* Footer */}
      <div className="text-center pt-4 border-t border-dashed">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          HalaqahId Information System
        </p>
      </div>
    </div>
  );
}
