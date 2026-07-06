import { PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart as PieIcon } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface JenisData {
  name: string;
  value: number;
}

interface JenisLembagaChartProps {
  data: JenisData[];
  isLoading: boolean;
}

const COLORS: Record<string, string> = {
  PESANTREN: "#10b981",
  MADRASAH: "#3b82f6",
  SEKOLAH_UMUM: "#8b5cf6",
  TPA: "#f59e0b",
  Lainnya: "#94a3b8",
};

const LABELS: Record<string, string> = {
  PESANTREN: "Pesantren",
  MADRASAH: "Madrasah",
  SEKOLAH_UMUM: "Sekolah Umum",
  TPA: "TPA",
  Lainnya: "Lainnya",
};

export function JenisLembagaChart({ data, isLoading }: JenisLembagaChartProps) {
  const chartConfig = data.reduce<ChartConfig>((acc, item) => {
    acc[item.name] = {
      label: LABELS[item.name] ?? item.name,
      color: COLORS[item.name] ?? "#94a3b8",
    };
    return acc;
  }, {});

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
          <PieIcon className="h-4 w-4 text-muted-foreground" />
          Distribusi Jenis Lembaga
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-[230px]">
            <Skeleton className="h-40 w-40 rounded-full" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-[230px] flex items-center justify-center text-xs text-muted-foreground font-semibold">
            Belum ada data sekolah
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[230px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name] ?? "#94a3b8"}
                    className="hover:opacity-90 transition-opacity duration-200"
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent />}
                className="text-[10px] flex-wrap gap-x-2 gap-y-1 mt-4"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
