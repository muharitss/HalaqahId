import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { halaqahManagementService } from "../api/halaqahManagementService";
import { type Halaqah } from "../types";
import { type Santri } from "../types";
import type { KategoriTarget } from "@/types/domain/enums";
import { toast } from "sonner";

export function useHalaqahManagement() {
  const queryClient = useQueryClient();

  // Selection state
  const [selectedHalaqah, setSelectedHalaqah] = useState<Halaqah | null>(null);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

  // Modal visibility state
  const [isEditHalaqahOpen, setIsEditHalaqahOpen] = useState(false);
  const [isDeleteHalaqahOpen, setIsDeleteHalaqahOpen] = useState(false);
  const [isSantriModalOpen, setIsSantriModalOpen] = useState(false);
  const [isDeleteSantriOpen, setIsDeleteSantriOpen] = useState(false);
  const [isMoveSantriOpen, setIsMoveSantriOpen] = useState(false);

  // --- DATA FETCHING ---
  const { data: { halaqahs = [], santriMap = {} } = {}, isFetching: isLoadingHalaqah, refetch: fetchData } = useQuery({
    queryKey: ["halaqah-management"],
    queryFn: async () => {
      try {
        const data = await halaqahManagementService.getAllHalaqah();
        const map: Record<number, Santri[]> = {};
        data.forEach((h) => {
          map[h.id_halaqah] = (h.santri || []).map((s) => ({
            ...s,
            id_halaqah: h.id_halaqah,
          })) as Santri[];
        });
        return { halaqahs: data, santriMap: map };
      } catch (error) {
        console.error("Gagal mengambil data halaqah:", error);
        toast.error("Gagal mengambil data halaqah");
        throw error;
      }
    }
  });

  // --- HANDLERS ---
  const handleHalaqahSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["halaqah-management"] });
    setIsEditHalaqahOpen(false);
    setIsDeleteHalaqahOpen(false);
  }, [queryClient]);

  const handleOpenAddSantri = useCallback((halaqah: Halaqah) => {
    setSelectedHalaqah(halaqah);
    setSelectedSantri(null);
    setIsSantriModalOpen(true);
  }, []);

  const handleOpenEditSantri = useCallback((santri: Santri) => {
    setSelectedSantri(santri);
    setIsSantriModalOpen(true);
  }, []);

  const saveSantriMutation = useMutation({
    mutationFn: async (data: {
      nama_santri: string | FormDataEntryValue | null;
      nomor_telepon: string | FormDataEntryValue | null;
      target: string;
      id_halaqah: number | undefined;
    }) => {
      const payload = {
        nama_santri: String(data.nama_santri),
        nomor_telepon: String(data.nomor_telepon),
        target: data.target as KategoriTarget,
        id_halaqah: data.id_halaqah || selectedHalaqah?.id_halaqah || 0,
      } as Santri;

      if (selectedSantri?.id_santri) {
        await halaqahManagementService.updateSantri(selectedSantri.id_santri, payload);
        return "update";
      } else {
        await halaqahManagementService.createSantri(payload);
        return "create";
      }
    },
    onSuccess: (type) => {
      toast.success(type === "update" ? "Santri berhasil diperbarui" : "Santri berhasil ditambahkan");
      setIsSantriModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["halaqah-management"] });
    },
    onError: (error) => {
      console.error("Error saving santri:", error);
      toast.error("Gagal menyimpan data santri");
    }
  });

  const deleteSantriMutation = useMutation({
    mutationFn: (id: number) => halaqahManagementService.deleteSantri(id),
    onSuccess: () => {
      toast.success("Santri berhasil dihapus");
      setIsDeleteSantriOpen(false);
      queryClient.invalidateQueries({ queryKey: ["halaqah-management"] });
    },
    onError: (error) => {
      console.error("Error deleting santri:", error);
      toast.error("Gagal menghapus santri");
    }
  });

  const moveSantriMutation = useMutation({
    mutationFn: async ({ santriId, targetHalaqahId }: { santriId: number, targetHalaqahId: number }) => {
      if (!selectedSantri) throw new Error("No selected santri");
      await halaqahManagementService.updateSantri(santriId, {
        ...selectedSantri,
        id_halaqah: targetHalaqahId,
      });
    },
    onSuccess: () => {
      toast.success("Santri berhasil dipindahkan");
      setIsMoveSantriOpen(false);
      queryClient.invalidateQueries({ queryKey: ["halaqah-management"] });
    },
    onError: (error) => {
      console.error("Error moving santri:", error);
      toast.error("Gagal memindahkan santri");
    }
  });

  const handleSaveSantri = useCallback(
    async (data: {
      nama_santri: string | FormDataEntryValue | null;
      nomor_telepon: string | FormDataEntryValue | null;
      target: string;
      id_halaqah: number | undefined;
    }) => {
      await saveSantriMutation.mutateAsync(data);
    },
    [saveSantriMutation]
  );

  const handleDeleteSantriConfirm = useCallback(async () => {
    if (!selectedSantri?.id_santri) return;
    await deleteSantriMutation.mutateAsync(selectedSantri.id_santri);
  }, [selectedSantri, deleteSantriMutation]);

  const handleMoveSantriConfirm = useCallback(
    async (santriId: number, targetHalaqahId: number) => {
      await moveSantriMutation.mutateAsync({ santriId, targetHalaqahId });
    },
    [moveSantriMutation]
  );

  const isSubmitting = saveSantriMutation.isPending || deleteSantriMutation.isPending || moveSantriMutation.isPending;

  return {
    halaqahs,
    santriMap,
    isLoadingHalaqah,
    selectedHalaqah,
    selectedSantri,
    isEditHalaqahOpen,
    isDeleteHalaqahOpen,
    isSantriModalOpen,
    isDeleteSantriOpen,
    isMoveSantriOpen,
    isSubmitting,

    setSelectedHalaqah,
    setSelectedSantri,
    setIsEditHalaqahOpen,
    setIsDeleteHalaqahOpen,
    setIsSantriModalOpen,
    setIsDeleteSantriOpen,
    setIsMoveSantriOpen,

    fetchData,
    handleOpenAddSantri,
    handleOpenEditSantri,
    handleSaveSantri,
    handleDeleteSantriConfirm,
    handleMoveSantriConfirm,
    handleHalaqahSuccess,
  };
}
