import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, PieChart as PieIcon } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface LaporanChartSectionProps {
  distribusiKategori: Record<string, number>;
  distribusiHalaqah: Record<string, number>;
}

const KATEGORI_CONFIG: Record<string, { color: string; label: string }> = {
  HAFALAN: { color: "#10b981", label: "Hafalan" },
  MURAJAAH: { color: "#3b82f6", label: "Murajaah" },
  ZIYADAH: { color: "#8b5cf6", label: "Ziyadah" },
  INTENS: { color: "#f59e0b", label: "Intensif" },
  BACAAN: { color: "#f43f5e", label: "Bacaan" },
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; fill: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border rounded-lg shadow-lg px-3 py-2 text-sm">
        <p className="font-semibold text-foreground">{label}</p>
        <p style={{ color: payload[0].fill }} className="font-bold">
          {payload[0].value.toLocaleString("id-ID")} setoran
        </p>
      </div>
    );
  }
  return null;
};

const PieTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border rounded-lg shadow-lg px-3 py-2 text-sm">
        <p className="font-semibold" style={{ color: payload[0].payload.fill }}>
          {payload[0].name}
        </p>
        <p className="text-foreground font-bold">
          {payload[0].value.toLocaleString("id-ID")} setoran
        </p>
      </div>
    );
  }
  return null;
};

export function LaporanChartSection({
  distribusiKategori,
  distribusiHalaqah,
}: LaporanChartSectionProps) {
  const kategoriData: ChartData[] = Object.entries(distribusiKategori)
    .filter(([, val]) => val > 0)
    .map(([key, val]) => ({
      name: KATEGORI_CONFIG[key]?.label ?? key,
      value: val,
      fill: KATEGORI_CONFIG[key]?.color ?? "#94a3b8",
    }));

  const halaqahData: ChartData[] = Object.entries(distribusiHalaqah)
    .filter(([, val]) => val > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([key, val], i) => ({
      name: key,
      value: val,
      fill: `hsl(${210 + i * 30}, 70%, 55%)`,
    }));

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Bar Chart — Distribusi per halaqah */}
      <Card className="lg:col-span-3 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
              <BarChart2 className="h-3 w-3 text-primary" />
            </div>
            Setoran per Halaqah
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          {halaqahData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={halaqahData}
                margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {halaqahData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
              Tidak ada data untuk ditampilkan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pie Chart — Distribusi kategori */}
      <Card className="lg:col-span-2 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-violet-500/10 flex items-center justify-center">
              <PieIcon className="h-3 w-3 text-violet-600" />
            </div>
            Distribusi Kategori
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          {kategoriData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={kategoriData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {kategoriData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "hsl(var(--muted-foreground))",
                      }}
                    >
                      {value}
                    </span>
                  )}
                  iconSize={8}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
              Tidak ada data
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
