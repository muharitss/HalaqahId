/**
 * ummahApiService.ts
 * Service untuk berkomunikasi dengan UmmahAPI (quran.ummahapi.com)
 * Menyediakan data mushaf per halaman (kata, baris, ayat).
 */

import axios from "axios";
import type { MushafPage, MushafPageResponse } from "../types";

const UMMAH_API_BASE_URL =
  import.meta.env.VITE_UMMAH_API_URL || "https://www.ummahapi.com/api";

const ummahApiClient = axios.create({
  baseURL: UMMAH_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const ummahApiService = {
  /**
   * Ambil data kata per halaman mushaf.
   * Data mencakup text_uthmani, line_number, verse_key, surah_number, ayah_number.
   *
   * @param page - Nomor halaman mushaf (1–604)
   */
  getMushafPage: async (page: number): Promise<MushafPage> => {
    if (page < 1 || page > 604) {
      throw new Error(`Nomor halaman mushaf tidak valid: ${page}. Harus antara 1–604.`);
    }

    const response = await ummahApiClient.get<MushafPageResponse>(
      `/quran/page/${page}`
    );

    if (!response.data.success) {
      throw new Error(`UmmahAPI mengembalikan respons gagal untuk halaman ${page}`);
    }

    return response.data.data;
  },
};
