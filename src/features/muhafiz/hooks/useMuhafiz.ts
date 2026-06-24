import { useState } from "react";
import { useAuth } from "@/features/auth/components/auth-provider";
import { muhafizService } from "../api/muhafizService";
import { type Muhafiz, type AbsensiStatus } from "../types";
import { sesiService } from "@/features/halaqah/api/sesiService";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const { data: initData, isFetching: isLoadingInit, refetch: loadMuhafiz } = useQuery({
    queryKey: ["muhafiz-init"],
    queryFn: async () => {
      try {
        const [muhafizRes, activeIds, sesiRes] = await Promise.all([
          muhafizService.getAllMuhafiz(),
          muhafizService.getActiveMuhafizIds(),
          sesiService.getSesiHalaqah()
        ]);
        const sesiData = sesiRes.data || [];
        return {
          muhafizList: muhafizRes,
          activeMuhafizIds: activeIds,
          sesiList: sesiData,
        };
      } catch (err) {
        toast.error("Gagal memuat data muhafiz");
        throw err;
      }
    }
  });

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
  // Digunakan agar badge "Tercatat" dan status dropdown tampil sesuai data DB.
  const { data: submittedAttendance = {} } = useQuery<Record<number, AbsensiStatus>>({
    queryKey: ["absensi-muhafiz", selectedDate, activeSesiId],
    queryFn: async (): Promise<Record<number, AbsensiStatus>> => {
      try {
        const res = await muhafizService.getDailyAsatidz(
          selectedDate,
          activeSesiId ?? undefined,
        );
        if (!res.success || !Array.isArray(res.data)) return {};

        return res.data.reduce<Record<number, AbsensiStatus>>((acc, item) => {
          if (item.id_user && item.status) {
            acc[item.id_user] = item.status as AbsensiStatus;
          }
          return acc;
        }, {});
      } catch {
        return {};
      }
    },
    enabled: !!selectedDate,
  });


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

  const saveAbsensiMutation = useMutation({
    mutationFn: async (selectedIds: number[]) => {
      const promises = selectedIds.map((userId) =>
        muhafizService.catatAbsensiAsatidz({
          id_user: userId,
          id_sesi: activeSesiId ?? undefined,
          status: attendanceMap[userId],
          tanggal: selectedDate,
          keterangan: "",
        }),
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast.success("Absensi berhasil disimpan/diperbarui");
      setAttendanceMap({});
      // Invalidasi query spesifik agar badge 'Tercatat' langsung terupdate
      queryClient.invalidateQueries({
        queryKey: ["absensi-muhafiz", selectedDate, activeSesiId],
      });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan absensi");
    },
  });

  const handleSaveAllAbsensi = async () => {
    const selectedIds = Object.keys(attendanceMap).map(Number);
    if (selectedIds.length === 0) {
      toast.error("Pilih atau ubah status absensi terlebih dahulu");
      return;
    }
    await saveAbsensiMutation.mutateAsync(selectedIds);
  };

  const absenSingleMutation = useMutation({
    mutationFn: async ({
      userId,
      status,
      today,
    }: {
      userId: number;
      status: AbsensiStatus;
      today: string;
    }) => {
      await muhafizService.catatAbsensiAsatidz({
        id_user: userId,
        id_sesi: activeSesiId ?? undefined,
        status: status,
        tanggal: today,
        keterangan: "",
      });
      return { status, today };
    },
    onSuccess: ({ status, today }) => {
      toast.success(`Berhasil mencatat absensi: ${status}`);
      queryClient.invalidateQueries({
        queryKey: ["absensi-muhafiz", today, activeSesiId],
      });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Gagal mencatat absensi");
    },
  });

  const handleAbsenMuhafiz = async (userId: number, status: AbsensiStatus) => {
    const today = new Date().toISOString().split('T')[0];
    absenSingleMutation.mutate({ userId, status, today });
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
