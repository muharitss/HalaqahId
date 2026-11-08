export interface Semester {
  id_semester: number;
  id_tahun_ajaran: number;
  nama: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  created_at?: string;
  updated_at?: string;
}

export interface TahunAjaran {
  id_tahun_ajaran: number;
  id_sekolah: number;
  nama: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  is_aktif: boolean;
  created_at?: string;
  updated_at?: string;
  semesters?: Semester[];
}

export interface HariLibur {
  id_libur: number;
  id_sekolah: number;
  tanggal: string;
  keterangan: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTahunAjaranPayload {
  nama: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  is_aktif?: boolean;
}

export interface UpdateTahunAjaranPayload {
  nama?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  is_aktif?: boolean;
}

export interface CreateSemesterPayload {
  nama: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
}

export interface UpdateSemesterPayload {
  nama?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
}

export interface CreateHariLiburPayload {
  tanggal: string;
  keterangan: string;
}

export interface UpdateHariLiburPayload {
  tanggal?: string;
  keterangan?: string;
}

export interface NationalHolidayItem {
  tanggal: string; // YYYY-MM-DD
  keterangan: string;
}
