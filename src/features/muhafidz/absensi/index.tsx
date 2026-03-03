import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom"; // Penting untuk Mode Kontrol
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import { CalendarIcon, AlertCircle } from "lucide-react";

// Import internal
import { useSantri } from "@/features/muhafidz/kelola-santri/hooks/useSantri"; 
import { useAbsensi } from "./hooks/useAbsensi";
import { absensiService, } from "./services/absensiService";
import { InputAbsensi } from "./components/InputAbsensi";
import { RekapAbsensiTable } from "./components/RekapAbsensiTable";

// Import UI/Typed Text
import { Absensi } from "@/components/typed-text";
import type { AbsensiRecord, AbsensiStatus } from "./types";

export default function AbsensiPage({ hideHeader = false }: { hideHeader?: boolean }) {
  // --- Route Params ---
  const { halaqahId: paramHalaqahId } = useParams();

  // --- Data States ---
  const { santriList, loadSantri, isLoading: loadingSantri } = useSantri();
  const { submitAbsensiBulk, isSubmitting } = useAbsensi();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AbsensiStatus>>({});
  const [alreadySubmittedIds, setAlreadySubmittedIds] = useState<number[]>([]);
  const [isLoadingSync, setIsLoadingSync] = useState(false);
  

  /**
   * Mengambil data absensi yang sudah tersimpan di server 
   * untuk tanggal yang dipilih
   */
  const syncAttendanceData = useCallback(async () => {
    // Logic penentuan ID: Ambil dari URL (Kepala Muhafidz) atau fallback ke santri pertama (Muhafidz)
    const idFromUrl = paramHalaqahId ? Number(paramHalaqahId) : NaN;
    const idFromList = (santriList && santriList.length > 0) ? santriList[0].halaqah_id : NaN;
    
    const activeHalaqahId = !isNaN(idFromUrl) ? idFromUrl : idFromList;

    // Guard Clause: Jangan tembak API jika ID belum tersedia
    if (!activeHalaqahId || isNaN(activeHalaqahId)) return; 

    setIsLoadingSync(true);
    try {
      const tglStr = format(selectedDate, "yyyy-MM-dd");
      const response = await absensiService.getRekapHalaqah(activeHalaqahId, tglStr);
      
      const records = response.data as AbsensiRecord[] || [];
      const newMap: Record<number, AbsensiStatus> = {};
      const submittedIds: number[] = [];

      // Mapping data dari backend ke state UI
      records.forEach((rec) => {
        newMap[rec.santri_id] = rec.status;
        submittedIds.push(rec.santri_id);
      });

      setAttendanceMap(newMap);
      setAlreadySubmittedIds(submittedIds);
    } catch (error) {
      console.error("Gagal sinkronisasi absensi:", error);
      toast.error("Gagal mengambil data absensi yang sudah tersimpan.");
    } finally {
      setIsLoadingSync(false);
    }
  }, [santriList, selectedDate, paramHalaqahId]);

  // Load awal data santri
  useEffect(() => {
    loadSantri();
  }, [loadSantri]);

  // Sinkronisasi data absensi setiap kali tanggal berubah atau daftar santri tersedia
  useEffect(() => {
    if (santriList.length > 0 || paramHalaqahId) {
      syncAttendanceData();
    }
  }, [syncAttendanceData, santriList.length, paramHalaqahId]);

  const handleStatusChange = (id: number, status: AbsensiStatus) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: status }));
  };

  const handleSave = async () => {
    const tanggalStr = format(selectedDate, "yyyy-MM-dd");

    // Hanya kirim data yang belum pernah di-submit sebelumnya (ID tidak ada di database)
    const newEntries = Object.entries(attendanceMap).filter(([id]) => 
      !alreadySubmittedIds.includes(Number(id))
    );

    if (newEntries.length === 0) {
      toast.info("Tidak ada perubahan baru untuk disimpan.");
      return;
    }

    const payloads = newEntries.map(([id, status]) => ({
      santri_id: Number(id),
      status: status,
      tanggal: tanggalStr, 
      keterangan: "-"
    }));

    try {
      await submitAbsensiBulk(payloads);
      toast.success("Absensi berhasil disimpan!");
      await syncAttendanceData(); // Refresh data untuk mengunci (lock) row
    } catch (error) {
      console.error("Gagal menyimpan absensi:", error);
      toast.error("Gagal menyimpan data absensi. Silakan coba lagi.");

    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {!hideHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
          <div className="space-y-1">
            <Absensi />
          </div>
        </div>
      )}

      <Tabs defaultValue="input" className="space-y-4">
        <TabsList className="bg-muted p-1 w-full md:w-auto grid grid-cols-2 max-w-sm">
          <TabsTrigger value="input">Input Harian</TabsTrigger>
          <TabsTrigger value="rekap">Rekap Bulanan</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6 mt-0 focus-visible:outline-none">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-60 justify-start text-left font-normal border-primary/20 hover:border-primary shadow-sm">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {format(selectedDate, "dd MMMM yyyy", { locale: localeId })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            {isLoadingSync || loadingSantri ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : santriList.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground opacity-20 mb-4" />
                <p className="text-muted-foreground font-medium">Tidak ada santri di halaqah ini.</p>
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

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
            <div className="flex items-start gap-3 text-muted-foreground italic text-xs max-w-md">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>Data yang sudah disimpan (tanda "Tercatat") tidak dapat diubah kembali melalui halaman ini.</p>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isSubmitting || isLoadingSync || loadingSantri || santriList.length === 0}
              className="w-full md:w-auto px-12 h-11 font-bold shadow-lg shadow-primary/20"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Absensi"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="rekap" className="mt-0 focus-visible:outline-none">
          <div className="pt-2">
            <RekapAbsensiTable 
              halaqahId={paramHalaqahId ? Number(paramHalaqahId) : (santriList[0]?.halaqah_id)} 
              externalSantriList={santriList}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

