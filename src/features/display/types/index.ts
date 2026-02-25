export interface SetoranRecord {
  id_setoran: number;
  nama_santri: string;
  nama_halaqah: string;
  tanggal: string;         
  surat: string;
  juz: number;
  ayat: string;            
  kategori: "HAFALAN" | "MUROJAAH" | string;
}

export interface AbsensiRecord {
  nama_santri: string;
  status: "HADIR" | "IZIN" | "SAKIT" | "TERLAMBAT" | "ALFA";
}

export interface MonthlyData {
  tanggal: string;         
  data: AbsensiRecord[];
}

export interface Santri {
  id_santri: number | string;
  nama_santri: string;
  nama_halaqah: string;
  nomor_telepon?: string;
  nama_muhafiz?: string;   
}

export interface Halaqah {
  id_halaqah: number;
  nama_halaqah: string;
  tingkat: string;
  jumlah_santri: number;
  nama_muhafidz: string;
}