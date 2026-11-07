import type { PaginationMeta } from "@/types/api/pagination";
import {
  type IzinSantri,
  type AjukanIzinRequest,
  type ApprovalIzinRequest,
  type IzinFilterParams,
  JenisIzin,
  StatusIzin,
  JENIS_IZIN_LABELS,
  STATUS_IZIN_LABELS,
} from "@/types/domain/izin";

export {
  type IzinSantri,
  type AjukanIzinRequest,
  type ApprovalIzinRequest,
  type IzinFilterParams,
  JenisIzin,
  StatusIzin,
  JENIS_IZIN_LABELS,
  STATUS_IZIN_LABELS,
};

export type IzinStatusTab = "ALL" | StatusIzin;

export interface IzinFilterState {
  statusTab: IzinStatusTab;
  idSantri?: number;
  tanggal?: string;
  page: number;
  limit: number;
}

export interface IzinListResponse {
  data: IzinSantri[];
  pagination?: PaginationMeta;
}
