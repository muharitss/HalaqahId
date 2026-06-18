import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDate } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Import internal
import { absensiService, type MonthlyAbsensiData } from "../services/absensiService";
import type { StatusKehadiran as AbsensiStatus } from "@/types/domain/enums";
import { useSantri } from "@/features/muhafidz/kelola-santri/hooks/useSantri";
import { type Santri } from "@/features/muhafidz/kelola-santri/types";

interface RekapAbsensiProps {
  halaqahId?: number;
  externalSantriList?: Santri[];
}

export const RekapAbsensiTable = ({ halaqahId, externalSantriList }: RekapAbsensiProps) => {
  const { santriList: hookSantri, isLoading: loadingSantri, loadSantri } = useSantri();
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [monthlyData, setMonthlyData] = useState<MonthlyAbsensiData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const currentSantriList = useMemo(() => externalSantriList || hookSantri, [externalSantriList, hookSantri]);

  const daysInMonth = useMemo(() => eachDayOfInterval({
    start: startOfMonth(viewDate),
    end: endOfMonth(viewDate)
  }), [viewDate]);

  const fetchMonthlyRekap = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const m = (viewDate.getMonth() + 1).toString();
      const y = viewDate.getFullYear().toString();

      let data: MonthlyAbsensiData[] = [];

      if (halaqahId) {
        // Tambahkan 'as MonthlyAbsensiData[]' di sini
        const response = await absensiService.getRekapHalaqah(halaqahId, undefined, m, y);
        data = (response.data as MonthlyAbsensiData[]) || []; 
      } else {
        const response = await absensiService.getAllRekapSantri(m, y);
        data = response.data || [];
      }

      setMonthlyData(data);
    } catch (error) {
      console.error("Gagal memuat rekap:", error);
      setMonthlyData([]);
    } finally {
      setIsLoadingData(false);
    }
  }, [viewDate, halaqahId]);

  useEffect(() => {
    if (!externalSantriList && hookSantri.length === 0) loadSantri();
  }, [loadSantri, hookSantri.length, externalSantriList]);

  useEffect(() => {
    fetchMonthlyRekap();
  }, [fetchMonthlyRekap, halaqahId]);

  const getStatusForCell = (santriId: number, dateStr: string) => {
    const dayData = monthlyData.find((m) => m.tanggal === dateStr);
    if (!dayData) return null;
    
    const found = dayData.data.find((item) => Number(item.id_santri) === Number(santriId));
    return found?.status;
  };

  const calculateTotal = (santriId: number) => {
    const totals = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
    
    monthlyData.forEach(day => {
      const found = day.data.find(item => Number(item.id_santri) === Number(santriId));
      const status = found?.status as keyof typeof totals | undefined;
      
      if (status && status in totals) {
        totals[status]++;
      }
    });
    return totals;
  };

  const getStatusStyle = (status?: AbsensiStatus) => {
    const base = "text-center p-0 border-r h-9 min-w-[35px] text-[10px] font-bold transition-all";
    switch (status) {
      case "HADIR": return cn(base, "bg-green-500 text-white");
      case "IZIN": return cn(base, "bg-blue-500 text-white");
      case "SAKIT": return cn(base, "bg-yellow-500 text-white");
      case "TERLAMBAT": return cn(base, "bg-orange-500 text-white");
      case "ALFA": return cn(base, "bg-red-500 text-white");
      default: return cn(base, "text-muted-foreground/20");
    }
  };

  const getStatusInitial = (status?: AbsensiStatus) => status ? status.charAt(0) : "-";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select 
          value={format(viewDate, "yyyy-MM")} 
          onValueChange={(val) => setViewDate(new Date(val + "-01"))}
        >
          <SelectTrigger className="w-48 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }).map((_, i) => {
              const d = new Date(); 
              d.setDate(1); 
              d.setMonth(d.getMonth() - i);
              return (
                <SelectItem key={i} value={format(d, "yyyy-MM")}>
                  {format(d, "MMMM yyyy", { locale: localeId })}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto relative shadow-sm scrollbar-thin">
        <Table className="border-separate border-spacing-0"> 
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-40 sticky left-0 z-30 bg-muted font-bold border-r border-b text-xs">
                Nama Santri
              </TableHead>
              {daysInMonth.map((date) => (
                <TableHead key={date.toString()} className="text-center min-w-8 p-0 text-[10px] font-bold border-r border-b">
                  {getDate(date)}
                </TableHead>
              ))}
              {['H', 'I', 'S', 'T', 'A'].map(label => (
                <TableHead key={label} className="text-center min-w-10 bg-muted/80 font-black border-r border-b text-primary text-[10px]">
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingData || (loadingSantri && !externalSantriList) ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="sticky left-0 bg-background border-r border-b">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  {daysInMonth.map((d) => (
                    <TableCell key={d.toString()} className="p-1 border-r border-b">
                      <Skeleton className="h-6 w-6 rounded-sm mx-auto" />
                    </TableCell>
                  ))}
                  {Array(5).fill(0).map((_, idx) => (
                    <TableCell key={idx} className="p-1 border-r border-b">
                      <Skeleton className="h-6 w-6 rounded-sm mx-auto" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : currentSantriList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={daysInMonth.length + 6} className="text-center py-10 text-muted-foreground">
                    Data santri tidak ditemukan.
                  </TableCell>
                </TableRow>
            ) : (
              currentSantriList.map((s) => {
                const id_santri = s.id_santri;
                const totals = calculateTotal(id_santri);
                return (
                  <TableRow key={id_santri} className="group hover:bg-muted/30">
                    <TableCell className="font-medium sticky left-0 z-20 bg-background border-r border-b py-2 text-xs">
                      <span className="truncate block w-32 md:w-40">{s.nama_santri}</span>
                    </TableCell>
                    {daysInMonth.map((date) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      const status = getStatusForCell(id_santri, dateStr) || undefined;
                      return (
                        <TableCell 
                          key={date.toString()} 
                          className={cn(getStatusStyle(status), "border-b")}
                        >
                          {getStatusInitial(status)}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-bold border-b border-r bg-green-50/30 text-green-700 text-xs">{totals.HADIR}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-blue-50/30 text-blue-700 text-xs">{totals.IZIN}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-yellow-50/30 text-yellow-700 text-xs">{totals.SAKIT}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-orange-50/30 text-orange-700 text-xs">{totals.TERLAMBAT}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-red-50/30 text-red-700 text-xs">{totals.ALFA}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};