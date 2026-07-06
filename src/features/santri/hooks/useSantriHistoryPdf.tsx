import { useState, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { SantriHistoryPdfTemplate } from "../components/SantriHistoryPdfTemplate";
import { type SetoranRecord } from "../../setoran/types";
import { type ProgresSantri } from "../types";
import { useProfilSekolah } from "@/features/sekolah/hooks/useProfilSekolah";

interface UseSantriHistoryPdfOptions {
  santri: ProgresSantri;
  history: SetoranRecord[];
  periodLabel: string;
  namaSekolah?: string;
}

export function useSantriHistoryPdf() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { sekolah } = useProfilSekolah();

  const generateSantriHistoryPdf = useCallback(async ({
    santri,
    history,
    periodLabel,
  }: UseSantriHistoryPdfOptions) => {
    setIsGenerating(true);
    try {
      const generatedAt = format(new Date(), "dd MMMM yyyy, HH:mm", {
        locale: idLocale,
      });

      const doc = (
        <SantriHistoryPdfTemplate
          santri={santri}
          history={history}
          periodLabel={periodLabel}
          sekolah={sekolah}
          generatedAt={generatedAt}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      // Build filename: riwayat-[nama-santri]-[periode].pdf
      const safeName = santri.nama_santri.replace(/\s+/g, "-").toLowerCase();
      const safePeriod = periodLabel.replace(/\s+/g, "-").toLowerCase();
      const filename = `riwayat-${safeName}-${safePeriod}.pdf`;

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

  return { generateSantriHistoryPdf, isGenerating };
}
