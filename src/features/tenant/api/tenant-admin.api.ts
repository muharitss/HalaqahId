import axiosClient from "@/lib/axiosClient";
import type { PaginationMeta } from "@/types/api/pagination";
import type {
  TenantListItem,
  TenantDetail,
  TenantListParams,
  CreateTenantPayload,
  UpdateTenantPayload,
  UpdateTenantBrandPayload,
  UpdateTenantTerminologyPayload,
  UpdateTenantFeaturePayload,
  TenantStatus,
} from "../types";
import type { Tenant, TenantBrand, TenantTerminology, TenantFeature } from "@/types";

export interface TenantListResult {
  tenants: TenantListItem[];
  meta: PaginationMeta;
}

export const tenantAdminApi = {
  listTenants: async (params?: TenantListParams): Promise<TenantListResult> => {
    const res = await axiosClient.get("/tenants", { params });
    const payload = res.data;
    const tenants: TenantListItem[] = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
      ? payload
      : [];
    const meta: PaginationMeta = payload?.meta ||
      payload?.pagination || {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: tenants.length,
        totalPages: Math.max(1, Math.ceil(tenants.length / (params?.limit || 10))),
      };
    return { tenants, meta };
  },

  getTenantById: async (id: number): Promise<TenantDetail> => {
    const res = await axiosClient.get(`/tenants/${id}`);
    return res.data?.data ?? res.data;
  },

  createTenant: async (payload: CreateTenantPayload): Promise<Tenant> => {
    const res = await axiosClient.post("/tenants", payload);
    return res.data?.data ?? res.data;
  },

  updateTenant: async (id: number, payload: UpdateTenantPayload): Promise<Tenant> => {
    const res = await axiosClient.put(`/tenants/${id}`, payload);
    return res.data?.data ?? res.data;
  },

  updateTenantStatus: async (id: number, status: TenantStatus): Promise<Tenant> => {
    const res = await axiosClient.put(`/tenants/${id}/status`, { status });
    return res.data?.data ?? res.data;
  },

  deleteTenant: async (id: number): Promise<void> => {
    await axiosClient.delete(`/tenants/${id}`);
  },

  getBrand: async (id: number): Promise<TenantBrand> => {
    const res = await axiosClient.get(`/tenant/${id}/brand`);
    return res.data?.data ?? res.data;
  },

  updateBrand: async (
    id: number,
    payload: UpdateTenantBrandPayload
  ): Promise<TenantBrand> => {
    const res = await axiosClient.put(`/tenant/${id}/brand`, payload);
    return res.data?.data ?? res.data;
  },

  getTerminology: async (id: number): Promise<TenantTerminology[]> => {
    const res = await axiosClient.get(`/tenant/${id}/terminology`);
    const data = res.data?.data ?? res.data;
    return Array.isArray(data) ? data : [];
  },

  updateTerminology: async (
    id: number,
    payload: UpdateTenantTerminologyPayload
  ): Promise<TenantTerminology> => {
    const res = await axiosClient.put(`/tenant/${id}/terminology`, payload);
    return res.data?.data ?? res.data;
  },

  getFeatures: async (id: number): Promise<TenantFeature[]> => {
    const res = await axiosClient.get(`/tenant/${id}/features`);
    const data = res.data?.data ?? res.data;
    return Array.isArray(data) ? data : [];
  },

  updateFeature: async (
    id: number,
    payload: UpdateTenantFeaturePayload
  ): Promise<TenantFeature> => {
    const res = await axiosClient.put(`/tenant/${id}/features`, payload);
    return res.data?.data ?? res.data;
  },
};
