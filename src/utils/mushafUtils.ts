/**
 * mushafUtils.ts
 * Utility functions untuk fitur Mushaf Interaktif
 */

/**
 * Hitung total baris setoran berdasarkan koordinat halaman mushaf.
 * Setiap halaman mushaf standar memiliki 15 baris.
 *
 * Contoh:
 *   start: hal.3 baris 1, end: hal.3 baris 3 → 3 baris
 *   start: hal.3 baris 13, end: hal.4 baris 2 → 5 baris (sisa hal.3 + hal.4)
 */
export function hitungTotalBaris(
  startPage: number,
  startLine: number,
  endPage: number,
  endLine: number,
  linesPerPage: number = 15,
): number {
  if (startPage === endPage) {
    return Math.max(0, endLine - startLine + 1);
  }

  const barisDiHalamanPertama = linesPerPage - startLine + 1;
  const halamanPenuhDiTengah = Math.max(0, endPage - startPage - 1) * linesPerPage;
  const barisDiHalamanTerakhir = endLine;

  return barisDiHalamanPertama + halamanPenuhDiTengah + barisDiHalamanTerakhir;
}

/**
 * Konversi nomor surah (dari UmmahAPI) ke nama latin.
 * Menggunakan daftar statis 114 surah Al-Quran.
 */
export function surahNumberToName(surahNumber: number): string {
  const SURAH_NAMES: Record<number, string> = {
    1: "Al-Fatihah", 2: "Al-Baqarah", 3: "Ali 'Imran", 4: "An-Nisa'",
    5: "Al-Ma'idah", 6: "Al-An'am", 7: "Al-A'raf", 8: "Al-Anfal",
    9: "At-Taubah", 10: "Yunus", 11: "Hud", 12: "Yusuf",
    13: "Ar-Ra'd", 14: "Ibrahim", 15: "Al-Hijr", 16: "An-Nahl",
    17: "Al-Isra'", 18: "Al-Kahfi", 19: "Maryam", 20: "Ta-Ha",
    21: "Al-Anbiya'", 22: "Al-Hajj", 23: "Al-Mu'minun", 24: "An-Nur",
    25: "Al-Furqan", 26: "Asy-Syu'ara'", 27: "An-Naml", 28: "Al-Qasas",
    29: "Al-'Ankabut", 30: "Ar-Rum", 31: "Luqman", 32: "As-Sajdah",
    33: "Al-Ahzab", 34: "Saba'", 35: "Fatir", 36: "Ya-Sin",
    37: "As-Saffat", 38: "Sad", 39: "Az-Zumar", 40: "Ghafir",
    41: "Fussilat", 42: "Asy-Syura", 43: "Az-Zukhruf", 44: "Ad-Dukhan",
    45: "Al-Jatsiyah", 46: "Al-Ahqaf", 47: "Muhammad", 48: "Al-Fath",
    49: "Al-Hujurat", 50: "Qaf", 51: "Adz-Dzariyat", 52: "At-Tur",
    53: "An-Najm", 54: "Al-Qamar", 55: "Ar-Rahman", 56: "Al-Waqi'ah",
    57: "Al-Hadid", 58: "Al-Mujadilah", 59: "Al-Hasyr", 60: "Al-Mumtahanah",
    61: "As-Saff", 62: "Al-Jumu'ah", 63: "Al-Munafiqun", 64: "At-Taghabun",
    65: "At-Talaq", 66: "At-Tahrim", 67: "Al-Mulk", 68: "Al-Qalam",
    69: "Al-Haqqah", 70: "Al-Ma'arij", 71: "Nuh", 72: "Al-Jinn",
    73: "Al-Muzzammil", 74: "Al-Muddatsir", 75: "Al-Qiyamah", 76: "Al-Insan",
    77: "Al-Mursalat", 78: "An-Naba'", 79: "An-Nazi'at", 80: "'Abasa",
    81: "At-Takwir", 82: "Al-Infitar", 83: "Al-Mutaffifin", 84: "Al-Insyiqaq",
    85: "Al-Buruj", 86: "At-Tariq", 87: "Al-A'la", 88: "Al-Ghasyiyah",
    89: "Al-Fajr", 90: "Al-Balad", 91: "Asy-Syams", 92: "Al-Lail",
    93: "Ad-Duha", 94: "Asy-Syarh", 95: "At-Tin", 96: "Al-'Alaq",
    97: "Al-Qadr", 98: "Al-Bayyinah", 99: "Az-Zalzalah", 100: "Al-'Adiyat",
    101: "Al-Qari'ah", 102: "At-Takatsur", 103: "Al-'Asr", 104: "Al-Humazah",
    105: "Al-Fil", 106: "Quraisy", 107: "Al-Ma'un", 108: "Al-Kautsar",
    109: "Al-Kafirun", 110: "An-Nasr", 111: "Al-Lahab", 112: "Al-Ikhlas",
    113: "Al-Falaq", 114: "An-Nas",
  };
  return SURAH_NAMES[surahNumber] ?? `Surah ${surahNumber}`;
}

/**
 * Konversi nama surah latin ke nomor surah.
 */
export function surahNameToNumber(surahName: string): number | null {
  const SURAH_IDS: Record<string, number> = {
    "Al-Fatihah": 1, "Al-Baqarah": 2, "Ali 'Imran": 3, "An-Nisa'": 4,
    "Al-Ma'idah": 5, "Al-An'am": 6, "Al-A'raf": 7, "Al-Anfal": 8,
    "At-Taubah": 9, "Yunus": 10, "Hud": 11, "Yusuf": 12,
    "Ar-Ra'd": 13, "Ibrahim": 14, "Al-Hijr": 15, "An-Nahl": 16,
    "Al-Isra'": 17, "Al-Kahfi": 18, "Maryam": 19, "Ta-Ha": 20,
    "Al-Anbiya'": 21, "Al-Hajj": 22, "Al-Mu'minun": 23, "An-Nur": 24,
    "Al-Furqan": 25, "Asy-Syu'ara'": 26, "An-Naml": 27, "Al-Qasas": 28,
    "Al-'Ankabut": 29, "Ar-Rum": 30, "Luqman": 31, "As-Sajdah": 32,
    "Al-Ahzab": 33, "Saba'": 34, "Fatir": 35, "Ya-Sin": 36,
    "As-Saffat": 37, "Sad": 38, "Az-Zumar": 39, "Ghafir": 40,
    "Fussilat": 41, "Asy-Syura": 42, "Az-Zukhruf": 43, "Ad-Dukhan": 44,
    "Al-Jatsiyah": 45, "Al-Ahqaf": 46, "Muhammad": 47, "Al-Fath": 48,
    "Al-Hujurat": 49, "Qaf": 50, "Adz-Dzariyat": 51, "At-Tur": 52,
    "An-Najm": 53, "Al-Qamar": 54, "Ar-Rahman": 55, "Al-Waqi'ah": 56,
    "Al-Hadid": 57, "Al-Mujadilah": 58, "Al-Hasyr": 59, "Al-Mumtahanah": 60,
    "As-Saff": 61, "Al-Jumu'ah": 62, "Al-Munafiqun": 63, "At-Taghabun": 64,
    "At-Talaq": 65, "At-Tahrim": 66, "Al-Mulk": 67, "Al-Qalam": 68,
    "Al-Haqqah": 69, "Al-Ma'arij": 70, "Nuh": 71, "Al-Jinn": 72,
    "Al-Muzzammil": 73, "Al-Muddatsir": 74, "Al-Qiyamah": 75, "Al-Insan": 76,
    "Al-Mursalat": 77, "An-Naba'": 78, "An-Nazi'at": 79, "'Abasa": 80,
    "At-Takwir": 81, "Al-Infitar": 82, "Al-Mutaffifin": 83, "Al-Insyiqaq": 84,
    "Al-Buruj": 85, "At-Tariq": 86, "Al-A'la": 87, "Al-Ghasyiyah": 88,
    "Al-Fajr": 89, "Al-Balad": 90, "Asy-Syams": 91, "Al-Lail": 92,
    "Ad-Duha": 93, "Asy-Syarh": 94, "At-Tin": 95, "Al-'Alaq": 96,
    "Al-Qadr": 97, "Al-Bayyinah": 98, "Az-Zalzalah": 99, "Al-'Adiyat": 100,
    "Al-Qari'ah": 101, "At-Takatsur": 102, "Al-'Asr": 103, "Al-Humazah": 104,
    "Al-Fil": 105, "Quraisy": 106, "Al-Ma'un": 107, "Al-Kautsar": 108,
    "Al-Kafirun": 109, "An-Nasr": 110, "Al-Lahab": 111, "Al-Ikhlas": 112,
    "Al-Falaq": 113, "An-Nas": 114,
  };
  return SURAH_IDS[surahName] ?? null;
}

/**
 * Dapatkan nomor halaman mushaf pertama untuk suatu surah dan nomor ayat.
 * Ini adalah estimasi kasar berbasis data umum mushaf rasm Uthmani.
 * Data akurat akan didapat langsung dari UmmahAPI saat runtime.
 *
 * Mapping halaman awal per surah (rasm Uthmani standar):
 */
export const SURAH_PAGE_START: Record<number, number> = {
  1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177,
  9: 187, 10: 208, 11: 221, 12: 235, 13: 249, 14: 255, 15: 262,
  16: 267, 17: 282, 18: 293, 19: 305, 20: 312, 21: 322, 22: 332,
  23: 342, 24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396,
  30: 404, 31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440,
  37: 446, 38: 453, 39: 458, 40: 467, 41: 477, 42: 483, 43: 489,
  44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
  51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537,
  58: 542, 59: 545, 60: 549, 61: 551, 62: 553, 63: 554, 64: 556,
  65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568, 71: 570,
  72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582,
  79: 583, 80: 585, 81: 586, 82: 587, 83: 587, 84: 589, 85: 590,
  86: 591, 87: 591, 88: 592, 89: 593, 90: 594, 91: 595, 92: 595,
  93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599,
  100: 599, 101: 600, 102: 600, 103: 601, 104: 601, 105: 601, 106: 602,
  107: 602, 108: 602, 109: 603, 110: 603, 111: 603, 112: 604, 113: 604,
  114: 604,
};

/**
 * Sesuaikan baris awal setoran jika dimulai dari ayat 1.
 * Jika dimulai dari ayat 1, baris nama surah dan basmalah di atasnya ikut dihitung.
 */
export function adjustStartLine(
  surahNum: number,
  ayahNum: number,
  originalLine: number,
): number {
  if (ayahNum === 1) {
    if (surahNum === 1) {
      return 1; // Al-Fatihah header is line 1, verse 1 is line 2
    } else if (surahNum === 9) {
      return Math.max(1, originalLine - 1); // At-Taubah header is startLine - 1, no basmalah
    } else {
      return Math.max(1, originalLine - 2); // Header is startLine - 2, basmalah is startLine - 1
    }
  }
  return originalLine;
}

/**
 * Hitung total baris setoran secara presisi berdasarkan posisi kata (word-by-word)
 * jika dalam satu halaman, atau fallback ke hitung total baris biasa jika lintas halaman.
 */
export function hitungTotalBarisPresisi(
  selection: {
    startPage: number;
    startLine: number;
    endPage: number;
    endLine: number;
    startWordPosition?: number;
    endWordPosition?: number;
    startSurahNumber: number;
    startAyah: number;
    endSurahNumber: number;
    endAyah: number;
    isPartialAyah?: boolean;
  },
  currentPageWords: {
    line_number: number;
    char_type_name: string;
    position: number;
    surah_number: number;
    ayah_number: number;
  }[]
): number {
  const { startPage, endPage, startLine, endLine } = selection;

  if (startPage === endPage && currentPageWords && currentPageWords.length > 0) {
    let totalFraction = 0;
    const lines = Array.from(new Set(currentPageWords.map(w => w.line_number)));

    const getWordVal = (sNum: number, aNum: number, pos: number) => {
      return sNum * 10000000 + aNum * 1000 + pos;
    };

    const startVal = getWordVal(selection.startSurahNumber, selection.startAyah, selection.startWordPosition ?? 1);
    const endVal = getWordVal(selection.endSurahNumber, selection.endAyah, selection.endWordPosition ?? 1);

    for (const line of lines) {
      const lineWords = currentPageWords.filter(w => w.line_number === line && w.char_type_name === "word");
      if (lineWords.length === 0) continue;

      const selectedLineWords = lineWords.filter(w => {
        const val = getWordVal(w.surah_number, w.ayah_number, w.position);
        return val >= startVal && val <= endVal;
      });

      if (selectedLineWords.length > 0) {
        totalFraction += selectedLineWords.length / lineWords.length;
      }
    }

    return Math.max(1, Math.round(totalFraction));
  }

  if (startPage === endPage) {
    return Math.max(1, endLine - startLine + 1);
  }

  const barisDiHalamanPertama = 15 - startLine + 1;
  const halamanPenuhDiTengah = Math.max(0, endPage - startPage - 1) * 15;
  const barisDiHalamanTerakhir = endLine;

  return Math.max(1, barisDiHalamanPertama + halamanPenuhDiTengah + barisDiHalamanTerakhir);
}


