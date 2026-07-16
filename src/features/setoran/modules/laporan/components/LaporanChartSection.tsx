import { useMemo } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, PieChart as PieIcon } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface LaporanChartSectionProps {
  distribusiKategori: Record<string, number>;
  distribusiHalaqah: Record<string, number>;
  onHalaqahClick?: (halaqahName: string) => void;
}

const halaqahChartConfig = {
  value: {
    label: "Setoran",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function LaporanChartSection({
  distribusiKategori,
  distribusiHalaqah,
  onHalaqahClick,
}: LaporanChartSectionProps) {
  const kategoriChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    const PRESET_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#f43f5e", "#06b6d4", "#ec4899", "#14b8a6"];
    Object.keys(distribusiKategori).forEach((key, index) => {
      config[key] = {
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
        color: PRESET_COLORS[index % PRESET_COLORS.length],
      };
    });
    return config;
  }, [distribusiKategori]);

  const kategoriData = Object.entries(distribusiKategori)
    .filter(([, val]) => val > 0)
    .map(([key, val]) => ({
      name: key,
      value: val,
      fill: kategoriChartConfig[key]?.color || "#94a3b8",
    }));

  const halaqahData = Object.entries(distribusiHalaqah)
    .filter(([, val]) => val > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([key, val]) => ({
      name: key,
      value: val,
      fill: "var(--primary)",
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
      <Card className="lg:col-span-3 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            Setoran per Halaqah
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          {halaqahData.length > 0 ? (
            <ChartContainer config={halaqahChartConfig} className="h-[230px] w-full">
              <BarChart
                data={halaqahData}
                margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
                onClick={(state) => {
                  if (state && state.activePayload && state.activePayload.length > 0) {
                    const clickedData = state.activePayload[0].payload;
                    if (onHalaqahClick) {
                      onHalaqahClick(clickedData.name);
                    }
                  }
                }}
                className="cursor-pointer"
              >
                <CartesianGrid vertical={false} strokeOpacity={0.1} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--primary)" />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[230px] flex items-center justify-center text-xs text-muted-foreground font-semibold">
              Tidak ada data setoran halaqah
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-muted-foreground" />
            Distribusi Kategori
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          {kategoriData.length > 0 ? (
            <ChartContainer config={kategoriChartConfig} className="mx-auto aspect-square max-h-[230px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={kategoriData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {kategoriData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-90 transition-opacity duration-200" />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent />}
                  className="text-[10px] flex-wrap gap-x-2 gap-y-1 mt-4"
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[230px] flex items-center justify-center text-xs text-muted-foreground font-semibold">
              Tidak ada data kategori setoran
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
