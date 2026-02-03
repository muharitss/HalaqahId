import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { displayService } from "@/services/displayService";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDate, 
  parseISO 
} from "date-fns";
import { id as localeId } from "date-fns/locale";

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Recharts
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Icons
import { ArrowLeft, BookOpen, PieChart as ChartIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// CONFIGURATION: Centralized status for consistency between Chart and Table
const STATUS_CONFIG = {
  HADIR: { label: "Hadir", color: "#10b981", bg: "bg-emerald-500" },
  IZIN: { label: "Izin", color: "#3b82f6", bg: "bg-blue-500" },
  SAKIT: { label: "Sakit", color: "#f59e0b", bg: "bg-amber-500" },
  TERLAMBAT: { label: "Terlambat", color: "#f97316", bg: "bg-orange-500" },
  ALFA: { label: "Alfa", color: "#ef4444", bg: "bg-red-500" },
};

const SantriDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [santri, setSantri] = useState<any>(null);
  const [allSetoran, setAllSetoran] = useState<any[]>([]);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [monthlyAbsensi, setMonthlyAbsensi] = useState<any[]>([]);
  const [isLoadingAbsensi, setIsLoadingAbsensi] = useState(false);

  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(viewDate),
      end: endOfMonth(viewDate)
    });
  }, [viewDate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resSantri, resSetoran] = await Promise.all([
        displayService.getSantriList(),
        displayService.getSetoranAll(),
      ]);

      const currentSantri = resSantri.find((s: any) => String(s.id_santri) === String(id));
      
      if (!currentSantri) {
        setSantri(null);
        return;
      }

      setSantri(currentSantri);
      const filteredSetoran = resSetoran.filter(
        (set: any) => set.nama_santri === currentSantri.nama_santri
      );
      setAllSetoran(filteredSetoran);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMonthlyAbsensi = useCallback(async () => {
    if (!santri) return;

    setIsLoadingAbsensi(true);
    try {
      const halaqahList = await displayService.getHalaqahList();
      const currentHalaqah = halaqahList.find((h: any) => h.nama_halaqah === santri.nama_halaqah);

      if (!currentHalaqah) return;

      const requests = daysInMonth.map(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        return displayService.getAbsensiByHalaqah(currentHalaqah.id_halaqah, dateStr)
          .then(res => ({ tanggal: dateStr, data: res }))
          .catch(() => ({ tanggal: dateStr, data: [] }));
      });

      const results = await Promise.all(requests);
      setMonthlyAbsensi(results);
    } catch (err) {
      console.error("Error fetching absensi:", err);
    } finally {
      setIsLoadingAbsensi(false);
    }
  }, [santri, daysInMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchMonthlyAbsensi(); }, [fetchMonthlyAbsensi]);

  const chartData = useMemo(() => {
    const stats = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
    monthlyAbsensi.forEach(day => {
      const record = day.data?.find((item: any) => item.nama_santri === santri?.nama_santri);
      if (record?.status && stats.hasOwnProperty(record.status)) {
        stats[record.status as keyof typeof stats]++;
      }
    });

    return [
      { name: "Hadir", value: stats.HADIR, fill: STATUS_CONFIG.HADIR.color },
      { name: "Izin", value: stats.IZIN, fill: STATUS_CONFIG.IZIN.color },
      { name: "Sakit", value: stats.SAKIT, fill: STATUS_CONFIG.SAKIT.color },
      { name: "Terlambat", value: stats.TERLAMBAT, fill: STATUS_CONFIG.TERLAMBAT.color },
      { name: "Alfa", value: stats.ALFA, fill: STATUS_CONFIG.ALFA.color },
    ].filter(d => d.value > 0);
  }, [monthlyAbsensi, santri]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Skeleton className="h-12 w-12 rounded-full" /></div>;
  if (!santri) return <div className="p-20 text-center text-muted-foreground">Data santri dengan ID {id} tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 transition-colors duration-300">
      <div className="mx-auto max-w-5xl space-y-6">
        
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/display")} className="gap-2 hover:bg-card">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
          <ThemeToggle />
        </div>

        <Card className="border-none shadow-sm bg-linear-to-br from-card to-muted/20">
          <CardContent className="p-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-sm">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl">
                    {santri.nama_santri.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight uppercase">{santri.nama_santri}</h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                      {santri.nama_halaqah}
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground">
                      Telp: {santri.nomor_telepon || "-"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Statistik Kehadiran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-55">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={60} outerRadius={80} dataKey="value" stroke="none" paddingAngle={5}>
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-muted-foreground italic">
                     <ChartIcon className="h-8 w-8 mb-2 opacity-20" />
                     <p className="text-xs">Data belum tersedia</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Rekap Harian {format(viewDate, "MMMM yyyy", { locale: localeId })}
              </CardTitle>
              <Select value={format(viewDate, "yyyy-MM")} onValueChange={(v) => setViewDate(new Date(v))}>
                <SelectTrigger className="w-40 h-9 bg-muted/50 border-none shadow-none focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const d = new Date(); d.setMonth(d.getMonth() - i);
                    return <SelectItem key={i} value={format(d, "yyyy-MM")}>{format(d, "MMMM yyyy", { locale: localeId })}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
               <div className="relative overflow-x-auto rounded-lg border border-muted/50 scrollbar-thin">
                  <Table className="border-separate border-spacing-0">
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        {daysInMonth.map((date) => (
                          <TableHead key={date.toString()} className="h-10 border-r p-0 text-center text-[10px] font-bold min-w-8">
                            {getDate(date)}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-transparent">
                        {isLoadingAbsensi ? (
                          daysInMonth.map((d) => <TableCell key={d.toString()} className="border-r p-1"><Skeleton className="h-8 w-full" /></TableCell>)
                        ) : (
                          daysInMonth.map((date) => {
                            const dateStr = format(date, "yyyy-MM-dd");
                            const record = monthlyAbsensi.find(m => m.tanggal === dateStr)?.data?.find((s: any) => s.nama_santri === santri.nama_santri);
                            const status = record?.status as keyof typeof STATUS_CONFIG;
                            
                            return (
                              <TableCell key={date.toString()} className={cn(
                                "h-12 border-r p-0 text-center text-[11px] font-extrabold transition-colors border-b",
                                status ? `${STATUS_CONFIG[status].bg} text-white` : "text-muted-foreground/20 bg-muted/5"
                              )}>
                                {status ? status.charAt(0) : "-"}
                              </TableCell>
                            );
                          })
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
               </div>
               <div className="mt-4 flex flex-wrap gap-3 text-[10px] font-medium text-muted-foreground">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-1">
                      <div className={cn("h-2 w-2 rounded-full", config.bg)} /> {config.label}
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>

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
                {allSetoran.length > 0 ? (
                  allSetoran.map((s) => (
                    <TableRow key={s.id_setoran} className="hover:bg-muted/5">
                      <TableCell className="text-xs font-medium">
                        {s.tanggal ? format(parseISO(s.tanggal), "dd MMM yyyy", { locale: localeId }) : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-sm text-foreground uppercase">{s.surat}</div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase">Juz {s.juz} • Ayat {s.ayat}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={s.kategori === 'HAFALAN' ? 'default' : 'secondary'} className="text-[9px] px-2 py-0">
                          {s.kategori}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={3} className="h-32 text-center text-muted-foreground italic">Tidak ada data setoran ditemukan</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SantriDetail;