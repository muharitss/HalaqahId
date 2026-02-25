import { useHalaqahManagement } from "./hooks/useHalaqahManagement";
import { BuatHalaqah } from "./components/BuatHalaqah";
import { EditHalaqah } from "./components/EditHalaqah";
import { DeleteHalaqah } from "./components/DeleteHalaqah";
import { DaftarHalaqah } from "./components/DaftarHalaqah";
import { EmptyState } from "./components/EmptyState";
import { HalaqahManagement } from "@/components/typed-text";
import { SantriModal } from "@/features/muhafidz/kelola-santri/components/SantriModal";
import { PindahSantri } from "@/components/forms/PindahSantri";
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

export default function KelolaHalaqahPage() {
  const {
    halaqahs,
    santriMap,
    isLoadingHalaqah,
    selectedHalaqah,
    selectedSantri,
    isEditHalaqahOpen,
    isDeleteHalaqahOpen,
    isSantriModalOpen,
    isDeleteSantriOpen,
    isMoveSantriOpen,
    isSubmitting,
    setSelectedHalaqah,
    setSelectedSantri,
    setIsEditHalaqahOpen,
    setIsDeleteHalaqahOpen,
    setIsSantriModalOpen,
    setIsDeleteSantriOpen,
    setIsMoveSantriOpen,
    fetchData,
    handleOpenAddSantri,
    handleOpenEditSantri,
    handleSaveSantri,
    handleDeleteSantriConfirm,
    handleMoveSantriConfirm,
    handleHalaqahSuccess,
  } = useHalaqahManagement();

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">
    
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 md:px-0">
        <div>
          <HalaqahManagement />
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola kelompok bimbingan santri.
          </p>
        </div>
        <div className="w-full md:w-auto">
          <BuatHalaqah onSuccess={handleHalaqahSuccess} />
        </div>
      </div>

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

      {/* Modals Halaqah */}
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

      {/* Modal Santri */}
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