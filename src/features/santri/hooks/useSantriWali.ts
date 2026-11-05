import { useState } from "react";
import { toast } from "sonner";
import {
  useSantriWaliList,
  useCreateSantriWali,
  useUpdateSantriWali,
  useDeleteSantriWali,
} from "../api";
import { santriWaliSchema, type SantriWaliFormData } from "../validation/santri-wali.schema";
import type { SantriWali } from "@/types/domain/santri-wali";
import { getErrorMessage } from "@/utils/error";

export function useSantriWali(santriId?: number) {
  // Query
  const { data: waliList = [], isLoading, error, refetch } = useSantriWaliList(santriId);

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWali, setEditingWali] = useState<SantriWali | null>(null);

  // Delete confirm state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingWali, setDeletingWali] = useState<SantriWali | null>(null);

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mutations
  const createMutation = useCreateSantriWali(santriId ?? 0, () => {
    toast.success("Wali santri berhasil ditambahkan");
    closeFormDialog();
  });

  const updateMutation = useUpdateSantriWali(santriId ?? 0, () => {
    toast.success("Data wali santri berhasil diperbarui");
    closeFormDialog();
  });

  const deleteMutation = useDeleteSantriWali(santriId ?? 0, () => {
    toast.success("Wali santri berhasil dihapus");
    closeDeleteDialog();
  });

  const openCreateDialog = () => {
    setEditingWali(null);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditDialog = (wali: SantriWali) => {
    setEditingWali(wali);
    setFormErrors({});
    setIsFormOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormOpen(false);
    setEditingWali(null);
    setFormErrors({});
  };

  const openDeleteDialog = (wali: SantriWali) => {
    setDeletingWali(wali);
    setIsDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteOpen(false);
    setDeletingWali(null);
  };

  const handleSave = async (formData: SantriWaliFormData): Promise<boolean> => {
    if (!santriId) {
      toast.error("ID santri tidak valid");
      return false;
    }

    const parseResult = santriWaliSchema.safeParse(formData);
    if (!parseResult.success) {
      const errors: Record<string, string> = {};
      parseResult.error.issues.forEach((err) => {
        const field = String(err.path[0]);
        errors[field] = err.message;
      });
      setFormErrors(errors);
      return false;
    }

    setFormErrors({});

    try {
      if (editingWali) {
        await updateMutation.mutateAsync({
          waliId: editingWali.id_wali,
          data: parseResult.data,
        });
      } else {
        await createMutation.mutateAsync(parseResult.data);
      }
      return true;
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menyimpan data wali"));
      return false;
    }
  };

  const handleDelete = async () => {
    if (!deletingWali || !santriId) return;
    try {
      await deleteMutation.mutateAsync(deletingWali.id_wali);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menghapus wali santri"));
    }
  };

  const handleSetPrimary = async (wali: SantriWali) => {
    if (!santriId) return;
    if (wali.is_primary_contact) return;
    try {
      await updateMutation.mutateAsync({
        waliId: wali.id_wali,
        data: { is_primary_contact: true },
      });
      toast.success(`${wali.nama_wali} diset sebagai kontak utama`);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal mengubah kontak utama"));
    }
  };

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return {
    waliList,
    isLoading,
    isSubmitting,
    error: error ? error.message : null,
    refetch,
    // Form Dialog
    isFormOpen,
    editingWali,
    formErrors,
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleSave,
    // Delete Dialog
    isDeleteOpen,
    deletingWali,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    // Primary contact
    handleSetPrimary,
  };
}
