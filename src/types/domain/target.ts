/**
 * Interface untuk model TargetSekolah dari backend.
 * Target bersifat fleksibel — setiap sekolah bisa membuat target sendiri.
 * Mushaf standar: 15 baris/halaman (mushaf pojok/Madinah Indonesia).
 */

export const TipeTarget = {
  HARIAN: "HARIAN",
  MINGGUAN: "MINGGUAN",
  BULANAN: "BULANAN",
  SEMESTER: "SEMESTER",
  GLOBAL: "GLOBAL",
} as const;
export type TipeTarget = (typeof TipeTarget)[keyof typeof TipeTarget];

export const SatuanTarget = {
  BARIS: "BARIS",
  HALAMAN: "HALAMAN",
  AYAT: "AYAT",
  JUZ: "JUZ",
} as const;
export type SatuanTarget = (typeof SatuanTarget)[keyof typeof SatuanTarget];

export interface TargetSekolah {
  id_target: number;
  id_sekolah: number;
  nama_target: string;
  tipe: TipeTarget;
  nilai_target: number;
  satuan: SatuanTarget;
  deskripsi?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateTargetRequest {
  nama_target: string;
  tipe: TipeTarget;
  nilai_target: number;
  satuan: SatuanTarget;
  deskripsi?: string | null;
}

export interface UpdateTargetRequest {
  nama_target?: string;
  tipe?: TipeTarget;
  nilai_target?: number;
  satuan?: SatuanTarget;
  deskripsi?: string | null;
}

/** Label ramah user untuk setiap tipe periode target */
export const TIPE_TARGET_LABELS: Record<TipeTarget, string> = {
  HARIAN: "Harian",
  MINGGUAN: "Mingguan",
  BULANAN: "Bulanan",
  SEMESTER: "Semester",
  GLOBAL: "Semua Waktu",
};

/** Label ramah user untuk setiap satuan target */
export const SATUAN_TARGET_LABELS: Record<SatuanTarget, string> = {
  BARIS: "Baris",
  HALAMAN: "Halaman",
  AYAT: "Ayat",
  JUZ: "Juz",
};
