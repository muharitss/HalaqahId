import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Pin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export interface PengumumanItem {
  id_pengumuman: number;
  judul: string;
  isi: string;
  prioritas?: "NORMAL" | "PENTING" | "URGENT" | "MENDESAK";
  is_pinned?: boolean;
  created_at: string;
}

interface PengumumanRecentCardProps {
  items: PengumumanItem[];
  isLoading: boolean;
}

export function PengumumanRecentCard({ items, isLoading }: PengumumanRecentCardProps) {
  if (!isLoading && items.length === 0) {
    return null; // Don't take up space if no announcements
  }

  const getPriorityBadge = (prioritas?: string) => {
    switch (prioritas) {
      case "URGENT":
      case "MENDESAK":
        return <Badge variant="destructive" className="text-[9px] px-1.5 py-0 uppercase">Mendesak</Badge>;
      case "PENTING":
        return <Badge variant="secondary" className="text-[9px] px-1.5 py-0 uppercase bg-amber-500/10 text-amber-700 border-amber-300">Penting</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm border-primary/20 bg-primary/5 overflow-hidden">
      <CardHeader className="pb-3 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
              <Bell className="h-4 w-4 text-primary" />
              Pengumuman & Notifikasi Terbaru
            </CardTitle>
            <CardDescription className="text-xs">
              Informasi terkini dari pimpinan sekolah untuk muhafiz
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <div className="divide-y divide-primary/10 max-h-[220px] overflow-y-auto scrollbar-thin">
            {items.map((item) => {
              let dateStr = "";
              try {
                dateStr = format(new Date(item.created_at), "dd MMM yyyy", { locale: idLocale });
              } catch {
                dateStr = item.created_at;
              }

              return (
                <div key={item.id_pengumuman} className="p-3.5 hover:bg-primary/10 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.is_pinned && (
                        <span className="inline-flex items-center text-[10px] text-primary font-bold">
                          <Pin className="h-3 w-3 mr-0.5" /> Pinned
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-foreground">{item.judul}</h4>
                      {getPriorityBadge(item.prioritas)}
                    </div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                      <Calendar className="h-3 w-3" />
                      {dateStr}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.isi}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
