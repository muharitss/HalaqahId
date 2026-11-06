import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, LogIn, Building2, UserPlus } from "lucide-react";
import type { AuditLog } from "@/features/auth/types";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface RecentActivityCardProps {
  logs?: AuditLog[];
  isLoading: boolean;
}

export function RecentActivityCard({ logs = [], isLoading }: RecentActivityCardProps) {
  const getActionIcon = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("LOGIN") || act.includes("AUTH")) {
      return <LogIn className="h-3.5 w-3.5 text-blue-500" />;
    }
    if (act.includes("TENANT")) {
      return <Building2 className="h-3.5 w-3.5 text-emerald-500" />;
    }
    if (act.includes("USER") || act.includes("CREATE")) {
      return <UserPlus className="h-3.5 w-3.5 text-amber-500" />;
    }
    return <Activity className="h-3.5 w-3.5 text-primary" />;
  };

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("LOGIN")) {
      return <Badge variant="secondary" className="text-[10px] py-0">Login</Badge>;
    }
    if (act.includes("TENANT")) {
      return <Badge className="text-[10px] py-0 bg-emerald-500/10 text-emerald-600 border-emerald-200">Tenant Baru</Badge>;
    }
    return <Badge variant="outline" className="text-[10px] py-0">{action}</Badge>;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Aktivitas Platform Terbaru
          </CardTitle>
          <CardDescription className="text-xs">
            Log pendaftaran tenant baru dan login pengguna terbaru
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            Belum ada log aktivitas tercatat.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {logs.slice(0, 6).map((log) => {
              let timeLabel = "";
              try {
                timeLabel = formatDistanceToNow(new Date(log.created_at), {
                  addSuffix: true,
                  locale: idLocale,
                });
              } catch {
                timeLabel = log.created_at;
              }

              return (
                <div key={log.id_log} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-full bg-muted shrink-0">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {log.actor_name || "Pengguna"}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {log.details || log.action}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    {getActionBadge(log.action)}
                    <span className="text-[10px] text-muted-foreground">{timeLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
