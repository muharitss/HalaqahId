"use client"

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { akunService, type Muhafiz } from "@/services/akunService";

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

// Recharts Components
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChartLine, faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";

// 1. Konfigurasi Chart: Menghubungkan variabel CSS ke Chart
const chartConfig = {
  setoran: { 
    label: "Total Setoran", 
    color: "var(--primary)"
  },
  juz30: { label: "Juz 30", color: "var(--primary)" },
  juzLow: { label: "Juz 1-5", color: "color-mix(in srgb, var(--primary), transparent 30%)" },
  juzMid: { label: "Juz 6-10", color: "color-mix(in srgb, var(--primary), transparent 60%)" },
  juzHigh: { label: "Juz 10+", color: "color-mix(in srgb, var(--primary), transparent 80%)" },
} satisfies ChartConfig;

const dataSetoranMingguan = [
  { day: "Senin", setoran: 145 },
  { day: "Selasa", setoran: 152 },
  { day: "Rabu", setoran: 138 },
  { day: "Kamis", setoran: 165 },
  { day: "Jumat", setoran: 148 },
  { day: "Sabtu", setoran: 80 },
];

const dataDistribusiHafalan = [
  { category: "juz30", santri: 80 },
  { category: "juzLow", santri: 45 },
  { category: "juzMid", santri: 25 },
  { category: "juzHigh", santri: 15 },
];

export default function KepalaMuhafidzDashboard() {
  const [muhafizData, setMuhafizData] = useState<Muhafiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    akunService.getAllMuhafiz().then(res => {
      if (res.success) setMuhafizData(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Dashboard Utama</h2>
          <p className="text-muted-foreground">Analisis data halaqah dan performa muhafidz.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FontAwesomeIcon icon={faChartLine} className="text-primary" />
              Aktivitas Setoran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={dataSetoranMingguan}>
                <CartesianGrid vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="setoran" 
                  fill="var(--color-setoran)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40} 
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FontAwesomeIcon icon={faUsersViewfinder} className="text-primary" />
              Progres Santri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie 
                  data={dataDistribusiHafalan} 
                  dataKey="santri" 
                  nameKey="category" 
                  innerRadius={60} 
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {dataDistribusiHafalan.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`var(--color-${entry.category})`} 
                    />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} className="text-xs" />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabel */}
      <Card className="shadow-none border-none bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10 py-4 px-6">
          <CardTitle className="text-base font-semibold">Muhafidz Baru Terdaftar</CardTitle>
          <Button variant="link" size="sm" asChild className="text-primary">
            <Link to="/kelola-muhafiz">Lihat Semua <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-3 w-3" /></Link>
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
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10">Memuat data...</TableCell></TableRow>
              ) : (
                muhafizData.slice(0, 5).map((m) => (
                  <TableRow key={m.id_user} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="pl-6"><Badge variant="outline" className="border-primary/20">#{m.id_user}</Badge></TableCell>
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