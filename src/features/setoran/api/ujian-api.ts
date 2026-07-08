import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/features/halaqah/api/halaqahService";

export type ExamMode = "MULTI_SOAL" | "SINGLE_PASS";

export interface ExamTemplate {
  id_template: number;
  id_sekolah: number;
  nama_ujian: string;
  exam_mode: ExamMode;
  input_schema: Array<{
    key: string;
    label: string;
    type: "COUNTER" | "SLIDER" | "TEXTAREA" | "NUMBER";
    min?: number;
    max?: number;
    default?: any;
  }>;
  formula_expression: string;
  soal_rules: {
    jumlah_soal?: number;          // MULTI_SOAL
    mode?: string;
    nilai_per_kesalahan?: number;  // SINGLE_PASS
    auto_range_from_setoran?: boolean; // SINGLE_PASS
    periode?: "PEKANAN" | "BULANAN";
  };
}

export interface SubmitExamPayload {
  id_template: number;
  id_santri: number;
  catatan?: string;

  // Untuk MULTI_SOAL
  questions?: Array<{
    nomor_soal: number;
    start_surat_id?: number;
    start_ayat?: number;
    end_surat_id?: number;
    end_ayat?: number;
    deskripsi_soal?: string;
    input_data: Record<string, any>;
  }>;

  // Untuk SINGLE_PASS
  single_pass_data?: {
    jumlah_kesalahan: number;
    periode_start?: string;
    periode_end?: string;
    start_surat_id?: number;
    start_ayat?: number;
    end_surat_id?: number;
    end_ayat?: number;
    start_surat?: string;
    end_surat?: string;
  };
}

export interface SubmitExamResponse {
  session: {
    id_sesi_ujian: number;
    id_template: number;
    id_santri: number;
    nilai_akhir: number;
    predikat: string;
    catatan: string | null;
  };
  nilai_akhir: number;
  predikat: string;
  total_kesalahan: number;
  exam_mode: ExamMode;
  range_metadata: AutoRangeResult | null;
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
    exam_mode: ExamMode;
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
    id_user: number;
    name: string;
  };
}

export interface AutoRangeResult {
  found: boolean;
  count_setoran?: number;
  message?: string;
  start_surat_id?: number;
  start_ayat?: number;
  end_surat_id?: number;
  end_ayat?: number;
  start_surat?: string;
  end_surat?: string;
  periode_start?: string;
  periode_end?: string;
}

export const ujianService = {
  getExamTemplates: async (): Promise<ApiResponse<ExamTemplate[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<ExamTemplate[]>>("/ujian/templates");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil templat ujian"));
    }
  },

  submitExam: async (payload: SubmitExamPayload): Promise<ApiResponse<SubmitExamResponse>> => {
    try {
      const response = await axiosClient.post<ApiResponse<SubmitExamResponse>>("/ujian/sessions/submit", payload);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengirimkan ujian"));
    }
  },

  getExamHistory: async (idSantri: number): Promise<ApiResponse<ExamSession[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<ExamSession[]>>(`/ujian/sessions/santri/${idSantri}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil riwayat ujian"));
    }
  },

  /**
   * Ambil range materi ujian otomatis dari akumulasi setoran santri.
   * Digunakan untuk mode SINGLE_PASS (Ujian Bulanan).
   */
  getAutoRange: async (
    idSantri: number,
    params?: { periode_start?: string; periode_end?: string; id_kategori?: number }
  ): Promise<ApiResponse<AutoRangeResult>> => {
    try {
      const response = await axiosClient.get<ApiResponse<AutoRangeResult>>(
        `/ujian/sessions/santri/${idSantri}/range`,
        { params }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil range materi ujian"));
    }
  },

  createExamTemplate: async (payload: Omit<ExamTemplate, "id_template" | "id_sekolah">): Promise<ApiResponse<ExamTemplate>> => {
    try {
      const response = await axiosClient.post<ApiResponse<ExamTemplate>>("/ujian/templates", payload);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal membuat templat ujian"));
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
};
