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
import { type Halaqah } from "./types";
import { type Santri } from "./types";
import { faBookOpen, faCalendarCheck, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AbsensiPage from "@/features/muhafidz/absensi";
import SetoranPage from "@/features/muhafidz/setoran";

export default function KelolaHalaqahPage() {
  const {
    // State
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

    // Setters
    setSelectedHalaqah,
    setSelectedSantri,
    setIsEditHalaqahOpen,
    setIsDeleteHalaqahOpen,
    setIsSantriModalOpen,
    setIsDeleteSantriOpen,
    setIsMoveSantriOpen,

    // Handlers
    fetchData,
    handleOpenAddSantri,
    handleOpenEditSantri,
    handleSaveSantri,
    handleDeleteSantriConfirm,
    handleMoveSantriConfirm,
    handleHalaqahSuccess,
  } = useHalaqahManagement();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <HalaqahManagement />
        </div>
        <div className="shrink-0">
          <BuatHalaqah onSuccess={() => handleHalaqahSuccess()} />
        </div>
      </div>

      <Tabs defaultValue="daftar" className="w-full space-y-6">
        <TabsList className="flex w-full items-center justify-start overflow-x-auto overflow-y-hidden bg-muted/50 p-1 md:grid md:grid-cols-3 md:max-w-[550px] scrollbar-hide h-auto">
          <TabsTrigger value="daftar" className="flex items-center gap-2 shrink-0 whitespace-nowrap py-2 px-4 md:px-2">
            <FontAwesomeIcon icon={faLayerGroup} className="h-3.5 w-3.5" />
            <span>Daftar Halaqah</span>
          </TabsTrigger>
          <TabsTrigger value="absensi" className="flex items-center gap-2 shrink-0 whitespace-nowrap py-2 px-4 md:px-2">
            <FontAwesomeIcon icon={faCalendarCheck} className="h-3.5 w-3.5" />
            <span>Absensi Santri</span>
          </TabsTrigger>
          <TabsTrigger value="setoran" className="flex items-center gap-2 shrink-0 whitespace-nowrap py-2 px-4 md:px-2">
            <FontAwesomeIcon icon={faBookOpen} className="h-3.5 w-3.5" />
            <span>Setoran Hafalan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daftar" className="mt-0 outline-none">
          {!isLoadingHalaqah && (halaqahs ?? []).length === 0 ? (
            <EmptyState message="Belum ada halaqah yang dibuat." />
          ) : (
            <DaftarHalaqah
              halaqahs={halaqahs ?? []}
              santriMap={santriMap ?? {}}
              isLoading={isLoadingHalaqah}
              onAddSantri={(h: Halaqah) => handleOpenAddSantri(h)}
              onEdit={(h: Halaqah) => {
                setSelectedHalaqah(h);
                setIsEditHalaqahOpen(true);
              }}
              onDelete={(h: Halaqah) => {
                setSelectedHalaqah(h);
                setIsDeleteHalaqahOpen(true);
              }}
              onMoveSantri={(s: Santri) => {
                setSelectedSantri(s);
                setIsMoveSantriOpen(true);
              }}
              onEditSantri={(s: Santri) => handleOpenEditSantri(s)}
              onDeleteSantri={(s: Santri) => {
                setSelectedSantri(s);
                setIsDeleteSantriOpen(true);
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="absensi" className="mt-0 outline-none">
          <AbsensiPage hideHeader />
        </TabsContent>

        <TabsContent value="setoran" className="mt-0 outline-none">
          <SetoranPage hideHeader />
        </TabsContent>
      </Tabs>

      {/* --- MODALS SECTION --- */}

      {/* 1. Modal Edit & Delete Halaqah */}
      {selectedHalaqah && (
        <>
          <EditHalaqah
            halaqah={selectedHalaqah}
            isOpen={isEditHalaqahOpen ?? false}
            onClose={() => setIsEditHalaqahOpen?.(false)}
            onSuccess={() => fetchData()}
          />
          <DeleteHalaqah
            halaqah={selectedHalaqah}
            isOpen={isDeleteHalaqahOpen ?? false}
            onClose={() => setIsDeleteHalaqahOpen?.(false)}
            onSuccess={() => fetchData()}
          />
        </>
      )}

      {/* 2. Modal Tambah/Edit Santri */}
      <SantriModal
        isOpen={isSantriModalOpen}
        onClose={() => setIsSantriModalOpen(false)}
        selectedSantri={selectedSantri as any}
        onSave={handleSaveSantri}
        isAdmin={true}
        halaqahList={halaqahs}
        isSubmitting={isSubmitting}
      />

      {/* 3. Modal Pindah Santri */}
      {selectedSantri && (
        <PindahSantri
          isOpen={isMoveSantriOpen}
          onClose={() => setIsMoveSantriOpen(false)}
          santri={selectedSantri as any} 
          halaqahs={halaqahs}
          onConfirm={handleMoveSantriConfirm}
        />
      )}

      {/* 4. Alert Dialog Delete Santri */}
      <AlertDialog 
        open={isDeleteSantriOpen ?? false} 
        onOpenChange={(open) => setIsDeleteSantriOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Santri?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selectedSantri?.nama_santri}</strong>? 
              Data ini akan dipindahkan ke tempat sampah dan dapat dipulihkan nanti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteSantriConfirm()} 
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Ya, Hapus Santri
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}