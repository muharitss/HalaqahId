import { useTenant } from "@/store/tenant-context";

export function useTerminology(kode: string): string {
  const { terminology } = useTenant();
  const term = terminology.find(
    (t) => t.kode_entity.toUpperCase() === kode.toUpperCase()
  );
  return term?.label_custom || term?.label_default || kode;
}
