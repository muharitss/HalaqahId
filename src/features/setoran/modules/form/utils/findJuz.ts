import { pemetaanJuz } from "@/utils/daftarSurah";

/**
 * Mencari juz berdasarkan nama surah dan nomor ayat
 */
export function findJuzBySurahAndAyah(
  surahName: string,
  ayahNum: number
): number {
  for (const [juzNumStr, surahs] of Object.entries(pemetaanJuz)) {
    const juzNum = Number(juzNumStr);
    const match = surahs.find(
      (s) =>
        s.nama.toLowerCase() === surahName.toLowerCase() &&
        ayahNum >= s.ayatMulai &&
        ayahNum <= s.ayatSelesai
    );
    if (match) return juzNum;
  }
  return 1;
}