"use client"

import * as React from "react";
import { Link } from "react-router-dom";
import { akunService, type Muhafiz } from "@/services/akunService";
import { useSetoran } from "@/hooks/useSetoran";

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChartLine, faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";

// 1. Konfigurasi Chart tetap menggunakan variabel CSS
const chartConfig = {
  setoran: { label: "Total Setoran", color: "var(--primary)" },
  hafalan: { label: "Hafalan Baru", color: "var(--primary)" },
  murajaah: { label: "Murajaah", color: "color-mix(in srgb, var(--primary), transparent 50%)" },
} satisfies ChartConfig;

export default function KepalaMuhafidzDashboard() {
  const [muhafizData, setMuhafizData] = React.useState<Muhafiz[]>([]);
  const { allSetoran, fetchAllSetoran, loading: loadingSetoran } = useSetoran();
  const [loadingAkun, setLoadingAkun] = React.useState(true);

  React.useEffect(() => {
    // Ambil data Muhafidz & Setoran
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

  // Logika 1: Data Setoran Mingguan Riil dari Backend
  const dataSetoranMingguan = React.useMemo(() => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const counts: Record<string, number> = {};
    days.forEach(d => counts[d] = 0);

    allSetoran.forEach(s => {
      const d = new Date(s.tanggal_setoran);
      counts[days[d.getDay()]]++;
    });

    return days.map(day => ({ day, setoran: counts[day] }));
  }, [allSetoran]);

  // Logika 2: Distribusi Kategori Riil (Hafalan vs Murajaah)
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
          <h2 className="text-3xl font-bold tracking-tight text-primary">Dashboard Utama</h2>
          <p className="text-muted-foreground">Analisis data halaqah dan performa muhafidz.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar Chart - Aktivitas Setoran Mingguan */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FontAwesomeIcon icon={faChartLine} className="text-primary" />
              Aktivitas Setoran
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSetoran ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={dataSetoranMingguan}>
                  <CartesianGrid vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="setoran" 
                    fill="var(--primary)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40} 
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart - Distribusi Kategori Setoran */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FontAwesomeIcon icon={faUsersViewfinder} className="text-primary" />
              Kategori Setoran
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSetoran ? (
              <Skeleton className="h-[250px] w-[250px] rounded-full mx-auto" />
            ) : (
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
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
      <Card className="shadow-none border-none bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10 py-4 px-6">
          <CardTitle className="text-base font-semibold">Muhafidz Baru Terdaftar</CardTitle>
          <Button variant="link" size="sm" asChild className="text-primary">
            <Link to="/kelola-muhafiz">
              Lihat Semua <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/5">
              <TableRow>
                <TableHead className="pl-6">ID</TableHead>
                <TableHead>Nama Muhafidz</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingAkun ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    <Skeleton className="h-20 w-full" />
                  </TableCell>
                </TableRow>
              ) : muhafizData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    Belum ada muhafidz terdaftar.
                  </TableCell>
                </TableRow>
              ) : (
                muhafizData.slice(0, 5).map((m) => (
                  <TableRow key={m.id_user} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="pl-6">
                      <Badge variant="outline" className="border-primary/20 font-mono">
                        #{m.id_user}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{m.username}</TableCell>
                    <TableCell className="text-muted-foreground">{m.email}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2 text-primary font-medium">
                        <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                        Aktif
                      </div>
                    </TableCell>
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