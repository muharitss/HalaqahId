import { useMemo, useState } from "react";
import { useLaporanData } from "../hooks/useLaporanData";
import { useLaporanPdf } from "../hooks/useLaporanPdf";
import { PdfPreviewDialog } from "@/components/custom/pdf-preview-dialog";
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
import { FileDown, RefreshCw } from "lucide-react";
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
    filterMode,
    selectedWeek,
    selectedKategori,
    groupedData,
    halaqahNames,
    santriNames,
    kategoriNames,
    periodLabel,
    isFilterActive,
    setActiveHalaqah,
    setSelectedSantri,
    setSelectedKategori,
    setPeriodFilters,
    resetFilters,
    refreshData,
  } = useLaporanData();

  const { getPdfDocument } = useLaporanPdf();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfDocInfo, setPdfDocInfo] = useState<{
    doc: React.ReactElement;
    filename: string;
    title: string;
  } | null>(null);

  // Hitung stats untuk KPI cards + charts
  const stats = useMemo(() => {
    return laporanService.getSummaryStats(groupedData, activeHalaqah, periodLabel);
  }, [groupedData, activeHalaqah, periodLabel]);

  const hasData = Object.keys(groupedData).length > 0;

  const handlePreviewPdf = () => {
    if (!hasData) {
      toast.warning("Tidak ada data untuk di-export");
      return;
    }
    try {
      const info = getPdfDocument({
        groupedData,
        stats,
        activeHalaqah,
        selectedSantri,
        periodLabel,
        namaSekolah: "Halaqah ID",
      });
      setPdfDocInfo(info);
      setPreviewOpen(true);
    } catch (err) {
      console.error("PDF preview preparation error:", err);
      toast.error("Gagal menyiapkan pratinjau PDF");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── STANDARD PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
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
            onClick={handlePreviewPdf}
            disabled={loading || !hasData}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Unduh PDF Laporan
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
                dateFrom={dateFrom}
                dateTo={dateTo}
                filterMode={filterMode}
                selectedWeek={selectedWeek}
                onPeriodChange={setPeriodFilters}
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
      {/* Dialog Pratinjau PDF */}
      <PdfPreviewDialog
        isOpen={previewOpen}
        onOpenChange={setPreviewOpen}
        document={pdfDocInfo?.doc ?? null}
        filename={pdfDocInfo?.filename ?? ""}
        title={pdfDocInfo?.title}
      />
    </div>
  );
}
