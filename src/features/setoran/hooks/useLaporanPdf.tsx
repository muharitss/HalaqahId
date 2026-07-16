import { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { LaporanPdfTemplate } from "../modules/laporan";
import type { LaporanPdfStats, LaporanPdfRow } from "../modules/laporan/components/LaporanPdfTemplate";
import type { GroupedData, GroupedSantriItem, SetoranItem } from "../types";
import { useProfilSekolah } from "@/features/sekolah/hooks/useProfilSekolah";

interface UseLaporanPdfOptions {
  groupedData: GroupedData;
  stats: LaporanPdfStats;
  activeHalaqah: string;
  periodLabel: string;
  namaSekolah?: string;
}

export function useLaporanPdf() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { sekolah } = useProfilSekolah();

  const generatePdf = useCallback(async ({
    groupedData,
    stats,
    activeHalaqah,
    periodLabel,
    namaSekolah = "Halaqah ID",
  }: UseLaporanPdfOptions) => {
    setIsGenerating(true);
    try {
      // Flatten & numerate rows
      const rows: LaporanPdfRow[] = [];

      let counter = 1;

      Object.entries(groupedData).forEach(([halaqahName, group]) => {
        if (activeHalaqah !== "all" && activeHalaqah !== "" && halaqahName !== activeHalaqah) return;
        Object.values(group.santriGroup).forEach((santri: GroupedSantriItem) => {
          // Sort by date desc
          const sorted = [...santri.setoran].sort(
            (a: SetoranItem, b: SetoranItem) =>
              new Date(b.tanggal_setoran).getTime() - new Date(a.tanggal_setoran).getTime()
          );
          sorted.forEach((s: SetoranItem) => {
            const kategoriName = s.kategori?.nama_kategori || (typeof s.kategori === "string" ? s.kategori : "Setoran");
            rows.push({
              no: counter++,
              tanggal: s.tanggal_setoran,
              nama_santri: santri.nama,
              nama_halaqah: halaqahName,
              juz: s.juz,
              surat: s.surat,
              ayat: s.ayat,
              kategori: kategoriName,
              taqwim: s.taqwim !== undefined ? s.taqwim : null,
              keterangan: s.keterangan ?? undefined,
              custom_values: s.custom_values || null,
            });
          });
        });
      });

      const namaHalaqah =
        activeHalaqah === "all" || activeHalaqah === ""
          ? "Semua Halaqah"
          : `Halaqah ${activeHalaqah}`;

      const generatedAt = format(new Date(), "dd MMMM yyyy, HH:mm", {
        locale: idLocale,
      });

      const doc = (
        <LaporanPdfTemplate
          rows={rows}
          stats={stats}
          periodLabel={periodLabel}
          sekolah={sekolah}
          namaSekolah={namaSekolah}
          namaHalaqah={namaHalaqah}
          generatedAt={generatedAt}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      // Build filename: laporan-setoran-[periode].pdf
      const safePeriod = periodLabel.replace(/\s+/g, "-").toLowerCase();
      const filename = `laporan-setoran-${safePeriod}.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup object URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } finally {
      setIsGenerating(false);
    }
  }, [sekolah]);

  return { generatePdf, isGenerating };
}
