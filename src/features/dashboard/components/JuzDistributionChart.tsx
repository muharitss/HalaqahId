import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Users, UserMinus, UserCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  type ChartConfig 
} from "@/components/ui/chart";

const chartConfig = {
  total_santri: { label: "Total Santri", color: "var(--primary)" },
} satisfies ChartConfig;

interface JuzDistributionChartProps {
  distribution: { juz: number; total_santri: number }[];
  belumSetoran: number;
  totalSantri: number;
  loading: boolean;
}

export const JuzDistributionChart = ({
  distribution,
  belumSetoran,
  totalSantri,
  loading
}: JuzDistributionChartProps) => {
  const [filterMode, setFilterMode] = useState<"all" | "active">("all");

  const chartData = useMemo(() => {
    if (filterMode === "active") {
      return distribution.filter(item => item.total_santri > 0);
    }
    return distribution;
  }, [distribution, filterMode]);

  const santriAktif = totalSantri - belumSetoran;

  return (
    <Card className="col-span-full border-none shadow-sm bg-muted/20 w-full min-w-0 overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <BookOpen className="h-5 w-5 text-primary" />
            Distribusi Hafalan Juz Santri
          </CardTitle>
          <CardDescription className="text-xs">
            Peta penyebaran santri berdasarkan juz hafalan aktif saat ini
          </CardDescription>
        </div>

        <Tabs value={filterMode} onValueChange={(v) => setFilterMode(v as "all" | "active")}>
          <TabsList className="bg-background/50 h-8">
            <TabsTrigger value="all" className="text-[10px] h-6 px-3">Semua Juz (1-30)</TabsTrigger>
            <TabsTrigger value="active" className="text-[10px] h-6 px-3">Hanya Juz Aktif</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Metrik Ringkasan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-background/40 p-3 rounded-lg border border-border/20">
                <div className="p-2 bg-primary/10 rounded-md animate-fade-in">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Santri</p>
                  <p className="text-base font-bold text-foreground">{totalSantri}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-background/40 p-3 rounded-lg border border-border/20">
                <div className="p-2 bg-green-500/10 rounded-md animate-fade-in">
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Santri Aktif Setoran</p>
                  <p className="text-base font-bold text-foreground">{santriAktif}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-background/40 p-3 rounded-lg border border-border/20">
                <div className="p-2 bg-amber-500/10 rounded-md animate-fade-in">
                  <UserMinus className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Belum Setoran</p>
                  <p className="text-base font-bold text-foreground">{belumSetoran}</p>
                </div>
              </div>
            </div>

            {/* Visualisasi Bar Chart */}
            <div className="min-w-0 w-full bg-background/45 rounded-lg p-3 border border-border/20">
              {chartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[250px] text-sm text-muted-foreground">
                  <p>Tidak ada data distribusi juz yang dapat ditampilkan.</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">
                    Semua santri saat ini berada di status belum setoran.
                  </p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[250px] w-full min-w-0">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeOpacity={0.15} />
                    <XAxis
                      dataKey="juz"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      dy={10}
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
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
                      maxBarSize={40}
                    />
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
