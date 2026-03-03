// Types untuk Activity Chart
export interface PekanData {
  day: string;
  setoran: number;
}

export interface BulanData {
  date: string;
  setoran: number;
}

// Types untuk Attendance Donut Chart
export interface AbsensiStat {
  status: string;
  count: number;
  fill: string;
}

// Types untuk Category Pie Chart
export interface CategoryStat {
  category: string;
  count: number;
}

// Types untuk data dashboard secara keseluruhan
export interface DashboardStats {
  totalSantri: number;
  totalMuhafiz: number;
  totalHalaqah: number;
  totalSetoran: number;
}

// Types untuk filter tanggal
export type ViewType = "pekan" | "bulan";

export type Muhafiz = {
  id_user: number;
  username: string;
  id_muhafiz: string;
  nama_lengkap: string;
  email: string;
  no_telp: string;
  status: string;
  foto_profil: string;
  created_at: string;
  updated_at: string;
};

export interface SetoranData {
  id_setoran: number;
  id_santri?: number;     
  tanggal_setoran: string; 
  juz: number;
  surat: string;
  ayat: string;
  kategori: "HAFALAN" | "MURAJAAH" | "ZIYADAH" | "INTENS" | "BACAAN"; 
  taqwim: number;
  keterangan: string;
  created_at?: string;      
  updated_at?: string;       
  santri: SantriInSetoran;
}

export interface SantriInSetoran {
  nama_santri: string;
  halaqah: HalaqahInSetoran;
}

export interface HalaqahInSetoran {
  name_halaqah: string;
}

export interface Halaqah {
  id_halaqah: number;
  name_halaqah: string;
  muhafiz_id: number;
  jenis: "TAHFIDZ" | "BACAAN" | "INTENSIF" | string; 
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user: MuhafizUser;
  santri: SantriInHalaqah[];
  _count: {
    santri: number;
  };
}

export interface MuhafizUser {
  id_user: number;
  username: string;
  email: string;
}

export interface SantriInHalaqah {
  id_santri: number;
  nama_santri: string;
  nomor_telepon: string;
  target: "INTENSE" | "RIGAN" | "SEDANG" | "BACAAN" | string; 
}

export interface AbsensiData {
  id_absensi: number;
  santri_id: number;
  tanggal: string; // ISO Date String
  status: "HADIR" | "IZIN" | "SAKIT" | "ALFA" | "TERLAMBAT";
  keterangan: string;
  santri: SantriInAbsensi;
}

export interface SantriInAbsensi {
  nama_santri: string;
}