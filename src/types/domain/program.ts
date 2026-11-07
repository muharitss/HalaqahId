export interface LevelHafalan {
  id_level: number;
  id_program: number;
  nama_level: string;
  urutan: number;
  target_juz_min: number | null;
  target_juz_max: number | null;
  keterangan: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ProgramTahfidz {
  id_program: number;
  id_sekolah: number;
  nama_program: string;
  deskripsi: string | null;
  levels?: LevelHafalan[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
