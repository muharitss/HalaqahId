import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  ClipboardCheck,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useRubrikList } from "../api/queries/useRubrikQueries";
import { useRubrikMutations } from "../api/mutations/useRubrikMutations";
import { RubrikFormDialog, LinkKategoriDialog } from "../modules/rubrik-form";
import type { RubrikTemplate, TipeRubrik } from "../types";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function KelolaRubrikPage() {
  const navigate = useNavigate();
  const [filterTipe, setFilterTipe] = useState<TipeRubrik | "ALL">("ALL");

  const { data: rubrikList = [], isLoading } = useRubrikList(
    filterTipe === "ALL" ? undefined : filterTipe
  );
  const { removeMutation } = useRubrikMutations();

  const [formOpen, setFormOpen] = useState(false);
  const [editingRubrik, setEditingRubrik] = useState<RubrikTemplate | null>(null);

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkingRubrik, setLinkingRubrik] = useState<RubrikTemplate | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (rubrik: RubrikTemplate) => {
    setEditingRubrik(rubrik);
    setFormOpen(true);
  };

  const handleLinkKategori = (rubrik: RubrikTemplate) => {
    setLinkingRubrik(rubrik);
    setLinkDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await removeMutation.mutateAsync(deletingId);
      toast.success("Template rubrik berhasil dihapus");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menghapus rubrik"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/kepala-muhafidz/settings")}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                Rubrik Penilaian
              </h1>
              <Badge variant="secondary" className="gap-1 text-xs">
                <Sparkles className="h-3 w-3 text-primary" />
                Terstandar
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Kelola template kriteria & bobot penilaian terstandar untuk setoran harian dan ujian tahfidz.
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            setEditingRubrik(null);
            setFormOpen(true);
          }}
          className="gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Tambah Rubrik
        </Button>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Daftar Template Rubrik</CardTitle>
              <CardDescription className="text-xs">
                Rubrik yang aktif dapat ditautkan ke kategori setoran agar penilaian otomatis menggunakan bobot kriteria.
              </CardDescription>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg self-start sm:self-auto">
              <Button
                variant={filterTipe === "ALL" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setFilterTipe("ALL")}
              >
                Semua
              </Button>
              <Button
                variant={filterTipe === "SETORAN" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setFilterTipe("SETORAN")}
              >
                Setoran
              </Button>
              <Button
                variant={filterTipe === "UJIAN" ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={() => setFilterTipe("UJIAN")}
              >
                Ujian
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3 py-4">
              <div className="h-10 bg-muted animate-pulse rounded-md" />
              <div className="h-14 bg-muted animate-pulse rounded-md" />
              <div className="h-14 bg-muted animate-pulse rounded-md" />
            </div>
          ) : rubrikList.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                <ClipboardCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm">Belum Ada Rubrik Penilaian</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Buat rubrik penilaian pertama untuk mulai menilai hafalan santri dengan kriteria terbobot.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setEditingRubrik(null);
                  setFormOpen(true);
                }}
                className="gap-1.5 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Buat Rubrik Baru
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[280px]">Nama Rubrik</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Kriteria Penilaian</TableHead>
                    <TableHead>Kategori Terkait</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rubrikList.map((rubrik) => {
                    const kriteriaSummary = (rubrik.kriteria || [])
                      .map((k) => `${k.nama} (${k.bobot}%)`)
                      .join(", ");

                    return (
                      <TableRow key={rubrik.id_rubrik}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                {rubrik.nama}
                              </span>
                              {rubrik.is_default && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] bg-primary/10 text-primary border-primary/20 gap-1 py-0 h-5"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  Default
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {rubrik.kriteria?.length || 0} kriteria penilaian
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={rubrik.tipe === "SETORAN" ? "secondary" : "default"}
                            className="text-[10px] tracking-wide"
                          >
                            {rubrik.tipe}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div
                            className="text-xs text-muted-foreground max-w-[280px] truncate"
                            title={kriteriaSummary}
                          >
                            {kriteriaSummary || "—"}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {rubrik.kategori && rubrik.kategori.length > 0 ? (
                              rubrik.kategori.map((kat) => (
                                <Badge
                                  key={kat.id_kategori}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-5"
                                >
                                  {kat.nama_kategori}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground italic">
                                Belum ada kategori
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 text-xs hidden md:flex"
                              onClick={() => handleLinkKategori(rubrik)}
                            >
                              <Layers className="h-3.5 w-3.5" />
                              Kategori
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleLinkKategori(rubrik)}
                                  className="gap-2 cursor-pointer md:hidden"
                                >
                                  <Layers className="h-4 w-4 text-muted-foreground" />
                                  <span>Tautkan Kategori</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEdit(rubrik)}
                                  className="gap-2 cursor-pointer"
                                >
                                  <Edit className="h-4 w-4 text-muted-foreground" />
                                  <span>Edit Rubrik</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeletingId(rubrik.id_rubrik)}
                                  className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                  <span>Hapus</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <RubrikFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingRubrik}
      />

      {/* Link Kategori Dialog */}
      <LinkKategoriDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        rubrik={linkingRubrik}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Rubrik Penilaian?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus template rubrik penilaian. Jika rubrik sudah pernah digunakan dalam setoran, riwayat nilai setoran yang sudah tersimpan tidak akan hilang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default KelolaRubrikPage;
