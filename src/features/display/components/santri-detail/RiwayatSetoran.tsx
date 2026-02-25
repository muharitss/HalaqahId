import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { BookOpen } from "lucide-react";

export interface SetoranRecord {
  id_setoran: string | number;
  tanggal: string;
  surat: string;
  juz: string | number;
  ayat: string;
  kategori: "HAFALAN" | "MUROJAAH" | string;
}

interface RiwayatSetoranProps {
  data: SetoranRecord[];
}

export function RiwayatSetoran({ data }: RiwayatSetoranProps) {
  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/10 border-b">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4" /> Riwayat Setoran Hafalan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="text-[11px] font-bold uppercase">Tanggal</TableHead>
              <TableHead className="text-[11px] font-bold uppercase">Materi</TableHead>
              <TableHead className="text-[11px] font-bold uppercase">Kategori</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((s) => (
                <TableRow key={s.id_setoran} className="hover:bg-muted/5">
                  <TableCell className="text-xs font-medium">
                    {s.tanggal ? format(parseISO(s.tanggal), "dd MMM yyyy", { locale: localeId }) : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-sm text-foreground uppercase">{s.surat}</div>
                    <div className="text-[10px] text-muted-foreground font-medium uppercase">
                      Juz {s.juz} • Ayat {s.ayat}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.kategori === "HAFALAN" ? "default" : "secondary"} className="text-[9px] px-2 py-0">
                      {s.kategori}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">
                  Tidak ada data setoran ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}