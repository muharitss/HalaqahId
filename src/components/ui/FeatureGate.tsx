import React from "react";
import { useFeature } from "@/lib/hooks/useFeature";

export interface FeatureGateProps {
  code: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * FeatureGate renders its children only if the specified tenant feature is enabled.
 * If disabled, it renders optional fallback content or null.
 */
export function FeatureGate({
  code,
  children,
  fallback,
}: FeatureGateProps) {
  const enabled = useFeature(code);
  return enabled ? <>{children}</> : (fallback ?? null);
}
