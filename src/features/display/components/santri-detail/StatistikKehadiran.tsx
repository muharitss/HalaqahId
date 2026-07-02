import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";

const STATUS_CONFIG: Record<string, { label: string; color: string; darkColor: string }> = {
  "Hadir": { label: "Hadir", color: "#10b981", darkColor: "#34d399" },
  "Izin": { label: "Izin", color: "#3b82f6", darkColor: "#60a5fa" },
  "Sakit": { label: "Sakit", color: "#f59e0b", darkColor: "#fbbf24" },
  "Terlambat": { label: "Terlambat", color: "#f97316", darkColor: "#fb923c" },
  "Alfa": { label: "Alfa", color: "#ef4444", darkColor: "#f87171" },
};

interface StatistikKehadiranProps {
  data: Array<{ name: string; value: number }>;
}

export function StatistikKehadiran({ data }: StatistikKehadiranProps) {
  const total = useMemo(() => data.reduce((acc, d) => acc + d.value, 0), [data]);
  const hadirCount = useMemo(() => data.find(d => d.name === "Hadir")?.value || 0, [data]);
  const percentage = total > 0 ? Math.round((hadirCount / total) * 100) : 0;

  return (
    <Card className="border border-border/60 bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <PieChartIcon className="h-3.5 w-3.5 text-primary" />
          Statistik Kehadiran
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px] w-full relative">
          {data.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={62}
                    outerRadius={82}
                    dataKey="value"
                    stroke="none"
                    paddingAngle={3}
                    cornerRadius={4}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_CONFIG[entry.name]?.color || "#8884d8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderRadius: "0.5rem",
                      border: "1px solid hsl(var(--border))",
                      color: "hsl(var(--popover-foreground))",
                      fontSize: "12px",
                      padding: "8px 12px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{ fontWeight: "600" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-foreground leading-none">{percentage}%</span>
                <span className="text-[10px] text-muted-foreground font-medium mt-0.5">Kehadiran</span>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <div className="h-14 w-14 rounded-2xl bg-muted/40 flex items-center justify-center mb-3">
                <PieChartIcon className="h-7 w-7 opacity-30" />
              </div>
              <p className="text-xs font-medium">Belum ada data kehadiran</p>
            </div>
          )}
        </div>

        {/* Legend */}
        {data.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2">
            {data.map((entry) => {
              const config = STATUS_CONFIG[entry.name];
              return (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: config?.color || "#8884d8" }}
                  />
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {entry.name}
                  </span>
                  <span className="text-[11px] font-bold text-foreground">{entry.value}</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
