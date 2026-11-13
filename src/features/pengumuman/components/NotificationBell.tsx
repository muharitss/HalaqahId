import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Pin, ArrowRight } from "lucide-react";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  format,
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/features/auth/components/auth-provider";
import { isKepalaRole, Role } from "@/types/domain/enums";
import { cn } from "@/lib/utils";
import { usePengumumanUnreadCount, usePengumumanList } from "../api/queries/usePengumumanQueries";
import { usePengumumanMutations } from "../api/mutations/usePengumumanMutations";
import { PengumumanDetailDialog } from "./PengumumanDetailDialog";
import type { PengumumanItem } from "../types";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PengumumanItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { user } = useAuth();
  const { data: unreadCount = 0 } = usePengumumanUnreadCount();
  const { markAsReadMutation } = usePengumumanMutations();

  const { data: pengumumanResult } = usePengumumanList({
    active_only: true,
    limit: 5,
  });

  const recentList = pengumumanResult?.data || [];

  const targetPath =
    user?.role === Role.SUPERADMIN || (user && isKepalaRole(user.role))
      ? "/kepala-muhafidz/pengumuman"
      : "/muhafidz/pengumuman";

  const handleMarkAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    markAsReadMutation.mutate(id);
  };

  const handleItemClick = (item: PengumumanItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
    setOpen(false);
  };

  const formatTimeAgo = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMins = differenceInMinutes(now, date);
      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins}m lalu`;
      const diffHours = differenceInHours(now, date);
      if (diffHours < 24) return `${diffHours}j lalu`;
      const diffDays = differenceInDays(now, date);
      if (diffDays < 7) return `${diffDays}h lalu`;
      return format(date, "dd MMM", { locale: localeId });
    } catch {
      return "";
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full focus-visible:ring-1"
            aria-label="Pengumuman & Notifikasi"
          >
            <Bell className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground ring-2 ring-background tabular-nums animate-in zoom-in-50">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-80 sm:w-96 p-0 shadow-lg border-border"
          sideOffset={8}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/20">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-foreground">Pengumuman</h4>
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 text-[11px] font-medium px-2 py-0.5 tabular-nums"
                >
                  {unreadCount} baru
                </Badge>
              )}
            </div>

            <Link
              to={targetPath}
              onClick={() => setOpen(false)}
              className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1 group"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* List */}
          <ScrollArea className="max-h-80">
            {recentList.length === 0 ? (
              <div className="py-10 px-4 text-center text-sm text-muted-foreground">
                Tidak ada pengumuman saat ini.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentList.map((item) => {
                  const isUnread = item.is_read === false;
                  return (
                    <div
                      key={item.id_pengumuman}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "p-3.5 text-left transition-colors hover:bg-muted/50 cursor-pointer group flex flex-col gap-1.5",
                        isUnread ? "bg-primary/[0.02]" : "bg-card"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                          {item.is_pinned && (
                            <span
                              className="inline-flex items-center text-amber-600 dark:text-amber-400 shrink-0"
                              title="Disematkan"
                            >
                              <Pin className="h-3 w-3 -rotate-45 fill-current" />
                            </span>
                          )}
                          {isUnread && (
                            <span
                              className="h-2 w-2 rounded-full bg-primary shrink-0"
                              aria-hidden="true"
                            />
                          )}
                          <p
                            className={cn(
                              "text-xs text-foreground line-clamp-1 group-hover:text-primary transition-colors",
                              isUnread ? "font-semibold" : "font-medium"
                            )}
                          >
                            {item.judul}
                          </p>
                        </div>

                        <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 tabular-nums">
                          {formatTimeAgo(item.created_at)}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.isi}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                        <span className="truncate max-w-[200px]">
                          {item.creator?.name ? `Oleh: ${item.creator.name}` : "Admin"}
                        </span>
                        {isUnread && (
                          <button
                            type="button"
                            onClick={(e) => handleMarkAsRead(item.id_pengumuman, e)}
                            className="text-[11px] font-medium text-primary hover:underline shrink-0"
                          >
                            Tandai dibaca
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer - Tombol Lihat Semua Pengumuman */}
          <div className="border-t p-2.5 bg-muted/30">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full h-8.5 text-xs font-medium border-border/80 bg-background hover:bg-primary/5 hover:text-primary hover:border-primary/30 shadow-2xs transition-all group"
              onClick={() => setOpen(false)}
            >
              <Link
                to={targetPath}
                className="flex items-center justify-center gap-1.5"
              >
                <span>Lihat Semua Pengumuman</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <PengumumanDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        item={selectedItem}
        onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
        canManage={false}
      />
    </>
  );
}
