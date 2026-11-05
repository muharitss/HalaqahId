import type { Tenant, TenantBrand } from "@/types";

export type TenantStatus = "ACTIVE" | "SUSPENDED" | "TRIAL";

export interface TenantListItem extends Tenant {
  brand?: TenantBrand | null;
  _count?: {
    users?: number;
    sekolah?: number;
  };
}

export interface TenantListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TenantStatus;
}

export interface CreateTenantPayload {
  nama_tenant: string;
  slug: string;
  status?: TenantStatus;
}

export interface UpdateTenantPayload {
  nama_tenant?: string;
  slug?: string;
}

export interface UpdateTenantStatusPayload {
  status: TenantStatus;
}

export interface UpdateTenantBrandPayload {
  logo_url?: string | null;
  favicon_url?: string | null;
  warna_primer?: string | null;
  warna_sekunder?: string | null;
  nama_aplikasi?: string | null;
  copyright_text?: string | null;
  login_background_url?: string | null;
}

export interface UpdateTenantTerminologyPayload {
  kode_entity: string;
  label_custom: string | null;
}

export interface UpdateTenantFeaturePayload {
  feature_code: string;
  enabled: boolean;
  config?: Record<string, unknown> | null;
}

export interface TenantDetail extends Tenant {
  brand?: TenantBrand | null;
  roles?: Array<{
    id_role: number;
    nama_role: string;
    kode_role: string;
  }>;
}
