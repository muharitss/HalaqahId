import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/features/halaqah/api/halaqahService";

export interface ExamTemplate {
  id_template: number;
  id_sekolah: number;
  nama_ujian: string;
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
    jumlah_soal?: number;
    mode?: string;
  };
}

export interface SubmitExamPayload {
  id_template: number;
  id_santri: number;
  catatan?: string;
  questions: Array<{
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
};
