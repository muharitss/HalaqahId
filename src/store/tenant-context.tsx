import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { tenantApi } from "@/lib/api/tenant.api";
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

// Helper to determine the tenant slug from host or environment
export const getTenantSlugFromUrl = (): string => {
  const isSingleMode = import.meta.env.VITE_TENANT_MODE === "single";
  if (isSingleMode) {
    return import.meta.env.VITE_DEFAULT_TENANT_SLUG || "default";
  }

  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  // Handle subdomain resolving (e.g., tenant-a.halaqah.id or tenant-a.localhost)
  if (parts.length > 2) {
    const subdomain = parts[0];
    if (subdomain !== "www" && subdomain !== "app" && subdomain !== "admin") {
      return subdomain;
    }
  }

  // Fallback to configured default
  return import.meta.env.VITE_DEFAULT_TENANT_SLUG || "default";
};

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
  const tenantId = tenant?.id_tenant;

  // Fetch branding info
  const { data: brandResponse, isLoading: isLoadingBrand } = useQuery({
    queryKey: ["tenant-brand", tenantId],
    queryFn: () => tenantApi.getBrand(tenantId!),
    enabled: !!tenantId,
    staleTime: 1000 * 60 * 10,
  });

  // Fetch custom terminology mapping
  const { data: terminologyResponse, isLoading: isLoadingTerminology } =
    useQuery({
      queryKey: ["tenant-terminology", tenantId],
      queryFn: () => tenantApi.getTerminology(tenantId!),
      enabled: !!tenantId,
      staleTime: 1000 * 60 * 10,
    });

  // Fetch active features gating
  const { data: featuresResponse, isLoading: isLoadingFeatures } = useQuery({
    queryKey: ["tenant-features", tenantId],
    queryFn: () => tenantApi.getFeatures(tenantId!),
    enabled: !!tenantId,
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
        (!!tenantId &&
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
    tenantId,
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

export const useTerminology = (code: string, fallback: string): string => {
  const { terminology } = useTenant();
  const matched = terminology.find(
    (t) => t.kode_entity.toUpperCase() === code.toUpperCase()
  );
  return matched?.label_custom || matched?.label_default || fallback;
};

export const useFeature = (code: string): boolean => {
  const { features } = useTenant();
  const matched = features.find(
    (f) => f.feature_code.toUpperCase() === code.toUpperCase()
  );
  return matched ? matched.enabled : false;
};
