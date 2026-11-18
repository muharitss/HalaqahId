/**
 * ummahApiService.ts
 * Melayani data halaman mushaf Al-Qur'an langsung dari backend terverifikasi (/api/quran/page/:page)
 * dengan dukungan multi-mushaf (Madinah 15 baris & Mushaf Standar Indonesia Kemenag RI).
 */

import axiosClient from "@/lib/axiosClient";
import type { MushafPage, MushafPageResponse } from "../types";

export const ummahApiService = {
  getMushafPage: async (
    page: number,
    mushaf: string = "madinah-15"
  ): Promise<MushafPage> => {
    if (page < 1 || page > 604) {
      throw new Error(`Nomor halaman mushaf tidak valid: ${page}. Harus antara 1–604.`);
    }

    const response = await axiosClient.get<MushafPageResponse>(
      `/quran/page/${page}?mushaf=${encodeURIComponent(mushaf)}`
    );

    if (!response.data?.success) {
      throw new Error(`Server mengembalikan respons gagal untuk halaman mushaf ${page}`);
    }

    return response.data.data;
  },
};
