import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { BookOpen, Calendar, Hash, Type, FileText } from "lucide-react";
import { type SetoranRecord } from "@/types/domain/display";
import { cn } from "@/lib/utils";

interface RiwayatSetoranProps {
  data: SetoranRecord[];
}

const KATEGORI_CONFIG: Record<string, { className: string }> = {
  HAFALAN: { className: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-500/30 dark:text-emerald-400" },
  MURAJAAH: { className: "bg-blue-500/10 text-blue-700 border-blue-200 dark:border-blue-500/30 dark:text-blue-400" },
  ZIYADAH: { className: "bg-violet-500/10 text-violet-700 border-violet-200 dark:border-violet-500/30 dark:text-violet-400" },
  INTENS: { className: "bg-amber-500/10 text-amber-700 border-amber-200 dark:border-amber-500/30 dark:text-amber-400" },
  BACAAN: { className: "bg-cyan-500/10 text-cyan-700 border-cyan-200 dark:border-cyan-500/30 dark:text-cyan-400" },
};

export function RiwayatSetoran({ data }: RiwayatSetoranProps) {
  return (
    <Card className="border border-border/60 bg-card shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-4 space-y-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          Riwayat Setoran Hafalan
        </CardTitle>
        <Badge variant="outline" className="font-semibold text-[10px] px-2.5 py-0.5 bg-muted/50">
          {data.length} Setoran
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider h-9 text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Tanggal</div>
                </TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider h-9 text-muted-foreground">
                  <div className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> Surat</div>
                </TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider h-9 text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Hash className="h-3 w-3" /> Juz / Ayat</div>
                </TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider h-9 text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Type className="h-3 w-3" /> Kategori</div>
                </TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-wider h-9 text-muted-foreground">
                  <div className="flex items-center gap-1.5"><FileText className="h-3 w-3" /> Keterangan</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((s, idx) => {
                  const kategoriKey = s.kategori?.toUpperCase() || "";
                  const kategoriConfig = KATEGORI_CONFIG[kategoriKey];

                  return (
                    <TableRow
                      key={s.id_setoran}
                      className={cn(
                        "hover:bg-muted/20 transition-colors border-b border-border/30",
                        idx % 2 === 0 ? "bg-transparent" : "bg-muted/5"
                      )}
                    >
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap font-medium py-3">
                        {s.tanggal ? format(parseISO(s.tanggal), "dd MMM yyyy", { locale: localeId }) : "-"}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-sm font-semibold text-foreground">
                          {s.surat}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          {s.juz != null && (
                            <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0 h-5 bg-primary/8 text-primary border-0 rounded-md">
                              Juz {s.juz}
                            </Badge>
                          )}
                          <span className="text-[11px] text-muted-foreground font-medium">Ayat {s.ayat}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 uppercase tracking-tight rounded-md",
                            kategoriConfig?.className || "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          {s.kategori}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[11px] text-muted-foreground max-w-[200px] truncate py-3">
                        {s.keterangan || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <div className="h-14 w-14 rounded-2xl bg-muted/40 flex items-center justify-center">
                        <BookOpen className="h-7 w-7 opacity-30" />
                      </div>
                      <p className="text-sm font-medium">Belum ada riwayat setoran</p>
                      <p className="text-xs text-muted-foreground/70">Data setoran akan muncul setelah dicatat oleh muhafidz</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
