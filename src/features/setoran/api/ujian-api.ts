import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/features/halaqah/api/halaqahService";
import { surahNumberToName } from "@/utils/mushafUtils";

export type ExamMode = "MULTI_SOAL" | "SINGLE_PASS";

export interface ExamTemplate {
  id_template: number;
  id_sekolah: number;
  nama_template: string;
  nama_ujian?: string; // backward compatibility
  jenis_ujian: ExamMode;
  exam_mode?: ExamMode; // backward compatibility
  tipe_ujian?: "PEKANAN" | "BULANAN" | "HARIAN" | "KUSTOM";
  filter_jenis_kategori?: string[];
  jumlah_soal?: number;
  soal_acak_tanpa_detail?: boolean;
  input_schema: Array<{
    key: string;
    label: string;
    type: "COUNTER" | "SLIDER" | "TEXTAREA" | "NUMBER";
    min?: number;
    max?: number;
    default?: any;
  }>;
  formula_expression: string;
  aturan_kelulusan?: {
    kkm?: number;
  };
  is_aktif: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExamSchedule {
  id_jadwal: number;
  id_sekolah: number;
  id_template: number;
  judul_jadwal: string;
  tanggal_ujian: string;
  periode_start: string;
  periode_end: string;
  status: "DRAFT" | "AKTIF" | "SELESAI" | "DIBATALKAN";
  catatan?: string;
  template?: {
    nama_template: string;
    jenis_ujian: ExamMode;
    input_schema: any;
    formula_expression: string;
    aturan_kelulusan?: {
      kkm?: number;
    };
  };
}

export interface SubmitExamPayload {
  id_jadwal: number;
  id_santri: number;
  catatan?: string;
  tipe_percobaan?: "UTAMA" | "REMEDIAL" | "SUSULAN";
  id_parent_hasil?: number;
  input_data: Record<string, any>;
  questions?: Array<{
    nomor_soal: number;
    start_surat_id?: number;
    start_ayat?: number;
    end_surat_id?: number;
    end_ayat?: number;
    deskripsi_soal?: string;
    input_data: Record<string, any>;
  }>;
}

export interface SubmitExamResponse {
  id_hasil: number;
  id_sekolah: number;
  id_jadwal: number;
  id_santri: number;
  id_muhafiz: number;
  nilai_akhir: number;
  predikat: string;
  is_lulus: boolean;
  catatan: string | null;
  created_at: string;
}

export interface AutoRangeResult {
  found: boolean;
  count_setoran?: number;
  message?: string;
  start_juz?: number | null;
  start_surat_id?: number | null;
  start_ayat?: number | null;
  end_juz?: number | null;
  end_surat_id?: number | null;
  end_ayat?: number | null;
  start_page?: number | null;
  end_page?: number | null;
  total_halaman?: number;
  total_ayat?: number;
  jumlah_hari_setor?: number;
  rata_rata_setoran?: number;
  target_tercapai?: number;
  target_belum_tercapai?: number;
  start_surat?: string;
  end_surat?: string;
}

export interface ExamSession {
  id_sesi_ujian: number;
  id_template: number;
  id_santri: number;
  id_muhafiz: number;
  status: string;
  nilai_akhir: number | null;
  predikat: string | null;
  catatan: string | null;
  range_metadata: AutoRangeResult | null;
  created_at: string;
  updated_at: string;
  template: {
    nama_ujian: string;
    nama_template?: string;
    exam_mode: ExamMode;
    jenis_ujian?: ExamMode;
    tipe_ujian?: "PEKANAN" | "BULANAN" | "HARIAN" | "KUSTOM";
    filter_jenis_kategori?: string[];
    jumlah_soal?: number;
    soal_acak_tanpa_detail?: boolean;
    input_schema: Array<{
      key: string;
      label: string;
      type: string;
      min?: number;
      max?: number;
      default?: any;
    }>;
    formula_expression: string;
  };
  jawaban_soal: Array<{
    id_jawaban: number;
    id_sesi_ujian: number;
    nomor_soal: number;
    soal_detail: {
      start_surat_id?: number | null;
      start_ayat?: number | null;
      end_surat_id?: number | null;
      end_ayat?: number | null;
      deskripsi_soal?: string;
    } | null;
    input_data: Record<string, any>;
    created_at: string;
    updated_at: string;
  }>;
  muhafiz: {
    name: string;
  };
}

export const ujianService = {
  // ── TEMPLATES ───────────────────────────────────────────────────────────
  getExamTemplates: async (): Promise<ApiResponse<ExamTemplate[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<ExamTemplate[]>>("/ujian/templates");
      // Map properties for backward compatibility
      if (response.data && response.data.data) {
        response.data.data = response.data.data.map(t => ({
          ...t,
          nama_ujian: t.nama_template,
          exam_mode: t.jenis_ujian,
        }));
      }
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil templat ujian"));
    }
  },

  createExamTemplate: async (payload: Omit<ExamTemplate, "id_template" | "id_sekolah" | "is_aktif">): Promise<ApiResponse<ExamTemplate>> => {
    try {
      const response = await axiosClient.post<ApiResponse<ExamTemplate>>("/ujian/templates", payload);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal membuat templat ujian"));
    }
  },

  updateExamTemplate: async (idTemplate: number, payload: Partial<ExamTemplate>): Promise<ApiResponse<ExamTemplate>> => {
    try {
      const response = await axiosClient.put<ApiResponse<ExamTemplate>>(`/ujian/templates/${idTemplate}`, payload);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengubah templat ujian"));
    }
  },

  deleteExamTemplate: async (idTemplate: number): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosClient.delete<ApiResponse<any>>(`/ujian/templates/${idTemplate}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus templat ujian"));
    }
  },

  // ── SCHEDULES ───────────────────────────────────────────────────────────
  getExamSchedules: async (params?: { start_date?: string; end_date?: string }): Promise<ApiResponse<ExamSchedule[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<ExamSchedule[]>>("/ujian/jadwal", { params });
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil jadwal ujian"));
    }
  },

  createExamSchedule: async (payload: Omit<ExamSchedule, "id_jadwal" | "id_sekolah">): Promise<ApiResponse<ExamSchedule>> => {
    try {
      const response = await axiosClient.post<ApiResponse<ExamSchedule>>("/ujian/jadwal", payload);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal membuat jadwal ujian"));
    }
  },

  updateExamSchedule: async (idJadwal: number, payload: Partial<ExamSchedule>): Promise<ApiResponse<ExamSchedule>> => {
    try {
      const response = await axiosClient.put<ApiResponse<ExamSchedule>>(`/ujian/jadwal/${idJadwal}`, payload);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui jadwal ujian"));
    }
  },

  deleteExamSchedule: async (idJadwal: number): Promise<ApiResponse<any>> => {
    try {
      const response = await axiosClient.delete<ApiResponse<any>>(`/ujian/jadwal/${idJadwal}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus jadwal ujian"));
    }
  },

  // ── KALKULASI & SNAPSHOT ────────────────────────────────────────────────
  getAutoRange: async (
    idSantri: number,
    idJadwal: number,
    params: { periode_start: string; periode_end: string }
  ): Promise<ApiResponse<AutoRangeResult>> => {
    try {
      const response = await axiosClient.get<ApiResponse<AutoRangeResult>>(
        `/ujian/jadwal/${idJadwal}/kalkulasi/${idSantri}`,
        { params }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil kalkulasi setoran santri"));
    }
  },

  lockSnapshot: async (idJadwal: number): Promise<ApiResponse<{ locked: boolean; santri_count: number }>> => {
    try {
      const response = await axiosClient.post<ApiResponse<{ locked: boolean; santri_count: number }>>(
        `/ujian/jadwal/${idJadwal}/lock-snapshot`
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengunci snapshot materi ujian"));
    }
  },

  // ── RESULTS & HISTORY ───────────────────────────────────────────────────
  submitExam: async (payload: SubmitExamPayload): Promise<ApiResponse<SubmitExamResponse>> => {
    try {
      const response = await axiosClient.post<ApiResponse<SubmitExamResponse>>("/ujian/hasil", payload);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengirimkan hasil ujian"));
    }
  },

  getExamHistory: async (idSantri: number): Promise<ApiResponse<ExamSession[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<any[]>>(`/ujian/hasil/santri/${idSantri}`);
      
      // Adapt new backend response into legacy ExamSession interface
      if (response.data && response.data.data) {
        response.data.data = response.data.data.map((session: any) => {
          const detail = session.detail_jawaban?.[0]?.soal_detail;
          const startSuratName = detail?.start_surat_id ? surahNumberToName(detail.start_surat_id) : undefined;
          const endSuratName = detail?.end_surat_id ? surahNumberToName(detail.end_surat_id) : undefined;

          return {
            id_sesi_ujian: session.id_hasil,
            id_template: session.jadwal?.id_template,
            id_santri: session.id_santri,
            id_muhafiz: session.id_muhafiz,
            status: "SELESAI",
            nilai_akhir: session.nilai_akhir,
            predikat: session.predikat,
            catatan: session.catatan,
            created_at: session.created_at,
            updated_at: session.created_at,
            range_metadata: detail ? {
              found: true,
              start_juz: detail.start_juz || null,
              start_surat_id: detail.start_surat_id || null,
              start_ayat: detail.start_ayat || null,
              end_juz: detail.end_juz || null,
              end_surat_id: detail.end_surat_id || null,
              end_ayat: detail.end_ayat || null,
              start_surat: startSuratName || (detail.start_juz ? `Juz ${detail.start_juz}` : ""),
              end_surat: endSuratName || (detail.end_juz ? `Juz ${detail.end_juz}` : ""),
            } : null,
            template: {
              nama_ujian: session.jadwal?.template?.nama_template || "Ujian",
              exam_mode: session.jadwal?.template?.jenis_ujian || "SINGLE_PASS",
              input_schema: session.jadwal?.template?.input_schema || [],
              formula_expression: session.jadwal?.template?.formula_expression || "",
            },
            jawaban_soal: (session.detail_jawaban || []).map((j: any) => ({
              id_jawaban: j.id_detail,
              id_sesi_ujian: j.id_hasil,
              nomor_soal: j.nomor_soal,
              soal_detail: j.soal_detail,
              input_data: j.input_data,
              created_at: j.created_at,
              updated_at: j.updated_at,
            })),
            muhafiz: session.muhafiz,
          };
        });
      }

      return response.data as unknown as ApiResponse<ExamSession[]>;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil riwayat ujian"));
    }
  },

  getExamReport: async (params: {
    id_template?: number;
    id_jadwal?: number;
    id_halaqah?: number;
    id_muhafiz?: number;
    is_lulus?: boolean;
    start_date?: string;
    end_date?: string;
  }): Promise<ApiResponse<{ results: ExamSession[]; summary: any }>> => {
    try {
      const response = await axiosClient.get<ApiResponse<{ results: ExamSession[]; summary: any }>>(
        "/ujian/laporan",
        { params }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil laporan ujian"));
    }
  },
};
