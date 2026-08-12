import { useState } from "react";
import { useAuth } from "@/features/auth/components/auth-provider";
import { muhafizService, useMuhafizInit, useAbsensiMuhafizDaily, useBulkCatatAbsensiAsatidz, useCatatAbsensiAsatidz } from "../../../api";
import { type Muhafiz, type AbsensiStatus } from "@/features/muhafiz/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useMuhafiz = () => {
  const { user, impersonate } = useAuth();
  const queryClient = useQueryClient();
  
  // Modal States
  const [editingMuhafiz, setEditingMuhafiz] = useState<Muhafiz | null>(null);
  const [deletingMuhafiz, setDeletingMuhafiz] = useState<Muhafiz | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Absensi States
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSesi, setSelectedSesi] = useState<number | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AbsensiStatus>>({});

  // Fetch Muhafiz List & Active IDs & Sesi
  const { data: initData, isLoading: isLoadingInit, refetch: loadMuhafiz } = useMuhafizInit(user?.id_user);

  // Derive current active sesi ID from loaded list if not explicitly selected
  const activeSesiId = selectedSesi ?? initData?.sesiList?.[0]?.id_sesi ?? null;

  // Track prev date/sesi to clear attendance map during render if date/sesi changes
  const [prevDate, setPrevDate] = useState(selectedDate);
  const [prevSesi, setPrevSesi] = useState<number | null>(activeSesiId);

  if (selectedDate !== prevDate || activeSesiId !== prevSesi) {
    setPrevDate(selectedDate);
    setPrevSesi(activeSesiId);
    setAttendanceMap({});
  }

  // Sinkronisasi status absensi yang sudah tersimpan dari database untuk tanggal & sesi terpilih.
  const { data: submittedAttendance = {} } = useAbsensiMuhafizDaily(selectedDate, activeSesiId);

  // Modals Actions
  const openEditModal = (muhafiz: Muhafiz) => { setEditingMuhafiz(muhafiz); setIsEditOpen(true); };
  const openDeleteModal = (muhafiz: Muhafiz) => { setDeletingMuhafiz(muhafiz); setIsDeleteOpen(true); };
  const closeEditModal = () => { setIsEditOpen(false); setEditingMuhafiz(null); };
  const closeDeleteModal = () => { setIsDeleteOpen(false); setDeletingMuhafiz(null); };

  const handleCreateSuccess = () => { toast.success("Akun muhafidz berhasil dibuat"); queryClient.invalidateQueries({ queryKey: ["muhafiz-init"] }); };
  const handleEditSuccess = () => { toast.success("Data muhafidz berhasil diperbarui"); queryClient.invalidateQueries({ queryKey: ["muhafiz-init"] }); };
  const handleDeleteSuccess = () => { toast.success("Muhafidz berhasil dihapus"); queryClient.invalidateQueries({ queryKey: ["muhafiz-init"] }); };

  // Impersonate
  const handleImpersonate = async (muhafiz: Muhafiz) => {
    const promise = async () => {
      const response = await muhafizService.impersonateMuhafiz(muhafiz.id_user);
      if (response.success && response.data && user) {
        const impersonatedUser = {
          ...response.data.user,
          token: response.data.token,
          isImpersonating: true
        };
        await impersonate(impersonatedUser, user);
        return response;
      }
      throw new Error("Gagal login");
    };

    toast.promise(promise(), {
      loading: `Menyiapkan sesi untuk ${muhafiz.name}...`,
      success: `Berhasil login sebagai ${muhafiz.name}`,
      error: "Gagal login sebagai muhafidz",
    });
  };

  const handleStatusChange = (userId: number, status: AbsensiStatus) => {
    setAttendanceMap(prev => {
      if (prev[userId] === status) {
        const newMap = { ...prev };
        delete newMap[userId];
        return newMap;
      }
      return { ...prev, [userId]: status };
    });
  };

  const saveAbsensiMutation = useBulkCatatAbsensiAsatidz(
    () => {
      toast.success("Absensi berhasil disimpan/diperbarui");
      setAttendanceMap({});
      queryClient.invalidateQueries({
        queryKey: ["absensi-muhafiz", selectedDate, activeSesiId],
      });
    },
    (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan absensi");
    }
  );

  const handleSaveAllAbsensi = async () => {
    const selectedIds = Object.keys(attendanceMap).map(Number);
    if (selectedIds.length === 0) {
      toast.error("Pilih atau ubah status absensi terlebih dahulu");
      return;
    }
    const payloads = selectedIds.map((userId) => ({
      id_user: userId,
      id_sesi: activeSesiId ?? undefined,
      status: attendanceMap[userId],
      tanggal: selectedDate,
      keterangan: "",
    }));
    await saveAbsensiMutation.mutateAsync(payloads);
  };

  const absenSingleMutation = useCatatAbsensiAsatidz(
    (_data: any, variables: any) => {
      toast.success(`Berhasil mencatat absensi: ${variables.status}`);
      queryClient.invalidateQueries({
        queryKey: ["absensi-muhafiz", variables.tanggal, activeSesiId],
      });
    },
    (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Gagal mencatat absensi");
    }
  );

  const handleAbsenMuhafiz = async (userId: number, status: AbsensiStatus) => {
    const today = new Date().toISOString().split('T')[0];
    absenSingleMutation.mutate({
      id_user: userId,
      id_sesi: activeSesiId ?? undefined,
      status: status,
      tanggal: today,
      keterangan: "",
    });
  };

  const isSubmitting = saveAbsensiMutation.isPending || absenSingleMutation.isPending;

  return {
    muhafizList: initData?.muhafizList || [],
    activeMuhafizIds: initData?.activeMuhafizIds || new Set(),
    isLoading: isLoadingInit,
    editingMuhafiz,
    deletingMuhafiz,
    isEditOpen,
    isDeleteOpen,
    
    selectedDate,
    attendanceMap,
    isSubmitting,
    submittedAttendance,
    
    loadMuhafiz,
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    handleImpersonate,
    openEditModal,
    openDeleteModal,
    closeEditModal,
    closeDeleteModal,
    
    setSelectedDate,
    selectedSesi: activeSesiId,
    setSelectedSesi,
    sesiList: initData?.sesiList || [],
    handleStatusChange,
    handleSaveAllAbsensi,
    handleAbsenMuhafiz
  };
};
