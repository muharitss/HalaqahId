import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { useLaporanData } from "../hooks/useLaporanData";
import { LaporanHeader } from "../components/LaporanHeader";
import { PeriodSelector } from "../components/PeriodSelector";
import { HalaqahSelector } from "../components/HalaqahSelector";
import { SantriAccordion } from "../components/SantriAccordion";
import { EmptyState } from "../components/EmptyState";
import { LaporanSkeleton } from "../components/LaporanSkeleton";

export function LaporanSetoranPage() {
  const {
    loading,
    selectedMonth,
    selectedYear,
    activeHalaqah,
    groupedData,
    halaqahNames,
    setSelectedMonth,
    setSelectedYear,
    setActiveHalaqah,
    refreshData
  } = useLaporanData();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const isFilterActive = selectedMonth !== null || selectedYear !== null || (activeHalaqah !== "" && activeHalaqah !== "all");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <LaporanHeader />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <PeriodSelector 
          selectedMonth={selectedMonth} 
          selectedYear={selectedYear} 
          onMonthChange={setSelectedMonth} 
          onYearChange={setSelectedYear} 
        />
        <HalaqahSelector 
          halaqahNames={halaqahNames} 
          activeHalaqah={activeHalaqah} 
          onHalaqahChange={setActiveHalaqah} 
        />
      </div>

      {loading ? (
        <LaporanSkeleton />
      ) : Object.keys(groupedData).length === 0 ? (
        <EmptyState isFilterActive={isFilterActive} />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedData).map(([halaqahName, group]: [string, any]) => {
            // Filter locally if a specific halaqah is selected
            if (activeHalaqah !== "all" && activeHalaqah !== "" && halaqahName !== activeHalaqah) {
              return null;
            }

            return (
              <div key={halaqahName} className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <FontAwesomeIcon icon={faUserGraduate} className="text-primary h-4 w-4" />
                  <h3 className="font-bold text-lg">Halaqah {halaqahName}</h3>
                </div>
                <SantriAccordion santriGroup={group.santriGroup} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
