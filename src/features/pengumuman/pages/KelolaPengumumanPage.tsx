import { useState, useMemo } from "react";
import { Plus, Search, Megaphone, Pin, AlertTriangle, Filter } from "lucide-react";
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
import {
  usePengumumanList,
  usePengumumanMutations,
} from "../api";
import { PengumumanCard } from "../components/PengumumanCard";
import { PengumumanDialog } from "../components/PengumumanDialog";
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

  // Modal dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PengumumanItem | null>(null);

  // Delete alert dialog
  const [deleteItem, setDeleteItem] = useState<PengumumanItem | null>(null);

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

  // Summary counts
  const totalCount = items.length;
  const pinnedCount = items.filter((i) => i.is_pinned).length;
  const urgentCount = items.filter(
    (i) => i.prioritas === "URGENT" || i.prioritas === "PENTING"
  ).length;

  const handleCreateOpen = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditOpen = (item: PengumumanItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
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
    <div className="container max-w-6xl mx-auto py-6 px-4 md:px-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-primary" />
            Kelola Pengumuman
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Publikasikan pengumuman ke seluruh civitas, per halaqah, atau per santri.
          </p>
        </div>

        <Button onClick={handleCreateOpen} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Buat Pengumuman
        </Button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Pengumuman</p>
              <h3 className="text-xl font-bold">{totalCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600">
              <Pin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Disematkan (Pinned)</p>
              <h3 className="text-xl font-bold">{pinnedCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Prioritas Tinggi</p>
              <h3 className="text-xl font-bold">{urgentCount}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card p-3 rounded-lg border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul atau isi pengumuman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground hidden sm:block shrink-0" />
          <Select
            value={prioritasFilter}
            onValueChange={setPrioritasFilter}
          >
            <SelectTrigger className="w-full sm:w-36">
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
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Target" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Target</SelectItem>
              <SelectItem value="HALAQAH">Halaqah</SelectItem>
              <SelectItem value="SANTRI">Santri</SelectItem>
              <SelectItem value="ROLE">Role</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pengumuman List */}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Memuat daftar pengumuman...
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center border rounded-lg bg-card/50">
          <Megaphone className="w-10 h-10 mx-auto text-muted-foreground/60 mb-2" />
          <h3 className="font-semibold text-base">Belum Ada Pengumuman</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            Pengumuman yang Anda buat akan muncul di sini dan dapat dibaca oleh target penerima.
          </p>
          <Button onClick={handleCreateOpen} size="sm">
            Buat Pengumuman Sekarang
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <PengumumanCard
              key={item.id_pengumuman}
              item={item}
              canManage={true}
              onEdit={handleEditOpen}
              onDelete={setDeleteItem}
              onTogglePin={handleTogglePin}
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
