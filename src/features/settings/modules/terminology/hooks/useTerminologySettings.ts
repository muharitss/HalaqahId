import { useState, useEffect, useCallback } from "react";
import { useTenant } from "@/store/tenant-context";
import { tenantApi } from "@/lib/api/tenant.api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ENTITY_CONFIGS } from "../constants/terminology.constants";

export function useTerminologySettings() {
  const { tenant, terminology } = useTenant();
  const queryClient = useQueryClient();

  const [customLabels, setCustomLabels] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [isSavingAll, setIsSavingAll] = useState(false);

  useEffect(() => {
    if (terminology) {
      const mapped: Record<string, string> = {};
      terminology.forEach((t) => {
        mapped[t.kode_entity.toUpperCase()] = t.label_custom || "";
      });
      setCustomLabels(mapped);
    }
  }, [terminology]);

  const handleLabelChange = useCallback((code: string, val: string) => {
    setCustomLabels((prev) => ({
      ...prev,
      [code]: val,
    }));
  }, []);

  const handleSaveItem = useCallback(
    async (code: string) => {
      if (!tenant?.id_tenant) return;

      setSavingKey(code);
      try {
        const val = customLabels[code]?.trim() || null;
        await tenantApi.updateTerminology(tenant.id_tenant, {
          kode_entity: code,
          label_custom: val,
        });

        await queryClient.invalidateQueries({
          queryKey: ["tenant-terminology", tenant.id_tenant],
        });
        await queryClient.invalidateQueries({
          queryKey: ["tenant", tenant.id_tenant, "terminology"],
        });

        toast.success(`Terminologi ${code} berhasil diperbarui!`);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || `Gagal menyimpan terminologi ${code}`
        );
      } finally {
        setSavingKey(null);
      }
    },
    [tenant?.id_tenant, customLabels, queryClient]
  );

  const handleResetItem = useCallback(
    async (code: string) => {
      if (!tenant?.id_tenant) return;

      setSavingKey(code);
      try {
        await tenantApi.updateTerminology(tenant.id_tenant, {
          kode_entity: code,
          label_custom: null,
        });

        setCustomLabels((prev) => ({
          ...prev,
          [code]: "",
        }));

        await queryClient.invalidateQueries({
          queryKey: ["tenant-terminology", tenant.id_tenant],
        });
        await queryClient.invalidateQueries({
          queryKey: ["tenant", tenant.id_tenant, "terminology"],
        });

        toast.success(`Terminologi ${code} dikembalikan ke default.`);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || `Gagal mereset terminologi ${code}`
        );
      } finally {
        setSavingKey(null);
      }
    },
    [tenant?.id_tenant, queryClient]
  );

  const handleSaveAll = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!tenant?.id_tenant) return;

      setIsSavingAll(true);
      try {
        for (const item of ENTITY_CONFIGS) {
          const val = customLabels[item.code]?.trim() || null;
          await tenantApi.updateTerminology(tenant.id_tenant, {
            kode_entity: item.code,
            label_custom: val,
          });
        }

        await queryClient.invalidateQueries({
          queryKey: ["tenant-terminology", tenant.id_tenant],
        });
        await queryClient.invalidateQueries({
          queryKey: ["tenant", tenant.id_tenant, "terminology"],
        });

        toast.success("Semua perubahan terminologi berhasil disimpan!");
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Gagal menyimpan perubahan terminologi"
        );
      } finally {
        setIsSavingAll(false);
      }
    },
    [tenant?.id_tenant, customLabels, queryClient]
  );

  return {
    tenant,
    terminology,
    entityConfigs: ENTITY_CONFIGS,
    customLabels,
    savingKey,
    isSavingAll,
    handleLabelChange,
    handleSaveItem,
    handleResetItem,
    handleSaveAll,
  };
}
