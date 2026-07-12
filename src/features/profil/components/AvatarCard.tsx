import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import type { AuthUser } from "@/types/domain/auth";

interface AvatarCardProps {
  user: AuthUser;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getRoleBadgeLabel(role: string): string {
  const map: Record<string, string> = {
    MUHAFIZ: "Muhafiz",
    ADMIN: "Admin",
    KOORDINATOR_TAHFIZ: "Koordinator",
    SUPERADMIN: "Superadmin",
  };
  return map[role] ?? role;
}

export function AvatarCard({ user }: AvatarCardProps) {
  console.log("DEBUG AvatarCard user:", user);
  const initials = getInitials(user.name);

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-muted/30 p-6 shadow-sm">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-md ring-4 ring-primary/10">
          {initials}
        </div>
        {/* Online dot */}
        <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-background" />
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left space-y-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          {/* Role badge */}
          <Badge variant="secondary" className="text-xs font-medium">
            {getRoleBadgeLabel(user.role)}
          </Badge>

          {/* Verifikasi badge */}
          {user.is_verified ? (
            <Badge
              variant="outline"
              className="text-xs gap-1 border-emerald-500/40 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
            >
              <ShieldCheck className="w-3 h-3" />
              Terverifikasi
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-xs gap-1 border-amber-500/40 text-amber-600 bg-amber-50 dark:bg-amber-950/20"
            >
              <ShieldAlert className="w-3 h-3" />
              Belum Terverifikasi
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
