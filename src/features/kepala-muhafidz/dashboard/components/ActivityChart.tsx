import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  type ChartConfig 
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Area, AreaChart } from "recharts";
import type { PekanData, BulanData, ViewType } from "../types";

const chartConfig = {
  setoran: { label: "Total Setoran", color: "var(--primary)" },
} satisfies ChartConfig;

interface ActivityChartProps {
  dataPekan: PekanData[];
  dataBulan: BulanData[];
  view: ViewType;
  onViewChange: (val: ViewType) => void;
  loading: boolean;
}

export const ActivityChart = ({ 
  dataPekan, 
  dataBulan, 
  view, 
  onViewChange, 
  loading 
}: ActivityChartProps) => (
  <Card className="lg:col-span-3 border-none shadow-sm bg-muted/20">
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base">
          <FontAwesomeIcon icon={faChartLine} className="text-primary" />
          Aktivitas Setoran
        </CardTitle>
        <CardDescription className="text-xs flex items-center gap-1">
          <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
          {view === "pekan" ? "Senin - Minggu Ini" : "Tren Bulan Ini"}
        </CardDescription>
      </div>
      <Tabs value={view} onValueChange={(v) => onViewChange(v as ViewType)}>
        <TabsList className="bg-background/50 h-8">
          <TabsTrigger value="pekan" className="text-[10px] h-6">Pekan</TabsTrigger>
          <TabsTrigger value="bulan" className="text-[10px] h-6">Bulan</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-62.5 w-full" />
      ) : (
        <ChartContainer config={chartConfig} className="h-62.5 w-full">
          {view === "pekan" ? (
            <BarChart data={dataPekan}>
              <CartesianGrid vertical={false} strokeOpacity={0.1} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="setoran" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          ) : (
            <AreaChart data={dataBulan}>
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
);