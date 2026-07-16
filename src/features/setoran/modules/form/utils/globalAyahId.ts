import { SURAH_IDS } from "@/utils/daftarSurah";

export function getGlobalAyahId(surahName: string, ayahNum: number): number {
  const surahId = SURAH_IDS[surahName] || 0;
  return surahId * 10000 + ayahNum;
}