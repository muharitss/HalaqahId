import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { halaqahManagementService } from "../services/halaqahManagementService";
import { type Halaqah } from "../types";
import { type Santri } from "@/features/muhafidz/kelola-santri/types";
import { getErrorMessage } from "@/utils/error";

export const useHalaqahManagement = () => {
  // State Halaqah
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);
  const [isLoadingHalaqah, setIsLoadingHalaqah] = useState(true);
  const [selectedHalaqah, setSelectedHalaqah] = useState<Halaqah | null>(null);
  const [isEditHalaqahOpen, setIsEditHalaqahOpen] = useState(false);
  const [isDeleteHalaqahOpen, setIsDeleteHalaqahOpen] = useState(false);

  // State Santri
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [isSantriModalOpen, setIsSantriModalOpen] = useState(false);
  const [isDeleteSantriOpen, setIsDeleteSantriOpen] = useState(false);
  const [isMoveSantriOpen, setIsMoveSantriOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Data
  const fetchData = useCallback(async () => {
    setIsLoadingHalaqah(true);
    try {
      const halaqahData = await halaqahManagementService.getAllHalaqah();
      setHalaqahs(halaqahData);
      
      const santriData = await halaqahManagementService.getAllSantri();
      setSantriList(santriData);
    } catch {
      toast.error("Gagal mengambil data halaqah");
    } finally {
      setIsLoadingHalaqah(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimasi: Map santri ke ID Halaqah untuk performa render
  const santriMap = useMemo(() => {
    return santriList.reduce((acc, s) => {
      const key = s.halaqah_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {} as Record<number, Santri[]>);
  }, [santriList]);

  // --- HANDLER ACTIONS ---

  const handleOpenAddSantri = (h: Halaqah) => {
    setSelectedHalaqah(h);
    setSelectedSantri(null);
    setIsSantriModalOpen(true);
  };

  const handleOpenEditSantri = (s: Santri) => {
    setSelectedSantri(s);
    setIsSantriModalOpen(true);
  };

  const handleSaveSantri = async (payload: any) => {
    const santriPayload = {
      nama_santri: payload.nama_santri as string,
      nomor_telepon: payload.nomor_telepon as string,
      target: payload.target as "RINGAN" | "SEDANG" | "INTENSE",
      halaqah_id: payload.halaqah_id
    };

    setIsSubmitting(true);
    try {
      if (selectedSantri) {
        await halaqahManagementService.updateSantri(selectedSantri.id_santri, santriPayload);
        toast.success("Profil santri diperbarui");
      } else {
        await halaqahManagementService.createSantri(santriPayload);
        toast.success("Santri baru berhasil ditambahkan");
      }
      setIsSantriModalOpen(false);
      fetchData();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menyimpan data santri"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSantriConfirm = async () => {
    if (!selectedSantri) return;
    try {
      await halaqahManagementService.deleteSantri(selectedSantri.id_santri);
      toast.success("Santri berhasil dihapus");
      fetchData();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menghapus santri"));
    } finally {
      setIsDeleteSantriOpen(false);
    }
  };

  const handleMoveSantriConfirm = async (santriId: number, targetHalaqahId: number) => {
    try {
      await halaqahManagementService.updateSantri(santriId, { halaqah_id: targetHalaqahId });
      toast.success("Santri berhasil dipindahkan");
      fetchData();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal memindahkan santri"));
      throw err;
    }
  };

  const handleHalaqahSuccess = () => {
    fetchData();
  };

  return {
    // State
    halaqahs,
    santriList,
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

    // Actions
    fetchData,
    handleOpenAddSantri,
    handleOpenEditSantri,
    handleSaveSantri,
    handleDeleteSantriConfirm,
    handleMoveSantriConfirm,
    handleHalaqahSuccess,
  };
};