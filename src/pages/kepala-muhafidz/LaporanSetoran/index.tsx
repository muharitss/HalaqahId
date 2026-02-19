import { useEffect, useMemo, useState } from "react";
import { useSetoran } from "@/hooks/useSetoran";
import { useHalaqah } from "@/hooks/useHalaqah"; // Tambahkan ini
import { useSantri } from "@/hooks/useSantri";   // Tambahkan ini
import { transformSetoranData } from "@/lib/dataTransformer";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Icons & Local Components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUserGraduate, faUsers, faFileLines } from "@fortawesome/free-solid-svg-icons";
import LaporanHeader from "@/components/ui/TypedText";
import { SantriAccordion } from "./SantriAccordion";
import { RekapAbsensiTable } from "../../muhafidz/Absensi/RekapAbsensiTable";

const MONTHS = [
  { label: "Semua Bulan", value: "all" },
  { label: "Januari", value: "0" }, { label: "Februari", value: "1" },
  { label: "Maret", value: "2" }, { label: "April", value: "3" },
  { label: "Mei", value: "4" }, { label: "Juni", value: "5" },
  { label: "Juli", value: "6" }, { label: "Agustus", value: "7" },
  { label: "September", value: "8" }, { label: "Oktober", value: "9" },
  { label: "November", value: "10" }, { label: "Desember", value: "11" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function LaporanSetoranPage() {
  const { allSetoran, fetchAllSetoran, loading } = useSetoran();
  const { halaqah: listHalaqah, fetchHalaqah } = useHalaqah();
  const { santriList: masterSantri, loadSantri } = useSantri();
  
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear());
  const [activeHalaqah, setActiveHalaqah] = useState<string>("");

  useEffect(() => {
    fetchAllSetoran();
    fetchHalaqah();
    loadSantri();
  }, [fetchAllSetoran, fetchHalaqah, loadSantri]);

  const groupedData = useMemo(() => {
    const filter = {
      month: selectedMonth, 
      year: selectedYear,   
    };
    
    return transformSetoranData(allSetoran, filter);
  }, [allSetoran, selectedMonth, selectedYear]);

  const halaqahNames = Object.keys(groupedData);

  useEffect(() => {
    if (halaqahNames.length > 0 && (!activeHalaqah || !halaqahNames.includes(activeHalaqah))) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveHalaqah(halaqahNames[0]);
    }
  }, [halaqahNames, activeHalaqah]);


  // JEMBATAN: Cari ID Halaqah numerik berdasarkan nama yang dipilih
  const activeHalaqahId = useMemo(() => {
    return listHalaqah.find(h => h.name_halaqah === activeHalaqah)?.id_halaqah;
  }, [listHalaqah, activeHalaqah]);

  // JEMBATAN: Ambil daftar santri lengkap (bukan cuma yang setor) untuk Absensi
  const santriForAbsensi = useMemo(() => {
    if (!activeHalaqahId) return [];
    return masterSantri.filter(s => s.halaqah_id === activeHalaqahId);
  }, [masterSantri, activeHalaqahId]);

  const periodLabel = (selectedMonth === null || selectedYear === null)
    ? "Semua Periode"
    : format(new Date(selectedYear ?? 0, selectedMonth ?? 0), "MMMM yyyy", { locale: id });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <LaporanHeader />
          <p className="text-sm text-muted-foreground mt-1">Monitoring progres dan kehadiran per halaqah.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={activeHalaqah} onValueChange={setActiveHalaqah}>
            <SelectTrigger className="w-full sm:w-50 bg-background shadow-sm">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5 text-primary/60" />
                <SelectValue placeholder="Pilih Halaqah" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {halaqahNames.map((name) => (
                <SelectItem key={name} value={name} className="capitalize">{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-55 justify-start text-left font-normal shadow-sm">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 h-4 w-4 opacity-50" />
                {periodLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-semibold text-sm">Filter Periode</h4>
                  <Button variant="ghost" className="h-auto p-0 text-xs text-primary" onClick={() => { setSelectedMonth(null); setSelectedYear(null); }}>Reset</Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-muted-foreground font-bold ml-1">Bulan</label>
                    <Select value={selectedMonth?.toString() ?? "all"} onValueChange={(v) => setSelectedMonth(v === "all" ? null : parseInt(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-muted-foreground font-bold ml-1">Tahun</label>
                    <Select value={selectedYear?.toString() ?? "all"} onValueChange={(v) => setSelectedYear(v === "all" ? null : parseInt(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        {years.map((y) => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="setoran" className="space-y-6">
        <TabsList className="grid w-full md:w-100 grid-cols-2 bg-muted/50 p-1">
          <TabsTrigger value="setoran" className="gap-2">
            <FontAwesomeIcon icon={faFileLines} className="h-3.5 w-3.5" /> Setoran
          </TabsTrigger>
          <TabsTrigger value="absensi" className="gap-2">
            <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5" /> Absensi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setoran" className="min-h-100 mt-0">
          {loading ? (
            <div className="space-y-4 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-40" /></div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : halaqahNames.length === 0 ? (
            <EmptyState isFilterActive={selectedMonth !== null} />
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
              {activeHalaqah && groupedData[activeHalaqah] && (
                <>
                  <div className="flex items-center gap-2 px-1">
                    <FontAwesomeIcon icon={faUserGraduate} className="text-primary h-4 w-4" />
                    <h3 className="font-bold text-lg capitalize">Daftar Progres: <span className="text-primary">{activeHalaqah}</span></h3>
                  </div>
                  <SantriAccordion santriGroup={groupedData[activeHalaqah].santriGroup} />
                </>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="absensi" className="mt-0">
          {activeHalaqahId ? (
            <div>
              <div className="mb-6 flex items-center gap-2 border-b pb-4">
                <FontAwesomeIcon icon={faUsers} className="text-primary h-4 w-4" />
                <h3 className="font-bold text-lg">Rekap Kehadiran: <span className="text-primary capitalize">{activeHalaqah}</span></h3>
              </div>
              <RekapAbsensiTable 
                halaqahId={activeHalaqahId} 
                externalSantriList={santriForAbsensi} 
              />
            </div>
          ) : (
              <p className="text-muted-foreground italic">Pilih halaqah terlebih dahulu.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ isFilterActive }: { isFilterActive: boolean }) {
  return (
    <Card className="border-dashed flex flex-col items-center justify-center p-16 text-center bg-muted/20">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FontAwesomeIcon icon={faCalendarAlt} className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-semibold">Data Tidak Ditemukan</h3>
      <p className="text-sm text-muted-foreground max-w-xs mt-1">
        {isFilterActive ? "Tidak ada setoran untuk periode ini." : "Database setoran masih kosong."}
      </p>
    </Card>
  );
}