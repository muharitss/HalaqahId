import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import type { ProgressSummaryData, SurahProgressItem } from "../types";

interface ProgressChartProps {
  summaryData: ProgressSummaryData | null;
  suratList: SurahProgressItem[];
}

const COLORS = {
  LANCAR: "#0284c7",  // sky-600
  SELESAI: "#059669", // emerald-600
  PROSES: "#d97706",  // amber-600
  BELUM: "#94a3b8",   // slate-400
};

export function ProgressChart({ summaryData, suratList: _suratList }: ProgressChartProps) {
  const s = summaryData?.summary;

  const pieData = useMemo(() => {
    return [
      { name: "Lancar", value: s?.total_surat_lancar ?? 0, color: COLORS.LANCAR },
      { name: "Selesai", value: s?.total_surat_selesai ?? 0, color: COLORS.SELESAI },
      { name: "Proses", value: s?.total_surat_proses ?? 0, color: COLORS.PROSES },
      { name: "Belum", value: s?.total_surat_belum ?? 0, color: COLORS.BELUM },
    ].filter((item) => item.value > 0);
  }, [s]);

  // Juz completion array (1 - 30)
  const completedJuzSet = useMemo(() => {
    return new Set(s?.daftar_juz_selesai || []);
  }, [s?.daftar_juz_selesai]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Chart 1: Status Distribution Donut Chart */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Distribusi Status 114 Surat</CardTitle>
          <CardDescription className="text-xs">
            Proporsi tingkat ketuntasan hafalan per kategori status.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[240px] flex items-center justify-center">
          {pieData.length === 0 ? (
            <div className="text-xs text-muted-foreground">Belum ada data progres hafalan.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(val: any) => [`${val} Surat`, "Jumlah"]}
                  contentStyle={{
                    borderRadius: "8px",
                    fontSize: "12px",
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Chart 2: 30 Juz Visual Matrix */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Status Ketuntasan 30 Juz</CardTitle>
          <CardDescription className="text-xs">
            Indikator juz yang sudah diselesaikan secara lengkap (30 Juz Al-Quran).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 pt-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => {
              const isCompleted = completedJuzSet.has(juzNum);
              return (
                <div
                  key={juzNum}
                  className={`p-2 rounded-lg text-center border transition-all text-xs font-semibold ${
                    isCompleted
                      ? "bg-emerald-500/15 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold"
                      : "bg-muted/40 border-border text-muted-foreground"
                  }`}
                  title={isCompleted ? `Juz ${juzNum}: Selesai Tuntas ✓` : `Juz ${juzNum}: Belum Selesai`}
                >
                  <div className="text-[10px] opacity-75 font-normal">Juz</div>
                  <div className="text-sm">{juzNum}</div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-emerald-500/20 border border-emerald-400" />
              <span>Selesai Tuntas ({completedJuzSet.size})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-muted/50 border border-border" />
              <span>Belum Selesai ({30 - completedJuzSet.size})</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
