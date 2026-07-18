import { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useProfilSekolah } from "@/features/sekolah";
import { AbsensiPdfTemplate, type AbsensiPdfRow, type AbsensiPdfStats } from "../components/AbsensiPdfTemplate";
import type { MonthlyAbsensiData } from "../types";
import type { Santri } from "@/features/santri";
import type { SesiHalaqah } from "@/types/domain/sesi-halaqah";

interface UseAbsensiPdfOptions {
  santriList: Santri[];
  monthlyData: MonthlyAbsensiData[];
  filteredSesiList: SesiHalaqah[];
  viewDate: Date;
  halaqahId?: number;
}

export function useAbsensiPdf() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { sekolah } = useProfilSekolah();

  const getPdfDocument = useCallback(({
    santriList,
    monthlyData,
    filteredSesiList,
    viewDate,
    halaqahId,
  }: UseAbsensiPdfOptions) => {
    let counter = 1;
    const rows: AbsensiPdfRow[] = [];

    const stats: AbsensiPdfStats = {
      totalSantri: santriList.length,
      rataRataKehadiran: 0,
      totalHadir: 0,
      totalIzin: 0,
      totalSakit: 0,
      totalTerlambat: 0,
      totalAlfa: 0,
    };

    let sumPercentage = 0;

    // Helper function to calculate status totals for a student and a session
    const calculateTotal = (santriId: number, sesiId: number) => {
      const totals = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
      monthlyData.forEach((day) => {
        const found = day.data.find(
          (item) =>
            Number(item.id_santri) === Number(santriId) &&
            (Number(item.id_sesi) === Number(sesiId) || sesiId === 0)
        );
        const status = found?.status;
        if (status && status in totals) {
          totals[status as keyof typeof totals]++;
        }
      });
      return totals;
    };

    santriList.forEach((santri) => {
      const availableSesi = filteredSesiList.filter(
        (s) =>
          !s.halaqahs ||
          s.halaqahs.length === 0 ||
          s.halaqahs.some((h) => h.id_halaqah === santri.id_halaqah)
      );
      const renderSesi = availableSesi.length > 0 ? availableSesi : [{ id_sesi: 0, nama_sesi: "-" }];

      const studentTotals = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
      renderSesi.forEach((sesi) => {
        const t = calculateTotal(santri.id_santri, sesi.id_sesi);
        studentTotals.HADIR += t.HADIR;
        studentTotals.IZIN += t.IZIN;
        studentTotals.SAKIT += t.SAKIT;
        studentTotals.TERLAMBAT += t.TERLAMBAT;
        studentTotals.ALFA += t.ALFA;
      });

      const totalSessions = studentTotals.HADIR + studentTotals.IZIN + studentTotals.SAKIT + studentTotals.TERLAMBAT + studentTotals.ALFA;
      const totalPresent = studentTotals.HADIR + studentTotals.TERLAMBAT;
      const persentase = totalSessions > 0 ? (totalPresent / totalSessions) * 100 : 100;

      sumPercentage += persentase;
      stats.totalHadir += studentTotals.HADIR;
      stats.totalIzin += studentTotals.IZIN;
      stats.totalSakit += studentTotals.SAKIT;
      stats.totalTerlambat += studentTotals.TERLAMBAT;
      stats.totalAlfa += studentTotals.ALFA;

      // Resolve Halaqah name
      const halaqahName = santri.halaqah?.name_halaqah || "Umum";

      rows.push({
        no: counter++,
        nama_santri: santri.nama_santri,
        nama_halaqah: halaqahName,
        hadir: studentTotals.HADIR,
        izin: studentTotals.IZIN,
        sakit: studentTotals.SAKIT,
        terlambat: studentTotals.TERLAMBAT,
        alfa: studentTotals.ALFA,
        persentase,
      });
    });

    if (santriList.length > 0) {
      stats.rataRataKehadiran = sumPercentage / santriList.length;
    } else {
      stats.rataRataKehadiran = 100;
    }

    // Period text
    const periodLabel = format(viewDate, "MMMM yyyy", { locale: idLocale });
    const activeHalaqahObj = santriList.find((s) => s.id_halaqah === halaqahId)?.halaqah;
    const namaHalaqah = activeHalaqahObj?.name_halaqah || "Semua Halaqah";

    const generatedAt = format(new Date(), "dd MMMM yyyy, HH:mm", {
      locale: idLocale,
    });

    const doc = (
      <AbsensiPdfTemplate
        rows={rows}
        stats={stats}
        periodLabel={periodLabel}
        sekolah={sekolah}
        namaSekolah="Halaqah ID"
        namaHalaqah={namaHalaqah}
        generatedAt={generatedAt}
      />
    );

    // Build filename: laporan-absensi-[periode].pdf
    const safePeriod = periodLabel.replace(/\s+/g, "-").toLowerCase();
    const filename = `laporan-absensi-${safePeriod}.pdf`;

    return { doc, filename, title: `Laporan Absensi - ${namaHalaqah}` };
  }, [sekolah]);

  const generatePdf = useCallback(async (options: UseAbsensiPdfOptions) => {
    setIsGenerating(true);
    try {
      const { doc, filename } = getPdfDocument(options);
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup object URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [getPdfDocument]);

  return { getPdfDocument, generatePdf, isGenerating };
}
