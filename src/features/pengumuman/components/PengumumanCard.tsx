import { useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { MoreVertical, Pin, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { PengumumanItem, PrioritasPengumuman } from "../types";

interface PengumumanCardProps {
  item: PengumumanItem;
  canManage?: boolean;
  onEdit?: (item: PengumumanItem) => void;
  onDelete?: (item: PengumumanItem) => void;
  onTogglePin?: (item: PengumumanItem) => void;
  onMarkAsRead?: (id: number) => void;
  onViewDetail?: (item: PengumumanItem) => void;
}

export function PengumumanCard({
  item,
  canManage = false,
  onEdit,
  onDelete,
  onTogglePin,
  onMarkAsRead,
  onViewDetail,
}: PengumumanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm", {
        locale: localeId,
      });
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

  const renderPriorityBadge = (prioritas: PrioritasPengumuman) => {
    switch (prioritas) {
      case "URGENT":
        return (
          <Badge
            variant="outline"
            className="bg-destructive/10 text-destructive border-destructive/25 text-[11px] font-medium"
          >
            Urgent
          </Badge>
        );
      case "PENTING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25 text-[11px] font-medium"
          >
            Penting
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTargetSummary = () => {
    if (!item.targets || item.targets.length === 0) return "Semua";
    const types = item.targets.map((t) => {
      switch (t.target_type) {
        case "ALL":
          return "Semua";
        case "HALAQAH":
          return "Halaqah";
        case "SANTRI":
          return "Santri";
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

  const isUnread = !canManage && item.is_read === false;
  const isLongContent = item.isi && item.isi.length > 220;

  const handleTitleClick = () => {
    if (onViewDetail) {
      onViewDetail(item);
    } else {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-150 shadow-xs border",
        item.is_pinned
          ? "border-amber-400/40 dark:border-amber-500/30 bg-amber-50/[0.12] dark:bg-amber-950/[0.06]"
          : "hover:border-border/90",
        isUnread && "border-l-4 border-l-primary"
      )}
    >
      <CardHeader className="pb-2.5 pt-4 px-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          {/* Author Block */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-8 w-8 border shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">
                {getInitials(item.creator?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate leading-tight">
                {item.creator?.name || "Admin"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                <span className="tabular-nums">{formatDate(item.created_at)}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>Untuk: {getTargetSummary()}</span>
              </p>
            </div>
          </div>

          {/* Right Badges & Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {item.is_pinned && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 text-[11px] font-medium inline-flex items-center gap-1"
              >
                <Pin className="h-3 w-3 -rotate-45 fill-current" />
                Disematkan
              </Badge>
            )}

            {renderPriorityBadge(item.prioritas)}

            {isUnread && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary ml-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Baru
              </span>
            )}

            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground ml-1"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Aksi</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {onTogglePin && (
                    <DropdownMenuItem onClick={() => onTogglePin(item)}>
                      <Pin className="h-4 w-4 mr-2" />
                      {item.is_pinned ? "Lepas Sematan" : "Sematkan di Atas"}
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Pengumuman
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(item)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Title */}
        <CardTitle
          onClick={handleTitleClick}
          className="text-base font-semibold tracking-tight text-foreground hover:text-primary transition-colors cursor-pointer pt-2 leading-snug"
        >
          {item.judul}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-3 px-4 sm:px-5 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
        {isLongContent && !isExpanded ? (
          <>
            {item.isi.slice(0, 220)}...{" "}
            {onViewDetail ? (
              <button
                type="button"
                className="font-medium text-primary text-xs hover:underline inline-block"
                onClick={() => onViewDetail(item)}
              >
                Baca selengkapnya
              </button>
            ) : (
              <button
                type="button"
                className="font-medium text-primary text-xs hover:underline inline-block"
                onClick={() => setIsExpanded(true)}
              >
                Selengkapnya
              </button>
            )}
          </>
        ) : (
          <>
            {item.isi}
            {isLongContent && !onViewDetail && (
              <button
                type="button"
                className="font-medium text-muted-foreground hover:text-foreground text-xs block mt-1 hover:underline"
                onClick={() => setIsExpanded(false)}
              >
                Tampilkan lebih sedikit
              </button>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-3 px-4 sm:px-5 border-t text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {canManage && item.read_count !== undefined && (
            <span className="tabular-nums">
              Dibaca {item.read_count} kali
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onViewDetail && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => onViewDetail(item)}
            >
              Lihat Detail
            </Button>
          )}

          {isUnread && onMarkAsRead && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2.5 text-xs border-primary/30 text-primary hover:bg-primary/5"
              onClick={() => onMarkAsRead(item.id_pengumuman)}
            >
              Tandai dibaca
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
