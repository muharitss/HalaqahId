import axiosClient from "@/lib/axiosClient";

export const landingService = {
  getSections: async () => {
    const res = await axiosClient.get("/landing/sections");
    return res.data;
  },

  getAdminSections: async () => {
    const res = await axiosClient.get("/landing/admin/sections");
    return res.data;
  },

  updateAdminSection: async (sectionKey: string, payload: any) => {
    const res = await axiosClient.put(`/landing/admin/sections/${sectionKey}`, payload);
    return res.data;
  },
};

export const seoService = {
  getRedirects: async () => {
    const res = await axiosClient.get("/seo");
    return res.data;
  },

  createRedirect: async (payload: any) => {
    const res = await axiosClient.post("/seo", payload);
    return res.data;
  },

  updateRedirect: async (id: number, payload: any) => {
    const res = await axiosClient.put(`/seo/${id}`, payload);
    return res.data;
  },

  deleteRedirect: async (id: number) => {
    const res = await axiosClient.delete(`/seo/${id}`);
    return res.data;
  },

  getSettings: async () => {
    const res = await axiosClient.get("/seo/settings");
    return res.data;
  },
};
