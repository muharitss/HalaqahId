import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/api/common";
import type {
  ProgramTahfidz,
  LevelHafalan,
  CreateProgramPayload,
  UpdateProgramPayload,
  CreateLevelPayload,
  UpdateLevelPayload,
} from "../../types";

export const programService = {
  // ==================== PROGRAM TAHFIDZ ====================
  getAllPrograms: async (): Promise<ApiResponse<ProgramTahfidz[]>> => {
    const res = await axiosClient.get<ApiResponse<ProgramTahfidz[]>>("/program");
    return res.data;
  },

  getProgramById: async (id: number): Promise<ApiResponse<ProgramTahfidz>> => {
    const res = await axiosClient.get<ApiResponse<ProgramTahfidz>>(`/program/${id}`);
    return res.data;
  },

  createProgram: async (
    payload: CreateProgramPayload
  ): Promise<ApiResponse<ProgramTahfidz>> => {
    const res = await axiosClient.post<ApiResponse<ProgramTahfidz>>("/program", payload);
    return res.data;
  },

  updateProgram: async (
    id: number,
    payload: UpdateProgramPayload
  ): Promise<ApiResponse<ProgramTahfidz>> => {
    const res = await axiosClient.put<ApiResponse<ProgramTahfidz>>(`/program/${id}`, payload);
    return res.data;
  },

  deleteProgram: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/program/${id}`);
    return res.data;
  },

  // ==================== LEVEL HAFALAN ====================
  getLevels: async (idProgram: number): Promise<ApiResponse<LevelHafalan[]>> => {
    const res = await axiosClient.get<ApiResponse<LevelHafalan[]>>(
      `/program/${idProgram}/level`
    );
    return res.data;
  },

  getLevelById: async (
    idProgram: number,
    idLevel: number
  ): Promise<ApiResponse<LevelHafalan>> => {
    const res = await axiosClient.get<ApiResponse<LevelHafalan>>(
      `/program/${idProgram}/level/${idLevel}`
    );
    return res.data;
  },

  createLevel: async (
    idProgram: number,
    payload: CreateLevelPayload
  ): Promise<ApiResponse<LevelHafalan>> => {
    const res = await axiosClient.post<ApiResponse<LevelHafalan>>(
      `/program/${idProgram}/level`,
      payload
    );
    return res.data;
  },

  updateLevel: async (
    idProgram: number,
    idLevel: number,
    payload: UpdateLevelPayload
  ): Promise<ApiResponse<LevelHafalan>> => {
    const res = await axiosClient.put<ApiResponse<LevelHafalan>>(
      `/program/${idProgram}/level/${idLevel}`,
      payload
    );
    return res.data;
  },

  deleteLevel: async (
    idProgram: number,
    idLevel: number
  ): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(
      `/program/${idProgram}/level/${idLevel}`
    );
    return res.data;
  },
};
