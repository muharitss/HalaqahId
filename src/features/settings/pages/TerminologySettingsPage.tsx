import { ChevronRight, ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  TerminologySettingsCard,
  useTerminologySettings,
} from "../modules/terminology";
import { useAuth } from "@/features/auth/components/auth-provider";
import { isKepalaRole, Role } from "@/types/domain/enums";

export default function TerminologySettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isSuperAdmin = user?.role === Role.SUPERADMIN;
  const backPath = isSuperAdmin
    ? "/superadmin/settings"
    : user && isKepalaRole(user.role)
      ? "/kepala-muhafidz/settings"
      : "/muhafidz/settings";

  const {
    entityConfigs,
    customLabels,
    savingKey,
    isSavingAll,
    handleLabelChange,
    handleSaveItem,
    handleResetItem,
    handleSaveAll,
  } = useTerminologySettings();

  // Reset all fields to default labels
  const handleResetDefaults = () => {
    entityConfigs.forEach((item) => {
      handleLabelChange(item.code, item.defaultLabel);
    });
  };

  return (
    <div className="w-full space-y-6 text-left pb-12">
      {/* ── TOP CONTEXT NAVIGATION & HEADER BAR ── */}
      <div className="flex flex-col gap-3">
        {/* Breadcrumb & Status Info */}
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <button
              type="button"
              onClick={() => navigate(backPath)}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Pengaturan</span>
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-primary font-semibold">
              Terminologi Lembaga
            </span>
          </nav>
        </div>

        {/* Main Title & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(backPath)}
              className="rounded-xl h-9 w-9 shrink-0 bg-card hover:bg-muted shadow-xs"
              title="Kembali ke Pengaturan Sistem"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-0">
                Pengaturan Terminologi Lembaga
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-0">
                Atur dan kustomisasi sebutan istilah entitas sesuai kebutuhan lembaga Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SETTINGS CARD FULL WIDTH ── */}
      <div className="w-full">
        <TerminologySettingsCard
          entityConfigs={entityConfigs}
          customLabels={customLabels}
          savingKey={savingKey}
          isSavingAll={isSavingAll}
          handleLabelChange={handleLabelChange}
          handleSaveItem={handleSaveItem}
          handleResetItem={handleResetItem}
          handleSaveAll={handleSaveAll}
          onResetAll={handleResetDefaults}
        />
      </div>
    </div>
  );
}
