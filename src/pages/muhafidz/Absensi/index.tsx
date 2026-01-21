import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hooks & Services
import { useSantri } from "@/hooks/useSantri";
import { useAbsensi } from "@/hooks/useAbsensi";
import { absensiService, type AbsensiStatus } from "@/services/absensiService";

// Modular Components
import { InputAbsensi } from "./InputAbsensi";
import { RekapAbsensiTable } from "./RekapAbsensiTable";
import { CalendarIcon, InfoIcon } from "lucide-react";

export default function AbsensiPage() {
  // --- States ---
  const { santriList, loadSantri, isLoading: loadingSantri } = useSantri();
  const { submitAbsensiBulk, isSubmitting } = useAbsensi();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AbsensiStatus>>({});
  const [alreadySubmittedIds, setAlreadySubmittedIds] = useState<number[]>([]);
  const [isLoadingSync, setIsLoadingSync] = useState(false);

  /**
   * Fungsi untuk mengambil data absensi yang sudah ada di DB
   * berdasarkan tanggal yang dipilih.
   */
  const syncAttendanceData = useCallback(async () => {
    if (santriList.length === 0) return;
    
    setIsLoadingSync(true);
    // PENTING: Reset state lokal agar data antar tanggal tidak bercampur
    setAlreadySubmittedIds([]);
    setAttendanceMap({});

    try {
      const halaqahId = santriList[0].halaqah_id;
      const tglStr = format(selectedDate, "yyyy-MM-dd");
      
      const response = await absensiService.getRekapHalaqah(halaqahId, tglStr);
      
      const submittedIds: number[] = [];
      const currentMap: Record<number, AbsensiStatus> = {};

      if (response.success && Array.isArray(response.data)) {
        response.data.forEach((item: any) => {
          submittedIds.push(item.santri_id);
          currentMap[item.santri_id] = item.status as AbsensiStatus;
        });
      }

      setAlreadySubmittedIds(submittedIds);
      setAttendanceMap(currentMap);
    } catch (error: any) {
      console.error("Gagal sinkronisasi data absensi:", error);
      // Jika error 404 (data belum ada), kita biarkan state kosong
    } finally {
      setIsLoadingSync(false);
    }
  }, [santriList, selectedDate]);

  // --- Effects ---
  useEffect(() => {
    loadSantri();
  }, [loadSantri]);

  // Sync ulang tiap kali tanggal atau data santri berubah
  useEffect(() => {
    syncAttendanceData();
  }, [syncAttendanceData]);

  // --- Handlers ---
  const handleStatusChange = (id: number, status: AbsensiStatus) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: status }));
  };

  const handleSave = async () => {
    const tanggalStr = format(selectedDate, "yyyy-MM-dd");

    // FILTER: Hanya kirim data yang belum ada di Database (alreadySubmittedIds)
    const newEntries = Object.entries(attendanceMap).filter(([id]) => 
      !alreadySubmittedIds.includes(Number(id))
    );

    if (newEntries.length === 0) {
      toast.info("Semua data sudah tersimpan atau tidak ada pilihan baru.");
      return;
    }

    // Persiapkan payload sesuai dokumentasi POST /api/absensi
    const payloads = newEntries.map(([id, status]) => ({
      santri_id: Number(id),
      status: status,
      tanggal: tanggalStr, // Tanggal dinamis sesuai kalender
      keterangan: "-"
    }));

    try {
      await submitAbsensiBulk(payloads);
      // Refresh data setelah sukses untuk mengunci baris yang baru disimpan
      await syncAttendanceData();
    } catch (error) {
      // Error notification dihandle oleh hook useAbsensi
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Absensi Santri</h1>
          <p className="text-muted-foreground text-sm">
            Kelola kehadiran harian dan lihat rekap bulanan halaqah.
          </p>
        </div>
      </div>

      <Tabs defaultValue="input" className="space-y-4">
        <TabsList className="bg-muted p-1 w-full md:w-auto grid grid-cols-2">
          <TabsTrigger value="input">Input Harian</TabsTrigger>
          <TabsTrigger value="rekap">Rekap Bulanan</TabsTrigger>
        </TabsList>

        {/* TAB INPUT HARIAN */}
        <TabsContent value="input" className="space-y-6 mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-60 justify-start text-left font-normal border-primary/20 hover:border-primary">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {format(selectedDate, "dd MMMM yyyy", { locale: id })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="min-h-[300px]">
            {isLoadingSync || loadingSantri ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <InputAbsensi
                santriList={santriList}
                attendanceMap={attendanceMap}
                alreadySubmittedIds={alreadySubmittedIds}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <p className="text-sm text-muted-foreground italic">
              * Pastikan semua data benar sebelum menekan tombol simpan.
            </p>
            <Button 
              onClick={handleSave} 
              disabled={isSubmitting || isLoadingSync || loadingSantri || santriList.length === 0}
              className="px-10 h-11"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Absensi"}
            </Button>
          </div>
        </TabsContent>

        {/* TAB REKAP BULANAN */}
        <TabsContent value="rekap" className="mt-0">
          <div className="pt-2">
            <RekapAbsensiTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}