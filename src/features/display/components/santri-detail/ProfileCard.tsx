import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, BookOpen, User, Target, Phone } from "lucide-react";

interface ProfileCardProps {
  nama: string;
  halaqah: string;
  nomorTelepon?: string;
  target?: string;
  muhafiz?: string;
}

function getTargetConfig(target?: string) {
  switch (target?.toUpperCase()) {
    case "INTENSE":
      return { label: "Intense", className: "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/30 dark:text-rose-400" };
    case "SEDANG":
      return { label: "Sedang", className: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/30 dark:text-amber-400" };
    case "RINGAN":
      return { label: "Ringan", className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30 dark:text-emerald-400" };
    default:
      return { label: target || "-", className: "bg-muted text-muted-foreground border-border" };
  }
}

export function ProfileCard({ nama, halaqah, nomorTelepon, target, muhafiz }: ProfileCardProps) {
  const waLink = nomorTelepon ? `https://wa.me/${nomorTelepon.replace(/^0/, '62').replace(/\D/g, '')}` : null;
  const targetConfig = getTargetConfig(target);

  return (
    <Card className="border border-border/60 bg-card overflow-hidden shadow-sm">
      {/* Gradient Banner */}
      <div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
      </div>

      <CardContent className="px-5 pb-5 -mt-10 relative">
        {/* Avatar + Name */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-5">
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/60 to-primary/20 blur-[2px]" />
            <Avatar className="relative h-20 w-20 rounded-xl border-[3px] border-background shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-2xl rounded-xl">
                {nama.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0 space-y-1 pb-0.5">
            <h1 className="text-xl font-bold text-foreground tracking-tight truncate">
              {nama}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-semibold text-xs px-2.5 py-0.5 rounded-md">
                {halaqah}
              </Badge>
              <Badge variant="outline" className={`font-semibold text-[10px] px-2 py-0 ${targetConfig.className}`}>
                <Target className="h-2.5 w-2.5 mr-1" />
                {targetConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {muhafiz && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/30">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Muhafidz</p>
                <p className="text-sm font-semibold text-foreground truncate">{muhafiz}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/30">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Halaqah</p>
              <p className="text-sm font-semibold text-foreground truncate">{halaqah}</p>
            </div>
          </div>

          {nomorTelepon && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/30 sm:col-span-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Telepon</p>
                <p className="text-sm font-semibold text-foreground">{nomorTelepon}</p>
              </div>
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-semibold shrink-0"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
