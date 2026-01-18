import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

// Services & Hooks
import { halaqahService, type Halaqah } from "@/services/halaqahService";
import { type Santri } from "@/services/santriService";
import { useSantri } from "@/hooks/useSantri";

// Components
import { BuatHalaqah } from "./BuatHalaqah";
import { EditHalaqah } from "./EditHalaqah";
import { DeleteHalaqah } from "./DeleteHalaqah";
import { DaftarHalaqah } from "./DaftarHalaqah";
import { SantriModal } from "../../muhafidz/KelolaSantri/SantriModal";
import { PindahSantri } from "@/components/forms/PindahSantri";
import { HalaqahManagement } from "@/components/ui/TypedText";

// UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function KelolaHalaqah() {
  // State Halaqah
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);
  const [isLoadingHalaqah, setIsLoadingHalaqah] = useState(true);
  const [selectedHalaqah, setSelectedHalaqah] = useState<Halaqah | null>(null);
  const [isEditHalaqahOpen, setIsEditHalaqahOpen] = useState(false);
  const [isDeleteHalaqahOpen, setIsDeleteHalaqahOpen] = useState(false);

  // State Santri
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [isSantriModalOpen, setIsSantriModalOpen] = useState(false);
  const [isDeleteSantriOpen, setIsDeleteSantriOpen] = useState(false);
  const [isMoveSantriOpen, setIsMoveSantriOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { santriList, loadSantri, createSantri, updateSantri, deleteSantri } = useSantri();

  // Load Data
  const fetchData = useCallback(async () => {
    setIsLoadingHalaqah(true);
    try {
      const res = await halaqahService.getAllHalaqah();
      setHalaqahs(res.data);
      loadSantri();
    } catch (error) {
      toast.error("Gagal mengambil data halaqah");
    } finally {
      setIsLoadingHalaqah(false);
    }
  }, [loadSantri]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimasi: Map santri ke ID Halaqah untuk performa render
  const santriMap = useMemo(() => {
    return santriList.reduce((acc, s) => {
      const key = s.halaqah_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {} as Record<number, Santri[]>);
  }, [santriList]);

  // --- HANDLER ACTIONS ---

  // Handler Buka Modal Tambah Santri (dari Dropdown Halaqah)
  const handleOpenAddSantri = (h: Halaqah) => {
    setSelectedHalaqah(h);
    setSelectedSantri(null); // Pastikan null untuk mode "Tambah"
    setIsSantriModalOpen(true);
  };

  // Handler Buka Modal Edit Santri
  const handleOpenEditSantri = (s: Santri) => {
    setSelectedSantri(s);
    setIsSantriModalOpen(true);
  };

  // Handler Simpan Santri (Create & Update)
  const handleSaveSantri = async (payload: any) => {
    setIsSubmitting(true);
    try {
      if (selectedSantri) {
        // Mode Edit
        await updateSantri(selectedSantri.id_santri, payload);
        toast.success("Profil santri diperbarui");
      } else {
        // Mode Tambah
        await createSantri(payload);
        toast.success("Santri baru berhasil ditambahkan");
      }
      setIsSantriModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan data santri");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Santri Confirm
  const handleDeleteSantriConfirm = async () => {
    if (!selectedSantri) return;
    try {
      await deleteSantri(selectedSantri.id_santri);
      toast.success("Santri berhasil dihapus");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus santri");
    } finally {
      setIsDeleteSantriOpen(false);
    }
  };

  // Move Santri Confirm
  const handleMoveSantriConfirm = async (santriId: number, targetHalaqahId: number) => {
    try {
      await updateSantri(santriId, { halaqah_id: targetHalaqahId });
      toast.success("Santri berhasil dipindahkan");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Gagal memindahkan santri");
      throw error;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">
    
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 px-2 md:px-0">
      <div>
        <HalaqahManagement />
        <p className="text-sm md:text-base text-muted-foreground">
          Kelola kelompok bimbingan santri.
        </p>
      </div>
      <div className="w-full md:w-auto">
        <BuatHalaqah onSuccess={fetchData} />
      </div>
    </div>

      {/* Content */}
      {!isLoadingHalaqah && halaqahs.length === 0 ? (
        <EmptyState message="Belum ada halaqah yang dibuat." />
      ) : (
        <DaftarHalaqah
          halaqahs={halaqahs}
          santriMap={santriMap}
          isLoading={isLoadingHalaqah}
          onAddSantri={handleOpenAddSantri}
          onEdit={(h) => { setSelectedHalaqah(h); setIsEditHalaqahOpen(true); }}
          onDelete={(h) => { setSelectedHalaqah(h); setIsDeleteHalaqahOpen(true); }}
          onMoveSantri={(s) => { setSelectedSantri(s); setIsMoveSantriOpen(true); }}
          onEditSantri={handleOpenEditSantri}
          onDeleteSantri={(s) => { setSelectedSantri(s); setIsDeleteSantriOpen(true); }}
        />
      )}

      {/* --- MODALS HALAQAH --- */}
      {selectedHalaqah && (
        <>
          <EditHalaqah
            halaqah={selectedHalaqah}
            isOpen={isEditHalaqahOpen}
            onClose={() => setIsEditHalaqahOpen(false)}
            onSuccess={fetchData}
          />
          <DeleteHalaqah
            halaqah={selectedHalaqah}
            isOpen={isDeleteHalaqahOpen}
            onClose={() => setIsDeleteHalaqahOpen(false)}
            onSuccess={fetchData}
          />
        </>
      )}

      {/* --- MODAL SANTRI (Unified Add/Edit) --- */}
      <SantriModal
        isOpen={isSantriModalOpen}
        onClose={() => setIsSantriModalOpen(false)}
        selectedSantri={selectedSantri || (selectedHalaqah ? { halaqah_id: selectedHalaqah.id_halaqah } : null)}
        onSave={handleSaveSantri}
        isAdmin={true}
        halaqahList={halaqahs}
        isSubmitting={isSubmitting}
      />

      {/* Pindah Santri */}
      <PindahSantri
        isOpen={isMoveSantriOpen}
        onClose={() => setIsMoveSantriOpen(false)}
        santri={selectedSantri}
        halaqahs={halaqahs}
        onConfirm={handleMoveSantriConfirm}
      />

      {/* Delete Santri Alert */}
      <AlertDialog open={isDeleteSantriOpen} onOpenChange={setIsDeleteSantriOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Santri?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selectedSantri?.nama_santri}</strong>? 
              Tindakan ini akan memindahkan data ke tempat sampah.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSantriConfirm} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Hapus Santri
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl opacity-50">
      <FontAwesomeIcon icon={faUsers} size="3x" className="mb-4" />
      <p>{message}</p>
    </div>
  );
}