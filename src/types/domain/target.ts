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
  /**
   * JSON string dari array hari aktif, e.g. "[1,2,3,4,5]" = Senin–Jumat.
   * null berarti semua hari aktif (default/lama).
   * Hanya relevan untuk tipe HARIAN.
   */
  hari_aktif?: string | null;
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
  /** Array hari aktif (0=Minggu…6=Sabtu), hanya untuk tipe HARIAN */
  hari_aktif?: number[] | null;
}

export interface UpdateTargetRequest {
  nama_target?: string;
  tipe?: TipeTarget;
  nilai_target?: number;
  satuan?: SatuanTarget;
  deskripsi?: string | null;
  /** Array hari aktif (0=Minggu…6=Sabtu), hanya untuk tipe HARIAN */
  hari_aktif?: number[] | null;
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

/** Nama hari singkat (index = 0=Minggu…6=Sabtu) */
export const HARI_LABELS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] as const;
export const HARI_LABELS_FULL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

/**
 * Parse string JSON hari_aktif dari backend menjadi number[].
 * Mengembalikan null jika kosong/null (berarti semua hari aktif).
 */
export const parseHariAktif = (raw?: string | null): number[] | null => {
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr.filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
  } catch {
    // invalid JSON, abaikan
  }
  return null;
};

/**
 * Format hari aktif menjadi label ringkas untuk ditampilkan di UI.
 * Contoh: [1,2,3,4,5] → "Sen–Jum (5 hari)"
 */
export const formatHariAktif = (hariArr: number[]): string => {
  if (hariArr.length === 7) return "Semua hari (7 hari)";
  const labels = hariArr.map((d) => HARI_LABELS_SHORT[d]).join(", ");
  return `${labels} (${hariArr.length} hari/pekan)`;
};
