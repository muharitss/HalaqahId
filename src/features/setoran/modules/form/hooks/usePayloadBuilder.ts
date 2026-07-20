import { type SetoranFormFields, type SetoranPayload, type MushafSelection } from "../../../types";
import { SURAH_IDS } from "@/utils/daftarSurah";
import { findJuzBySurahAndAyah } from "../utils/findJuz";

export function buildPayload(
  values: SetoranFormFields,
  mushafSelection: MushafSelection | null
): SetoranPayload {
  const startSuratId = SURAH_IDS[values.surat_mulai] || 1;
  const endSuratId = SURAH_IDS[values.surat_selesai] || startSuratId;
  const startGlobal = startSuratId * 10000 + values.ayat_mulai;
  const endGlobal = endSuratId * 10000 + values.ayat_selesai;

  let finalStartSuratId = startSuratId;
  let finalStartAyat = values.ayat_mulai;
  let finalEndSuratId = endSuratId;
  let finalEndAyat = values.ayat_selesai;

  if (startGlobal > endGlobal) {
    finalStartSuratId = endSuratId;
    finalStartAyat = values.ayat_selesai;
    finalEndSuratId = startSuratId;
    finalEndAyat = values.ayat_mulai;
  }

  const calculatedJuz = findJuzBySurahAndAyah(
    values.surat_mulai,
    values.ayat_mulai
  );

  const customValuesObj = {
    ...(values.custom_values || {}),
    ...(mushafSelection && mushafSelection.isPartialAyah && {
      is_partial_ayah: true,
      start_word_pos: mushafSelection.startWordPosition,
      end_word_pos: mushafSelection.endWordPosition,
      start_word_text: mushafSelection.startWordText,
      end_word_text: mushafSelection.endWordText,
    })
  };

  let startPage = mushafSelection?.startPage ?? undefined;
  let startLine = mushafSelection?.startLine ?? undefined;
  let endPage = mushafSelection?.endPage ?? undefined;
  let endLine = mushafSelection?.endLine ?? undefined;

  if (startPage !== undefined && endPage !== undefined) {
    if (startPage > endPage || (startPage === endPage && startLine !== undefined && endLine !== undefined && startLine > endLine)) {
      const tempPage = startPage;
      startPage = endPage;
      endPage = tempPage;

      const tempLine = startLine;
      startLine = endLine;
      endLine = tempLine;
    }
  }

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
    custom_values: Object.keys(customValuesObj).length > 0 ? customValuesObj : null,
    start_surat_id: finalStartSuratId,
    start_ayat: finalStartAyat,
    end_surat_id: finalEndSuratId,
    end_ayat: finalEndAyat,
    ...(mushafSelection && {
      start_page: startPage,
      start_line: startLine,
      end_page: endPage,
      end_line: endLine,
      total_baris: mushafSelection.totalBaris,
    }),
  };
}