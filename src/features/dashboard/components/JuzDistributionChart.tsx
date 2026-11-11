import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Clock } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  type ChartConfig 
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  total_santri: { label: "Santri", color: "var(--primary)" },
} satisfies ChartConfig;

interface JuzDistributionChartProps {
  distribution: { juz: number; total_santri: number }[];
  belumSetoran: number;
  totalSantri: number;
  loading: boolean;
  className?: string;
}

export const JuzDistributionChart = ({
  distribution,
  belumSetoran,
  totalSantri,
  loading,
  className
}: JuzDistributionChartProps) => {
  const [filterMode, setFilterMode] = useState<"all" | "active">("active");

  const chartData = useMemo(() => {
    if (filterMode === "active") {
      const active = distribution.filter((item) => item.total_santri > 0);
      return active.length > 0 ? active : distribution.slice(0, 5);
    }
    return distribution;
  }, [distribution, filterMode]);

  const santriAktif = Math.max(0, totalSantri - belumSetoran);

  return (
    <Card className={cn("shadow-sm border border-border/70 bg-card rounded-xl overflow-hidden flex flex-col justify-between h-full min-w-0 w-full", className)}>
      <div>
        <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 pb-2">
          <div className="space-y-0.5 min-w-0 flex-1">
            <CardTitle className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground">
              <BookOpen className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">Distribusi Juz Santri</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground truncate">
              Sebaran santri per juz hafalan
            </CardDescription>
          </div>

          <Tabs value={filterMode} onValueChange={(v) => setFilterMode(v as "all" | "active")}>
            <TabsList className="bg-muted/70 h-7 px-1">
              <TabsTrigger value="active" className="text-[10px] h-5 px-2">Juz Aktif</TabsTrigger>
              <TabsTrigger value="all" className="text-[10px] h-5 px-2">1-30</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="p-4 pt-1 pb-2 min-w-0 w-full">
          {loading ? (
            <Skeleton className="h-[180px] w-full" />
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[180px] text-xs text-muted-foreground text-center px-4">
              <BookOpen className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p>Belum ada santri pada juz aktif</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[180px] w-full min-w-0">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeOpacity={0.12} />
                <XAxis
                  dataKey="juz"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  dy={8}
                  tickFormatter={(val) => `J${val}`}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  allowDecimals={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `Juz ${value}`}
                    />
                  }
                />
                <Bar
                  dataKey="total_santri"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </div>

      <div>
        <Separator className="my-0 opacity-60" />
        <div className="flex items-center text-xs text-muted-foreground px-4 py-2.5 gap-1.5">
          <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
          <p className="mb-0 text-xs text-muted-foreground truncate">
            <span className="font-semibold text-foreground">{santriAktif}</span> santri aktif • <span className="font-semibold text-foreground">{belumSetoran}</span> belum setor
          </p>
        </div>
      </div>
    </Card>
  );
};
