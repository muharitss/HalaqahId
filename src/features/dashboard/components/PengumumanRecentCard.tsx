import { useState } from "react";
import { Link } from "react-router-dom";
import { Pin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Term } from "@/components/ui/Term";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  PengumumanDetailDialog,
  usePengumumanMutations,
  type PengumumanItem,
} from "@/features/pengumuman";

export type { PengumumanItem };

interface PengumumanRecentCardProps {
  items: PengumumanItem[];
  isLoading: boolean;
  className?: string;
}

export function PengumumanRecentCard({ items, isLoading, className }: PengumumanRecentCardProps) {
  const [selectedItem, setSelectedItem] = useState<PengumumanItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { markAsReadMutation } = usePengumumanMutations();

  if (!isLoading && items.length === 0) {
    return null;
  }

  const getPriorityBadge = (prioritas?: string) => {
    switch (prioritas) {
      case "URGENT":
      case "MENDESAK":
        return (
          <Badge
            variant="outline"
            className="bg-destructive/10 text-destructive border-destructive/25 text-[10px] px-1.5 py-0 font-medium"
          >
            Mendesak
          </Badge>
        );
      case "PENTING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25 text-[10px] px-1.5 py-0 font-medium"
          >
            Penting
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleItemClick = (item: PengumumanItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  return (
    <>
      <Card className={cn("shadow-sm overflow-hidden flex flex-col h-full min-w-0 w-full", className)}>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-semibold text-foreground">
                Pengumuman Terbaru
              </CardTitle>
              <CardDescription className="text-xs">
                Informasi terkini untuk <Term code="MUHAFIZ" className="lowercase" />
              </CardDescription>
            </div>
            <Link
              to="/muhafidz/pengumuman"
              className="text-xs font-medium text-primary hover:underline shrink-0"
            >
              Lihat semua
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1">
          {isLoading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </div>
          ) : (
            <div className="divide-y divide-border max-h-[240px] overflow-y-auto scrollbar-thin">
              {items.map((item) => {
                let dateStr = "";
                try {
                  dateStr = format(new Date(item.created_at), "dd MMM yyyy", { locale: idLocale });
                } catch {
                  dateStr = item.created_at;
                }

                return (
                  <div
                    key={item.id_pengumuman}
                    onClick={() => handleItemClick(item)}
                    className="p-3.5 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        {item.is_pinned && (
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0 font-medium inline-flex items-center gap-1"
                          >
                            <Pin className="h-2.5 w-2.5 -rotate-45 fill-current" />
                            Disematkan
                          </Badge>
                        )}
                        {getPriorityBadge(item.prioritas)}
                        <h4 className="text-xs font-semibold text-foreground line-clamp-1">
                          {item.judul}
                        </h4>
                      </div>
                      <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                        {dateStr}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {item.isi}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

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
