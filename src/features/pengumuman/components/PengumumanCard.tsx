import { useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Pin,
  Clock,
  User,
  CheckCircle2,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PengumumanItem, PrioritasPengumuman } from "../types";

interface PengumumanCardProps {
  item: PengumumanItem;
  canManage?: boolean;
  onEdit?: (item: PengumumanItem) => void;
  onDelete?: (item: PengumumanItem) => void;
  onTogglePin?: (item: PengumumanItem) => void;
  onMarkAsRead?: (id: number) => void;
}

export function PengumumanCard({
  item,
  canManage = false,
  onEdit,
  onDelete,
  onTogglePin,
  onMarkAsRead,
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

  const renderPriorityBadge = (prioritas: PrioritasPengumuman) => {
    switch (prioritas) {
      case "URGENT":
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 flex items-center gap-1 font-medium"
          >
            <AlertCircle className="w-3 h-3" />
            Urgent
          </Badge>
        );
      case "PENTING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900 flex items-center gap-1 font-medium"
          >
            <AlertTriangle className="w-3 h-3" />
            Penting
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-muted text-muted-foreground border-border flex items-center gap-1 font-normal"
          >
            <Info className="w-3 h-3" />
            Normal
          </Badge>
        );
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

  const isLongContent = item.isi && item.isi.length > 220;

  return (
    <Card
      className={`transition-all duration-200 ${
        item.is_pinned
          ? "border-primary/40 bg-primary/[0.02] shadow-sm"
          : "hover:border-border/80"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {item.is_pinned && (
                <Badge
                  variant="default"
                  className="bg-primary text-primary-foreground text-xs flex items-center gap-1 px-2 py-0.5"
                >
                  <Pin className="w-3 h-3 fill-current rotate-45" />
                  Disematkan
                </Badge>
              )}
              {renderPriorityBadge(item.prioritas)}
              <Badge variant="secondary" className="text-xs">
                Target: {getTargetSummary()}
              </Badge>
              {item.is_read === false && (
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] px-1.5 py-0">
                  Baru
                </Badge>
              )}
            </div>

            <CardTitle className="text-base sm:text-lg font-semibold tracking-tight text-foreground line-clamp-2 mt-1">
              {item.judul}
            </CardTitle>
          </div>

          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onTogglePin && (
                  <DropdownMenuItem onClick={() => onTogglePin(item)}>
                    <Pin className="h-4 w-4 mr-2" />
                    {item.is_pinned ? "Lepas Sematan" : "Sematkan di Atas"}
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(item)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
        {isLongContent && !isExpanded ? (
          <>
            {item.isi.slice(0, 220)}...
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-primary text-xs ml-1 inline-flex items-center"
              onClick={() => setIsExpanded(true)}
            >
              Baca selengkapnya
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </Button>
          </>
        ) : (
          <>
            {item.isi}
            {isLongContent && (
              <Button
                variant="link"
                className="p-0 h-auto font-medium text-muted-foreground text-xs block mt-1"
                onClick={() => setIsExpanded(false)}
              >
                Tampilkan lebih sedikit
                <ChevronUp className="w-3 h-3 ml-0.5 inline" />
              </Button>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-3 border-t text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {item.creator?.name || "Admin"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(item.created_at)}
          </span>
          {canManage && item.read_count !== undefined && (
            <span className="text-muted-foreground">
              {item.read_count} kali dibaca
            </span>
          )}
        </div>

        {!canManage && item.is_read === false && onMarkAsRead && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/5"
            onClick={() => onMarkAsRead(item.id_pengumuman)}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tandai Dibaca
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
