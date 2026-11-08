export interface CheckSlugResult {
  slug: string;
  available: boolean;
}

export interface CheckEmailResult {
  email: string;
  available: boolean;
}

export interface RegisterTenantPayload {
  nama_tenant: string;
  slug: string;
  email_admin: string;
  password: string;
  nama_sekolah: string;
}

export interface RegisterTenantResult {
  token: string;
  refresh_token?: string;
  tenant: {
    id_tenant: number;
    nama_tenant: string;
    slug: string;
    status: string;
  };
  user: {
    id_user: number;
    name: string;
    email: string;
    role: string;
    is_verified: boolean;
  };
  sekolah: {
    id_sekolah: number;
    nama_sekolah: string;
  };
}

export interface OnboardingFormData {
  // Step 1: Info Tenant / Lembaga
  nama_tenant: string;
  slug: string;

  // Step 2: Info Admin
  admin_name: string;
  email_admin: string;
  password: string;
  confirm_password: string;

  // Step 3: Info Sekolah / Unit
  nama_sekolah: string;
  jenis_lembaga: string;
  alamat_sekolah: string;

  // Step 4: Plan
  plan: "TRIAL" | "STANDARD" | "PRO";
}
