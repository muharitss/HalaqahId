export type { LevelHafalan, ProgramTahfidz } from "@/types/domain/program";

export interface CreateProgramPayload {
  nama_program: string;
  deskripsi?: string | null;
}

export interface UpdateProgramPayload {
  nama_program?: string;
  deskripsi?: string | null;
}

export interface CreateLevelPayload {
  nama_level: string;
  urutan?: number;
  target_juz_min?: number | null;
  target_juz_max?: number | null;
  keterangan?: string | null;
}

export interface UpdateLevelPayload {
  nama_level?: string;
  urutan?: number;
  target_juz_min?: number | null;
  target_juz_max?: number | null;
  keterangan?: string | null;
}
