import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { muhafizService } from "../services/muhafizService";
import { type Muhafiz, type AbsensiStatus } from "../types";
import { toast } from "sonner";

export const useMuhafiz = () => {
  const { user, impersonate } = useAuth();
  
  // --- States ---
  const [muhafizList, setMuhafizList] = useState<Muhafiz[]>([]);
  const [activeMuhafizIds, setActiveMuhafizIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [editingMuhafiz, setEditingMuhafiz] = useState<Muhafiz | null>(null);
  const [deletingMuhafiz, setDeletingMuhafiz] = useState<Muhafiz | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Absensi States
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  // Perbaikan tipe Record agar spesifik menggunakan AbsensiStatus
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AbsensiStatus>>({});
  const [submittedAttendance, setSubmittedAttendance] = useState<Record<number, AbsensiStatus>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handlers ---

  const loadMuhafiz = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await muhafizService.getAllMuhafiz();
      setMuhafizList(data);
      
      const activeIds = await muhafizService.getActiveMuhafizIds();
      setActiveMuhafizIds(activeIds);
    } catch {
      toast.error("Gagal memuat data muhafiz");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkExistingAbsensi = useCallback(async (date: string) => {
    try {
      const res = await muhafizService.getDailyAsatidz(date);
      
      // Log ini untuk memastikan data status ada di console browser
      console.log("Response Absensi Harian:", res.data);

      if (res.data && Array.isArray(res.data)) {
        const mappedData = res.data.reduce((acc: Record<number, AbsensiStatus>, item: any) => {
          // Cek apakah backend kirim id_user atau id_user
          const userId = item.id_user || item.id_user; 
          const status = item.status;

          if (userId && status) {
            acc[Number(userId)] = status as AbsensiStatus;
          }
          return acc;
        }, {});
        
        setSubmittedAttendance(mappedData);
      } else {
        setSubmittedAttendance({});
      }
    } catch (err) {
      setSubmittedAttendance({});
    }
  }, []);

  useEffect(() => {
    loadMuhafiz();
  }, [loadMuhafiz]);

  // Efek saat tanggal berubah
  useEffect(() => {
    if (selectedDate) {
      checkExistingAbsensi(selectedDate);
      setAttendanceMap({}); // Reset draft pilihan setiap ganti tanggal
    }
  }, [selectedDate, checkExistingAbsensi]);

  // Modal Actions
  const openEditModal = (muhafiz: Muhafiz) => {
    setEditingMuhafiz(muhafiz);
    setIsEditOpen(true);
  };

  const openDeleteModal = (muhafiz: Muhafiz) => {
    setDeletingMuhafiz(muhafiz);
    setIsDeleteOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingMuhafiz(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setDeletingMuhafiz(null);
  };

  // CRUD Callbacks
  const handleCreateSuccess = () => {
    toast.success("Akun muhafidz berhasil dibuat");
    loadMuhafiz();
  };

  const handleEditSuccess = () => {
    toast.success("Data muhafidz berhasil diperbarui");
    loadMuhafiz();
  };

  const handleDeleteSuccess = () => {
    toast.success("Muhafidz berhasil dihapus");
    loadMuhafiz();
  };

  // Impersonate
  const handleImpersonate = async (muhafiz: Muhafiz) => {
    const promise = async () => {
      const response = await muhafizService.impersonateMuhafiz(muhafiz.id_user);
      if (response.success && user) {
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

  // --- Absensi Handlers ---

  const handleStatusChange = (userId: number, status: AbsensiStatus) => {
    setAttendanceMap(prev => {
      // Jika status yang dipilih sama dengan yang sudah ada, hapus dari map (toggle off)
      if (prev[userId] === status) {
        const newMap = { ...prev };
        delete newMap[userId];
        return newMap;
      }
      return { ...prev, [userId]: status };
    });
  };

  const handleSaveAllAbsensi = async () => {
    const selectedIds = Object.keys(attendanceMap).map(Number);
    if (selectedIds.length === 0) {
      toast.error("Pilih atau ubah status absensi terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    try {
      const promises = selectedIds.map((userId) => 
        muhafizService.catatAbsensiAsatidz({ 
          id_user: userId, 
          status: attendanceMap[userId], 
          tanggal: selectedDate,
          keterangan: ""
        })
      );
      await Promise.all(promises);
      toast.success("Absensi berhasil disimpan/diperbarui");
      setAttendanceMap({}); // Kosongkan draft setelah simpan
      await checkExistingAbsensi(selectedDate); // Ambil data terbaru
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan absensi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbsenMuhafiz = async (userId: number, status: AbsensiStatus) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await muhafizService.catatAbsensiAsatidz({
        id_user: userId,
        status: status,
        tanggal: today,
        keterangan: ""
      });
      toast.success(`Berhasil mencatat absensi: ${status}`);
      // Refresh list kunci jika admin sedang melihat halaman di tanggal hari ini
      if (selectedDate === today) checkExistingAbsensi(today);
    } catch (error: any) {
      toast.error(error.message || "Gagal mencatat absensi");
    }
  };

  return {
    // States
    muhafizList,
    activeMuhafizIds,
    isLoading,
    editingMuhafiz,
    deletingMuhafiz,
    isEditOpen,
    isDeleteOpen,
    
    // Absensi States
    selectedDate,
    attendanceMap,
    isSubmitting,
    submittedAttendance,
    
    // Actions
    loadMuhafiz,
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    handleImpersonate,
    openEditModal,
    openDeleteModal,
    closeEditModal,
    closeDeleteModal,
    
    // Absensi Actions
    setSelectedDate,
    handleStatusChange,
    handleSaveAllAbsensi,
    handleAbsenMuhafiz
  };
};