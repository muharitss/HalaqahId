import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategoryStat } from "../types";

const chartConfig = {
  hafalan: { label: "Hafalan Baru", color: "var(--primary)" },
  murajaah: { label: "Murajaah", color: "color-mix(in srgb, var(--primary), transparent 50%)" },
} satisfies ChartConfig;

interface CategoryPieChartProps {
  data: CategoryStat[];
  loading: boolean;
}

export const CategoryPieChart = ({ data, loading }: CategoryPieChartProps) => (
  <Card className="lg:col-span-2 border-none shadow-sm bg-muted/20">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-base">
        <FontAwesomeIcon icon={faUsersViewfinder} className="text-primary" />
        Kategori Setoran
      </CardTitle>
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-62.5 w-62.5 rounded-full mx-auto" />
      ) : (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-62.5">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="count" nameKey="category" innerRadius={60} outerRadius={80} paddingAngle={4}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? "var(--primary)" : "color-mix(in srgb, var(--primary), white 60%)"} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent />} className="text-xs" />
          </PieChart>
        </ChartContainer>
      )}
    </CardContent>
  </Card>
);