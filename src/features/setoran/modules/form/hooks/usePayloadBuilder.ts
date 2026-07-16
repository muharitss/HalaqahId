import { type SetoranFormFields, type SetoranPayload, type MushafSelection } from "../../../types";
import { SURAH_IDS } from "@/utils/daftarSurah";
import { findJuzBySurahAndAyah } from "../utils/findJuz";

export function buildPayload(
  values: SetoranFormFields,
  mushafSelection: MushafSelection | null
): SetoranPayload {
  const startSuratId = SURAH_IDS[values.surat_mulai] || 1;
  const endSuratId = SURAH_IDS[values.surat_selesai] || startSuratId;
  const calculatedJuz = findJuzBySurahAndAyah(
    values.surat_mulai,
    values.ayat_mulai
  );

  return {
    id_santri: values.id_santri,
    id_sesi: values.id_sesi,
    juz: calculatedJuz,
    surat:
      values.surat_mulai === values.surat_selesai
        ? values.surat_mulai
        : `${values.surat_mulai} - ${values.surat_selesai}`,
    ayat: `${values.ayat_mulai}-${values.ayat_selesai}`,
    id_kategori: values.id_kategori,
    tanggal_setoran: values.tanggal_setoran,
    taqwim: values.taqwim,
    keterangan: values.keterangan,
    custom_values: values.custom_values || null,
    start_surat_id: startSuratId,
    start_ayat: values.ayat_mulai,
    end_surat_id: endSuratId,
    end_ayat: values.ayat_selesai,
    ...(mushafSelection && {
      start_page: mushafSelection.startPage,
      start_line: mushafSelection.startLine,
      end_page: mushafSelection.endPage,
      end_line: mushafSelection.endLine,
      total_baris: mushafSelection.totalBaris,
    }),
  };
}