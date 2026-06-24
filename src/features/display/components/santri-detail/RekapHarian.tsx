import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getDate, isSameDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { MonthSelector } from "../MonthSelector";

const STATUS_CONFIG = {
  HADIR: { label: "Hadir", color: "#10b981", bg: "bg-green-500", initial: "H" },
  IZIN: { label: "Izin", color: "#3b82f6", bg: "bg-blue-500", initial: "I" },
  SAKIT: { label: "Sakit", color: "#f59e0b", bg: "bg-yellow-500", initial: "S" },
  TERLAMBAT: { label: "Terlambat", color: "#f97316", bg: "bg-orange-500", initial: "T" },
  ALFA: { label: "Alfa", color: "#ef4444", bg: "bg-red-500", initial: "A" },
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

  return (
    <Card className="border-none shadow-md lg:col-span-2 overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-muted/20">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground/70">
          Rekap Kehadiran
        </CardTitle>
        <MonthSelector value={viewDate} onChange={onViewDateChange} />
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative overflow-x-auto scrollbar-thin">
          <Table className="border-separate border-spacing-0">
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                {daysInMonth.map((date) => (
                  <TableHead
                    key={date.toString()}
                    className="h-10 border-r border-b p-0 text-center text-[10px] font-bold min-w-[32px]"
                  >
                    {getDate(date)}
                  </TableHead>
                ))}
                {Object.values(STATUS_CONFIG).map(config => (
                  <TableHead key={config.initial} className="h-10 border-r border-b p-0 text-center text-[10px] font-black text-primary bg-primary/5 min-w-[32px]">
                    {config.initial}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-transparent">
                {isLoading ? (
                  Array(daysInMonth.length + 5).fill(0).map((_, i) => (
                    <TableCell key={i} className="border-r border-b p-1">
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  ))
                ) : (
                  <>
                    {daysInMonth.map((date) => {
                      const record = riwayatAbsensi.find(r => isSameDay(parseISO(r.tanggal), date));
                      const statusKey = record?.status as keyof typeof STATUS_CONFIG | undefined;

                      return (
                        <TableCell
                          key={date.toString()}
                          className={cn(
                            "h-12 border-r border-b p-0 text-center text-[11px] font-bold transition-all",
                            statusKey
                              ? `${STATUS_CONFIG[statusKey].bg} text-white`
                              : "text-muted-foreground/20 bg-muted/5"
                          )}
                        >
                          {statusKey ? STATUS_CONFIG[statusKey].initial : "-"}
                        </TableCell>
                      );
                    })}
                    {Object.entries(STATUS_CONFIG).map(([key]) => (
                      <TableCell key={key} className="border-r border-b p-0 text-center text-xs font-black bg-muted/10 text-foreground">
                        {stats[key as keyof typeof stats]}
                      </TableCell>
                    ))}
                  </>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="p-4 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-sm shadow-xs", config.bg)} /> 
              <span>{config.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
