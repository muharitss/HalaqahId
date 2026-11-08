import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Edit,
  Trash2,
  ShieldCheck,
  Power,
  PowerOff,
  ChevronLeft,
  ChevronRight,
  School,
  Users,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTenants,
  useUpdateTenantStatus,
  useDeleteTenant,
} from "../hooks/useTenants";
import { TenantForm } from "../components/TenantForm";
import type { TenantListItem, TenantStatus } from "../types";

export function KelolaTenantPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenantListItem | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<TenantListItem | null>(null);

  const queryParams = useMemo(() => {
    return {
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: statusFilter !== "ALL" ? (statusFilter as TenantStatus) : undefined,
    };
  }, [page, search, statusFilter]);

  const { data, isLoading, isPlaceholderData } = useTenants(queryParams);
  const updateStatusMutation = useUpdateTenantStatus();
  const deleteMutation = useDeleteTenant();

  const tenants = data?.tenants || [];
  const meta = data?.meta;

  const handleOpenCreate = () => {
    setEditingTenant(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tenant: TenantListItem) => {
    setEditingTenant(tenant);
    setIsFormOpen(true);
  };

  const handleStatusChange = async (tenant: TenantListItem, newStatus: TenantStatus) => {
    await updateStatusMutation.mutateAsync({
      id: tenant.id_tenant,
      status: newStatus,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTenant) return;
    try {
      await deleteMutation.mutateAsync(deletingTenant.id_tenant);
      setDeletingTenant(null);
    } catch {
      // Handled in toast
    }
  };

  const getStatusBadge = (status: TenantStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
            Aktif
          </Badge>
        );
      case "TRIAL":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
            Trial
          </Badge>
        );
      case "SUSPENDED":
        return <Badge variant="destructive">Ditangguhkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Manajemen Tenant
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Kelola lembaga, institusi, dan konfigurasi multi-tenant platform
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="gap-2 shadow-xs">
          <Plus className="w-4 h-4" />
          Tambah Tenant Baru
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama lembaga atau slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44 h-9">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="ACTIVE">Aktif (ACTIVE)</SelectItem>
              <SelectItem value="TRIAL">Masa Trial (TRIAL)</SelectItem>
              <SelectItem value="SUSPENDED">Ditangguhkan (SUSPENDED)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tenant Table */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Lembaga / Tenant</TableHead>
              <TableHead className="w-[180px]">Slug Identitas</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[140px] text-center">Sekolah / Unit</TableHead>
              <TableHead className="w-[120px] text-center">Total Pengguna</TableHead>
              <TableHead className="w-[80px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-xs">Memuat daftar tenant...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Building2 className="w-8 h-8 opacity-40" />
                    <p className="text-sm font-medium">Tidak ada tenant ditemukan</p>
                    <p className="text-xs">
                      {search ? "Coba ubah kata kunci pencarian" : "Klik tombol Tambah Tenant untuk memulai"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((t) => (
                <TableRow key={t.id_tenant} className="hover:bg-muted/40 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 overflow-hidden">
                        {t.brand?.logo_url ? (
                          <img
                            src={t.brand.logo_url}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          t.nama_tenant.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <button
                          type="button"
                          onClick={() => navigate(`/superadmin/tenants/${t.id_tenant}`)}
                          className="font-semibold text-sm text-foreground hover:text-primary transition-colors text-left truncate"
                        >
                          {t.nama_tenant}
                        </button>
                        <span className="text-[11px] text-muted-foreground">
                          ID: #{t.id_tenant}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <code className="text-xs px-2 py-0.5 rounded bg-muted font-mono text-primary">
                      {t.slug}
                    </code>
                  </TableCell>

                  <TableCell>{getStatusBadge(t.status)}</TableCell>

                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <School className="w-3.5 h-3.5" />
                      <span className="font-medium text-foreground">
                        {t._count?.sekolah ?? 0}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-medium text-foreground">
                        {t._count?.users ?? 0}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Aksi Tenant</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigate(`/superadmin/tenants/${t.id_tenant}`)}
                          className="gap-2 cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4 text-primary" />
                          <span>Kelola / Detail</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(t)}
                          className="gap-2 cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit Info</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel className="text-[11px] text-muted-foreground font-normal">
                          Ubah Status:
                        </DropdownMenuLabel>
                        {t.status !== "ACTIVE" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(t, "ACTIVE")}
                            className="gap-2 text-emerald-600 cursor-pointer"
                          >
                            <Power className="w-4 h-4" />
                            <span>Aktifkan (ACTIVE)</span>
                          </DropdownMenuItem>
                        )}
                        {t.status !== "TRIAL" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(t, "TRIAL")}
                            className="gap-2 text-amber-600 cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Set ke TRIAL</span>
                          </DropdownMenuItem>
                        )}
                        {t.status !== "SUSPENDED" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(t, "SUSPENDED")}
                            className="gap-2 text-destructive cursor-pointer"
                          >
                            <PowerOff className="w-4 h-4" />
                            <span>Suspend Tenant</span>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => setDeletingTenant(t)}
                          className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Hapus Tenant</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
            <div>
              Halaman {meta.page} dari {meta.totalPages} (Total: {meta.total} tenant)
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1 || isPlaceholderData}
                className="h-8 gap-1 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                disabled={page >= meta.totalPages || isPlaceholderData}
                className="h-8 gap-1 text-xs"
              >
                Berikutnya
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <TenantForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingTenant}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!deletingTenant}
        onOpenChange={(open) => !open && setDeletingTenant(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tenant?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menonaktifkan tenant &quot;{deletingTenant?.nama_tenant}&quot; secara permanen. Pengguna di bawah tenant ini tidak akan dapat login.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
