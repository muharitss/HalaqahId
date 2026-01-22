import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function HistoryTable({ data }: { data: any[] }) {
  if (data.length === 0) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Belum ada riwayat setoran.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[150px]">Tanggal</TableHead>
            <TableHead>Materi</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Taqwim</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id_setoran}>
              <TableCell className="text-xs">
                <div className="font-medium">{format(new Date(item.tanggal_setoran), "dd MMM yyyy")}</div>
                <div className="text-muted-foreground">{format(new Date(item.tanggal_setoran), "HH:mm")}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-semibold">Juz {item.juz}: {item.surat}</div>
                <div className="text-xs text-muted-foreground">Ayat {item.ayat}</div>
              </TableCell>
              <TableCell>
                <Badge variant={item.kategori === "HAFALAN" ? "default" : "secondary"} className="text-[10px]">
                  {item.kategori}
                </Badge>
              </TableCell>
              <TableCell>
                <span className={`text-sm font-bold ${item.taqwim === 'Mumtaz' ? 'text-green-600' : 'text-orange-600'}`}>
                  {item.taqwim}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}