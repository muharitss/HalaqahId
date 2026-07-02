import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSantri } from "../hooks/useSantri";
import { SantriTable } from "../components/SantriTable";
import { SantriModal } from "../components/SantriModal";
import type { Santri, CreateSantriData, UpdateSantriData } from "../types";
import { useAuth } from "@/features/auth/components/auth-provider";
import { Role } from "@/types/domain/enums";

import { KelolaSantri } from "@/components/custom/typed-text";

export function KelolaSantriPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === Role.SUPERADMIN || user?.role === Role.ADMIN || user?.role === Role.KOORDINATOR_TAHFIZ;
  
  const { santriList, isLoading, createSantri, updateSantri, deleteSantri, loadSantri } = useSantri();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

  useEffect(() => {
    loadSantri();
  }, [loadSantri]);

  const filteredSantri = santriList.filter((s) =>
    s.nama_santri.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (santri: Santri) => {
    setSelectedSantri(santri);
    setIsModalOpen(true);
  };

  const handleDelete = async (santri: Santri) => {
    if (confirm(`Yakin ingin menghapus santri ${santri.nama_santri}?`)) {
      await deleteSantri(santri.id_santri);
    }
  };

  const handleSave = async (data: {
    nama_santri: string | FormDataEntryValue | null;
    nomor_telepon: string | FormDataEntryValue | null;
    target: string;
    id_halaqah: number | undefined;
  }) => {
    const payload = {
      nama_santri: typeof data.nama_santri === "string" ? data.nama_santri : (data.nama_santri?.toString() || ""),
      nomor_telepon: typeof data.nomor_telepon === "string" ? data.nomor_telepon : (data.nomor_telepon?.toString() || ""),
      target: data.target as "RINGAN" | "SEDANG" | "INTENSE",
      id_halaqah: data.id_halaqah || 0,
    };
    if (selectedSantri) {
      await updateSantri(selectedSantri.id_santri, payload as UpdateSantriData);
    } else {
      await createSantri(payload as CreateSantriData);
    }
    setIsModalOpen(false);
    setSelectedSantri(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSantri(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <KelolaSantri />
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Cari nama santri..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Tambah Santri
          </Button>
        </div>

        <SantriTable 
          data={filteredSantri}
          searchTerm={searchTerm}
          isAdmin={isAdmin}
          halaqahList={[]} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <SantriModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        selectedSantri={selectedSantri}
        isAdmin={isAdmin}
        halaqahList={[]}
        isSubmitting={isLoading}
      />
    </div>
  );
}
