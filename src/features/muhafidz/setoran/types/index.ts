// Export semua type yang dibutuhkan
export type KategoriSetoran =
  | "HAFALAN"
  | "MURAJAAH"
  | "ZIYADAH"
  | "INTENS"
  | "BACAAN";

export interface SetoranPayload {
  id_santri: number;
  id_sesi?: number;
  juz: number;
  surat: string;
  ayat: string;
  kategori: KategoriSetoran;
  taqwim?: number;
  keterangan?: string;
}

export interface SetoranRecord {
  id_setoran: number;
  id_santri: number;
  id_sesi?: number;
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
  id_santri: number;
  id_sesi?: number;
  juz: number;
  surat: string;
  ayat_mulai: number;
  ayat_selesai: number;
  kategori: KategoriSetoran;
  taqwim?: number;
  keterangan?: string;
}
