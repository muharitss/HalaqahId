import { useTenant } from "@/store/tenant-context";

const DEFAULT_TERMINOLOGY: Record<string, string> = {
  SANTRI: "Santri",
  HALAQAH: "Halaqah",
  MUHAFIZ: "Muhafiz",
  SEKOLAH: "Sekolah",
};

/**
 * Hook to retrieve custom terminology label for a specific entity code (e.g., 'SANTRI', 'HALAQAH', 'MUHAFIZ', 'SEKOLAH').
 * Falls back to tenant default label or predefined system default.
 */
export function useTerminology(code: string, fallback?: string): string {
  const { terminology } = useTenant();
  const upperCode = code?.toUpperCase();

  const term = terminology?.find(
    (t) => t.kode_entity.toUpperCase() === upperCode
  );

  if (term?.label_custom && term.label_custom.trim()) {
    return term.label_custom;
  }
  if (term?.label_default && term.label_default.trim()) {
    return term.label_default;
  }
  if (fallback) {
    return fallback;
  }

  return DEFAULT_TERMINOLOGY[upperCode] || code;
}
