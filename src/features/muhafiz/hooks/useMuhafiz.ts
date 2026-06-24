import { useState, useEffect } from "react";
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

  // Set default sesi when sesiList loads
  useEffect(() => {
    if (initData?.sesiList && initData.sesiList.length > 0 && !selectedSesi) {
      setSelectedSesi(initData.sesiList[0].id_sesi);
    }
  }, [initData?.sesiList, selectedSesi]);

  // Daily Absensi
  const { data: submittedAttendance = {} } = useQuery({
    queryKey: ["absensi-muhafiz", selectedDate, selectedSesi],
    queryFn: async () => {
      try {
        const res = await muhafizService.getDailyAsatidz(selectedDate);
        if (res.data && Array.isArray(res.data)) {
          const mappedData = res.data.reduce((acc: Record<number, AbsensiStatus>, item: any) => {
            if (selectedSesi && item.id_sesi && item.id_sesi !== selectedSesi) return acc;
            const userId = item.id_user || item.id_user; 
            const status = item.status;
            if (userId && status) acc[Number(userId)] = status as AbsensiStatus;
            return acc;
          }, {});
          return mappedData;
        }
        return {};
      } catch {
        return {};
      }
    },
    enabled: !!selectedDate && !!selectedSesi,
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
          id_sesi: selectedSesi || undefined,
          status: attendanceMap[userId], 
          tanggal: selectedDate,
          keterangan: ""
        })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast.success("Absensi berhasil disimpan/diperbarui");
      setAttendanceMap({});
      queryClient.invalidateQueries({ queryKey: ["absensi-muhafiz"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Gagal menyimpan absensi");
    }
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
    mutationFn: async ({ userId, status, today }: { userId: number, status: AbsensiStatus, today: string }) => {
      await muhafizService.catatAbsensiAsatidz({
        id_user: userId,
        id_sesi: selectedSesi || undefined,
        status: status,
        tanggal: today,
        keterangan: ""
      });
      return { status, today };
    },
    onSuccess: ({ status, today }) => {
      toast.success(`Berhasil mencatat absensi: ${status}`);
      if (selectedDate === today) {
        queryClient.invalidateQueries({ queryKey: ["absensi-muhafiz", today, selectedSesi] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal mencatat absensi");
    }
  });

  const handleAbsenMuhafiz = async (userId: number, status: AbsensiStatus) => {
    const today = new Date().toISOString().split('T')[0];
    absenSingleMutation.mutate({ userId, status, today });
  };

  // Reset local draft when selectedDate/selectedSesi changes
  useEffect(() => {
    setAttendanceMap({});
  }, [selectedDate, selectedSesi]);

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
    selectedSesi,
    setSelectedSesi,
    sesiList: initData?.sesiList || [],
    handleStatusChange,
    handleSaveAllAbsensi,
    handleAbsenMuhafiz
  };
};
