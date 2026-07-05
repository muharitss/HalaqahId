import { useMemo } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ClipboardList, BookOpen, Layers } from "lucide-react";
import { type SetoranRecord } from "../../setoran/types";

interface HistoryTableProps {
  data: SetoranRecord[];
  monthName?: string;
}

export function HistoryTable({ data, monthName }: HistoryTableProps) {
  // Helper resolver nama kategori
  const getKategoriName = (item: SetoranRecord) => {
    if (typeof item.kategori === "object" && item.kategori) {
      return item.kategori.nama_kategori;
    }
    return (item.kategori as unknown as string) || "HAFALAN";
  };

  // Group data by Kategori
  const groupedData = useMemo(() => {
    const groups: Record<string, SetoranRecord[]> = {};
    data.forEach((item) => {
      const name = getKategoriName(item);
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push(item);
    });
    return groups;
  }, [data]);

  const categories = useMemo(() => Object.keys(groupedData).sort(), [groupedData]);

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Belum ada riwayat setoran di bulan {monthName || "ini"}.
      </div>
    );
  }

  // Helper hitung statistik untuk sekelompok setoran
  const getStats = (records: SetoranRecord[]) => {
    const totalSetoran = records.length;
    const totalBaris = records.reduce((sum, item) => sum + (item.total_baris || 0), 0);
    
    // Hitung total halaman berdasarkan data halaman mulai & selesai
    const totalHalaman = records.reduce((sum, item) => {
      // @ts-ignore
      const startPage = item.start_page || item.startPage;
      // @ts-ignore
      const endPage = item.end_page || item.endPage;
      if (startPage && endPage) {
        return sum + (endPage - startPage + 1);
      }
      return sum;
    }, 0);

    // Konversi baris ke halaman (jika data halaman kosong, gunakan estimasi total baris / 15 baris per halaman)
    const estimasiHalaman = totalBaris > 0 ? (totalBaris / 15).toFixed(1) : "0";

    return {
      totalSetoran,
      totalBaris,
      totalHalaman: totalHalaman > 0 ? totalHalaman.toString() : estimasiHalaman,
    };
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue={categories[0]} className="w-full">
        <div className="px-6 pt-3">
          <TabsList className="grid grid-flow-col auto-cols-auto justify-start gap-1 p-1 h-9.5 overflow-x-auto bg-muted/40">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat} 
                value={cat} 
                className="text-xs font-bold px-3.5 py-1.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Layers className="h-3 w-3 mr-1.5 opacity-60" />
                {cat}
                <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground group-data-[state=active]:bg-primary/10">
                  {groupedData[cat].length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((cat) => {
          const records = groupedData[cat];
          const stats = getStats(records);

          return (
            <TabsContent key={cat} value={cat} className="space-y-4 pt-2">
              {/* ── STATS CARDS GRID ── */}
              <div className="grid grid-cols-3 gap-4 px-6">
                <Card className="bg-card/50 shadow-none border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase">Total Setoran</p>
                      <h4 className="text-base font-extrabold">{stats.totalSetoran} kali</h4>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 shadow-none border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase">Total Halaman</p>
                      <h4 className="text-base font-extrabold">{stats.totalHalaman} hal</h4>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 shadow-none border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase">Total Baris</p>
                      <h4 className="text-base font-extrabold">{stats.totalBaris} baris</h4>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ── DETAILED HISTORY TABLE ── */}
              <div className="overflow-x-auto border-t">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="w-[120px] pl-6 text-xs font-semibold">Tanggal</TableHead>
                      <TableHead className="text-xs font-semibold">Materi Setoran</TableHead>
                      <TableHead className="w-[100px] text-xs font-semibold text-center">Taqwim</TableHead>
                      <TableHead className="pr-6 text-xs font-semibold">Keterangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((item) => {
                      // @ts-ignore
                      const startPage = item.start_page || item.startPage;
                      // @ts-ignore
                      const endPage = item.end_page || item.endPage;
                      // @ts-ignore
                      const totalBaris = item.total_baris || item.totalBaris;

                      return (
                        <TableRow key={item.id_setoran} className="hover:bg-muted/5">
                          <TableCell className="text-xs pl-6 py-3">
                            <div className="font-bold">{format(new Date(item.tanggal_setoran), "dd MMM yyyy")}</div>
                            <div className="text-muted-foreground text-[10px]">{format(new Date(item.tanggal_setoran), "HH:mm")}</div>
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="text-sm font-extrabold">Juz {item.juz}: {item.surat}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Ayat {item.ayat}
                              {startPage && (
                                <span className="ml-2 bg-muted px-1.5 py-0.5 rounded text-[10px] text-foreground font-medium">
                                  Halaman {startPage === endPage ? startPage : `${startPage}-${endPage}`} ({totalBaris} baris)
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-3">
                            <span className={`text-sm font-extrabold ${item.taqwim === 0 ? "text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full" : "text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full"}`}>
                              {item.taqwim}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground pr-6 py-3 max-w-[200px] truncate">
                            {item.keterangan || "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
