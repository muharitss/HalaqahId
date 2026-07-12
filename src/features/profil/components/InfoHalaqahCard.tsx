import { BookOpen, Users, CheckCircle2, AlertCircle } from "lucide-react";
import type { AuthUser } from "@/types/domain/auth";

interface InfoHalaqahCardProps {
  user: AuthUser;
}

export function InfoHalaqahCard({ user }: InfoHalaqahCardProps) {
  const hasHalaqah = user.has_halaqah && user.halaqah;

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b bg-muted/20">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Informasi Halaqah</h3>
        <span className="ml-auto text-[10px] text-muted-foreground/60 bg-muted rounded px-1.5 py-0.5">
          Read-only
        </span>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {hasHalaqah ? (
          <div className="space-y-4">
            {/* Status aktif */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30 shrink-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-semibold text-emerald-600">Aktif</p>
              </div>
            </div>

            {/* Nama Halaqah */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nama Halaqah</p>
                <p className="text-sm font-semibold">{user.halaqah?.name_halaqah}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Belum punya halaqah */
          <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/30">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Belum Memiliki Halaqah</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Hubungi admin atau koordinator untuk mendapatkan halaqah.
              </p>
            </div>
          </div>
        )}

        {/* Divider info */}
        <div className="mt-4 pt-4 border-t border-dashed">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground/60" />
            <p className="text-[11px] text-muted-foreground/60">
              Data halaqah dikelola oleh Koordinator / Admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
