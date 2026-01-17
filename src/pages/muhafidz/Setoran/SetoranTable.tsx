import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function SetoranTable({ history, loading }: { history: any[]; loading: boolean }) {
  const getNilaiVariant = (nilai: number) => {
    if (nilai >= 90) return "outline"; // Anda bisa kustomisasi sesuai kebutuhan Shadcn Badge
    return "secondary";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Santri</TableHead>
            <TableHead>Materi</TableHead>
            <TableHead className="text-center">Nilai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                {loading ? "Memuat data..." : "Tidak ada riwayat hari ini."}
              </TableCell>
            </TableRow>
          ) : (
            history.map((item) => (
              <TableRow key={item.id_setoran}>
                <TableCell className="font-medium">
                  <div>
                    <div className="text-sm">{item.santri?.nama_santri}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">{item.kategori}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{item.surat}</span>
                  <p className="text-xs text-muted-foreground">Ayat {item.ayat} (Juz {item.juz})</p>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={getNilaiVariant(item.nilai)} className="font-mono">
                    {item.nilai}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}