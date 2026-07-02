import { useEffect, useMemo } from "react";
import { useLaporanData } from "../hooks/useLaporanData";
import { useLaporanPdf } from "../hooks/useLaporanPdf";
import { laporanService } from "../api/laporanService";

import { LaporanSkeleton } from "../components/LaporanSkeleton";
import { EmptyState } from "../components/EmptyState";
import { LaporanChartSection } from "../components/LaporanChartSection";
import { LaporanTablePro } from "../components/LaporanTablePro";
import { LaporanFilterBar } from "../components/LaporanFilterBar";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileDown, Loader2, RefreshCw, ClipboardList } from "lucide-react";
import { toast } from "sonner";

export function LaporanSetoranPage() {
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
      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Laporan Setoran Hafalan
            </h1>
          </div>
          <p className="text-sm text-muted-foreground pl-9">
            Rekapitulasi setoran ·{" "}
            <span className="font-semibold text-foreground">{periodLabel}</span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pl-9 sm:pl-0">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => refreshData()}
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs font-semibold"
            onClick={handleDownloadPdf}
            disabled={isGenerating || loading || !hasData}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Membuat PDF...
              </>
            ) : (
              <>
                <FileDown className="h-3.5 w-3.5" />
                Unduh PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      {loading ? (
        <LaporanSkeleton />
      ) : !hasData ? (
        <EmptyState isFilterActive={isFilterActive} />
      ) : (
        <div className="space-y-5">
          <LaporanChartSection
            distribusiKategori={stats.distribusiKategori}
            distribusiHalaqah={stats.distribusiHalaqah}
          />

          <Separator />

          {/* Professional sortable table */}
          <LaporanTablePro
            groupedData={groupedData}
            activeHalaqah={activeHalaqah}
            isFilterActive={isFilterActive}
            filterComponent={
              <LaporanFilterBar
                halaqahNames={halaqahNames}
                activeHalaqah={activeHalaqah}
                onHalaqahChange={setActiveHalaqah}
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
