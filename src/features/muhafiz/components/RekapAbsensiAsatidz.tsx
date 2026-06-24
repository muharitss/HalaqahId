// src/features/muhafiz/components/RekapAbsensiAsatidz.tsx

import { useState, useEffect, useCallback, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDate, getMonth, getYear } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { muhafizService } from "../api/muhafizService";
import { type Muhafiz, type MonthlyAbsensiAsatidzRecord, type MonthlyAbsensiAsatidzItem } from "../types";
import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";

interface Props {
  muhafizList: Muhafiz[];
  sesiList: SesiHalaqah[];
}

export const RekapAbsensiAsatidz = ({ muhafizList, sesiList }: Props) => {
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [monthlyData, setMonthlyData] = useState<MonthlyAbsensiAsatidzRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const daysInMonth = useMemo(() => eachDayOfInterval({
    start: startOfMonth(viewDate),
    end: endOfMonth(viewDate)
  }), [viewDate]);

  const relevantSesi = useMemo(() => {
    return sesiList.length > 0 ? sesiList : [{ id_sesi: 0, nama_sesi: "Sesi" } as unknown as SesiHalaqah];
  }, [sesiList]);

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

  const getStatus = useCallback(
    (userId: number, dateStr: string, sesiId: number) => {
      const dayRecord = monthlyData.find((m) => m.tanggal === dateStr);
      if (!dayRecord?.data) return undefined;
      return dayRecord.data.find(
        (item: MonthlyAbsensiAsatidzItem) =>
          item.id_user === userId &&
          (item.id_sesi === sesiId || sesiId === 0 || item.id_sesi === null)
      )?.status;
    },
    [monthlyData]
  );

  const calculateTotal = useCallback(
    (userId: number, sesiId: number) => {
      const totals = { HADIR: 0, IZIN: 0, SAKIT: 0, ALFA: 0, TERLAMBAT: 0 };
      monthlyData.forEach((day) => {
        if (!day.data) return;
        const found = day.data.find(
          (item: MonthlyAbsensiAsatidzItem) =>
            item.id_user === userId &&
            (item.id_sesi === sesiId || sesiId === 0 || item.id_sesi === null)
        );
        const status = found?.status as keyof typeof totals | undefined;
        if (status && status in totals) {
          totals[status]++;
        }
      });
      return totals;
    },
    [monthlyData]
  );

  const getStatusStyle = (status?: string, hasSesi?: boolean) => {
    const base = "text-center p-0 border-r h-10 min-w-[34px] text-xs font-bold uppercase transition-colors";
    if (!hasSesi) {
      return cn(base, "bg-slate-100/50 text-slate-300 font-normal");
    }
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
    <div>
      {/* HEADER */}
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

      {/* TABLE WRAPPER */}
      <div className="relative border rounded-lg overflow-hidden bg-slate-50 shadow-sm">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-300">
          <Table className="border-separate border-spacing-0 w-full min-w-[900px]">
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead 
                  rowSpan={2}
                  className="min-w-[150px] md:min-w-[200px] sticky left-0 z-20 bg-slate-100 font-bold border-r border-b text-xs shadow-[1px_0_0_0_#e2e8f0] h-12 align-middle"
                >
                  Nama Muhafiz
                </TableHead>
                {daysInMonth.map((date) => (
                  <TableHead 
                    key={date.toString()} 
                    colSpan={relevantSesi.length}
                    className="text-center p-1 text-xs font-bold border-r border-b min-w-[32px] align-middle"
                  >
                    {getDate(date)}
                  </TableHead>
                ))}
                <TableHead 
                  colSpan={5}
                  className="text-center min-w-[40px] bg-primary/10 font-bold border-r border-b text-primary text-xs h-12 align-middle"
                >
                  Total
                </TableHead>
              </TableRow>
              <TableRow className="bg-slate-50">
                {daysInMonth.map((date) => {
                  return relevantSesi.map((sesi) => (
                    <TableHead
                      key={`${date.toString()}-${sesi.id_sesi}`}
                      className="text-center p-1 text-[9px] min-w-[35px] border-r border-b text-muted-foreground truncate align-middle h-10"
                      title={sesi.nama_sesi}
                    >
                      {sesi.nama_sesi.substring(0, 3)}
                    </TableHead>
                  ));
                })}
                {['H', 'I', 'S', 'A', 'T'].map(l => (
                  <TableHead 
                    key={l} 
                    className="text-center min-w-[36px] bg-primary/5 font-bold border-r border-b text-primary text-xs align-middle"
                  >
                    {l}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {isLoading ? (
                <TableRow>
                  <TableCell 
                    colSpan={daysInMonth.length * relevantSesi.length + 6} 
                    className="p-10 text-center"
                  >
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ) : muhafizList.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={daysInMonth.length * relevantSesi.length + 6} 
                    className="p-10 text-center text-muted-foreground text-sm"
                  >
                    Tidak ada data muhafiz.
                  </TableCell>
                </TableRow>
              ) : (
                muhafizList.map((m) => {
                  const grandTotals = { HADIR: 0, IZIN: 0, SAKIT: 0, ALFA: 0, TERLAMBAT: 0 };
                  relevantSesi.forEach((sesi) => {
                    const hasSesi = sesi.id_sesi === 0 || (
                      m.halaqah?.sesi_halaqahs?.some((s) => s.id_sesi === sesi.id_sesi)
                    ) || false;
                    if (hasSesi) {
                      const t = calculateTotal(m.id_user, sesi.id_sesi);
                      grandTotals.HADIR += t.HADIR;
                      grandTotals.IZIN += t.IZIN;
                      grandTotals.SAKIT += t.SAKIT;
                      grandTotals.ALFA += t.ALFA;
                      grandTotals.TERLAMBAT += t.TERLAMBAT;
                    }
                  });

                  return (
                    <TableRow key={m.id_user} className="group hover:bg-slate-50 transition-colors">
                      <TableCell className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 border-r border-b py-3 text-xs font-semibold shadow-[1px_0_0_0_#e2e8f0] truncate align-middle">
                        <span className="truncate block w-32 md:w-40 font-bold" title={m.name}>
                          {m.name}
                        </span>
                      </TableCell>
                      {daysInMonth.map((date) => {
                        const dateStr = format(date, "yyyy-MM-dd");
                        return relevantSesi.map((sesi) => {
                          const hasSesi = sesi.id_sesi === 0 || (
                            m.halaqah?.sesi_halaqahs?.some((s) => s.id_sesi === sesi.id_sesi)
                          ) || false;
                          const status = hasSesi ? getStatus(m.id_user, dateStr, sesi.id_sesi) : undefined;
                          return (
                            <TableCell 
                              key={`${date.toString()}-${sesi.id_sesi}`} 
                              className={cn(getStatusStyle(status, hasSesi), "border-b h-10 text-center")}
                              title={hasSesi ? `${m.name} - ${format(date, "dd MMM")} - ${sesi.nama_sesi} : ${status || "Belum Ada"}` : `${m.name} - Tidak ada halaqah di sesi ini`}
                            >
                              <div className="flex h-9 w-full items-center justify-center">
                                {hasSesi ? (status ? status.charAt(0) : "") : "-"}
                              </div>
                            </TableCell>
                          );
                        });
                      })}
                      <TableCell className="text-center font-bold border-b border-r text-green-600 bg-green-50/20 text-xs align-middle">{grandTotals.HADIR}</TableCell>
                      <TableCell className="text-center font-bold border-b border-r text-blue-600 bg-blue-50/20 text-xs align-middle">{grandTotals.IZIN}</TableCell>
                      <TableCell className="text-center font-bold border-b border-r text-yellow-600 bg-yellow-50/20 text-xs align-middle">{grandTotals.SAKIT}</TableCell>
                      <TableCell className="text-center font-bold border-b border-r text-red-600 bg-red-50/20 text-xs align-middle">{grandTotals.ALFA}</TableCell>
                      <TableCell className="text-center font-bold border-b border-r text-orange-600 bg-orange-50/20 text-xs align-middle">{grandTotals.TERLAMBAT}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* LEGENDA */}
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
