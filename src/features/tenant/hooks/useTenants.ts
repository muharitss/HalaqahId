import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tenantAdminApi } from "../api/tenant-admin.api";
import type {
  TenantListParams,
  CreateTenantPayload,
  UpdateTenantPayload,
  UpdateTenantBrandPayload,
  UpdateTenantTerminologyPayload,
  UpdateTenantFeaturePayload,
  TenantStatus,
} from "../types";

export const TENANT_QUERY_KEYS = {
  all: ["tenants"] as const,
  list: (params?: TenantListParams) => ["tenants", "list", params] as const,
  detail: (id: number) => ["tenants", "detail", id] as const,
  brand: (id: number) => ["tenants", "brand", id] as const,
  terminology: (id: number) => ["tenants", "terminology", id] as const,
  features: (id: number) => ["tenants", "features", id] as const,
};

export function useTenants(params?: TenantListParams) {
  return useQuery({
    queryKey: TENANT_QUERY_KEYS.list(params),
    queryFn: () => tenantAdminApi.listTenants(params),
  });
}

export function useTenantDetail(id: number) {
  return useQuery({
    queryKey: TENANT_QUERY_KEYS.detail(id),
    queryFn: () => tenantAdminApi.getTenantById(id),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTenantPayload) => tenantAdminApi.createTenant(payload),
    onSuccess: (newTenant) => {
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.all });
      toast.success(`Tenant "${newTenant.nama_tenant}" berhasil dibuat`);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || "Gagal membuat tenant";
      toast.error(msg);
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTenantPayload }) =>
      tenantAdminApi.updateTenant(id, payload),
    onSuccess: (updatedTenant) => {
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.all });
      toast.success(`Tenant "${updatedTenant.nama_tenant}" berhasil diperbarui`);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || "Gagal memperbarui tenant";
      toast.error(msg);
    },
  });
}

export function useUpdateTenantStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TenantStatus }) =>
      tenantAdminApi.updateTenantStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.all });
      toast.success(`Status tenant "${updated.nama_tenant}" diubah menjadi ${updated.status}`);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || "Gagal mengubah status tenant";
      toast.error(msg);
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tenantAdminApi.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.all });
      toast.success("Tenant berhasil dihapus");
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || "Gagal menghapus tenant";
      toast.error(msg);
    },
  });
}

export function useTenantBrand(id: number) {
  return useQuery({
    queryKey: TENANT_QUERY_KEYS.brand(id),
    queryFn: () => tenantAdminApi.getBrand(id),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useUpdateTenantBrand(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTenantBrandPayload) =>
      tenantAdminApi.updateBrand(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.brand(id) });
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.detail(id) });
      toast.success("Branding tenant berhasil diperbarui");
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || "Gagal memperbarui brand";
      toast.error(msg);
    },
  });
}

export function useTenantTerminology(id: number) {
  return useQuery({
    queryKey: TENANT_QUERY_KEYS.terminology(id),
    queryFn: () => tenantAdminApi.getTerminology(id),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useUpdateTenantTerminology(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTenantTerminologyPayload) =>
      tenantAdminApi.updateTerminology(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.terminology(id) });
      toast.success("Terminologi berhasil diperbarui");
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || "Gagal memperbarui terminologi";
      toast.error(msg);
    },
  });
}

export function useTenantFeatures(id: number) {
  return useQuery({
    queryKey: TENANT_QUERY_KEYS.features(id),
    queryFn: () => tenantAdminApi.getFeatures(id),
    enabled: typeof id === "number" && id > 0,
  });
}

export function useUpdateTenantFeature(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTenantFeaturePayload) =>
      tenantAdminApi.updateFeature(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.features(id) });
      toast.success("Fitur tenant berhasil diperbarui");
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error.response?.data?.message || error.message || "Gagal memperbarui fitur";
      toast.error(msg);
    },
  });
}
