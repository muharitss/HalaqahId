"use client";

import { PieChart, Pie, Cell, Label } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCheck, Clock, Calendar } from "lucide-react";
import type { AbsensiStat, ViewType } from "../types";
import { cn } from "@/lib/utils";

const chartConfig = {
  HADIR: { label: "Hadir", color: "#22c55e" },      
  IZIN: { label: "Izin", color: "#3b82f6" },       
  SAKIT: { label: "Sakit", color: "#eab308" },     
  TERLAMBAT: { label: "Terlambat", color: "#f97316" }, 
  ALFA: { label: "Alfa", color: "#ef4444" },       
} satisfies ChartConfig;

interface AttendanceDonutChartProps {
  data: AbsensiStat[];
  loading: boolean;
  totalCount: number;
  view: ViewType;
  onViewChange: (value: ViewType) => void;
  className?: string;
}

export const AttendanceDonutChart = ({ 
  data, 
  loading, 
  totalCount, 
  view, 
  onViewChange,
  className
}: AttendanceDonutChartProps) => {
  return (
    <Card className={cn("shadow-sm border border-border/70 bg-card rounded-xl overflow-hidden flex flex-col justify-between h-full min-w-0 w-full", className)}>
      <div>
        <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 pb-2">
          <div className="space-y-0.5 min-w-0 flex-1">
            <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground">
              <CheckCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span className="truncate">Rekap Absensi</span>
            </CardTitle>
            <CardDescription className="text-xs flex items-center gap-1 text-muted-foreground truncate">
              <Calendar className="h-3 w-3 shrink-0" />
              <span className="truncate">{view === "pekan" ? "Pekan Ini" : "Bulan Ini"}</span>
            </CardDescription>
          </div>
          
          <Tabs value={view} onValueChange={(v) => onViewChange(v as ViewType)}>
            <TabsList className="bg-muted/70 h-7 px-1">
              <TabsTrigger value="pekan" className="text-[10px] h-5 px-2">Pekan</TabsTrigger>
              <TabsTrigger value="bulan" className="text-[10px] h-5 px-2">Bulan</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="p-4 pt-1 pb-2 min-w-0 w-full">
          {loading ? (
            <div className="flex items-center justify-center h-[180px]">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="mx-auto h-[180px] min-w-0 w-full">
              <PieChart>
                <ChartTooltip 
                  cursor={false} 
                  content={<ChartTooltipContent hideLabel />} 
                />
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={48}
                  outerRadius={68}
                  strokeWidth={4}
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
                        const hadir = data.find((d) => d.status === "HADIR")?.count || 0;
                        const terlambat = data.find((d) => d.status === "TERLAMBAT")?.count || 0;
                        
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan 
                              x={viewBox.cx} 
                              y={viewBox.cy} 
                              className="fill-foreground text-2xl font-bold"
                            >
                              {hadir + terlambat}
                            </tspan>
                            <tspan 
                              x={viewBox.cx} 
                              y={(viewBox.cy || 0) + 16} 
                              className="fill-muted-foreground text-[9px]"
                            >
                              Total Hadir
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <ChartLegend 
                  content={<ChartLegendContent />} 
                  className="text-[10px] flex-wrap gap-x-2 gap-y-1 mt-1 justify-center" 
                />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </div>

      <div>
        <Separator className="my-0 opacity-60" />
        <div className="flex items-center text-xs text-muted-foreground px-4 py-2.5 gap-1.5">
          <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
          <p className="mb-0 text-xs text-muted-foreground truncate">
            Tercatat total <span className="font-semibold text-foreground">{totalCount}</span> log absensi santri
          </p>
        </div>
      </div>
    </Card>
  );
};
