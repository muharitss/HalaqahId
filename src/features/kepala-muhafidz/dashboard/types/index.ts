import type { Halaqah as DomainHalaqah, Santri as DomainSantri, User as DomainUser } from '@/types';
import type { StatusKehadiran } from '@/types/domain/enums';

export type Halaqah = DomainHalaqah;
export type Santri = DomainSantri;
export type Muhafiz = DomainUser;

export interface SetoranData {
  id_setoran: number;
  id_santri: number;
  tanggal_setoran: string;
  kategori: string;
  santri?: {
    nama_santri: string;
    deleted_at?: string | null;
  };
}

export interface AbsensiData {
  id_absensi: number;
  status: StatusKehadiran;
  santri?: {
    nama_santri: string;
    deleted_at?: string | null;
  };
}

export interface PekanData {
  day: string;
  setoran: number;
}

export interface BulanData {
  date: string;
  setoran: number;
}

export interface AbsensiStat {
  status: string;
  count: number;
  fill: string;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface DashboardStats {
  totalSantri: number;
  totalMuhafiz: number;
  totalHalaqah: number;
  totalSetoran: number;
}

export type ViewType = 'pekan' | 'bulan';
