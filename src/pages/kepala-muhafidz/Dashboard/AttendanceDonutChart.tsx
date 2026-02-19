"use client"

import { PieChart, Pie, Cell, Label } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

/**
 * Konfigurasi warna yang konsisten dengan standar tabel:
 * HADIR (Green), IZIN (Blue), SAKIT (Yellow), TERLAMBAT (Orange), ALFA (Red)
 */
const chartConfig = {
  HADIR: { label: "Hadir", color: "#22c55e" },      
  IZIN: { label: "Izin", color: "#3b82f6" },       
  SAKIT: { label: "Sakit", color: "#eab308" },     
  TERLAMBAT: { label: "Terlambat", color: "#f97316" }, 
  ALFA: { label: "Alfa", color: "#ef4444" },       
} satisfies ChartConfig;

export interface AbsensiStat {
  status: string;
  count: number;
  fill: string;
}

interface AttendanceDonutChartProps {
  data: AbsensiStat[];
  loading: boolean;
  totalCount: number;
  view: string;
  onViewChange: (value: string) => void;
}


export const AttendanceDonutChart = ({ 
  data, 
  loading, 
  totalCount, 
  view, 
  onViewChange 
}: AttendanceDonutChartProps) => {
  return (
    <Card className="lg:col-span-2 border-none shadow-sm bg-muted/20 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <FontAwesomeIcon icon={faCheckDouble} className="text-primary" />
              Rekap Absensi
            </CardTitle>
            <CardDescription className="text-[10px] flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-2.5 w-2.5" />
              {view === "pekan" ? "Pekan Ini" : "Bulan Ini"}
            </CardDescription>
          </div>
          
          <Tabs value={view} onValueChange={onViewChange}>
            <TabsList className="bg-background/50 h-7 px-1">
              <TabsTrigger value="pekan" className="text-[10px] h-5 px-2">Pekan</TabsTrigger>
              <TabsTrigger value="bulan" className="text-[10px] h-5 px-2">Bulan</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {loading ? (
          <div className="flex items-center justify-center h-70">
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-75">
            <PieChart>
              <ChartTooltip 
                cursor={false} 
                content={<ChartTooltipContent hideLabel />} 
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                innerRadius={65}
                outerRadius={85}
                strokeWidth={8}
                paddingAngle={2}
              >
                {data.map((entry, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill} 
                    stroke="transparent"
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      // Mencari data menggunakan uppercase key agar sinkron
                      const hadir = data.find((d) => d.status === "HADIR")?.count || 0;
                      const terlambat = data.find((d) => d.status === "TERLAMBAT")?.count || 0;

                      
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan 
                            x={viewBox.cx} 
                            y={viewBox.cy} 
                            className="fill-foreground text-3xl font-bold"
                          >
                            {hadir + terlambat}
                          </tspan>
                          <tspan 
                            x={viewBox.cx} 
                            y={(viewBox.cy || 0) + 20} 
                            className="fill-muted-foreground text-[10px]"
                          >
                            Total Presensi
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend 
                content={<ChartLegendContent />} 
                className="text-[10px] flex-wrap gap-x-2 gap-y-1 mt-4" 
              />
            </PieChart>
          </ChartContainer>
        )}
        
        <div className="text-center py-4 border-t border-primary/5 mt-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Akumulasi: <span className="font-bold text-foreground">{totalCount} catatan santri</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};