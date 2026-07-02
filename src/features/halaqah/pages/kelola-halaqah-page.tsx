import { useEffect, useState } from "react";
import { HalaqahManagement } from "@/components/custom/typed-text";
import { useHalaqahManagement } from "../hooks/useHalaqahManagement";
import { BuatHalaqah } from "../components/BuatHalaqah";
import { DaftarHalaqah } from "../components/DaftarHalaqah";
import { EditHalaqah } from "../components/EditHalaqah";
import { DeleteHalaqah } from "../components/DeleteHalaqah";
import { SantriModal } from "@/features/santri/components/SantriModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ArrowRightLeft } from "lucide-react";

export function KelolaHalaqahPage() {
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
    handleOpenEditSantri,
    handleSaveSantri,
    handleDeleteSantriConfirm,
    handleMoveSantriConfirm,
    handleHalaqahSuccess,
  } = useHalaqahManagement();

  const [targetHalaqahId, setTargetHalaqahId] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <HalaqahManagement />
        </div>
        <BuatHalaqah onSuccess={fetchData} />
      </div>

      <DaftarHalaqah 
        halaqahs={halaqahs}
        santriMap={santriMap}
        isLoading={isLoadingHalaqah}
        onAddSantri={(h) => {
          setSelectedHalaqah(h);
          setSelectedSantri(null);
          setIsSantriModalOpen(true);
        }}
        onEdit={(h) => { setSelectedHalaqah(h); setIsEditHalaqahOpen(true); }}
        onDelete={(h) => { setSelectedHalaqah(h); setIsDeleteHalaqahOpen(true); }}
        onMoveSantri={(s) => { setSelectedSantri(s); setTargetHalaqahId(""); setIsMoveSantriOpen(true); }}
        onEditSantri={handleOpenEditSantri}
        onDeleteSantri={(s) => { setSelectedSantri(s); setIsDeleteSantriOpen(true); }}
      />

      <EditHalaqah 
        isOpen={isEditHalaqahOpen}
        onClose={() => setIsEditHalaqahOpen(false)}
        halaqah={selectedHalaqah}
        onSuccess={handleHalaqahSuccess}
      />

      <DeleteHalaqah 
        isOpen={isDeleteHalaqahOpen}
        onClose={() => setIsDeleteHalaqahOpen(false)}
        halaqah={selectedHalaqah}
        onSuccess={handleHalaqahSuccess}
      />

      <SantriModal
        isOpen={isSantriModalOpen}
        onClose={() => setIsSantriModalOpen(false)}
        selectedSantri={selectedSantri || { id_halaqah: selectedHalaqah?.id_halaqah }}
        onSave={handleSaveSantri}
        isAdmin={true}
        halaqahList={halaqahs}
        isSubmitting={isSubmitting}
      />

      <Dialog open={isDeleteSantriOpen} onOpenChange={(open) => !open && setIsDeleteSantriOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Hapus Santri
            </DialogTitle>
            <DialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus santri <strong>{selectedSantri?.nama_santri}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteSantriOpen(false)} disabled={isSubmitting}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteSantriConfirm} disabled={isSubmitting}>
              {isSubmitting ? "Menghapus..." : "Hapus Santri"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMoveSantriOpen} onOpenChange={(open) => !open && setIsMoveSantriOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              Pindah Halaqah Santri
            </DialogTitle>
            <DialogDescription className="pt-2">
              Pilih halaqah baru untuk <strong>{selectedSantri?.nama_santri}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={targetHalaqahId} onValueChange={setTargetHalaqahId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih halaqah tujuan..." />
              </SelectTrigger>
              <SelectContent>
                {halaqahs.map((h) => (
                  <SelectItem key={h.id_halaqah} value={h.id_halaqah.toString()} disabled={h.id_halaqah === selectedSantri?.id_halaqah}>
                    {h.name_halaqah}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMoveSantriOpen(false)} disabled={isSubmitting}>Batal</Button>
            <Button onClick={() => handleMoveSantriConfirm(selectedSantri!.id_santri, parseInt(targetHalaqahId, 10))} disabled={!targetHalaqahId || isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Pindah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
