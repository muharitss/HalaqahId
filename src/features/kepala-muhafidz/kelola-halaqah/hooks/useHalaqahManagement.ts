import { useState, useEffect, useCallback } from "react";
import { halaqahManagementService } from "../services/halaqahManagementService";
import { type Halaqah } from "../types";
import { type Santri } from "../types";
import type { KategoriTarget } from "@/types/domain/enums";
import { toast } from "sonner";

export function useHalaqahManagement() {
  // --- STATE ---
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);
  const [isLoadingHalaqah, setIsLoadingHalaqah] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selection state
  const [selectedHalaqah, setSelectedHalaqah] = useState<Halaqah | null>(null);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

  // Modal visibility state
  const [isEditHalaqahOpen, setIsEditHalaqahOpen] = useState(false);
  const [isDeleteHalaqahOpen, setIsDeleteHalaqahOpen] = useState(false);
  const [isSantriModalOpen, setIsSantriModalOpen] = useState(false);
  const [isDeleteSantriOpen, setIsDeleteSantriOpen] = useState(false);
  const [isMoveSantriOpen, setIsMoveSantriOpen] = useState(false);

  // Derived state: Santri Map (Organized by id_halaqah)
  const [santriMap, setSantriMap] = useState<Record<number, Santri[]>>({});

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    setIsLoadingHalaqah(true);
    try {
      const data = await halaqahManagementService.getAllHalaqah();
      setHalaqahs(data);

      const map: Record<number, Santri[]> = {};
      data.forEach((h) => {
        map[h.id_halaqah] = (h.santri || []).map((s) => ({
          ...s,
          id_halaqah: h.id_halaqah,
        })) as Santri[];
      });
      setSantriMap(map);
    } catch (error) {
      console.error("Gagal mengambil data halaqah:", error);
      toast.error("Gagal mengambil data halaqah");
    } finally {
      setIsLoadingHalaqah(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- HANDLERS ---

  // 1. Halaqah Handlers
  const handleHalaqahSuccess = useCallback(() => {
    fetchData();
    setIsEditHalaqahOpen(false);
    setIsDeleteHalaqahOpen(false);
  }, [fetchData]);

  // 2. Santri Handlers
  const handleOpenAddSantri = useCallback((halaqah: Halaqah) => {
    setSelectedHalaqah(halaqah);
    setSelectedSantri(null);
    setIsSantriModalOpen(true);
  }, []);

  const handleOpenEditSantri = useCallback((santri: Santri) => {
    setSelectedSantri(santri);
    setIsSantriModalOpen(true);
  }, []);

  const handleSaveSantri = useCallback(
    async (data: {
      nama_santri: string | FormDataEntryValue | null;
      nomor_telepon: string | FormDataEntryValue | null;
      target: string;
      id_halaqah: number | undefined;
    }) => {
      setIsSubmitting(true);
      try {
        const payload = {
          nama_santri: String(data.nama_santri),
          nomor_telepon: String(data.nomor_telepon),
          target: data.target as KategoriTarget,
          id_halaqah: data.id_halaqah || selectedHalaqah?.id_halaqah || 0,
        } as Santri;

        if (selectedSantri?.id_santri) {
          await halaqahManagementService.updateSantri(
            selectedSantri.id_santri,
            payload,
          );
          toast.success("Santri berhasil diperbarui");
        } else {
          await halaqahManagementService.createSantri(payload);
          toast.success("Santri berhasil ditambahkan");
        }
        setIsSantriModalOpen(false);
        fetchData();
      } catch (error) {
        console.error("Error saving santri:", error);
        toast.error("Gagal menyimpan data santri");
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedSantri, selectedHalaqah, fetchData],
  );

  const handleDeleteSantriConfirm = useCallback(async () => {
    if (!selectedSantri?.id_santri) return;

    setIsSubmitting(true);
    try {
      await halaqahManagementService.deleteSantri(selectedSantri.id_santri);
      toast.success("Santri berhasil dihapus");
      setIsDeleteSantriOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting santri:", error);
      toast.error("Gagal menghapus santri");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedSantri, fetchData]);

  const handleMoveSantriConfirm = useCallback(
    async (santriId: number, targetHalaqahId: number) => {
      if (!selectedSantri) return;

      setIsSubmitting(true);
      try {
        await halaqahManagementService.updateSantri(santriId, {
          ...selectedSantri,
          id_halaqah: targetHalaqahId,
        });
        toast.success("Santri berhasil dipindahkan");
        setIsMoveSantriOpen(false);
        fetchData();
      } catch (error) {
        console.error("Error moving santri:", error);
        toast.error("Gagal memindahkan santri");
        throw error; // Re-throw for internal component handling
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedSantri, fetchData],
  );

  return {
    // State
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

    // Setters
    setSelectedHalaqah,
    setSelectedSantri,
    setIsEditHalaqahOpen,
    setIsDeleteHalaqahOpen,
    setIsSantriModalOpen,
    setIsDeleteSantriOpen,
    setIsMoveSantriOpen,

    // Handlers
    fetchData,
    handleOpenAddSantri,
    handleOpenEditSantri,
    handleSaveSantri,
    handleDeleteSantriConfirm,
    handleMoveSantriConfirm,
    handleHalaqahSuccess,
  };
}
