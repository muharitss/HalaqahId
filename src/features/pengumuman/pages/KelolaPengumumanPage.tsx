import { useState, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Term } from "@/components/ui/Term";
import {
  usePengumumanList,
  usePengumumanMutations,
} from "../api";
import { PengumumanCard } from "../components/PengumumanCard";
import { PengumumanDialog } from "../components/PengumumanDialog";
import { PengumumanDetailDialog } from "../components/PengumumanDetailDialog";
import type {
  PengumumanItem,
  PrioritasPengumuman,
  TargetTypePengumuman,
} from "../types";
import type { PengumumanFormValues } from "../modules/form/validation/pengumumanSchema";

export function KelolaPengumumanPage() {
  const [search, setSearch] = useState("");
  const [prioritasFilter, setPrioritasFilter] = useState<string>("ALL");
  const [targetFilter, setTargetFilter] = useState<string>("ALL");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PengumumanItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PengumumanItem | null>(null);

  const [selectedDetailItem, setSelectedDetailItem] = useState<PengumumanItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const queryFilters = useMemo(() => {
    return {
      search: search.trim() ? search.trim() : undefined,
      prioritas:
        prioritasFilter !== "ALL"
          ? (prioritasFilter as PrioritasPengumuman)
          : undefined,
      target:
        targetFilter !== "ALL"
          ? (targetFilter as TargetTypePengumuman)
          : undefined,
    };
  }, [search, prioritasFilter, targetFilter]);

  const { data: pengumumanResult, isLoading } = usePengumumanList(queryFilters);
  const {
    createPengumumanMutation,
    updatePengumumanMutation,
    deletePengumumanMutation,
    togglePinMutation,
  } = usePengumumanMutations();

  const items = pengumumanResult?.data || [];

  const totalCount = items.length;
  const pinnedCount = items.filter((i) => i.is_pinned).length;
  const urgentCount = items.filter(
    (i) => i.prioritas === "URGENT" || i.prioritas === "PENTING"
  ).length;

  const hasActiveFilters =
    search.trim() !== "" || prioritasFilter !== "ALL" || targetFilter !== "ALL";

  const handleResetFilters = () => {
    setSearch("");
    setPrioritasFilter("ALL");
    setTargetFilter("ALL");
  };

  const handleCreateOpen = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditOpen = (item: PengumumanItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleViewDetail = (item: PengumumanItem) => {
    setSelectedDetailItem(item);
    setIsDetailOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteItem) {
      deletePengumumanMutation.mutate(deleteItem.id_pengumuman, {
        onSuccess: () => setDeleteItem(null),
      });
    }
  };

  const handleFormSubmit = (values: PengumumanFormValues) => {
    const payload = {
      judul: values.judul,
      isi: values.isi,
      prioritas: values.prioritas,
      is_pinned: values.is_pinned,
      tanggal_mulai: values.tanggal_mulai
        ? new Date(values.tanggal_mulai).toISOString()
        : null,
      tanggal_selesai: values.tanggal_selesai
        ? new Date(values.tanggal_selesai).toISOString()
        : null,
      targets: [
        {
          target_type: values.target_type,
          target_id: values.target_id ?? null,
        },
      ],
    };

    if (editingItem) {
      updatePengumumanMutation.mutate(
        { id: editingItem.id_pengumuman, payload },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingItem(null);
          },
        }
      );
    } else {
      createPengumumanMutation.mutate(payload, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleTogglePin = (item: PengumumanItem) => {
    togglePinMutation.mutate({
      id: item.id_pengumuman,
      is_pinned: !item.is_pinned,
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Kelola Pengumuman
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Publikasikan pengumuman ke seluruh civitas, per{" "}
            <Term code="HALAQAH" className="lowercase" />, atau per{" "}
            <Term code="SANTRI" className="lowercase" />.
          </p>
        </div>

        <Button onClick={handleCreateOpen} size="sm" className="gap-1.5 shrink-0 self-start sm:self-auto shadow-xs">
          <Plus className="w-4 h-4" />
          Buat Pengumuman
        </Button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-xs border-border/80">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Total Pengumuman
            </p>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground mt-1">
              {totalCount}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Tercatat dalam sistem
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Disematkan (Pinned)
            </p>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground mt-1">
              {pinnedCount}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Tampil di urutan teratas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Prioritas Tinggi
            </p>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground mt-1">
              {urgentCount}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Urgent & Penting
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card p-3 rounded-lg border shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul atau isi pengumuman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 h-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <Select
            value={prioritasFilter}
            onValueChange={setPrioritasFilter}
          >
            <SelectTrigger className="w-full sm:w-40 h-9">
              <SelectValue placeholder="Prioritas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Prioritas</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="PENTING">Penting</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={targetFilter}
            onValueChange={setTargetFilter}
          >
            <SelectTrigger className="w-full sm:w-40 h-9">
              <SelectValue placeholder="Target" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Target</SelectItem>
              <SelectItem value="HALAQAH">
                <Term code="HALAQAH" />
              </SelectItem>
              <SelectItem value="SANTRI">
                <Term code="SANTRI" />
              </SelectItem>
              <SelectItem value="ROLE">Role</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Pengumuman List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-2/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-14 px-4 text-center border rounded-lg bg-card">
          <h3 className="font-semibold text-base text-foreground">
            {hasActiveFilters ? "Pengumuman Tidak Ditemukan" : "Belum Ada Pengumuman"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            {hasActiveFilters
              ? "Coba ubah kata kunci pencarian atau sesuaikan filter yang dipilih."
              : "Pengumuman yang Anda publikasikan akan muncul di sini dan dapat diakses oleh target penerima."}
          </p>
          {hasActiveFilters ? (
            <Button onClick={handleResetFilters} variant="outline" size="sm">
              Reset Filter
            </Button>
          ) : (
            <Button onClick={handleCreateOpen} size="sm">
              Buat Pengumuman Sekarang
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {items.map((item) => (
            <PengumumanCard
              key={item.id_pengumuman}
              item={item}
              canManage={true}
              onEdit={handleEditOpen}
              onDelete={setDeleteItem}
              onTogglePin={handleTogglePin}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      )}

      {/* Dialog Form Create / Edit */}
      <PengumumanDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        itemToEdit={editingItem}
        onSubmit={handleFormSubmit}
        isLoading={
          createPengumumanMutation.isPending || updatePengumumanMutation.isPending
        }
      />

      {/* Detail Preview Dialog */}
      <PengumumanDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        item={selectedDetailItem}
        canManage={true}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengumuman?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengumuman{" "}
              <span className="font-medium text-foreground">
                "{deleteItem?.judul}"
              </span>
              ? Pengumuman tidak akan lagi ditampilkan ke pengguna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletePengumumanMutation.isPending}
            >
              {deletePengumumanMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default KelolaPengumumanPage;
