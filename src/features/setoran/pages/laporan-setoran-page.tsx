import { useEffect, useMemo } from "react";
import { useLaporanData } from "../hooks/useLaporanData";
import { useLaporanPdf } from "../hooks/useLaporanPdf";
import { laporanService } from "../api/laporanService";
import { useAuth } from "@/features/auth/components/auth-provider";
import { Role } from "@/types/domain/enums";

import {
  LaporanSkeleton,
  EmptyState,
  LaporanTablePro,
  LaporanFilterBar,
  LaporanStatsCard,
} from "../modules/laporan";

import { Button } from "@/components/ui/button";
import { FileDown, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function LaporanSetoranPage() {
  const { user } = useAuth();
  const showHalaqahSelect = user?.role !== Role.MUHAFIZ;

  const {
    loading,
    selectedMonth,
    selectedYear,
    activeHalaqah,
    selectedSantri,
    dateFrom,
    dateTo,
    selectedKategori,
    groupedData,
    halaqahNames,
    santriNames,
    kategoriNames,
    periodLabel,
    isFilterActive,
    setSelectedMonth,
    setSelectedYear,
    setActiveHalaqah,
    setSelectedSantri,
    setDateFrom,
    setDateTo,
    setSelectedKategori,
    resetFilters,
    refreshData,
  } = useLaporanData();

  const { generatePdf, isGenerating } = useLaporanPdf();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Hitung stats untuk KPI cards + charts
  const stats = useMemo(() => {
    return laporanService.getSummaryStats(groupedData, activeHalaqah, periodLabel);
  }, [groupedData, activeHalaqah, periodLabel]);

  const hasData = Object.keys(groupedData).length > 0;

  const handleDownloadPdf = async () => {
    if (!hasData) {
      toast.warning("Tidak ada data untuk di-export");
      return;
    }
    try {
      await generatePdf({
        groupedData,
        stats,
        activeHalaqah,
        periodLabel,
        namaSekolah: "Halaqah ID",
      });
      toast.success("Laporan PDF berhasil diunduh!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Gagal membuat PDF, silakan coba lagi");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── STANDARD PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Laporan Setoran Hafalan
          </h1>
          <p className="text-sm text-muted-foreground">
            Rekapitulasi setoran tahfiz terpusat periode {periodLabel}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshData()}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          
          <Button
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isGenerating || loading || !hasData}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Membuat PDF...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Unduh PDF Laporan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── MAIN ANALYTICS CONTENT ───────────────────────────────────────── */}
      {loading ? (
        <LaporanSkeleton />
      ) : !hasData ? (
        <EmptyState isFilterActive={isFilterActive} />
      ) : (
        <div className="space-y-6">
          {/* KPI Dashboard Cards */}
          <LaporanStatsCard stats={stats} />

          {/* Detailed Auditable Table */}
          <LaporanTablePro
            groupedData={groupedData}
            activeHalaqah={activeHalaqah}
            isFilterActive={isFilterActive}
            filterComponent={
              <LaporanFilterBar
                halaqahNames={halaqahNames}
                activeHalaqah={activeHalaqah}
                onHalaqahChange={setActiveHalaqah}
                showHalaqahSelect={showHalaqahSelect}
                santriNames={santriNames}
                selectedSantri={selectedSantri}
                onSantriChange={setSelectedSantri}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
                selectedKategori={selectedKategori}
                onKategoriChange={setSelectedKategori}
                kategoriNames={kategoriNames}
                onReset={resetFilters}
                isFilterActive={isFilterActive}
              />
            }
          />
        </div>
      )}
    </div>
  );
}
