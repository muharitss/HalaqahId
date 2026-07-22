export interface Tenant {
  id_tenant: number;
  nama_tenant: string;
  slug: string;
  status: "ACTIVE" | "SUSPENDED" | "TRIAL";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TenantBrand {
  id_tenant: number;
  logo_url: string | null;
  favicon_url: string | null;
  warna_primer: string | null;
  warna_sekunder: string | null;
  nama_aplikasi: string | null;
  copyright_text: string | null;
  login_background_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantTerminology {
  id_terminology?: number;
  id_tenant: number;
  kode_entity: string;
  label_default: string;
  label_custom: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TenantFeature {
  id_feature?: number;
  id_tenant: number;
  feature_code: string;
  enabled: boolean;
  config: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}
