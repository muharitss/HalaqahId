import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { sekolahService, type KategoriSetoranResponse } from "@/features/sekolah";
import {
  useTargetList,
  useCreateTarget,
  useUpdateTarget,
  useDeleteTarget,
} from "./useTarget";
import { targetSchema, type TargetFormValues } from "../validation/target.schema";
import { parseHariAktif } from "@/types/domain/target";
import type { TargetSekolah } from "@/types/domain/target";

export function useTargetSettings() {
  const navigate = useNavigate();
  const { data: targets = [], isLoading } = useTargetList();
  const createMutation = useCreateTarget();
  const updateMutation = useUpdateTarget();
  const deleteMutation = useDeleteTarget();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetSekolah | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<TargetSekolah | null>(null);

  // Fetch Kategori Data
  const { data: kategoriList = [], isLoading: isLoadingKategori } = useQuery<KategoriSetoranResponse[]>({
    queryKey: ["kategori-setoran"],
    queryFn: async () => {
      const res = await sekolahService.getKategori();
      return (res.data || []) as KategoriSetoranResponse[];
    }
  });

  const form = useForm<TargetFormValues>({
    resolver: zodResolver(targetSchema) as Resolver<TargetFormValues>,
    defaultValues: {
      nama_target: "",
      id_kategori: undefined,
      tipe: "HARIAN",
      nilai_target: 1,
      satuan: "HALAMAN",
      deskripsi: "",
      hari_aktif: [1, 2, 3, 4, 5], // default: Senin–Jumat
      start_juz: null as any,
      end_juz: null as any,
      daftar_surat: "",
      arah: "BEBAS",
    },
  });

  // Watch tipe agar section HariAktifPicker bisa show/hide secara reaktif
  const watchedTipe = useWatch({ control: form.control, name: "tipe" });
  const isHarian = watchedTipe === "HARIAN";

  const openCreate = () => {
    setEditingTarget(null);
    form.reset({
      nama_target: "",
      id_kategori: undefined,
      tipe: "HARIAN",
      nilai_target: 1,
      satuan: "HALAMAN",
      deskripsi: "",
      hari_aktif: [1, 2, 3, 4, 5],
      start_juz: null as any,
      end_juz: null as any,
      daftar_surat: "",
      arah: "BEBAS",
    });
    setIsFormOpen(true);
  };

  const openEdit = (target: TargetSekolah) => {
    setEditingTarget(target);
    const hariParsed = parseHariAktif(target.hari_aktif);
    form.reset({
      nama_target: target.nama_target,
      id_kategori: target.id_kategori ?? undefined,
      tipe: target.tipe,
      nilai_target: target.nilai_target,
      satuan: target.satuan,
      deskripsi: target.deskripsi ?? "",
      // Jika tidak ada hari_aktif (target lama), default ke Senin-Jumat agar user tahu
      hari_aktif: hariParsed ?? [1, 2, 3, 4, 5],
      start_juz: target.start_juz ?? (null as any),
      end_juz: target.end_juz ?? (null as any),
      daftar_surat: target.daftar_surat ?? "",
      arah: target.arah ?? "BEBAS",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (values: TargetFormValues) => {
    const payload = {
      ...values,
      deskripsi: values.deskripsi || null,
      // Hanya kirim hari_aktif jika tipe HARIAN
      hari_aktif: values.tipe === "HARIAN" ? (values.hari_aktif ?? null) : null,
      start_juz: values.start_juz ? Number(values.start_juz) : null,
      end_juz: values.end_juz ? Number(values.end_juz) : null,
      daftar_surat: values.daftar_surat?.trim() || null,
      arah: values.arah || "BEBAS",
    };

    if (editingTarget) {
      await updateMutation.mutateAsync({ id: editingTarget.id_target, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setIsFormOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingTarget) return;
    await deleteMutation.mutateAsync(deletingTarget.id_target);
    setDeletingTarget(null);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return {
    navigate,
    targets,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingTarget,
    setEditingTarget,
    deletingTarget,
    setDeletingTarget,
    kategoriList,
    isLoadingKategori,
    form,
    isHarian,
    openCreate,
    openEdit,
    handleSubmit,
    handleDelete,
    isPending,
    isDeleting: deleteMutation.isPending,
  };
}
