// Export semua type yang dibutuhkan
export type KategoriSetoran = "HAFALAN" | "MURAJAAH" | "ZIYADAH" | "INTENS" | "BACAAN";

export interface SetoranPayload {
  santri_id: number;
  juz: number;
  surat: string;
  ayat: string;
  kategori: KategoriSetoran;
  taqwim?: number;
  keterangan?: string;
}

export interface SetoranRecord {
  id_setoran: number;
  santri_id: number;
  tanggal_setoran: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: KategoriSetoran;
  taqwim: number;
  keterangan: string;
  nilai: number;
  santri?: {
    nama_santri: string;
  };
}

export interface SetoranFormValues {
  santri_id: number;
  juz: number;
  surat: string;
  ayat_mulai: number;
  ayat_selesai: number;
  kategori: KategoriSetoran;
  taqwim?: number;
  keterangan?: string;
}