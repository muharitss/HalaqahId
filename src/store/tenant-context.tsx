/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { tenantApi } from "@/lib/api/tenant.api";
import { getTenantSlugFromUrl } from "@/utils/tenant";
import type { Tenant, TenantBrand, TenantTerminology, TenantFeature } from "@/types";

interface TenantContextType {
  tenant: Tenant | null;
  brand: TenantBrand | null;
  terminology: TenantTerminology[];
  features: TenantFeature[];
  isLoading: boolean;
  error: Error | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Re-export getTenantSlugFromUrl for convenience
export { getTenantSlugFromUrl };

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const slug = useMemo(() => getTenantSlugFromUrl(), []);

  // Fetch base tenant information
  const {
    data: tenantResponse,
    isLoading: isLoadingTenant,
    error: tenantError,
  } = useQuery({
    queryKey: ["tenant", slug],
    queryFn: () => tenantApi.resolve(slug),
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  const tenant = tenantResponse?.data || null;
  const activeTenantId = tenant?.id_tenant;

  // Fetch branding info (parallel, dependent on tenant id)
  const { data: brandResponse, isLoading: isLoadingBrand } = useQuery({
    queryKey: ["tenant-brand", activeTenantId],
    queryFn: () => tenantApi.getBrand(activeTenantId!),
    enabled: !!activeTenantId,
    staleTime: 1000 * 60 * 10,
  });

  // Fetch custom terminology mapping (parallel, dependent on tenant id)
  const { data: terminologyResponse, isLoading: isLoadingTerminology } =
    useQuery({
      queryKey: ["tenant-terminology", activeTenantId],
      queryFn: () => tenantApi.getTerminology(activeTenantId!),
      enabled: !!activeTenantId,
      staleTime: 1000 * 60 * 10,
    });

  // Fetch active features gating (parallel, dependent on tenant id)
  const { data: featuresResponse, isLoading: isLoadingFeatures } = useQuery({
    queryKey: ["tenant-features", activeTenantId],
    queryFn: () => tenantApi.getFeatures(activeTenantId!),
    enabled: !!activeTenantId,
    staleTime: 1000 * 60 * 10,
  });

  const contextValue = useMemo<TenantContextType>(() => {
    return {
      tenant,
      brand: brandResponse?.data || null,
      terminology: terminologyResponse?.data || [],
      features: featuresResponse?.data || [],
      isLoading:
        isLoadingTenant ||
        (!!activeTenantId &&
          (isLoadingBrand || isLoadingTerminology || isLoadingFeatures)),
      error: (tenantError as Error) || null,
    };
  }, [
    tenant,
    brandResponse,
    terminologyResponse,
    featuresResponse,
    isLoadingTenant,
    isLoadingBrand,
    isLoadingTerminology,
    isLoadingFeatures,
    activeTenantId,
    tenantError,
  ]);

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

export const useTerminology = (code: string, fallback?: string): string => {
  const { terminology } = useTenant();
  const matched = terminology.find(
    (t) => t.kode_entity.toUpperCase() === code.toUpperCase()
  );
  return matched?.label_custom || matched?.label_default || fallback || code;
};

const DEFAULT_CORE_FEATURES: Record<string, boolean> = {
  UJIAN: true,
  RUBRIK: true,
  TARGET: true,
  BLOG: true,
  PORTAL_WALI: true,
};

export const useFeature = (code: string): boolean => {
  const { features } = useTenant();
  const normalized = code?.toUpperCase();
  const matched = features?.find(
    (f) => f.feature_code?.toUpperCase() === normalized
  );
  if (matched !== undefined) {
    return matched.enabled;
  }
  return DEFAULT_CORE_FEATURES[normalized] ?? false;
};

export const useFeatureConfig = <T = unknown>(code: string): T | null => {
  const { features } = useTenant();
  const matched = features?.find(
    (f) => f.feature_code?.toUpperCase() === code?.toUpperCase()
  );
  return (matched?.config as T) ?? null;
};