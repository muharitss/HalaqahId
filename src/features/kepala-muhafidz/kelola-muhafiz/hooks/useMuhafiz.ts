import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { muhafizService } from "../services/muhafizService";
import { type Muhafiz } from "../types";
import { toast } from "sonner";

export const useMuhafiz = () => {
  const { user, impersonate } = useAuth();
  const [muhafizList, setMuhafizList] = useState<Muhafiz[]>([]);
  const [activeMuhafizIds, setActiveMuhafizIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [editingMuhafiz, setEditingMuhafiz] = useState<Muhafiz | null>(null);
  const [deletingMuhafiz, setDeletingMuhafiz] = useState<Muhafiz | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadMuhafiz = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await muhafizService.getAllMuhafiz();
      setMuhafizList(data);
      
      // Load active status
      const activeIds = await muhafizService.getActiveMuhafizIds();
      setActiveMuhafizIds(activeIds);
    } catch {
      toast.error("Gagal memuat data muhafiz");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMuhafiz();
  }, [loadMuhafiz]);

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
      loading: `Menyiapkan sesi untuk ${muhafiz.username}...`,
      success: `Berhasil login sebagai ${muhafiz.username}`,
      error: "Gagal login sebagai muhafidz",
    });
  };

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

  return {
    // State
    muhafizList,
    activeMuhafizIds,
    isLoading,
    editingMuhafiz,
    deletingMuhafiz,
    isEditOpen,
    isDeleteOpen,
    
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
  };
};