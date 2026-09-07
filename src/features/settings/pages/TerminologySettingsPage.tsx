import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TerminologySettingsCard } from "../modules";
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 text-left">
      <div className="flex items-center justify-between border-b pb-5">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(backPath)}
            className="rounded-full h-9 w-9 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              Pengaturan Terminologi Lembaga
            </h1>
            <p className="text-xs text-muted-foreground">
              Atur dan kustomisasi sebutan istilah entitas sesuai kebutuhan lembaga Anda
            </p>
          </div>
        </div>
      </div>

      {/* ── CARD CONTENT ── */}
      <TerminologySettingsCard />
    </div>
  );
}
