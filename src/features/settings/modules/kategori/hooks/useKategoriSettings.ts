import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sekolahService } from "@/features/sekolah";
import { toast } from "sonner";
import type { KategoriSetoran } from "../types/kategori.types";

export type { KategoriSetoran };

export function useKategoriSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedKategori, setSelectedKategori] = useState<KategoriSetoran | null>(null);

  // Form State
  const [namaKategori, setNamaKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [perluValidasiUrutan, setPerluValidasiUrutan] = useState(false);

  // Fetch Kategori Data
  const { data: kategoriList = [], isLoading, error } = useQuery<KategoriSetoran[]>({
    queryKey: ["kategori-setoran"],
    queryFn: async () => {
      const res = await sekolahService.getKategori();
      return (res.data || []) as KategoriSetoran[];
    }
  });

  // Mutation: Create
  const createMutation = useMutation({
    mutationFn: (data: { nama_kategori: string; deskripsi?: string; perlu_validasi_urutan?: boolean }) =>
      sekolahService.createKategori(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori-setoran"] });
      toast.success("Kategori setoran berhasil ditambahkan!");
      resetForm();
      setIsCreateOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menambahkan kategori");
    }
  });

  // Mutation: Update
  const updateMutation = useMutation({
    mutationFn: (args: { id: number; data: { nama_kategori?: string; deskripsi?: string | null; perlu_validasi_urutan?: boolean } }) =>
      sekolahService.updateKategori(args.id, args.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori-setoran"] });
      toast.success("Kategori setoran berhasil diperbarui!");
      resetForm();
      setIsEditOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal memperbarui kategori");
    }
  });

  // Mutation: Delete
  const deleteMutation = useMutation({
    mutationFn: (id: number) => sekolahService.deleteKategori(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori-setoran"] });
      toast.success("Kategori setoran berhasil dihapus!");
      setIsDeleteOpen(false);
      setSelectedKategori(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menghapus kategori");
    }
  });

  const resetForm = () => {
    setNamaKategori("");
    setDeskripsi("");
    setPerluValidasiUrutan(false);
    setSelectedKategori(null);
  };

  const handleOpenEdit = (kat: KategoriSetoran) => {
    setSelectedKategori(kat);
    setNamaKategori(kat.nama_kategori);
    setDeskripsi(kat.deskripsi || "");
    setPerluValidasiUrutan(!!kat.perlu_validasi_urutan);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (kat: KategoriSetoran) => {
    setSelectedKategori(kat);
    setIsDeleteOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKategori.trim()) {
      toast.warning("Nama kategori tidak boleh kosong");
      return;
    }
    createMutation.mutate({
      nama_kategori: namaKategori,
      deskripsi: deskripsi || undefined,
      perlu_validasi_urutan: perluValidasiUrutan
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKategori) return;
    if (!namaKategori.trim()) {
      toast.warning("Nama kategori tidak boleh kosong");
      return;
    }
    updateMutation.mutate({
      id: selectedKategori.id_kategori,
      data: {
        nama_kategori: namaKategori,
        deskripsi: deskripsi || null,
        perlu_validasi_urutan: perluValidasiUrutan
      }
    });
  };

  const handleDelete = () => {
    if (selectedKategori) {
      deleteMutation.mutate(selectedKategori.id_kategori);
    }
  };

  return {
    navigate,
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedKategori,
    namaKategori,
    setNamaKategori,
    deskripsi,
    setDeskripsi,
    perluValidasiUrutan,
    setPerluValidasiUrutan,
    kategoriList,
    isLoading,
    error,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    resetForm,
    handleOpenEdit,
    handleOpenDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
