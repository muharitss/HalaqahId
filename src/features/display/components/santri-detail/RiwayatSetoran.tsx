import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { BookOpen, Calendar, Hash, Type } from "lucide-react";
import { type SetoranRecord } from "@/types/domain/display";

interface RiwayatSetoranProps {
  data: SetoranRecord[];
}

export function RiwayatSetoran({ data }: RiwayatSetoranProps) {
  return (
    <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="bg-muted/20 border-b flex flex-row items-center justify-between py-4">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> Riwayat Setoran Hafalan
        </CardTitle>
        <Badge variant="outline" className="font-bold text-[10px] uppercase">
          Total: {data.length} Setoran
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-wider h-10">
                  <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Tanggal</div>
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-wider h-10">
                   <div className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> Nama Surat</div>
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-wider h-10">
                   <div className="flex items-center gap-1.5"><Hash className="h-3 w-3" /> Juz / Ayat</div>
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-wider h-10">
                   <div className="flex items-center gap-1.5"><Type className="h-3 w-3" /> Kategori</div>
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-wider h-10">Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((s) => (
                  <TableRow key={s.id_setoran} className="hover:bg-muted/5 transition-colors group">
                    <TableCell className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      {s.tanggal ? format(parseISO(s.tanggal), "dd MMM yyyy", { locale: localeId }) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="font-black text-sm text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">
                        {s.surat}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <Badge variant="secondary" className="text-[9px] font-bold px-2 py-0 h-5 bg-primary/5 text-primary border-primary/10">Juz {s.juz}</Badge>
                         <span className="text-[10px] font-medium text-muted-foreground">Ayat {s.ayat}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={s.kategori?.toUpperCase() === "HAFALAN" ? "default" : "secondary"} 
                        className={cn(
                          "text-[9px] font-black px-2 py-0.5 uppercase tracking-tighter",
                          s.kategori?.toUpperCase() === "HAFALAN" ? "bg-primary shadow-xs" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {s.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground max-w-[200px] truncate italic">
                      {s.keterangan || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                       <BookOpen className="h-8 w-8 opacity-20" />
                       <p className="text-sm font-medium italic">Belum ada riwayat setoran</p>
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

// Add cn utility if not present or just use simple classes
function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ");
}
