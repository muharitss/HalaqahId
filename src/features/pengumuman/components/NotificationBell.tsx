import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, Megaphone, ArrowRight } from "lucide-react";
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
import { usePengumumanUnreadCount, usePengumumanList } from "../api/queries/usePengumumanQueries";
import { usePengumumanMutations } from "../api/mutations/usePengumumanMutations";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { data: unreadCount = 0 } = usePengumumanUnreadCount();
  const { markAsReadMutation } = usePengumumanMutations();

  // Fetch up to 5 recent active announcements
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

  return (
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
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground animate-in zoom-in-50">
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
        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-sm">Pengumuman</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {unreadCount} baru
              </Badge>
            )}
          </div>

          <Link
            to={targetPath}
            onClick={() => setOpen(false)}
            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
          >
            Lihat Semua
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <ScrollArea className="max-h-72">
          {recentList.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Tidak ada pengumuman saat ini.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentList.map((item) => (
                <div
                  key={item.id_pengumuman}
                  className={`p-3 text-left transition-colors hover:bg-muted/50 ${
                    item.is_read === false ? "bg-primary/[0.03]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground line-clamp-1">
                      {item.judul}
                    </p>
                    {item.is_read === false && (
                      <button
                        title="Tandai sudah dibaca"
                        onClick={(e) => handleMarkAsRead(item.id_pengumuman, e)}
                        className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                    {item.isi}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-2 text-center bg-muted/20">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full text-xs font-medium h-8"
            onClick={() => setOpen(false)}
          >
            <Link to={targetPath}>Buka Halaman Pengumuman</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
