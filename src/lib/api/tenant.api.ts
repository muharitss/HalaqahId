import axiosClient from "../axiosClient";
import type  { Tenant, TenantBrand, TenantTerminology, TenantFeature } from "@/types";

export const tenantApi = {
  resolve: async (slug: string) => {
    const response = await axiosClient.get<{ success: boolean; data: Tenant }>(
      `/tenant/${slug}`
    );
    return response.data;
  },

  getBrand: async (id: number) => {
    const response = await axiosClient.get<{ success: boolean; data: TenantBrand }>(
      `/tenant/${id}/brand`
    );
    return response.data;
  },

  getTerminology: async (id: number) => {
    const response = await axiosClient.get<{
      success: boolean;
      data: TenantTerminology[];
    }>(`/tenant/${id}/terminology`);
    return response.data;
  },

  getFeatures: async (id: number) => {
    const response = await axiosClient.get<{
      success: boolean;
      data: TenantFeature[];
    }>(`/tenant/${id}/features`);
    return response.data;
  },
};
