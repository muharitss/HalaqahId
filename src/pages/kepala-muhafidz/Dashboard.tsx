"use client"

import * as React from "react";
import { Link } from "react-router-dom";
import { akunService, type Muhafiz } from "@/services/akunService";
import { useSetoran } from "@/hooks/useSetoran";

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  type ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Recharts Components
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, Area, AreaChart } from "recharts";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChartLine, faUsersViewfinder, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Dashboard } from "@/components/ui/TypedText";

const chartConfig = {
  setoran: { label: "Total Setoran", color: "var(--primary)" },
  hafalan: { label: "Hafalan Baru", color: "var(--primary)" },
  murajaah: { label: "Murajaah", color: "color-mix(in srgb, var(--primary), transparent 50%)" },
} satisfies ChartConfig;

export default function KepalaMuhafidzDashboard() {
  const [muhafizData, setMuhafizData] = React.useState<Muhafiz[]>([]);
  const { allSetoran, fetchAllSetoran, loading: loadingSetoran } = useSetoran();
  const [loadingAkun, setLoadingAkun] = React.useState(true);
  const [chartView, setChartView] = React.useState("pekan");

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const res = await akunService.getAllMuhafiz();
        if (res.success) setMuhafizData(res.data);
        await fetchAllSetoran();
      } finally {
        setLoadingAkun(false);
      }
    };
    loadData();
  }, [fetchAllSetoran]);

  // --- LOGIKA FILTER TANGGAL ---
  
  // 1. Data Pekan Ini (Senin - Minggu)
  const dataPekanIni = React.useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    // Set ke Senin pekan ini
    startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const counts: Record<string, number> = {};
    days.forEach(d => counts[d] = 0);

    allSetoran.forEach(s => {
      const d = new Date(s.tanggal_setoran);
      if (d >= startOfWeek) {
        const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
        counts[days[dayIdx]]++;
      }
    });

    return days.map(day => ({ day, setoran: counts[day] }));
  }, [allSetoran]);

  // 2. Data Bulan Ini (Per 5 Hari atau Per Minggu dalam bulan)
  const dataBulanIni = React.useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Kelompokkan per tanggal
    const dayCounts: Record<number, number> = {};
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let i = 1; i <= lastDay; i++) dayCounts[i] = 0;

    allSetoran.forEach(s => {
      const d = new Date(s.tanggal_setoran);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        dayCounts[d.getDate()]++;
      }
    });

    return Object.keys(dayCounts).map(date => ({
      date: `Tgl ${date}`,
      setoran: dayCounts[parseInt(date)]
    }));
  }, [allSetoran]);

  // 3. Distribusi Kategori
  const dataDistribusiKategori = React.useMemo(() => {
    const hafalan = allSetoran.filter(s => s.kategori === "HAFALAN").length;
    const murajaah = allSetoran.filter(s => s.kategori === "MURAJAAH").length;
    return [
      { category: "hafalan", count: hafalan },
      { category: "murajaah", count: murajaah },
    ];
  }, [allSetoran]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Dashboard/>
          <p className="text-muted-foreground">Analisis data halaqah dan performa muhafidz.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Aktivitas Setoran Card */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-muted/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <FontAwesomeIcon icon={faChartLine} className="text-primary" />
                Aktivitas Setoran
              </CardTitle>
              <CardDescription className="text-xs flex items-center gap-1">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
                {chartView === "pekan" ? "Senin - Minggu Ini" : "Tren Bulan Ini"}
              </CardDescription>
            </div>
            <Tabs defaultValue="pekan" onValueChange={setChartView}>
              <TabsList className="bg-background/50 h-8">
                <TabsTrigger value="pekan" className="text-[10px] h-6">Pekan</TabsTrigger>
                <TabsTrigger value="bulan" className="text-[10px] h-6">Bulan</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {loadingSetoran ? (
              <Skeleton className="h-62.5 w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-62.5 w-full">
                {chartView === "pekan" ? (
                  <BarChart data={dataPekanIni}>
                    <CartesianGrid vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="setoran" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                ) : (
                  <AreaChart data={dataBulanIni}>
                    <defs>
                      <linearGradient id="colorSetoran" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="date" hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="setoran" stroke="var(--primary)" fillOpacity={1} fill="url(#colorSetoran)" />
                  </AreaChart>
                )}
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Kategori Setoran Card */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FontAwesomeIcon icon={faUsersViewfinder} className="text-primary" />
              Kategori Setoran
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSetoran ? (
              <Skeleton className="h-62.5 w-62.5 rounded-full mx-auto" />
            ) : (
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-62.5">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie 
                    data={dataDistribusiKategori} 
                    dataKey="count" 
                    nameKey="category" 
                    innerRadius={60} 
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {dataDistribusiKategori.map((_entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? "var(--primary)" : "color-mix(in srgb, var(--primary), white 60%)"} 
                      />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} className="text-xs" />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabel Muhafidz Baru */}
      <Card className="shadow-none border-none bg-card/50 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10 py-4 px-6">
          <CardTitle className="text-base font-semibold">Muhafidz Baru Terdaftar</CardTitle>
          <Button variant="link" size="sm" asChild className="text-primary">
            <Link to="muhafiz">
              Lihat Semua <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/5">
              <TableRow>
                <TableHead className="pl-6">ID</TableHead>
                <TableHead>Nama Muhafidz</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingAkun ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                ))
              ) : muhafizData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Belum ada muhafidz.</TableCell>
                </TableRow>
              ) : (
                muhafizData.slice(0, 5).map((m) => (
                  <TableRow key={m.id_user} className="hover:bg-primary/5 transition-colors group">
                    <TableCell className="pl-6">
                      <Badge variant="outline" className="border-primary/20 font-mono group-hover:bg-primary group-hover:text-white transition-colors">
                        #{m.id_user}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{m.username}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{m.email}</TableCell>
                    <TableCell className="text-right pr-6 font-medium text-primary text-sm">● Aktif</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}