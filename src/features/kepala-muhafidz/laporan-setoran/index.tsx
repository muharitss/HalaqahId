import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faUsers, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { RekapAbsensiTable } from "@/features/muhafidz/absensi/components/RekapAbsensiTable";

import { useLaporanData } from "./hooks/useLaporanData";
import { LaporanHeader } from "./components/LaporanHeader";
import { HalaqahSelector } from "./components/HalaqahSelector";
import { SantriAccordion } from "./components/SantriAccordion";
import { EmptyState } from "./components/EmptyState";
import { LaporanSkeleton } from "./components/LaporanSkeleton";
import { PeriodSelector } from "./components/PeriodSelector";
import { DisplaySantriList } from "./components/DisplaySantriList";
import { SantriDetailView } from "./components/SantriDetailView";
import { useState } from "react";

export default function LaporanSetoranPage() {
  const {
    loading,
    selectedMonth,
    activeHalaqah,
    groupedData,
    halaqahNames,
    activeHalaqahId,
    santriForAbsensi,
    masterSantri,
    selectedYear,
    setSelectedMonth, 
    setSelectedYear,
    setActiveHalaqah,
  } = useLaporanData();

  const [searchSantri, setSearchSantri] = useState("");
  const [selectedSantriId, setSelectedSantriId] = useState<number | null>(null);

  const handleHalaqahChange = (name: string) => {
    setActiveHalaqah(name);
    setSelectedSantriId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <LaporanHeader />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <HalaqahSelector
            halaqahNames={halaqahNames}
            activeHalaqah={activeHalaqah}
            onHalaqahChange={handleHalaqahChange}
          />

        </div>
      </div>

      <Tabs defaultValue="setoran" className="space-y-6">
        <TabsList className="grid w-full md:w-150 grid-cols-3 bg-muted/50 p-1">
          <TabsTrigger value="setoran" className="gap-2">
            <FontAwesomeIcon icon={faFileLines} className="h-3.5 w-3.5" /> Setoran
          </TabsTrigger>
          <TabsTrigger value="absensi" className="gap-2">
            <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5" /> Absensi
          </TabsTrigger>
          <TabsTrigger value="display" className="gap-2">
            <FontAwesomeIcon icon={faIdCard} className="h-3.5 w-3.5" /> Info Santri
          </TabsTrigger>
        </TabsList>

       <TabsContent value="setoran" className="min-h-100 mt-0">
        {loading ? (
          <LaporanSkeleton />
        ) : (
          <div className="space-y-6">          
            {halaqahNames.length === 0 ? (
              <EmptyState isFilterActive={selectedMonth !== null} />
            ) : (
              <div className="space-y-8">
                {/* HEADER TAB SECTION */}
                <div className="flex items-center gap-2 border-b pb-4">
                  <FontAwesomeIcon icon={faUsers} className="text-primary h-4 w-4" />
                  <h3 className="font-bold text-lg">
                    Daftar Progres: <span className="text-primary capitalize">{activeHalaqah === "all" ? "Semua Halaqah" : activeHalaqah}</span>
                  </h3>
                </div>
                <div className="flex justify-end">
                  <PeriodSelector 
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthChange={setSelectedMonth}
                    onYearChange={setSelectedYear}
                  />
                </div>


                {activeHalaqah === "all" ? (
                  // LOOPING SEMUA HALAQAH
                  <div className="space-y-12">
                    {Object.entries(groupedData).map(([hName, data]) => (
                      <div key={hName} className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <h3 className="font-bold text-lg capitalize">
                            Halaqah: <span className="text-primary">{hName}</span>
                          </h3>
                        </div>
                        <SantriAccordion santriGroup={data.santriGroup} />
                      </div>
                    ))}
                  </div>
                ) : (
                  // TAMPILKAN SATU HALAQAH SAJA
                  activeHalaqah && groupedData[activeHalaqah] && (
                    <div className="space-y-2">
                      <SantriAccordion santriGroup={groupedData[activeHalaqah].santriGroup} />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </TabsContent>

          <TabsContent value="absensi" className="mt-0">
            {/* Sekarang bisa tampil meskipun activeHalaqahId null (berarti mode "All") */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-4">
                <FontAwesomeIcon icon={faUsers} className="text-primary h-4 w-4" />
                <h3 className="font-bold text-lg">
                  Rekap Kehadiran: <span className="text-primary capitalize">{activeHalaqah === "all" ? "Semua Halaqah" : activeHalaqah}</span>
                </h3>
              </div>
              <RekapAbsensiTable 
                halaqahId={activeHalaqahId || undefined} 
                externalSantriList={activeHalaqah === "all" ? masterSantri : santriForAbsensi} 
              />
            </div>
          </TabsContent>

          <TabsContent value="display" className="mt-0">
             <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-4">
                <FontAwesomeIcon icon={faIdCard} className="text-primary h-4 w-4" />
                <h3 className="font-bold text-lg">
                  Info Santri: <span className="text-primary capitalize">{activeHalaqah === "all" ? "Semua Halaqah" : activeHalaqah}</span>
                </h3>
              </div>
              
              {!selectedSantriId ? (
                <DisplaySantriList 
                  santriList={activeHalaqah === "all" ? masterSantri : santriForAbsensi}
                  searchQuery={searchSantri}
                  onSearchChange={setSearchSantri}
                  onSelectSantri={(id: number) => setSelectedSantriId(id)}
                />
              ) : (
                <SantriDetailView 
                  id={selectedSantriId} 
                  onBack={() => setSelectedSantriId(null)} 
                />
              )}
            </div>
          </TabsContent>
      </Tabs>
    </div>
  );
}

