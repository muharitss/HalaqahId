import { useEffect } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Pin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PengumumanItem } from "../types";

interface PengumumanDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: PengumumanItem | null;
  onMarkAsRead?: (id: number) => void;
  canManage?: boolean;
}

export function PengumumanDetailDialog({
  open,
  onOpenChange,
  item,
  onMarkAsRead,
  canManage = false,
}: PengumumanDetailDialogProps) {
  useEffect(() => {
    if (open && item && !canManage && item.is_read === false && onMarkAsRead) {
      onMarkAsRead(item.id_pengumuman);
    }
  }, [open, item, canManage, onMarkAsRead]);

  if (!item) return null;

  const formatDate = (dateString?: string | null, includeDay = false) => {
    if (!dateString) return "-";
    try {
      const pattern = includeDay
        ? "EEEE, dd MMMM yyyy 'pukul' HH:mm"
        : "dd MMMM yyyy, HH:mm";
      return format(new Date(dateString), pattern, { locale: localeId });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getTargetSummary = () => {
    if (!item.targets || item.targets.length === 0) return "Seluruh Pengguna";
    const types = item.targets.map((t) => {
      switch (t.target_type) {
        case "ALL":
          return "Seluruh Pengguna";
        case "HALAQAH":
          return "Halaqah Tertentu";
        case "SANTRI":
          return "Santri Tertentu";
        case "LEVEL":
          return "Level";
        case "ROLE":
          return "Role";
        default:
          return t.target_type;
      }
    });
    return Array.from(new Set(types)).join(", ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[88vh] flex flex-col p-0 overflow-hidden">
        {/* Header with Author identity */}
        <DialogHeader className="p-5 pb-3 border-b space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-10 w-10 border border-border shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {getInitials(item.creator?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {item.creator?.name || "Admin Sekolah"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.creator?.role || "Pimpinan / Admin"} ·{" "}
                  <span className="tabular-nums">
                    {formatDate(item.created_at)}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
              {item.is_pinned && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 text-xs font-medium inline-flex items-center gap-1"
                >
                  <Pin className="h-3 w-3 -rotate-45 fill-current" />
                  Disematkan
                </Badge>
              )}
              {item.prioritas === "URGENT" && (
                <Badge
                  variant="outline"
                  className="bg-destructive/10 text-destructive border-destructive/25 text-xs font-medium"
                >
                  Urgent
                </Badge>
              )}
              {item.prioritas === "PENTING" && (
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25 text-xs font-medium"
                >
                  Penting
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1.5">
                Target:{" "}
                <span className="text-foreground font-semibold">
                  {getTargetSummary()}
                </span>
              </div>
              <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug">
                {item.judul}
              </DialogTitle>
            </div>

            {(item.tanggal_mulai || item.tanggal_selesai) && (
              <div className="rounded-md bg-muted/50 border px-3 py-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  Periode Aktif:{" "}
                </span>
                {item.tanggal_mulai ? formatDate(item.tanggal_mulai) : "Sekarang"}{" "}
                s/d{" "}
                {item.tanggal_selesai
                  ? formatDate(item.tanggal_selesai)
                  : "Seterusnya"}
              </div>
            )}

            <Separator />

            <div className="text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-wrap font-normal">
              {item.isi}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-4 border-t bg-muted/20 flex flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {canManage && item.read_count !== undefined ? (
              <span>Telah dibaca {item.read_count} kali</span>
            ) : item.is_read ? (
              <span className="text-muted-foreground">Sudah dibaca</span>
            ) : (
              <span className="text-primary font-medium">Baru</span>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
