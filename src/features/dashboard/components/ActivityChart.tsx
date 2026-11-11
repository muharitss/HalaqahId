import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Clock, Calendar } from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  type ChartConfig 
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Area, AreaChart } from "recharts";
import type { PekanData, BulanData, ViewType } from "../types";
import { cn } from "@/lib/utils";

const chartConfig = {
  setoran: { label: "Total Setoran", color: "var(--primary)" },
} satisfies ChartConfig;

interface ActivityChartProps {
  dataPekan: PekanData[];
  dataBulan: BulanData[];
  view: ViewType;
  onViewChange: (val: ViewType) => void;
  loading: boolean;
  className?: string;
}

export const ActivityChart = ({ 
  dataPekan, 
  dataBulan, 
  view, 
  onViewChange, 
  loading,
  className
}: ActivityChartProps) => (
  <Card className={cn("shadow-sm border border-border/70 bg-card rounded-xl overflow-hidden flex flex-col justify-between h-full min-w-0 w-full", className)}>
    <div>
      <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 pb-2">
        <div className="space-y-0.5 min-w-0 flex-1">
          <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground">
            <TrendingUp className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">Aktivitas Setoran</span>
          </CardTitle>
          <CardDescription className="text-xs flex items-center gap-1 text-muted-foreground truncate">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="truncate">{view === "pekan" ? "Senin - Minggu Ini" : "Tren Bulan Ini"}</span>
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
          <Skeleton className="h-[180px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[180px] w-full min-w-0">
            {view === "pekan" ? (
              <BarChart 
                data={dataPekan} 
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeOpacity={0.1} />
                <XAxis 
                  dataKey="day" 
                  tickLine={false} 
                  axisLine={false} 
                  fontSize={11}
                  dy={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="setoran" 
                  fill="var(--primary)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={24} 
                />
              </BarChart>
            ) : (
              <AreaChart 
                data={dataBulan}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSetoran" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="date" hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="setoran" 
                  stroke="var(--primary)" 
                  fillOpacity={1} 
                  fill="url(#colorSetoran)" 
                />
              </AreaChart>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </div>

    <div>
      <Separator className="my-0 opacity-60" />
      <div className="flex items-center text-xs text-muted-foreground px-4 py-2.5 gap-1.5">
        <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
        <p className="mb-0 text-xs text-muted-foreground truncate">
          {view === "pekan" ? "Diperbarui otomatis sepekan terakhir" : "Akumulasi volume setoran bulan ini"}
        </p>
      </div>
    </div>
  </Card>
);
