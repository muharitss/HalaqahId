import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronsUpDown, Check, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SekolahSwitcherProps {
  className?: string;
  align?: "start" | "end" | "center";
}

export function SekolahSwitcher({ className, align = "end" }: SekolahSwitcherProps) {
  const { user, activeSekolah, sekolahList, switchSekolah } = useAuth();
  const [isSwitching, setIsSwitching] = useState<number | null>(null);

  // If user is pure superadmin with no assigned schools
  if (sekolahList.length === 0) {
    if (!user?.id_sekolah) {
      return (
        <div
          className={cn(
            "inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-md bg-muted text-muted-foreground border border-border/50",
            className
          )}
        >
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="truncate max-w-[140px] sm:max-w-[200px]">Semua Sekolah</span>
        </div>
      );
    }
  }

  const currentSchoolId = user?.id_sekolah;
  const currentSchoolName =
    activeSekolah?.nama_sekolah ||
    sekolahList.find((s) => s.id_sekolah === currentSchoolId)?.sekolah.nama_sekolah ||
    "Pilih Sekolah";

  const handleSelectSchool = async (sekolahId: number) => {
    if (sekolahId === currentSchoolId || isSwitching) return;
    try {
      setIsSwitching(sekolahId);
      await switchSekolah(sekolahId);
    } finally {
      setIsSwitching(null);
    }
  };

  // If user only has 1 school, render simple non-dropdown badge/button
  if (sekolahList.length <= 1) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-card border border-border shadow-xs text-foreground",
          className
        )}
      >
        <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="truncate max-w-[130px] sm:max-w-[200px]" title={currentSchoolName}>
          {currentSchoolName}
        </span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 px-2.5 sm:px-3 text-xs font-medium gap-2 justify-between max-w-[180px] sm:max-w-[240px] bg-card hover:bg-accent/50 border-border shadow-xs",
            className
          )}
          disabled={isSwitching !== null}
        >
          <div className="flex items-center gap-2 truncate text-left">
            {isSwitching !== null ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
            ) : (
              <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
            )}
            <span className="truncate" title={currentSchoolName}>
              {currentSchoolName}
            </span>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-64 max-w-[90vw] p-1.5">
        <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
          Pilih Lembaga / Sekolah
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />

        <div className="max-h-60 overflow-y-auto space-y-0.5">
          {sekolahList.map((item) => {
            const isCurrent = item.id_sekolah === currentSchoolId;
            const isTargetSwitching = isSwitching === item.id_sekolah;

            return (
              <DropdownMenuItem
                key={item.id_sekolah}
                onClick={() => handleSelectSchool(item.id_sekolah)}
                disabled={isSwitching !== null}
                className={cn(
                  "cursor-pointer flex items-center justify-between gap-2 px-2 py-2 rounded-md text-xs transition-colors",
                  isCurrent && "bg-primary/10 font-medium text-primary focus:bg-primary/15"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[10px]",
                      isCurrent
                        ? "border-primary/40 bg-primary/20 text-primary"
                        : "border-border bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {item.sekolah.logo_url ? (
                      <img
                        src={item.sekolah.logo_url}
                        alt=""
                        className="h-full w-full object-contain rounded-md"
                      />
                    ) : (
                      <Building2 className="h-3.5 w-3.5" />
                    )}
                  </div>

                  <div className="truncate flex flex-col">
                    <span className="truncate font-medium text-foreground">
                      {item.sekolah.nama_sekolah}
                    </span>
                    {item.sekolah.kota && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        {item.sekolah.kota}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-1">
                  {item.is_primary && (
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1 py-0 h-4 border-amber-500/40 text-amber-600 bg-amber-500/10 font-normal flex items-center gap-0.5"
                    >
                      <Star className="h-2 w-2 fill-current" />
                      Utama
                    </Badge>
                  )}

                  {isTargetSwitching ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  ) : isCurrent ? (
                    <Check className="h-3.5 w-3.5 text-primary font-bold" />
                  ) : null}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
