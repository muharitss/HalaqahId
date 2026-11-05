import axiosClient from "@/lib/axiosClient";
import type {
  CheckSlugResult,
  CheckEmailResult,
  RegisterTenantPayload,
  RegisterTenantResult,
} from "../types";

export const onboardingApi = {
  checkSlug: async (slug: string): Promise<CheckSlugResult> => {
    const res = await axiosClient.get(`/onboarding/check-slug/${encodeURIComponent(slug)}`);
    return res.data?.data ?? res.data;
  },

  checkEmail: async (email: string): Promise<CheckEmailResult> => {
    const res = await axiosClient.get(`/onboarding/check-email/${encodeURIComponent(email)}`);
    return res.data?.data ?? res.data;
  },

  registerTenant: async (
    payload: RegisterTenantPayload
  ): Promise<RegisterTenantResult> => {
    const res = await axiosClient.post("/onboarding/register", payload);
    return res.data?.data ?? res.data;
  },
};
