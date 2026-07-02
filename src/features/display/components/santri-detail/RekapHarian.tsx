import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDate, isSameDay, parseISO, format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { MonthSelector } from "../MonthSelector";
import { CalendarDays } from "lucide-react";

const STATUS_CONFIG = {
  HADIR: { label: "Hadir", color: "#10b981", bg: "bg-emerald-500", initial: "H", lightBg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-700 dark:text-emerald-400" },
  IZIN: { label: "Izin", color: "#3b82f6", bg: "bg-blue-500", initial: "I", lightBg: "bg-blue-100 dark:bg-blue-500/20", text: "text-blue-700 dark:text-blue-400" },
  SAKIT: { label: "Sakit", color: "#f59e0b", bg: "bg-amber-500", initial: "S", lightBg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-700 dark:text-amber-400" },
  TERLAMBAT: { label: "Terlambat", color: "#f97316", bg: "bg-orange-500", initial: "T", lightBg: "bg-orange-100 dark:bg-orange-500/20", text: "text-orange-700 dark:text-orange-400" },
  ALFA: { label: "Alfa", color: "#ef4444", bg: "bg-red-500", initial: "A", lightBg: "bg-red-100 dark:bg-red-500/20", text: "text-red-700 dark:text-red-400" },
};

interface AbsensiEntry {
  id_absensi: number;
  tanggal: string;
  status: string;
  keterangan: string;
}

interface RekapHarianProps {
  daysInMonth: Date[];
  riwayatAbsensi: AbsensiEntry[];
  isLoading: boolean;
  viewDate: Date;
  onViewDateChange: (date: Date) => void;
}

export function RekapHarian({
  daysInMonth,
  riwayatAbsensi,
  isLoading,
  viewDate,
  onViewDateChange,
}: RekapHarianProps) {
  const stats = daysInMonth.reduce((acc, date) => {
    const record = riwayatAbsensi.find(r => isSameDay(parseISO(r.tanggal), date));
    if (record && record.status in STATUS_CONFIG) {
      acc[record.status as keyof typeof STATUS_CONFIG]++;
    }
    return acc;
  }, { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 });

  // Create a 7-column calendar grid
  const firstDay = daysInMonth[0];
  const startDayOfWeek = firstDay.getDay(); // 0=Sun
  const dayLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <Card className="border border-border/60 bg-card shadow-sm lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-primary" />
          Rekap Kehadiran
        </CardTitle>
        <MonthSelector value={viewDate} onChange={onViewDateChange} />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Month Label */}
        <p className="text-sm font-semibold text-foreground">
          {format(viewDate, "MMMM yyyy", { locale: localeId })}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {/* Calendar Grid */}
            <div className="space-y-1.5">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1.5">
                {dayLabels.map(d => (
                  <div key={d} className="h-7 flex items-center justify-center text-[10px] font-semibold text-muted-foreground uppercase">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar cells */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty cells for offset */}
                {Array.from({ length: startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-9" />
                ))}

                {daysInMonth.map((date) => {
                  const record = riwayatAbsensi.find(r => isSameDay(parseISO(r.tanggal), date));
                  const statusKey = record?.status as keyof typeof STATUS_CONFIG | undefined;
                  const config = statusKey ? STATUS_CONFIG[statusKey] : null;
                  const isToday = isSameDay(date, new Date());

                  return (
                    <div
                      key={date.toString()}
                      className={cn(
                        "h-9 rounded-lg flex flex-col items-center justify-center text-[11px] font-semibold transition-all relative",
                        config
                          ? `${config.lightBg} ${config.text}`
                          : "bg-muted/30 text-muted-foreground/40",
                        isToday && "ring-2 ring-primary/40 ring-offset-1 ring-offset-background"
                      )}
                      title={config ? `${config.label}${record?.keterangan ? ` - ${record.keterangan}` : ''}` : undefined}
                    >
                      <span className="leading-none">{getDate(date)}</span>
                      {config && (
                        <span className="text-[7px] font-bold leading-none mt-0.5 opacity-70">{config.initial}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-border/50">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const count = stats[key as keyof typeof stats];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded-sm", config.bg)} />
                    <span className="text-[11px] font-medium text-muted-foreground">{config.label}</span>
                    <span className="text-[11px] font-bold text-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
