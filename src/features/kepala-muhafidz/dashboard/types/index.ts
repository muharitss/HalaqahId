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