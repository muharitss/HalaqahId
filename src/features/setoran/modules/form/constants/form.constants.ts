export const FORM_DEFAULTS = {
  id_santri: undefined as number | undefined,
  id_sesi: undefined as number | undefined,
  juz: 1,
  id_kategori: undefined as number | undefined,
  surat_mulai: "",
  ayat_mulai: undefined as number | undefined,
  surat_selesai: "",
  ayat_selesai: undefined as number | undefined,
  tanggal_setoran: getTodayString(),
  taqwim: undefined as number | undefined,
  keterangan: "",
  custom_values: {} as Record<string, any>,
};

export function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const DRAFT_STORAGE_KEY = "setoran_form_draft";
export const TEMP_STORAGE_KEY = "setoran_form_temp";
export const MUSHAF_SELECTION_KEY = "mushaf_selection_pending";
export const DRAFT_EXPIRY_MS = 10 * 60 * 1000;