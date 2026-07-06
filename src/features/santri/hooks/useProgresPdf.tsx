import { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ProgresPdfTemplate, type ProgresPdfRow } from "../components/ProgresPdfTemplate";
import type { ProgresSantri } from "../types";
import { SATUAN_TARGET_LABELS, TIPE_TARGET_LABELS } from "@/types/domain/target";
import { useProfilSekolah } from "@/features/sekolah/hooks/useProfilSekolah";

interface UseProgresPdfOptions {
  progresData: ProgresSantri[];
  stats: {
    total: number;
    tercapai: number;
    dalamProses: number;
    belumMulai: number;
    bebas: number;
  };
  activeHalaqah: string;
  periodLabel: string;
  namaSekolah?: string;
}

export function useProgresPdf() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { sekolah } = useProfilSekolah();

  const generatePdf = useCallback(async ({
    progresData,
    stats,
    activeHalaqah,
    periodLabel,
    namaSekolah = "Halaqah ID",
  }: UseProgresPdfOptions) => {
    setIsGenerating(true);
    try {
      // Map progress data to PDF rows
      const rows: ProgresPdfRow[] = progresData.map((item, index) => {
        const targetLabel = item.target
          ? `${item.target.nilai_target} ${SATUAN_TARGET_LABELS[item.target.satuan as keyof typeof SATUAN_TARGET_LABELS] ?? item.target.satuan} / ${TIPE_TARGET_LABELS[item.target.tipe as keyof typeof TIPE_TARGET_LABELS]?.toLowerCase() ?? item.target.tipe.toLowerCase()}`
          : "Tanpa Target";

        const capaianLabel = `${item.progres.capaian} ${SATUAN_TARGET_LABELS[item.progres.satuan as keyof typeof SATUAN_TARGET_LABELS] ?? item.progres.satuan}`;

        return {
          no: index + 1,
          nama_santri: item.nama_santri,
          nama_halaqah: item.nama_halaqah,
          target: targetLabel,
          capaian: item.target ? capaianLabel : `${item.progres.jumlah_setoran} setoran`,
          persentase: item.progres.persentase,
          status: item.progres.status,
        };
      });

      const namaHalaqah =
        activeHalaqah === "all" || activeHalaqah === ""
          ? "Semua Halaqah"
          : `Halaqah ${activeHalaqah}`;

      const generatedAt = format(new Date(), "dd MMMM yyyy, HH:mm", {
        locale: idLocale,
      });

      const doc = (
        <ProgresPdfTemplate
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

      // Build filename: laporan-progres-[halaqah]-[periode].pdf
      const safeHalaqah = namaHalaqah.replace(/\s+/g, "-").toLowerCase();
      const filename = `laporan-progres-${safeHalaqah}.pdf`;

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
  }, []);

  return { generatePdf, isGenerating };
}
