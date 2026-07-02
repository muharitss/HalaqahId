import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { useSesi } from "../hooks/useSesi";
import { useHalaqahManagement } from "@/features/halaqah/hooks/useHalaqahManagement";
import { SesiTable } from "../components/SesiTable";
import { SesiModal } from "../components/SesiModal";
import type { SesiHalaqah, CreateSesiHalaqahRequest, UpdateSesiHalaqahRequest } from "@/types/domain/sesi-halaqah";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

export function KelolaSesiPage() {
  const { sesiList, isLoading: loadingSesi, fetchSesi, createSesi, updateSesi, deleteSesi } = useSesi();
  const { halaqahs, fetchData: fetchHalaqahs } = useHalaqahManagement();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSesi, setSelectedSesi] = useState<SesiHalaqah | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sesiToDelete, setSesiToDelete] = useState<SesiHalaqah | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSesi();
    fetchHalaqahs();
  }, [fetchSesi, fetchHalaqahs]);

  const handleOpenAdd = () => {
    setSelectedSesi(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sesi: SesiHalaqah) => {
    setSelectedSesi(sesi);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: CreateSesiHalaqahRequest | UpdateSesiHalaqahRequest) => {
    setIsSaving(true);
    let success = false;
    try {
      if (selectedSesi) {
        success = await updateSesi(selectedSesi.id_sesi, payload as UpdateSesiHalaqahRequest);
      } else {
        success = await createSesi(payload as CreateSesiHalaqahRequest);
      }
    } finally {
      setIsSaving(false);
    }
    return success;
  };

  const handleOpenDelete = (sesi: SesiHalaqah) => {
    setSesiToDelete(sesi);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sesiToDelete) return;
    setIsDeleting(true);
    try {
      const success = await deleteSesi(sesiToDelete.id_sesi);
      if (success) {
        setIsDeleteModalOpen(false);
        setSesiToDelete(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Kelola Sesi Halaqah</h1>
          <p className="text-muted-foreground mt-1">Atur jadwal sesi halaqah untuk santri dan asatidz.</p>
        </div>
        <Button onClick={handleOpenAdd} className="shrink-0 shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Tambah Sesi
        </Button>
      </div>

      <SesiTable 
        sesiList={sesiList} 
        isLoading={loadingSesi} 
        onEdit={handleOpenEdit} 
        onDelete={handleOpenDelete} 
      />

      <SesiModal 
        key={isModalOpen ? (selectedSesi ? `edit-${selectedSesi.id_sesi}` : "add") : "closed"}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        sesi={selectedSesi} 
        halaqahList={halaqahs} 
        onSave={handleSave} 
        isSubmitting={isSaving}
      />

      <Dialog open={isDeleteModalOpen} onOpenChange={(open) => !open && setIsDeleteModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Hapus Sesi Halaqah
            </DialogTitle>
            <DialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus sesi <strong>{sesiToDelete?.nama_sesi}</strong>?
              Sesi yang masih memiliki data absensi atau setoran aktif tidak dapat dihapus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Menghapus..." : "Hapus Sesi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
