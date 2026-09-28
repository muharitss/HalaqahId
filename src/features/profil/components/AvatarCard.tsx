import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, ShieldAlert, Award, FileBadge2, Quote } from "lucide-react";
import type { AuthUser } from "@/types/domain/auth";
import type { UserProfileData } from "../types";
import { getInitials } from "../utils/format-initials";
import { getRoleBadgeLabel } from "../utils/format-role";

interface AvatarCardProps {
  user: AuthUser | UserProfileData;
  avatarSlot?: React.ReactNode;
}

export function AvatarCard({ user, avatarSlot }: AvatarCardProps) {
  const displayName =
    ("nama_lengkap" in user && user.nama_lengkap) || user.name || "Pengguna";
  const photoUrl =
    ("foto" in user && user.foto) ||
    ("foto_url" in user && user.foto_url) ||
    ("avatarUrl" in user && user.avatarUrl) ||
    null;
  const bio = "bio" in user ? user.bio : null;
  const spesialisasi = "spesialisasi" in user ? user.spesialisasi : null;
  const noIjazah = "no_ijazah" in user ? user.no_ijazah : null;

  const initials = getInitials(displayName);

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-2xl border bg-linear-to-br from-primary/5 via-background to-muted/30 p-6 shadow-sm relative overflow-hidden">
      {/* Avatar / Slot */}
      <div className="relative shrink-0">
        {avatarSlot ? (
          avatarSlot
        ) : (
          <div className="relative">
            <Avatar className="h-24 w-24 rounded-full border-4 border-background shadow-md ring-4 ring-primary/10">
              <AvatarImage src={photoUrl || undefined} alt={displayName} className="object-cover" />
              <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-2xl font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-background shadow-sm" />
          </div>
        )}
      </div>

      {/* Info Details */}
      <div className="flex-1 text-center sm:text-left space-y-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {displayName}
          </h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-0.5">
            {getRoleBadgeLabel(user.role)}
          </Badge>

          {user.is_verified ? (
            <Badge
              variant="outline"
              className="text-xs gap-1 border-emerald-500/40 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Terverifikasi
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-xs gap-1 border-amber-500/40 text-amber-600 bg-amber-50 dark:bg-amber-950/20"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Belum Terverifikasi
            </Badge>
          )}

          {spesialisasi && (
            <Badge
              variant="outline"
              className="text-xs gap-1 border-blue-500/40 text-blue-600 bg-blue-50 dark:bg-blue-950/20"
            >
              <Award className="w-3.5 h-3.5" />
              {spesialisasi}
            </Badge>
          )}

          {noIjazah && (
            <Badge
              variant="outline"
              className="text-xs gap-1 border-purple-500/40 text-purple-600 bg-purple-50 dark:bg-purple-950/20"
            >
              <FileBadge2 className="w-3.5 h-3.5" />
              No. Ijazah: {noIjazah}
            </Badge>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <div className="pt-1 flex items-start gap-2 text-xs text-muted-foreground italic bg-muted/30 p-2.5 rounded-lg border border-border/50">
            <Quote className="h-3.5 w-3.5 text-primary/70 shrink-0 mt-0.5" />
            <span>{bio}</span>
          </div>
        )}
      </div>
    </div>
  );
}
