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
  id_kategori?: number | null;
  kategori?: {
    id_kategori: number;
    nama_kategori: string;
    jenis_kategori: string;
  } | null;
  nama_target: string;
  tipe: TipeTarget;
  nilai_target: number;
  satuan: SatuanTarget;
  deskripsi?: string | null;
  /**
   * JSON string dari array hari aktif, e.g. "[1,2,3,4,5]" = Senin–Jumat.
   * null berarti semua hari aktif (default/lama).
   * Hanya relevan untuk tipe HARIAN.
   */
  hari_aktif?: string | null;
  start_juz?: number | null;
  end_juz?: number | null;
  daftar_surat?: string | null;
  arah?: "MAJU" | "MUNDUR" | "BEBAS" | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface CreateTargetRequest {
  nama_target: string;
  id_kategori: number;
  tipe: TipeTarget;
  nilai_target: number;
  satuan: SatuanTarget;
  deskripsi?: string | null;
  /** Array hari aktif (0=Minggu…6=Sabtu), hanya untuk tipe HARIAN */
  hari_aktif?: number[] | null;
  start_juz?: number | null;
  end_juz?: number | null;
  daftar_surat?: string | null;
  arah?: "MAJU" | "MUNDUR" | "BEBAS" | null;
}

export interface UpdateTargetRequest {
  nama_target?: string;
  id_kategori?: number;
  tipe?: TipeTarget;
  nilai_target?: number;
  satuan?: SatuanTarget;
  deskripsi?: string | null;
  /** Array hari aktif (0=Minggu…6=Sabtu), hanya untuk tipe HARIAN */
  hari_aktif?: number[] | null;
  start_juz?: number | null;
  end_juz?: number | null;
  daftar_surat?: string | null;
  arah?: "MAJU" | "MUNDUR" | "BEBAS" | null;
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

/** Nama hari singkat (1=Senin…7=Minggu/Ahad) */
export const HARI_LABELS_SHORT: Record<number, string> = {
  1: "Sen",
  2: "Sel",
  3: "Rab",
  4: "Kam",
  5: "Jum",
  6: "Sab",
  7: "Ahad",
};
export const HARI_LABELS_FULL: Record<number, string> = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
  7: "Minggu",
};

/**
 * Parse string JSON hari_aktif dari backend menjadi number[].
 * Mengembalikan null jika kosong/null (berarti semua hari aktif).
 */
export const parseHariAktif = (raw?: string | null): number[] | null => {
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.filter((n) => Number.isInteger(n) && n >= 1 && n <= 7);
  } catch {
    // invalid JSON, abaikan
  }
  return null;
};

/**
 * Format hari aktif menjadi label ringkas untuk ditampilkan di UI.
 * Contoh: [1,2,3,4,5] → "Sen, Sel, Rab, Kam, Jum (5 hari/pekan)"
 */
export const formatHariAktif = (hariArr: number[]): string => {
  if (hariArr.length === 7) return "Semua hari (7 hari)";
  const labels = hariArr.map((d) => HARI_LABELS_SHORT[d] ?? String(d)).join(", ");
  return `${labels} (${hariArr.length} hari/pekan)`;
};
