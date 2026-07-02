import { KategoriTarget, StatusKehadiran, KategoriSetoran } from './enums';

export interface DisplayHalaqah {
  id_halaqah: number;
  nama_halaqah: string;
  nama_muhafiz: string;
  jumlah_santri: number;
}

export interface DisplayAbsensi {
  id_absensi: number;
  nama_santri: string;
  status: StatusKehadiran;
  keterangan: string;
  tanggal: string;
}

export interface DisplaySetoran {
  id_setoran: number;
  nama_santri: string;
  nama_halaqah: string;
  surat: string;
  ayat: string;
  juz: number | null;
  kategori: KategoriSetoran;
  tanggal: string;
}

export interface DisplaySantri {
  id_santri: number;
  nama_santri: string;
  nomor_telepon: string;
  nama_halaqah: string;
}

export interface DisplaySantriDetail {
  profil: {
    id_santri: number;
    nama_santri: string;
    nomor_telepon: string;
    target: KategoriTarget;
    nama_halaqah: string;
    nama_muhafiz: string;
  };
  statistik_bulanan: {
    bulan: number;
    tahun: number;
    total_hadir: number;
    total_setoran: number;
  };
  riwayat_absensi: Array<{
    id_absensi: number;
    tanggal: string;
    status: StatusKehadiran;
    keterangan: string;
  }>;
  riwayat_setoran: Array<{
    id_setoran: number;
    tanggal: string;
    juz: number | null;
    surat: string;
    ayat: string;
    kategori: KategoriSetoran;
    keterangan: string;
  }>;
}

export type SantriDetailData = DisplaySantriDetail;

export type AbsensiRecord = DisplayAbsensi;

export interface SetoranRecord {
  id_setoran: string | number;
  tanggal: string;
  surat: string;
  juz: number | null;
  ayat: string;
  kategori: string;
  keterangan?: string;
}

export interface SetoranFeedItem {
  tanggal_setoran: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: string;
  taqwim: number;
}

export interface PublicSantriData {
  setoran: SetoranFeedItem[];
  stats: {
    HAFALAN: number;
    MURAJAAH: number;
    ZIYADAH: number;
    INTENS: number;
    BACAAN: number;
  };
}

export interface PublicSantriFeedProps {
  santriData: PublicSantriData;
}

export interface DisplayContextType {
  santriList: DisplaySantri[];
  isLoading: boolean;
  refreshSantri: () => Promise<void>;
}
