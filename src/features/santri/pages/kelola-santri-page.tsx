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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadSantri();
  }, [loadSantri]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredSantri = santriList.filter((s) =>
    s.nama_santri.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSantri.length / 10);
  const displayedSantri = showAll
    ? filteredSantri
    : filteredSantri.slice((currentPage - 1) * 10, currentPage * 10);

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
    nama_santri: string;
    nomor_telepon?: string | null;
    id_target: number | null;
    id_halaqah: number | undefined;
  }) => {
    const payload = {
      nama_santri: data.nama_santri,
      nomor_telepon: data.nomor_telepon || "",
      id_target: data.id_target,
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
        <div className="shrink-0">
          <Button onClick={() => setIsModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Tambah Santri
          </Button>
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
        </div>

        <SantriTable 
          data={displayedSantri}
          searchTerm={searchTerm}
          isAdmin={isAdmin}
          halaqahList={[]} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination Section */}
        {filteredSantri.length > 10 && (
          <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
            <div className="text-xs text-muted-foreground">
              {showAll ? (
                <span>Menampilkan semua <strong>{filteredSantri.length}</strong> santri</span>
              ) : (
                <span>
                  Menampilkan <strong>{Math.min((currentPage - 1) * 10 + 1, filteredSantri.length)}</strong> -{" "}
                  <strong>{Math.min(currentPage * 10, filteredSantri.length)}</strong> dari{" "}
                  <strong>{filteredSantri.length}</strong> santri
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8 px-3"
                onClick={() => {
                  setShowAll(!showAll);
                  setCurrentPage(1);
                }}
              >
                {showAll ? "Batasi 10 per Halaman" : "Tampilkan Semua"}
              </Button>
              
              {!showAll && totalPages > 1 && (
                <div className="flex items-center gap-2 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-xs text-muted-foreground min-w-[45px] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Selanjutnya
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
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
