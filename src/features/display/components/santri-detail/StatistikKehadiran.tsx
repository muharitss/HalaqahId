import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  "HADIR": { label: "Hadir", color: "hsl(var(--chart-1))" },
  "IZIN": { label: "Izin", color: "hsl(var(--chart-2))" },
  "SAKIT": { label: "Sakit", color: "hsl(var(--chart-3))" },
  "TERLAMBAT": { label: "Terlambat", color: "hsl(var(--chart-4))" },
  "ALFA": { label: "Alfa", color: "hsl(var(--chart-5))" },
};

interface StatistikKehadiranProps {
  data: Array<{ name: string; value: number }>;
}

export function StatistikKehadiran({ data }: StatistikKehadiranProps) {
  return (
    <Card className="border-none shadow-sm bg-card text-card-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Statistik Kehadiran
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                  paddingAngle={5}
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
                    borderRadius: "var(--radius)",
                    border: "1px solid hsl(var(--border))",
                    color: "hsl(var(--popover-foreground))",
                    fontSize: "12px",
                  }}
                  itemStyle={{ fontWeight: "bold" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground italic">
              <ChartBarIcon className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-xs">Data belum tersedia</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}