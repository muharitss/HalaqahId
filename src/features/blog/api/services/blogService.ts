import axiosClient from "@/lib/axiosClient";

export const blogService = {
  getPosts: async (params?: Record<string, any>) => {
    const res = await axiosClient.get("/blog/posts", { params });
    return res.data;
  },

  getPostBySlug: async (slug: string) => {
    const res = await axiosClient.get(`/blog/posts/${slug}`);
    return res.data;
  },

  getCategories: async () => {
    const res = await axiosClient.get("/blog/categories");
    return res.data;
  },

  getTags: async () => {
    const res = await axiosClient.get("/blog/tags");
    return res.data;
  },

  getAdminPosts: async () => {
    const res = await axiosClient.get("/blog/admin/posts");
    return res.data;
  },

  createAdminPost: async (payload: any) => {
    const res = await axiosClient.post("/blog/admin/posts", payload);
    return res.data;
  },

  updateAdminPost: async (id: number, payload: any) => {
    const res = await axiosClient.put(`/blog/admin/posts/${id}`, payload);
    return res.data;
  },

  deleteAdminPost: async (id: number) => {
    const res = await axiosClient.delete(`/blog/admin/posts/${id}`);
    return res.data;
  },

  restoreAdminPost: async (id: number) => {
    const res = await axiosClient.post(`/blog/admin/posts/${id}/restore`);
    return res.data;
  },

  createAdminCategory: async (payload: { nama: string; slug: string }) => {
    const res = await axiosClient.post("/blog/admin/categories", payload);
    return res.data;
  },

  deleteAdminCategory: async (id: number) => {
    const res = await axiosClient.delete(`/blog/admin/categories/${id}`);
    return res.data;
  },

  createAdminTag: async (payload: { nama: string; slug: string }) => {
    const res = await axiosClient.post("/blog/admin/tags", payload);
    return res.data;
  },

  deleteAdminTag: async (id: number) => {
    const res = await axiosClient.delete(`/blog/admin/tags/${id}`);
    return res.data;
  },
};
