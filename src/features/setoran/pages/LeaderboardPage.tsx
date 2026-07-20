import { useLeaderboardPage } from "../hooks/useLeaderboardPage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Trophy, Medal, Printer, Users, Award, BookOpen } from "lucide-react";

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
    leaderboardData,
    filteredLeaderboard,
    isLoading,
    topThree,
    listRemaining,
    setPeriod,
    setStartDate,
    setEndDate,
    setSelectedHalaqah,
    setTopPerHalaqah,
    setSearchQuery,
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
          .podium-container {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-around !important;
            border: 1px solid #ccc !important;
            padding: 15px !important;
            margin-bottom: 20px !important;
            border-radius: 8px !important;
            background: #fafafa !important;
          }
          .podium-card {
            border: 1px solid #ddd !important;
            padding: 10px !important;
            text-align: center !important;
            flex: 1 !important;
            margin: 0 10px !important;
            background: white !important;
            border-radius: 6px !important;
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
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h1 className="text-2xl font-bold tracking-tight">Leaderboard Hafalan Santri</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {role === "admin"
              ? "Peringkat hafalan santri secara keseluruhan atau per halaqah."
              : "Peringkat hafalan santri khusus di halaqah Anda."}
          </p>
        </div>
        <Button onClick={handlePrint} variant="outline" size="sm" className="shadow-sm">
          <Printer className="mr-2 h-4 w-4" />
          Cetak Peringkat
        </Button>
      </div>

      {/* 1. FILTER BAR (no-print) */}
      <Card className="no-print shadow-sm">
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
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

            {/* Kolom Pencarian */}
            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-2">
              <Label className="text-xs font-semibold">Cari Nama Santri</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ketik nama santri..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Kustom Date Picker Range */}
          {period === "kustom" && (
            <div className="grid gap-4 md:grid-cols-2 p-4 bg-muted/40 rounded-lg animate-in fade-in duration-200">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold">Dari Tanggal</Label>
                <input
                  type="date"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold">Sampai Tanggal</Label>
                <input
                  type="date"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Toggle Top Per Halaqah (Admin Only) */}
          {role === "admin" && (
            <div className="flex items-center space-x-2 pt-2 border-t">
              <Checkbox
                id="top-per-halaqah-toggle"
                checked={topPerHalaqah}
                onCheckedChange={(checked) => setTopPerHalaqah(!!checked)}
              />
              <Label htmlFor="top-per-halaqah-toggle" className="text-sm font-medium cursor-pointer">
                Tampilkan Hanya Perwakilan Terbaik (1 Santri Teratas Per Halaqah)
              </Label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. LOADING STATE */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : leaderboardData.length === 0 ? (
        /* EMPTY STATE */
        <Card className="text-center py-12">
          <CardContent className="space-y-3">
            <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-950/20 flex items-center justify-center mx-auto text-yellow-600">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Papan Peringkat Kosong</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Belum ada data setoran yang tercatat pada rentang waktu ini. Silakan catat setoran baru terlebih dahulu.
            </p>
          </CardContent>
        </Card>
      ) : (
        /* CONTENT FOUND */
        <div className="space-y-6">
          {/* A. PODIUM TOP 3 (Kecuali jika pencarian menyaring peringkat atau jika mode perwakilan halaqah aktif) */}
          {!searchQuery && !topPerHalaqah && (
            <div className="podium-container grid gap-4 md:grid-cols-3 items-end pt-4 print:flex print:flex-row print:justify-around">
              {/* RANK 2: PERAK */}
              {topThree.silver ? (
                <Card className="podium-card order-2 md:order-1 border-slate-200 bg-gradient-to-b from-slate-50/50 to-background dark:from-slate-900/10 dark:to-background border-t-4 border-t-slate-400 shadow-sm relative overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:shadow-md">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="absolute top-2 right-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center border border-slate-300">
                      2
                    </div>
                    <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-300 text-slate-500 shadow-inner">
                      <Medal className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base truncate">{topThree.silver.nama_santri}</h3>
                      <p className="text-xs text-muted-foreground truncate">{topThree.silver.nama_halaqah}</p>
                    </div>
                    <div className="bg-slate-100/50 dark:bg-slate-800/30 rounded-lg p-2">
                      <div className="text-xl font-extrabold text-slate-700 dark:text-slate-300">
                        {topThree.silver.total_halaman.toFixed(1)}
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Halaman</div>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex justify-center items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                      <span>{topThree.silver.total_setoran_count}x Setoran</span>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="order-2 md:order-1 hidden md:block" />
              )}

              {/* RANK 1: EMAS (Lebih tinggi/menonjol) */}
              {topThree.gold ? (
                <Card className="podium-card order-1 md:order-2 border-yellow-200 bg-gradient-to-b from-yellow-50/40 to-background dark:from-yellow-950/5 dark:to-background border-t-4 border-t-yellow-500 shadow-md relative overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg md:-translate-y-4">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300" />
                  <CardContent className="pt-8 text-center space-y-4">
                    <div className="absolute top-2 right-2 bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 font-extrabold text-sm h-7 w-7 rounded-full flex items-center justify-center border border-yellow-400 animate-pulse">
                      1
                    </div>
                    <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center border-2 border-yellow-400 text-yellow-600 shadow-md">
                      <Trophy className="h-8 w-8 text-yellow-500 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg truncate text-amber-800 dark:text-amber-500">
                        {topThree.gold.nama_santri}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate font-medium">{topThree.gold.nama_halaqah}</p>
                    </div>
                    <div className="bg-yellow-100/50 dark:bg-yellow-950/20 rounded-lg p-2.5 border border-yellow-200/50">
                      <div className="text-2xl font-black text-amber-600 dark:text-amber-500">
                        {topThree.gold.total_halaman.toFixed(1)}
                      </div>
                      <div className="text-[10px] uppercase font-extrabold tracking-wider text-amber-700/80">Halaman</div>
                    </div>
                    <div className="text-[11px] font-medium text-muted-foreground flex justify-center items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                      <span>{topThree.gold.total_setoran_count}x Setoran</span>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="order-1 md:order-2 hidden md:block" />
              )}

              {/* RANK 3: PERUNGGU */}
              {topThree.bronze ? (
                <Card className="podium-card order-3 border-orange-200 bg-gradient-to-b from-orange-50/50 to-background dark:from-orange-950/10 dark:to-background border-t-4 border-t-orange-400 shadow-sm relative overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:shadow-md">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="absolute top-2 right-2 bg-orange-100 dark:bg-slate-800 text-orange-700 dark:text-orange-400 font-bold text-xs h-6 w-6 rounded-full flex items-center justify-center border border-orange-300">
                      3
                    </div>
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center border border-orange-300 text-orange-600 shadow-inner">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base truncate">{topThree.bronze.nama_santri}</h3>
                      <p className="text-xs text-muted-foreground truncate">{topThree.bronze.nama_halaqah}</p>
                    </div>
                    <div className="bg-orange-100/50 dark:bg-orange-900/10 rounded-lg p-2">
                      <div className="text-xl font-extrabold text-orange-700 dark:text-orange-400">
                        {topThree.bronze.total_halaman.toFixed(1)}
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-orange-600">Halaman</div>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex justify-center items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-orange-400" />
                      <span>{topThree.bronze.total_setoran_count}x Setoran</span>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="order-3 hidden md:block" />
              )}
            </div>
          )}

          {/* B. TABEL PERINGKAT */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b no-print">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>Peringkat Setoran</span>
              </CardTitle>
              <CardDescription>
                Daftar lengkap santri diurutkan berdasarkan akumulasi halaman setoran.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center font-bold">Rank</TableHead>
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
                  {/* Tampilkan podium teratas juga dalam tabel jika ada pencarian atau jika mode perwakilan halaqah aktif agar tidak tersembunyi */}
                  {(searchQuery || topPerHalaqah) && filteredLeaderboard.map((item) => (
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

                  {/* Tampilan normal jika tidak dicari dan bukan mode perwakilan halaqah: Tampilkan ranks 4+ */}
                  {!searchQuery && !topPerHalaqah && (
                    <>
                      {/* Tampilkan top 3 di tabel khusus untuk cetak kertas/print */}
                      <tr className="hidden print:table-row font-bold bg-yellow-50/50">
                        <td className="text-center p-3 border-b">1</td>
                        <td className="p-3 border-b">{topThree.gold?.nama_santri}</td>
                        <td className="p-3 border-b">{topThree.gold?.nama_halaqah}</td>
                        {role === "admin" && <td className="p-3 border-b">{topThree.gold?.nama_muhafiz}</td>}
                        <td className="text-center p-3 border-b">{topThree.gold?.total_setoran_count} kali</td>
                        <td className="text-right pr-6 p-3 border-b">{topThree.gold?.total_halaman.toFixed(1)} hal</td>
                      </tr>
                      <tr className="hidden print:table-row font-bold bg-slate-50/50">
                        <td className="text-center p-3 border-b">2</td>
                        <td className="p-3 border-b">{topThree.silver?.nama_santri}</td>
                        <td className="p-3 border-b">{topThree.silver?.nama_halaqah}</td>
                        {role === "admin" && <td className="p-3 border-b">{topThree.silver?.nama_muhafiz}</td>}
                        <td className="text-center p-3 border-b">{topThree.silver?.total_setoran_count} kali</td>
                        <td className="text-right pr-6 p-3 border-b">{topThree.silver?.total_halaman.toFixed(1)} hal</td>
                      </tr>
                      <tr className="hidden print:table-row font-bold bg-orange-50/30">
                        <td className="text-center p-3 border-b">3</td>
                        <td className="p-3 border-b">{topThree.bronze?.nama_santri}</td>
                        <td className="p-3 border-b">{topThree.bronze?.nama_halaqah}</td>
                        {role === "admin" && <td className="p-3 border-b">{topThree.bronze?.nama_muhafiz}</td>}
                        <td className="text-center p-3 border-b">{topThree.bronze?.total_setoran_count} kali</td>
                        <td className="text-right pr-6 p-3 border-b">{topThree.bronze?.total_halaman.toFixed(1)} hal</td>
                      </tr>

                      {/* Baris Peringkat 4 ke Bawah */}
                      {listRemaining.map((item) => (
                        <TableRow key={item.id_santri} className="hover:bg-muted/40 transition-colors">
                          <TableCell className="text-center font-bold text-muted-foreground">{item.rank}</TableCell>
                          <TableCell className="font-semibold text-foreground">{item.nama_santri}</TableCell>
                          <TableCell className="text-muted-foreground">{item.nama_halaqah}</TableCell>
                          {role === "admin" && (
                            <TableCell className="text-muted-foreground">{item.nama_muhafiz}</TableCell>
                          )}
                          <TableCell className="text-center font-medium text-muted-foreground">
                            {item.total_setoran_count} kali
                          </TableCell>
                          <TableCell className="text-right font-bold pr-6 text-foreground/80">
                            {item.total_halaman.toFixed(1)} hal
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}

                  {/* Jika hasil filter kosong */}
                  {!searchQuery && listRemaining.length === 0 && !topThree.gold && !topThree.silver && !topThree.bronze && (
                    <TableRow>
                      <TableCell colSpan={role === "admin" ? 6 : 5} className="text-center py-6 text-muted-foreground">
                        Tidak ada santri yang sesuai kriteria pencarian
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
