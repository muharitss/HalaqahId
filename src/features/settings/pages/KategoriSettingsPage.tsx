import { ChevronLeft, Plus, Layers, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useKategoriSettings, KategoriTable, KategoriDialogs } from "../modules";

export default function KategoriSettingsPage() {
  const {
    navigate,
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedKategori,
    namaKategori,
    setNamaKategori,
    deskripsi,
    setDeskripsi,
    perluValidasiUrutan,
    setPerluValidasiUrutan,
    kategoriList,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    resetForm,
    handleOpenEdit,
    handleOpenDelete,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useKategoriSettings();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b pb-5">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/kepala-muhafidz/settings")} 
            className="rounded-full h-9 w-9 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Kelola Kategori Setoran
            </h1>
            <p className="text-xs text-muted-foreground">
              Tentukan kategori kustom setoran Al-Quran untuk sekolah Anda
            </p>
          </div>
        </div>
        
        <Button 
          size="sm" 
          onClick={() => { resetForm(); setIsCreateOpen(true); }}
          className="font-semibold text-xs h-8.5 gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      {/* ── ALERTS / INFO ── */}
      <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 flex gap-3 text-blue-800 dark:text-blue-300">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold">Informasi Fitur</p>
          <p className="leading-relaxed">
            Kategori setoran menentukan opsi yang dapat dipilih Muhafiz saat mencatat setoran santri. 
            Aktifkan opsi <strong>&quot;Validasi Urutan (Sequence Validation)&quot;</strong> jika kategori tersebut 
            mengharuskan santri menyetor surat/ayat secara berurutan tanpa terputus (seperti Ziyadah).
          </p>
        </div>
      </div>

      {/* ── CONTENT TABLE ────────────────────────────────────────────────── */}
      <Card className="shadow-sm border-primary/5">
        <CardHeader className="py-4.5 px-6 border-b">
          <CardTitle className="text-sm font-bold">Daftar Kategori Aktif</CardTitle>
          <CardDescription className="text-xs">
            Daftar kategori setoran Al-Quran yang tersedia di sekolah Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <KategoriTable
            kategoriList={kategoriList}
            isLoading={isLoading}
            error={error}
            handleOpenEdit={handleOpenEdit}
            handleOpenDelete={handleOpenDelete}
          />
        </CardContent>
      </Card>

      <KategoriDialogs
        isCreateOpen={isCreateOpen}
        setIsCreateOpen={setIsCreateOpen}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        selectedKategori={selectedKategori}
        namaKategori={namaKategori}
        setNamaKategori={setNamaKategori}
        deskripsi={deskripsi}
        setDeskripsi={setDeskripsi}
        perluValidasiUrutan={perluValidasiUrutan}
        setPerluValidasiUrutan={setPerluValidasiUrutan}
        isCreating={isCreating}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
      />
    </div>
  );
}
