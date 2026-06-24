import { KategoriSetoran } from './enums';

export interface Setoran {
  id_setoran: number;
  id_santri: number;
  id_sesi?: number | null;
  tanggal_setoran: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: KategoriSetoran;
  taqwim?: number | null;
  keterangan?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  santri?: {
    nama_santri: string;
  };
  sesi?: {
    nama_sesi: string;
  };
}

export interface CreateSetoranRequest {
  id_santri: number;
  id_sesi?: number;
  tanggal_setoran?: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: KategoriSetoran;
  taqwim?: number;
  keterangan?: string;
}

export interface UpdateSetoranRequest {
  id_santri?: number;
  id_sesi?: number;
  tanggal_setoran?: string;
  juz?: number;
  surat?: string;
  ayat?: string;
  kategori?: KategoriSetoran;
  taqwim?: number;
  keterangan?: string;
}
