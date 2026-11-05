export type TipeRubrik = "SETORAN" | "UJIAN";

export interface RubrikKriteria {
  id_kriteria: number;
  id_rubrik: number;
  nama: string;
  bobot: number;
  urutan: number;
  skala_min: number;
  skala_max: number;
  created_at?: string;
  updated_at?: string;
}

export interface LinkedKategori {
  id_kategori: number;
  nama_kategori: string;
  jenis_kategori: string;
}

export interface RubrikTemplate {
  id_rubrik: number;
  id_sekolah: number;
  nama: string;
  tipe: TipeRubrik;
  is_default: boolean;
  kriteria: RubrikKriteria[];
  kategori?: LinkedKategori[];
  created_at: string;
  updated_at: string;
}

export interface KriteriaInputPayload {
  nama: string;
  bobot: number;
  urutan?: number;
  skala_min?: number;
  skala_max?: number;
}

export interface CreateRubrikPayload {
  nama: string;
  tipe?: TipeRubrik;
  is_default?: boolean;
  kriteria?: KriteriaInputPayload[];
}

export interface UpdateRubrikPayload {
  nama?: string;
  tipe?: TipeRubrik;
  is_default?: boolean;
}

export interface CreateKriteriaPayload {
  nama: string;
  bobot: number;
  urutan?: number;
  skala_min?: number;
  skala_max?: number;
}

export interface UpdateKriteriaPayload {
  nama?: string;
  bobot?: number;
  urutan?: number;
  skala_min?: number;
  skala_max?: number;
}
