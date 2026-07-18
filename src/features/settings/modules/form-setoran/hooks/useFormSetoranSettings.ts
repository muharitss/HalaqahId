import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sekolahService } from "@/features/sekolah";
import { toast } from "sonner";
import type { CustomField } from "../types/form-setoran.types";

export type { CustomField };

export function useFormSetoranSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [fields, setFields] = useState<CustomField[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states for new field
  const [newFieldId, setNewFieldId] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "number" | "select" | "boolean">("text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptionsString, setNewFieldOptionsString] = useState("");

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["schoolProfile"],
    queryFn: () => sekolahService.getProfile(),
  });

  useEffect(() => {
    if (profileData?.data?.form_setoran_config) {
      setFields(profileData.data.form_setoran_config as CustomField[]);
    } else {
      setFields([]);
    }
  }, [profileData]);

  const saveMutation = useMutation({
    mutationFn: (newConfig: CustomField[]) =>
      sekolahService.updateProfile({ form_setoran_config: newConfig }),
    onSuccess: () => {
      toast.success("Pengaturan form setoran berhasil disimpan!");
      queryClient.invalidateQueries({ queryKey: ["schoolProfile"] });
      queryClient.invalidateQueries({ queryKey: ["profil-sekolah"] });
    },
    onError: (err: any) => {
      toast.error(`Gagal menyimpan pengaturan: ${err.message || "Terjadi kesalahan"}`);
    },
  });

  const handleAddField = () => {
    // Validasi ID
    const formattedId = newFieldId.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!formattedId) {
      toast.error("ID Field tidak boleh kosong");
      return;
    }
    if (fields.some((f) => f.id === formattedId)) {
      toast.error(`ID Field "${formattedId}" sudah digunakan`);
      return;
    }
    if (!newFieldLabel.trim()) {
      toast.error("Label Field tidak boleh kosong");
      return;
    }

    const fieldToAdd: CustomField = {
      id: formattedId,
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
    };

    if (newFieldType === "select") {
      const options = newFieldOptionsString
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt !== "");
      if (options.length === 0) {
        toast.error("Pilihan opsi dropdown wajib diisi (pisahkan dengan koma)");
        return;
      }
      fieldToAdd.options = options;
    }

    setFields([...fields, fieldToAdd]);
    setIsAddOpen(false);

    // Reset Form
    setNewFieldId("");
    setNewFieldLabel("");
    setNewFieldType("text");
    setNewFieldRequired(false);
    setNewFieldOptionsString("");

    toast.success("Field berhasil ditambahkan ke daftar sementara");
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    toast.success("Field dihapus dari daftar sementara");
  };

  const handleSaveConfig = () => {
    saveMutation.mutate(fields);
  };

  return {
    navigate,
    fields,
    isAddOpen,
    setIsAddOpen,
    newFieldId,
    setNewFieldId,
    newFieldLabel,
    setNewFieldLabel,
    newFieldType,
    setNewFieldType,
    newFieldRequired,
    setNewFieldRequired,
    newFieldOptionsString,
    setNewFieldOptionsString,
    isLoading,
    isSaving: saveMutation.isPending,
    handleAddField,
    handleRemoveField,
    handleSaveConfig,
  };
}
