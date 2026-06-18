import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom"; // Penting untuk Mode Kontrol
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import { CalendarIcon, AlertCircle } from "lucide-react";

// Import internal
import { useSantri } from "@/features/muhafidz/kelola-santri/hooks/useSantri";
import { useAbsensi } from "./hooks/useAbsensi";
import { absensiService } from "./services/absensiService";
import { sesiService } from "@/services/sesiService";
import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";
import { InputAbsensi } from "./components/InputAbsensi";
import { RekapAbsensiTable } from "./components/RekapAbsensiTable";

// Import UI/Typed Text
import { Absensi } from "@/components/typed-text";
import type { AbsensiSantri as AbsensiRecord } from "@/types/domain/absensi";
import type { StatusKehadiran as AbsensiStatus } from "@/types/domain/enums";
export default function AbsensiPage({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  // --- Route Params ---
  const { halaqahId: paramHalaqahId } = useParams();

  // --- Data States ---
  const { santriList, loadSantri, isLoading: loadingSantri } = useSantri();
  const { submitAbsensiBulk, isSubmitting } = useAbsensi();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceMap, setAttendanceMap] = useState<
    Record<number, AbsensiStatus>
  >({});
  const [submittedAttendance, setSubmittedAttendance] = useState<
    Record<number, AbsensiStatus>
  >({});
  const [isLoadingSync, setIsLoadingSync] = useState(false);
  const [sesiList, setSesiList] = useState<SesiHalaqah[]>([]);
  const [selectedSesi, setSelectedSesi] = useState<number | null>(null);

  // --- Derived State ---
  const uniqueHalaqahIds = useMemo(() => {
    const idFromUrl = paramHalaqahId ? Number(paramHalaqahId) : NaN;
    if (!isNaN(idFromUrl)) return [idFromUrl];
    
    return Array.from(
      new Set(santriList.map((s) => s.id_halaqah).filter((id) => !!id)),
    );
  }, [paramHalaqahId, santriList]);

  const filteredSesiList = useMemo(() => {
    return sesiList.filter(
      (sesi) => !sesi.id_halaqah || uniqueHalaqahIds.includes(sesi.id_halaqah)
    );
  }, [sesiList, uniqueHalaqahIds]);

  /**
   * Mengambil data absensi yang sudah tersimpan di server
   * untuk sesi dan tanggal yang dipilih
   */
  const syncAttendanceData = useCallback(async () => {
    // Guard Clause: Jangan tembak API jika sesi belum terpilih
    if (!selectedSesi) return;

    setIsLoadingSync(true);
    try {
      const tglStr = format(selectedDate, "yyyy-MM-dd");

      // Gunakan endpoint per sesi sesuai panduan API
      const response = await absensiService.getAbsensiSesi(selectedSesi, tglStr);
      const records = (response.data as AbsensiRecord[]) || [];

      const newMap: Record<number, AbsensiStatus> = {};

      records.forEach((rec) => {
        newMap[rec.id_santri] = rec.status;
      });

      setSubmittedAttendance(newMap);
      setAttendanceMap({});
    } catch (error) {
      console.error("Gagal sinkronisasi absensi:", error);
      toast.error("Gagal mengambil data absensi yang sudah tersimpan.");
    } finally {
      setIsLoadingSync(false);
    }
  }, [selectedDate, selectedSesi]);

  // Load awal data santri
  useEffect(() => {
    loadSantri();
  }, [loadSantri]);

  useEffect(() => {
    const fetchSesi = async () => {
      try {
        const response = await sesiService.getSesiHalaqah();
        const sesi = response.data || [];
        setSesiList(sesi);
      } catch (error) {
        console.error("Gagal memuat sesi halaqah:", error);
      }
    };
    fetchSesi();
  }, []);

  // Sinkronisasi data absensi setiap kali tanggal atau sesi berubah
  useEffect(() => {
    if (selectedSesi) {
      syncAttendanceData();
    }
  }, [syncAttendanceData, selectedSesi]);

  // Handle otomatisasi pilihan Sesi berdasarkan filteredSesiList
  useEffect(() => {
    if (filteredSesiList.length > 0) {
      const isSelectedValid = filteredSesiList.some(s => s.id_sesi === selectedSesi);
      if (!isSelectedValid) {
        setSelectedSesi(filteredSesiList[0].id_sesi);
      }
    } else if (sesiList.length > 0 && uniqueHalaqahIds.length > 0) {
      // Jika halaqah aktif tidak punya sesi yang valid, reset pilihan sesi
      setSelectedSesi(null);
    }
  }, [filteredSesiList, selectedSesi, sesiList.length, uniqueHalaqahIds.length]);

  const handleStatusChange = (id: number, status: AbsensiStatus) => {
    setAttendanceMap((prev) => {
      // Jika status yang dipilih sama dengan status yang sudah ada di DRAFT, hapus dari draft (toggle)
      if (prev[id] === status) {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      }
      return { ...prev, [id]: status };
    });
  };

  const handleSave = async () => {
    const tanggalStr = format(selectedDate, "yyyy-MM-dd");

    // Ambil semua entri di attendanceMap (draft perubahan)
    const draftEntries = Object.entries(attendanceMap);

    if (draftEntries.length === 0) {
      toast.info("Tidak ada perubahan untuk disimpan.");
      return;
    }

    const payloads = draftEntries.map(([id, status]) => ({
      id_santri: Number(id),
      id_sesi: selectedSesi!,
      status: status,
      tanggal: tanggalStr,
      keterangan: "-",
    }));

    try {
      await submitAbsensiBulk(payloads);
      toast.success("Absensi berhasil diperbarui!");
      setAttendanceMap({}); // Kosongkan draft setelah simpan
      await syncAttendanceData(); // Refresh data dari server
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

        <TabsContent
          value="input"
          className="space-y-6 mt-0 focus-visible:outline-none"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-end gap-2">
            <Select
              value={selectedSesi ? selectedSesi.toString() : ""}
              onValueChange={(val) => setSelectedSesi(Number(val))}
              disabled={isLoadingSync || filteredSesiList.length === 0}
            >
              <SelectTrigger className="w-full md:w-60 border-primary/20 shadow-sm">
                <SelectValue placeholder="Pilih Sesi" />
              </SelectTrigger>
              <SelectContent>
                {filteredSesiList.map((sesi) => (
                  <SelectItem
                    key={sesi.id_sesi}
                    value={sesi.id_sesi.toString()}
                  >
                    {sesi.nama_sesi} ({sesi.jam_mulai} - {sesi.jam_selesai})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-60 justify-start text-left font-normal border-primary/20 hover:border-primary shadow-sm"
                >
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
                <p className="text-muted-foreground font-medium">
                  Tidak ada santri di halaqah ini.
                </p>
              </div>
            ) : (
              <InputAbsensi
                santriList={santriList}
                attendanceMap={attendanceMap}
                submittedAttendance={submittedAttendance}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
            <div className="flex items-start gap-2 text-muted-foreground italic text-xs max-w-md">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Pilih status untuk mencatat atau mengubah kehadiran. Klik
                "Simpan" jika terdapat label "Draft" berwarna jingga.
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={
                isSubmitting ||
                isLoadingSync ||
                loadingSantri ||
                santriList.length === 0 ||
                !selectedSesi
              }
              className="w-full md:w-auto px-12 h-11 font-bold shadow-lg shadow-primary/20"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Absensi"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="rekap" className="mt-0 focus-visible:outline-none">
          <div className="pt-2">
            <RekapAbsensiTable
              halaqahId={paramHalaqahId ? Number(paramHalaqahId) : undefined}
              externalSantriList={santriList}
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
            <div className="flex items-start gap-3 text-muted-foreground italic text-xs max-w-md">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Tabel ini menampilkan rekapitulasi kehadiran santri per bulan.
                Gunakan filter di atas tabel untuk melihat data bulan lainnya.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
