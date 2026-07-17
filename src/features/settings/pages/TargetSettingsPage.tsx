import { Plus, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useTargetSettings, TargetList, TargetDialog } from "../modules";

export default function TargetSettingsPage() {
  const {
    navigate,
    targets,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingTarget,
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
    isDeleting,
  } = useTargetSettings();

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/kepala-muhafidz/settings")}
          className="rounded-full h-10 w-10 shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Target Setoran</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Atur target hafalan sesuai kurikulum sekolah Anda. Setiap santri dapat ditetapkan ke
            salah satu target, atau dibiarkan tanpa target.
          </p>
        </div>
        <Button onClick={openCreate} className="ml-auto shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Target
        </Button>
      </div>

      {/* Target List Component */}
      <TargetList
        targets={targets}
        isLoading={isLoading}
        openCreate={openCreate}
        openEdit={openEdit}
        setDeletingTarget={setDeletingTarget}
      />

      {/* Target Form Dialog Component */}
      <TargetDialog
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        editingTarget={editingTarget}
        form={form}
        kategoriList={kategoriList}
        isLoadingKategori={isLoadingKategori}
        isHarian={isHarian}
        isPending={isPending}
        handleSubmit={handleSubmit}
      />

      {/* Info Box */}
      <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground">📐 Standar Mushaf: 15 Baris/Halaman</p>
        <p>Sistem menggunakan standar mushaf pojok (Madinah) Indonesia — 15 baris per halaman, 20 halaman per juz. Semua kalkulasi capaian menggunakan standar ini secara konsisten.</p>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingTarget} onOpenChange={() => setDeletingTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Target?</AlertDialogTitle>
            <AlertDialogDescription>
              Target <strong>&quot;{deletingTarget?.nama_target}&quot;</strong> akan dihapus. Santri yang
              menggunakan target ini akan menjadi tidak memiliki target (status Bebas).
              <br /><br />
              Tindakan ini tidak dapat dibatalkan, tetapi riwayat setoran santri tetap aman.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Hapus Target
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
