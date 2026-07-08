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

export interface ExamSession {
  id_sesi_ujian: number;
  id_template: number;
  id_santri: number;
  id_muhafiz: number;
  status: string;
  nilai_akhir: number | null;
  predikat: string | null;
  catatan: string | null;
  created_at: string;
  updated_at: string;
  template: {
    nama_ujian: string;
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


