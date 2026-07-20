import { useLeaderboardPage } from "../hooks/useLeaderboardPage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Trophy, Printer, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface LeaderboardPageProps {
  role: "admin" | "muhafiz";
}

export function LeaderboardPage({ role }: LeaderboardPageProps) {
  const {
    period,
    startDate,
    endDate,
    selectedHalaqah,
    topPerHalaqah,
    searchQuery,
    halaqahList,
    filteredLeaderboard,
    isLoading,
    topThree,
    setPeriod,
    setStartDate,
    setEndDate,
    setSelectedHalaqah,
    setTopPerHalaqah,
    getPeriodeLabel,
    handlePrint,
  } = useLeaderboardPage({ role });

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* CSS Khusus Cetak Laporan */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          header, 
          aside, 
          .no-print, 
          .sidebar-trigger, 
          button,
          .dock,
          .theme-toggle,
          input,
          select,
          [role="combobox"] {
            display: none !important;
          }
          main, .container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .print-title {
            display: block !important;
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
        }
        .print-title {
          display: none;
        }
      `}</style>

      {/* Header Cetak */}
      <div className="print-title">
        <h1 className="text-2xl font-bold">LAPORAN PAPAN PERINGKAT SETORAN (LEADERBOARD)</h1>
        <p className="text-sm text-gray-600">HalaqahId - Periode: {getPeriodeLabel()}</p>
        {role === "muhafiz" && <p className="text-xs text-gray-500 mt-1">Khusus Halaqah Muhafiz</p>}
      </div>

      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Leaderboard Hafalan Santri</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {role === "admin"
              ? "Peringkat hafalan santri secara keseluruhan atau per halaqah."
              : "Peringkat hafalan santri khusus di halaqah Anda."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Tombol Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 shadow-sm">
                <Filter className="h-4 w-4" />
                Filter Pilihan
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 space-y-4" align="end">
              <div className="space-y-4">
                {/* Filter Periode */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold">Periode Waktu</Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Pilih Periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pekan_ini">Pekan Ini</SelectItem>
                      <SelectItem value="bulan_ini">Bulan Ini</SelectItem>
                      <SelectItem value="semua">Semua Waktu</SelectItem>
                      <SelectItem value="kustom">Kustom Tanggal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter Halaqah (Admin Only) */}
                {role === "admin" && (
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold">Pilih Halaqah</Label>
                    <Select value={selectedHalaqah} onValueChange={setSelectedHalaqah}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Semua Halaqah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Halaqah</SelectItem>
                        {halaqahList.map((h) => (
                          <SelectItem key={h.id_halaqah} value={String(h.id_halaqah)}>
                            {h.name_halaqah}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Kustom Date Picker Range */}
                {period === "kustom" && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold">Dari Tanggal</Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-semibold">Sampai Tanggal</Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                )}

                {/* Toggle Top Per Halaqah (Admin Only) */}
                {role === "admin" && (
                  <div className="flex items-center space-x-2 pt-3 border-t">
                    <Checkbox
                      id="top-per-halaqah-toggle"
                      checked={topPerHalaqah}
                      onCheckedChange={(checked) => setTopPerHalaqah(!!checked)}
                    />
                    <Label htmlFor="top-per-halaqah-toggle" className="text-sm font-medium cursor-pointer">
                      1 Santri Teratas Per Halaqah
                    </Label>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handlePrint} variant="outline" size="sm" className="shadow-sm h-9">
            <Printer className="mr-2 h-4 w-4" />
            Cetak Peringkat
          </Button>
        </div>
      </div>

      {/* 2. LOADING STATE */}
      {isLoading ? (
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </CardContent>
        </Card>
      ) : filteredLeaderboard.length === 0 ? (
        /* EMPTY STATE */
        <Card className="text-center py-12">
          <CardContent className="space-y-3">
            <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-950/20 flex items-center justify-center mx-auto text-yellow-600">
              {searchQuery ? <Search className="h-6 w-6" /> : <Trophy className="h-6 w-6" />}
            </div>
            <h3 className="text-lg font-semibold">
              {searchQuery ? "Tidak Ditemukan Hasil" : "Papan Peringkat Kosong"}
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {searchQuery 
                ? `Tidak ada nama santri "${searchQuery}" yang cocok.` 
                : "Belum ada data setoran yang tercatat pada rentang waktu ini. Silakan catat setoran baru terlebih dahulu."}
            </p>
          </CardContent>
        </Card>
      ) : (
        /* CONTENT FOUND: TABEL PERINGKAT */
        <div className="space-y-6">
          {/* 3 Card Teratas (Hanya jika tidak sedang mencari atau filter perwakilan halaqah) */}
          {!searchQuery && !topPerHalaqah && (topThree.gold || topThree.silver || topThree.bronze) && (
            <div className="grid gap-4 md:grid-cols-3 no-print">
              {/* RANK 1 */}
              {topThree.gold && (
                <Card className="shadow-sm">
                  <CardContent className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-base truncate">{topThree.gold.nama_santri}</div>
                      <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{topThree.gold.nama_halaqah}</div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t mt-3">
                      <span className="text-muted-foreground">{topThree.gold.total_setoran_count}x setoran</span>
                      <span className="font-bold">{topThree.gold.total_halaman.toFixed(1)} halaman</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* RANK 2 */}
              {topThree.silver && (
                <Card className="shadow-sm">
                  <CardContent className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-base truncate">{topThree.silver.nama_santri}</div>
                      <Trophy className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{topThree.silver.nama_halaqah}</div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t mt-3">
                      <span className="text-muted-foreground">{topThree.silver.total_setoran_count}x setoran</span>
                      <span className="font-bold">{topThree.silver.total_halaman.toFixed(1)} halaman</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* RANK 3 */}
              {topThree.bronze && (
                <Card className="shadow-sm">
                  <CardContent className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-base truncate">{topThree.bronze.nama_santri}</div>
                      <Trophy className="h-5 w-5 text-orange-400 flex-shrink-0" />
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{topThree.bronze.nama_halaqah}</div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t mt-3">
                      <span className="text-muted-foreground">{topThree.bronze.total_setoran_count}x setoran</span>
                      <span className="font-bold">{topThree.bronze.total_halaman.toFixed(1)} halaman</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* TABEL PERINGKAT */}
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20 text-center font-bold">Rank</TableHead>
                    <TableHead className="font-semibold">Nama Santri</TableHead>
                    <TableHead className="font-semibold">Halaqah</TableHead>
                    {role === "admin" && (
                      <TableHead className="font-semibold">Muhafiz / Pembimbing</TableHead>
                    )}
                    <TableHead className="text-center font-semibold">Total Setoran</TableHead>
                    <TableHead className="text-right font-semibold pr-6">Total Halaman</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaderboard.map((item) => (
                    <TableRow key={item.id_santri} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="text-center font-bold">
                        {item.rank === 1 ? (
                          <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white font-extrabold shadow-sm">1</Badge>
                        ) : item.rank === 2 ? (
                          <Badge className="bg-slate-400 hover:bg-slate-400 text-white font-extrabold shadow-sm">2</Badge>
                        ) : item.rank === 3 ? (
                          <Badge className="bg-orange-400 hover:bg-orange-400 text-white font-extrabold shadow-sm">3</Badge>
                        ) : (
                          item.rank
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">{item.nama_santri}</TableCell>
                      <TableCell className="text-muted-foreground">{item.nama_halaqah}</TableCell>
                      {role === "admin" && (
                        <TableCell className="text-muted-foreground">{item.nama_muhafiz}</TableCell>
                      )}
                      <TableCell className="text-center font-medium">{item.total_setoran_count} kali</TableCell>
                      <TableCell className="text-right font-bold pr-6 text-primary">
                        {item.total_halaman.toFixed(1)} hal
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
