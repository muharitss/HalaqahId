import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TenantListItem } from "@/features/tenant/types";

interface TenantGrowthChartProps {
  tenants: TenantListItem[];
  isLoading: boolean;
}

const chartConfig = {
  total: {
    label: "Total Tenant",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function TenantGrowthChart({ tenants, isLoading }: TenantGrowthChartProps) {
  const chartData = useMemo(() => {
    if (!tenants || tenants.length === 0) {
      // Default fallback months if no tenants yet
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
      return months.map((m, idx) => ({ bulan: m, total: idx + 1 }));
    }

    // Group tenant creation by month
    const monthCounts: Record<string, number> = {};
    const sorted = [...tenants].sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return da - db;
    });

    let cumulative = 0;
    sorted.forEach((t) => {
      const d = t.created_at ? new Date(t.created_at) : new Date();
      const monthLabel = d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
      cumulative += 1;
      monthCounts[monthLabel] = cumulative;
    });

    const entries = Object.entries(monthCounts).map(([bulan, total]) => ({
      bulan,
      total,
    }));

    // If only 1 entry, pad with previous month
    if (entries.length === 1) {
      return [{ bulan: "Prev", total: 0 }, entries[0]];
    }

    return entries;
  }, [tenants]);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-semibold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Pertumbuhan Tenant
            </CardTitle>
            <CardDescription className="text-xs">
              Akumulasi pendaftaran tenant baru per bulan
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        {isLoading ? (
          <Skeleton className="h-[220px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[220px] w-full min-w-0">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillTenant" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="bulan" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#fillTenant)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
