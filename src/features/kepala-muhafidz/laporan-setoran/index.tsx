import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faUsers } from "@fortawesome/free-solid-svg-icons";
import { RekapAbsensiTable } from "@/features/muhafidz/absensi/components/RekapAbsensiTable";

import { useLaporanData } from "./hooks/useLaporanData";
import { LaporanHeader } from "./components/LaporanHeader";
import { HalaqahSelector } from "./components/HalaqahSelector";
import { PeriodSelector } from "./components/PeriodSelector";
import { SantriAccordion } from "./components/SantriAccordion";
import { EmptyState } from "./components/EmptyState";
import { LaporanSkeleton } from "./components/LaporanSkeleton";

export default function LaporanSetoranPage() {
  const {
    loading,
    selectedMonth,
    selectedYear,
    activeHalaqah,
    groupedData,
    halaqahNames,
    activeHalaqahId,
    santriForAbsensi,
    setSelectedMonth,
    setSelectedYear,
    setActiveHalaqah,
  } = useLaporanData();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <LaporanHeader />

        <div className="flex flex-col sm:flex-row gap-3">
          <HalaqahSelector
            halaqahNames={halaqahNames}
            activeHalaqah={activeHalaqah}
            onHalaqahChange={setActiveHalaqah}
          />

          <PeriodSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
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
            <LaporanSkeleton />
          ) : halaqahNames.length === 0 ? (
            <EmptyState isFilterActive={selectedMonth !== null} />
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
              {activeHalaqah && groupedData[activeHalaqah] && (
                <>
                  <div className="flex items-center gap-2 px-1">
                    <FontAwesomeIcon icon={faUsers} className="text-primary h-4 w-4" />
                    <h3 className="font-bold text-lg capitalize">
                      Daftar Progres: <span className="text-primary">{activeHalaqah}</span>
                    </h3>
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
                <h3 className="font-bold text-lg">
                  Rekap Kehadiran: <span className="text-primary capitalize">{activeHalaqah}</span>
                </h3>
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