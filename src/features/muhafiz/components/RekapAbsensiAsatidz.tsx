// src/features/kepala-muhafidz/kelola-muhafiz/components/RekapAbsensiAsatidz.tsx

import { useState, useEffect, useCallback, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDate, getMonth, getYear } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { muhafizService } from "../api/muhafizService";
import { type Muhafiz } from "../types";

interface Props {
  muhafizList: Muhafiz[];
}

export const RekapAbsensiAsatidz = ({ muhafizList }: Props) => {
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const daysInMonth = useMemo(() => eachDayOfInterval({
    start: startOfMonth(viewDate),
    end: endOfMonth(viewDate)
  }), [viewDate]);

  const fetchRekap = useCallback(async () => {
    setIsLoading(true);
    try {
      const month = getMonth(viewDate) + 1;
      const year = getYear(viewDate);
      const res = await muhafizService.getMonthlyAsatidz(month, year);
      if (res.success) setMonthlyData(res.data);
    } catch (error) {
      console.error("Gagal memuat rekap:", error);
    } finally {
      setIsLoading(false);
    }
  }, [viewDate]);

  useEffect(() => { fetchRekap(); }, [fetchRekap]);

  const getStatus = (userId: number, dateStr: string) => {
    const dayRecord = monthlyData.find(m => m.tanggal === dateStr);
    return dayRecord?.data?.find((item: any) => item.id_user === userId)?.status;
  };

  const calculateTotal = (userId: number) => {
    const totals = { HADIR: 0, IZIN: 0, SAKIT: 0, ALFA: 0, TERLAMBAT: 0 };
    monthlyData.forEach(day => {
      const status = day.data?.find((item: any) => item.id_user === userId)?.status;
      if (status && status in totals) totals[status as keyof typeof totals]++;
    });
    return totals;
  };

  const getStatusStyle = (status?: string) => {
    const base = "text-center p-0 border-r h-9 min-w-[34px] text-xs font-bold uppercase transition-colors";
    switch (status) {
      case "HADIR": return cn(base, "bg-green-500 text-white hover:bg-green-600");
      case "IZIN": return cn(base, "bg-blue-500 text-white hover:bg-blue-600");
      case "SAKIT": return cn(base, "bg-yellow-500 text-white hover:bg-yellow-600");
      case "ALFA": return cn(base, "bg-red-500 text-white hover:bg-red-600");
      case "TERLAMBAT": return cn(base, "bg-orange-500 text-white hover:bg-orange-600");
      default: return cn(base, "text-muted-foreground/10");
    }
  };

  return (
    // 'max-w-full overflow-hidden' memastikan komponen tidak akan membuat halaman scroll ke samping
    <div>
      
      {/* HEADER: Dibuat wrap (baris baru) jika di layar HP */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="font-bold text-lg leading-tight p-4">Rekap Kehadiran Muhafiz</h3>
        <Select 
          value={format(viewDate, "yyyy-MM")} 
          onValueChange={(val) => setViewDate(new Date(val + "-01"))}
        >
          <SelectTrigger className="w-full sm:w-44 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }).map((_, i) => {
              const d = new Date(); d.setMonth(d.getMonth() - i);
              return <SelectItem key={i} value={format(d, "yyyy-MM")}>{format(d, "MMMM yyyy", { locale: id })}</SelectItem>;
            })}
          </SelectContent>
        </Select>
      </div>

      {/* TABLE WRAPPER: Scroll horizontal HANYA di sini */}
      <div className="relative border rounded-lg overflow-hidden bg-slate-50">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-300">
          <Table className="border-separate border-spacing-0 w-full min-w-[900px]">
            <TableHeader>
              <TableRow className="bg-slate-100">
                {/* STICKY LEFT: Nama tidak ikut bergeser */}
                <TableHead className="min-w-[150px] md:min-w-[200px] sticky left-0 z-20 bg-slate-100 font-bold border-r border-b text-xs shadow-[1px_0_0_0_#e2e8f0] h-12">
                  Nama Muhafiz
                </TableHead>
                {daysInMonth.map((date) => (
                  <TableHead key={date.toString()} className="text-center p-0 text-xs font-bold border-r border-b min-w-[32px] h-12">
                    {getDate(date)}
                  </TableHead>
                ))}
                {['H', 'I', 'S', 'A', 'T'].map(l => (
                  <TableHead key={l} className="text-center min-w-[36px] bg-primary/10 font-bold border-r border-b text-primary text-xs h-12">{l}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {isLoading ? (
                <TableRow><TableCell colSpan={daysInMonth.length + 6} className="p-10 text-center"><Skeleton className="h-10 w-full" /></TableCell></TableRow>
              ) : (
                muhafizList.map((m) => {
                  const totals = calculateTotal(m.id_user);
                  return (
                    <TableRow key={m.id_user} className="group hover:bg-slate-50 transition-colors">
                      <TableCell className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 border-r border-b py-3 text-xs font-semibold shadow-[1px_0_0_0_#e2e8f0] truncate">
                        {m.name}
                      </TableCell>
                      {daysInMonth.map((date) => {
                        const status = getStatus(m.id_user, format(date, "yyyy-MM-dd"));
                        return <TableCell key={date.toString()} className={cn(getStatusStyle(status), "border-b h-10")}>{status ? status.charAt(0) : ""}</TableCell>;
                      })}
                      <TableCell className="text-center font-bold border-b border-r text-green-600 bg-green-50/20 text-xs">{totals.HADIR}</TableCell>
                      <TableCell className="text-center font-bold border-b border-r text-blue-600 bg-blue-50/20 text-xs">{totals.IZIN}</TableCell>
                      <TableCell className="text-center font-bold border-b border-r text-yellow-600 bg-yellow-50/20 text-xs">{totals.SAKIT}</TableCell>
                      <TableCell className="text-center font-bold border-b border-r text-red-600 bg-red-50/20 text-xs">{totals.ALFA}</TableCell>
                      <TableCell className="text-center font-bold border-b border-r text-orange-600 bg-orange-50/20 text-xs">{totals.TERLAMBAT}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* LEGENDA (WRAP: Baris baru otomatis jika sempit) */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground pt-4 border-t px-2 mt-4 font-medium">
        <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-green-500 rounded-sm" /> HADIR</span>
        <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-500 rounded-sm" /> IZIN</span>
        <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-yellow-500 rounded-sm" /> SAKIT</span>
        <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-500 rounded-sm" /> ALFA</span>
        <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-orange-500 rounded-sm" /> TERLAMBAT</span>
      </div>
    </div>
  );
};