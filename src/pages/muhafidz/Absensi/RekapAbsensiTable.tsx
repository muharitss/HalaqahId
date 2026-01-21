import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSantri } from "@/hooks/useSantri";
import { absensiService, type AbsensiStatus } from "@/services/absensiService";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDate, 
} from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

export const RekapAbsensiTable = () => {
  const { santriList, isLoading: loadingSantri, loadSantri } = useSantri();
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 1. Dapatkan daftar tanggal untuk kolom (1 - 30/31)
  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(viewDate),
      end: endOfMonth(viewDate)
    });
  }, [viewDate]);

  // 2. Fungsi untuk mengambil data satu bulan (Looping Harian sesuai spek API)
  const fetchMonthlyRekap = useCallback(async () => {
    if (santriList.length === 0) return;
    
    setIsLoadingData(true);
    try {
      const halaqahId = santriList[0].halaqah_id;
      
      // Persiapkan request untuk setiap hari dalam sebulan
      const requests = daysInMonth.map(date => {
        const dateStr = format(date, "yyyy-MM-dd");
        return absensiService.getRekapHalaqah(halaqahId, dateStr)
          .then(res => ({
            tanggal: dateStr,
            data: res.data // Array berisi santri yang diabsen di hari itu
          }))
          .catch(() => ({ tanggal: dateStr, data: [] }));
      });

      const results = await Promise.all(requests);
      
      // Gabungkan semua data harian ke dalam satu state
      setMonthlyData(results);
    } catch (error) {
      console.error("Gagal memuat rekap bulanan:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, [santriList, daysInMonth]);

  useEffect(() => {
    if (santriList.length === 0) loadSantri();
  }, [loadSantri, santriList.length]);

  useEffect(() => {
    fetchMonthlyRekap();
  }, [fetchMonthlyRekap]);

  // 3. Helper untuk mencari status santri di tanggal tertentu
  const getStatusForCell = (santriId: number, dateStr: string) => {
    const dayData = monthlyData.find(m => m.tanggal === dateStr);
    if (!dayData) return null;

    // Cari santri di dalam array data harian
    // Sesuai spek API: item.santri.id atau item.santri_id
    const record = dayData.data.find((item: any) => 
       item.santri_id === santriId || item.santri?.id_santri === santriId
    );
    
    return record?.status as AbsensiStatus | undefined;
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

  const getStatusInitial = (status?: AbsensiStatus) => {
    if (!status) return "-";
    return status.charAt(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Laporan Kehadiran</h3>
          <p className="text-sm text-muted-foreground">
            Periode: {format(viewDate, "MMMM yyyy", { locale: id })}
          </p>
        </div>
        
        <Select 
          value={format(viewDate, "yyyy-MM")} 
          onValueChange={(val) => setViewDate(new Date(val))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Bulan" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }).map((_, i) => {
              const d = new Date();
              d.setMonth(d.getMonth() - i);
              return (
                <SelectItem key={i} value={format(d, "yyyy-MM")}>
                  {format(d, "MMMM yyyy", { locale: id })}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-x-auto relative shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="min-w-[160px] sticky left-0 z-30 bg-muted font-bold border-r">
                Nama Santri
              </TableHead>
              {daysInMonth.map((date) => (
                <TableHead key={date.toString()} className="text-center min-w-[35px] p-0 text-[10px] font-bold border-r">
                  {getDate(date)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingSantri || isLoadingData ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="sticky left-0 bg-background border-r">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  {daysInMonth.map((d) => (
                    <TableCell key={d.toString()} className="p-1">
                      <Skeleton className="h-6 w-6 rounded-sm" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              santriList.map((s) => (
                <TableRow key={s.id_santri} className="hover:bg-muted/30">
                  <TableCell className="font-medium sticky left-0 bg-background z-20 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] py-2 text-xs">
                    <span className="truncate block w-32 md:w-40">{s.nama_santri}</span>
                  </TableCell>
                  {daysInMonth.map((date) => {
                    const status = getStatusForCell(s.id_santri, format(date, "yyyy-MM-dd")) as any;
                    return (
                      <TableCell 
                        key={date.toString()} 
                        className={getStatusStyle(status)}
                      >
                        {getStatusInitial(status)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> H (Hadir)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full" /> I (Izin)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full" /> S (Sakit)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full" /> T (Terlambat)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full" /> A (Alfa)</div>
      </div>
    </div>
  );
};