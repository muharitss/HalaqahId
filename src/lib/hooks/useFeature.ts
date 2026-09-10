import { useTenant } from "@/store/tenant-context";

const DEFAULT_CORE_FEATURES: Record<string, boolean> = {
  UJIAN: true,
  RUBRIK: true,
  TARGET: true,
  BLOG: true,
  PORTAL_WALI: true,
};

/**
 * Hook to check if a specific tenant feature is enabled.
 * Case-insensitive comparison against tenant features list.
 */
export function useFeature(code: string): boolean {
  const { features } = useTenant();
  const normalized = code?.toUpperCase();
  const matched = features?.find(
    (f) => f.feature_code?.toUpperCase() === normalized
  );

  if (matched !== undefined) {
    return matched.enabled;
  }

  return DEFAULT_CORE_FEATURES[normalized] ?? false;
}

/**
 * Hook to retrieve configuration metadata associated with a tenant feature.
 */
export function useFeatureConfig<T = unknown>(code: string): T | null {
  const { features } = useTenant();
  const matched = features?.find(
    (f) => f.feature_code?.toUpperCase() === code?.toUpperCase()
  );
  return (matched?.config as T) ?? null;
}
