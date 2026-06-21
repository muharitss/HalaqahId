import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDate } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Import internal
import { absensiService, type MonthlyAbsensiData } from "../api/absensiService";
import type { StatusKehadiran as AbsensiStatus } from "@/types/domain/enums";
import { useSantri } from "@/features/santri/hooks/useSantri";
import { type Santri } from "@/features/santri/types";
import { sesiService } from "@/features/halaqah/api/sesiService";
import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";

interface RekapAbsensiProps {
  halaqahId?: number;
  externalSantriList?: Santri[];
}

export const RekapAbsensiTable = ({ halaqahId, externalSantriList }: RekapAbsensiProps) => {
  const { santriList: hookSantri, isLoading: loadingSantri, loadSantri } = useSantri();
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [monthlyData, setMonthlyData] = useState<MonthlyAbsensiData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [sesiList, setSesiList] = useState<SesiHalaqah[]>([]);

  const currentSantriList = useMemo(() => externalSantriList || hookSantri, [externalSantriList, hookSantri]);

  useEffect(() => {
    const fetchSesi = async () => {
      try {
        const response = await sesiService.getSesiHalaqah();
        setSesiList(response.data || []);
      } catch (error) {
        console.error("Gagal memuat sesi halaqah:", error);
      }
    };
    fetchSesi();
  }, []);



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

  const getStatusForCell = (santriId: number, sesiId: number, dateStr: string) => {
    const dayData = monthlyData.find((m) => m.tanggal === dateStr);
    if (!dayData) return null;
    
    const found = dayData.data.find(
      (item: any) => Number(item.id_santri) === Number(santriId) && 
                (Number(item.id_sesi) === Number(sesiId) || sesiId === 0)
    );
    return found?.status;
  };

  const calculateTotal = (santriId: number, sesiId: number) => {
    const totals = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
    
    monthlyData.forEach(day => {
      const found = day.data.find(item => 
        Number(item.id_santri) === Number(santriId) && 
        (Number(item.id_sesi) === Number(sesiId) || sesiId === 0)
      );
      const status = found?.status as keyof typeof totals | undefined;
      
      if (status && status in totals) {
        totals[status]++;
      }
    });
    return totals;
  };

  const getStatusStyle = (status?: AbsensiStatus) => {
    switch (status) {
      case "HADIR": return "bg-green-500 text-white font-bold";
      case "IZIN": return "bg-blue-500 text-white font-bold";
      case "SAKIT": return "bg-yellow-500 text-white font-bold";
      case "TERLAMBAT": return "bg-orange-500 text-white font-bold";
      case "ALFA": return "bg-red-500 text-white font-bold";
      default: return "text-muted-foreground/30 font-medium";
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
              <TableHead rowSpan={2} className="min-w-40 sticky left-0 z-30 bg-muted font-bold border-r border-b text-xs align-middle">
                Nama Santri
              </TableHead>
              {daysInMonth.map((date) => {
                // Tentukan sesi untuk header ini (bisa diambil dari sesiList yg relevan dg halaqah)
                const relevantSesi = sesiList.length > 0 ? sesiList : [{ id_sesi: 0, nama_sesi: "Sesi" } as any];
                return (
                  <TableHead key={date.toString()} colSpan={relevantSesi.length} className="text-center p-1 text-[10px] font-bold border-r border-b">
                    {getDate(date)}
                  </TableHead>
                );
              })}
              <TableHead colSpan={5} className="text-center min-w-10 bg-muted/80 font-black border-r border-b text-primary text-[10px]">
                Total
              </TableHead>
            </TableRow>
            <TableRow className="bg-muted/30">
              {daysInMonth.map((date) => {
                const relevantSesi = sesiList.length > 0 ? sesiList : [{ id_sesi: 0, nama_sesi: "Sesi", singkatan: "-" } as any];
                return relevantSesi.map((sesi) => (
                  <TableHead key={`${date.toString()}-${sesi.id_sesi}`} className="text-center p-1 text-[9px] min-w-[35px] border-r border-b text-muted-foreground truncate" title={sesi.nama_sesi}>
                    {sesi.nama_sesi.substring(0, 3)}
                  </TableHead>
                ));
              })}
              {['H', 'I', 'S', 'T', 'A'].map(label => (
                <TableHead key={label} className="text-center min-w-[40px] bg-muted/50 font-bold border-r border-b text-primary text-[10px]">
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
                  {daysInMonth.map((d) => {
                    const relevantSesi = sesiList.length > 0 ? sesiList : [1];
                    return relevantSesi.map((_, idx) => (
                      <TableCell key={`${d.toString()}-${idx}`} className="p-1 border-r border-b">
                        <Skeleton className="h-6 w-6 rounded-sm mx-auto" />
                      </TableCell>
                    ));
                  })}
                  {Array(5).fill(0).map((_, idx) => (
                    <TableCell key={idx} className="p-1 border-r border-b">
                      <Skeleton className="h-6 w-6 rounded-sm mx-auto" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : currentSantriList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={daysInMonth.length * (Math.max(sesiList.length, 1)) + 6} className="text-center py-10 text-muted-foreground">
                    Data santri tidak ditemukan.
                  </TableCell>
                </TableRow>
            ) : (
              currentSantriList.map((santri) => {
                const id_santri = santri.id_santri;
                const availableSesi = sesiList.filter(s => !s.id_halaqah || s.id_halaqah === santri.id_halaqah);
                const renderSesi = availableSesi.length > 0 ? availableSesi : [{ id_sesi: 0, nama_sesi: "-" } as any];

                // Calculate Grand Total for this santri across all their sessions
                const grandTotals = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
                renderSesi.forEach(sesi => {
                  const t = calculateTotal(id_santri, sesi.id_sesi);
                  grandTotals.HADIR += t.HADIR;
                  grandTotals.IZIN += t.IZIN;
                  grandTotals.SAKIT += t.SAKIT;
                  grandTotals.TERLAMBAT += t.TERLAMBAT;
                  grandTotals.ALFA += t.ALFA;
                });

                return (
                  <TableRow key={id_santri} className="group hover:bg-muted/30">
                    <TableCell className="font-medium sticky left-0 z-20 bg-background border-r border-b py-2 text-xs align-middle">
                      <span className="truncate block w-32 md:w-40 font-bold" title={santri.nama_santri}>{santri.nama_santri}</span>
                    </TableCell>
                    {daysInMonth.map((date) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      return renderSesi.map((sesi) => {
                        const status = getStatusForCell(id_santri, sesi.id_sesi, dateStr) || undefined;
                        return (
                          <TableCell 
                            key={`${date.toString()}-${sesi.id_sesi}`} 
                            className={cn("p-0 border-r border-b text-center text-[10px]", getStatusStyle(status))}
                            title={`${santri.nama_santri} - ${format(date, "dd MMM")} - ${sesi.nama_sesi} : ${status || 'Belum Ada'}`}
                          >
                            <div className="flex h-9 w-full items-center justify-center">
                              {getStatusInitial(status)}
                            </div>
                          </TableCell>
                        );
                      });
                    })}
                    <TableCell className="text-center font-bold border-b border-r bg-green-50/40 text-green-700 text-xs">{grandTotals.HADIR}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-blue-50/40 text-blue-700 text-xs">{grandTotals.IZIN}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-yellow-50/40 text-yellow-700 text-xs">{grandTotals.SAKIT}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-orange-50/40 text-orange-700 text-xs">{grandTotals.TERLAMBAT}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-red-50/40 text-red-700 text-xs">{grandTotals.ALFA}</TableCell>
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