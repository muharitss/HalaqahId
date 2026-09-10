import { type Role } from './enums';
import { type LoginFormValues } from '@/features/auth';

export interface User {
  id_user: number;
  name: string;
  email: string;
  password?: string;
  role: Role;
  is_verified: boolean;
  id_sekolah?: number | null;
  id_tenant?: number | null;
  deleted_at?: string | null;
  has_halaqah?: boolean;
  id_halaqah?: number | null;
  nomor_telepon?: string | null;
  halaqah?: {
    id_halaqah: number;
    name_halaqah: string;
    id_muhafiz?: number;
  } | null;
}

export interface UserProfile {
  id_user: number;
  name: string;
  email: string;
  role: Role;
  id_sekolah: number;
  id_tenant?: number | null;
  has_halaqah: boolean;
  id_halaqah: number | null;
  is_verified: boolean;
  nomor_telepon?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserProfile;
  token: string;
}

export interface RegisterMuhafizRequest {
  name: string;
  email: string;
  password: string;
  role?: 'MUHAFIZ' | 'KOORDINATOR_TAHFIZ';
  id_sekolah?: number;
  id_tenant?: number;
  nomor_telepon?: string;
}

export interface RegisterAdminRequest {
  name: string;
  email: string;
  password: string;
  nama_sekolah: string;
  alamat?: string;
  id_tenant?: number;
  tenant_slug?: string;
}

export interface RegisterAdminResponse {
  user: User;
  sekolah: {
    id_sekolah: number;
    nama_sekolah: string;
    alamat?: string;
  };
}

export interface VerifyEmailResponse {
  id_user: number;
  name: string;
  email: string;
  is_verified: boolean;
}

export interface ImpersonateResponse {
  user: {
    id_user: number;
    name: string;
    email: string;
    role: Role;
    id_sekolah: number;
    id_tenant?: number | null;
  };
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id_user: number;
      email: string;
      name: string;
      role: Role;
      id_sekolah?: number | null;
      id_tenant?: number | null;
      id_halaqah?: number | null;
      has_halaqah?: boolean;
      is_verified?: boolean;
      roles?: string[];
      permissions?: string[];
    };
    token: string;
    refresh_token?: string;
  };
}

export interface AuthUser {
  id_user: number;
  email: string;
  role: Role;
  name: string;
  id_sekolah?: number | null;
  id_tenant?: number | null;
  id_halaqah?: number | null;
  has_halaqah?: boolean;
  is_verified?: boolean;
  token?: string;
  avatarUrl?: string;
  isImpersonating?: boolean;
  nomor_telepon?: string | null;
  halaqah?: {
    id_halaqah: number;
    name_halaqah: string;
    id_muhafiz?: number;
  } | null;
  roles?: string[];
  permissions?: string[];
  originalUser?: {
    id_user: number;
    role: Role;
    name: string;
    token: string;
    id_tenant?: number | null;
  };
}

export interface AuthContextType {
  user: AuthUser | null;
  permissions: string[];
  roles: string[];
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  refreshUser: () => Promise<void>;
  impersonate: (userData: AuthUser, originalUser: AuthUser) => Promise<void>;
  stopImpersonating: () => Promise<void>;
  isImpersonating: boolean;
  isAdmin: () => boolean;
  isKepala: () => boolean;
}
