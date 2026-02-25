import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format, getDate } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { MonthSelector } from "../MonthSelector";

const STATUS_CONFIG = {
  HADIR: { label: "Hadir", color: "#10b981", bg: "bg-emerald-500" },
  IZIN: { label: "Izin", color: "#3b82f6", bg: "bg-blue-500" },
  SAKIT: { label: "Sakit", color: "#f59e0b", bg: "bg-amber-500" },
  TERLAMBAT: { label: "Terlambat", color: "#f97316", bg: "bg-orange-500" },
  ALFA: { label: "Alfa", color: "#ef4444", bg: "bg-red-500" },
};

interface AbsensiRecord {
  nama_santri: string;
  status: "HADIR" | "IZIN" | "SAKIT" | "TERLAMBAT" | "ALFA";
}

interface MonthlyData {
  tanggal: string;
  data: AbsensiRecord[];
}

interface RekapHarianProps {
  daysInMonth: Date[];
  monthlyAbsensi: MonthlyData[];
  santriName: string;
  isLoading: boolean;
  viewDate: Date;
  onViewDateChange: (date: Date) => void;
}

export function RekapHarian({
  daysInMonth,
  monthlyAbsensi,
  santriName,
  isLoading,
  viewDate,
  onViewDateChange,
}: RekapHarianProps) {
  return (
    <Card className="border-none shadow-sm lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Rekap Harian {format(viewDate, "MMMM yyyy", { locale: localeId })}
        </CardTitle>
        <MonthSelector value={viewDate} onChange={onViewDateChange} />
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto rounded-lg border border-muted/50 scrollbar-thin">
          <Table className="border-separate border-spacing-0">
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                {daysInMonth.map((date) => (
                  <TableHead
                    key={date.toString()}
                    className="h-10 border-r p-0 text-center text-[10px] font-bold min-w-8"
                  >
                    {getDate(date)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-transparent">
                {isLoading ? (
                  daysInMonth.map((d) => (
                    <TableCell key={d.toString()} className="border-r p-1">
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  ))
                ) : (
                  daysInMonth.map((date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const dailyRecord = monthlyAbsensi.find((m) => m.tanggal === dateStr);
                    const santriStatus = dailyRecord?.data.find((s) => s.nama_santri === santriName);
                    const statusKey = santriStatus?.status;

                    return (
                      <TableCell
                        key={date.toString()}
                        className={cn(
                          "h-12 border-r p-0 text-center text-[11px] font-extrabold transition-colors border-b",
                          statusKey
                            ? `${STATUS_CONFIG[statusKey].bg} text-white`
                            : "text-muted-foreground/20 bg-muted/5"
                        )}
                      >
                        {statusKey ? statusKey.charAt(0) : "-"}
                      </TableCell>
                    );
                  })
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-[10px] font-medium text-muted-foreground">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1">
              <div className={cn("h-2 w-2 rounded-full", config.bg)} /> {config.label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}