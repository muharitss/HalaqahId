import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSantri } from "@/hooks/useSantri";
import { absensiService, type AbsensiStatus } from "@/services/absensiService";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDate } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { type Santri } from "@/services/santriService";

interface MonthlyAbsensiData {
  tanggal: string;
  data: {
    santri_id?: number;
    santri?: { id_santri: number };
    status: AbsensiStatus;
  }[];
}


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
    const targetHalaqahId = halaqahId || (currentSantriList.length > 0 ? currentSantriList[0].halaqah_id : null);
    if (!targetHalaqahId) return;
    
    setIsLoadingData(true);
    try {
      const requests = daysInMonth.map(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        return absensiService.getRekapHalaqah(targetHalaqahId, dateStr)
          .then(res => ({ tanggal: dateStr, data: res.data || [] }))
          .catch(() => ({ tanggal: dateStr, data: [] }));
      });
      const results = await Promise.all(requests);
      setMonthlyData(results);
    } catch (error) {
      console.error("Gagal memuat rekap bulanan:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, [currentSantriList, daysInMonth, halaqahId]);

  useEffect(() => {
    if (!externalSantriList && hookSantri.length === 0) loadSantri();
  }, [loadSantri, hookSantri.length, externalSantriList]);

  useEffect(() => {
    fetchMonthlyRekap();
  }, [fetchMonthlyRekap]);

  const getStatusForCell = (santriId: number, dateStr: string) => {
    const dayData = monthlyData.find(m => m.tanggal === dateStr);
    if (!dayData) return null;
    return dayData.data.find((item: { santri_id?: number; santri?: { id_santri: number } }) => 
       item.santri_id === santriId || item.santri?.id_santri === santriId
    )?.status as AbsensiStatus | undefined;
  };


  // FUNGSI BARU: Menghitung total status per santri
  const calculateTotal = (santriId: number) => {
    const totals = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
    monthlyData.forEach(day => {
      const status = day.data.find((item: { santri_id?: number; santri?: { id_santri: number }; status?: AbsensiStatus }) => 
        item.santri_id === santriId || item.santri?.id_santri === santriId
      )?.status as keyof typeof totals | undefined;
      
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
        <Select value={format(viewDate, "yyyy-MM")} onValueChange={(val) => setViewDate(new Date(val))}>
          <SelectTrigger className="w-45"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }).map((_, i) => {
              const d = new Date(); d.setMonth(d.getMonth() - i);
              return <SelectItem key={i} value={format(d, "yyyy-MM")}>{format(d, "MMMM yyyy", { locale: id })}</SelectItem>;
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto relative shadow-sm scrollbar-thin">
        <Table className="border-separate border-spacing-0"> 
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-40 sticky left-0 z-30 bg-muted font-bold border-r border-b">Nama Santri</TableHead>
              {daysInMonth.map((date) => (
                <TableHead key={date.toString()} className="text-center min-w-8.75 p-0 text-[10px] font-bold border-r border-b">
                  {getDate(date)}
                </TableHead>
              ))}
              {/* Kolom Header Total */}
              {['H', 'I', 'S', 'T', 'A'].map(label => (
                <TableHead key={label} className="text-center min-w-10 bg-muted/80 font-black border-r border-b text-primary">{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingData || (loadingSantri && !externalSantriList) ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="sticky left-0 bg-background border-r border-b"><Skeleton className="h-4 w-24" /></TableCell>
                  {daysInMonth.map((d) => <TableCell key={d.toString()} className="p-1 border-r border-b"><Skeleton className="h-6 w-6 rounded-sm" /></TableCell>)}
                  {Array(5).fill(0).map((_, idx) => <TableCell key={idx} className="p-1 border-r border-b"><Skeleton className="h-6 w-6 rounded-sm" /></TableCell>)}
                </TableRow>
              ))
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
                      const status = getStatusForCell(id_santri, format(date, "yyyy-MM-dd")) || undefined;
                      return <TableCell key={date.toString()} className={cn(getStatusStyle(status), "border-b")}>{getStatusInitial(status)}</TableCell>;
                    })}


                    {/* Kolom Data Total */}
                    <TableCell className="text-center font-bold border-b border-r bg-green-50/30 text-green-700">{totals.HADIR}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-blue-50/30 text-blue-700">{totals.IZIN}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-yellow-50/30 text-yellow-700">{totals.SAKIT}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-orange-50/30 text-orange-700">{totals.TERLAMBAT}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-red-50/30 text-red-700">{totals.ALFA}</TableCell>
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