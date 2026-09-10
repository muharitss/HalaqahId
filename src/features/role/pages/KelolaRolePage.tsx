import { useState, useMemo } from "react";
import {
  useRoles,
  useRolePermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useUpdateRolePermissions,
} from "../hooks/useRoles";
import type { RoleItem } from "../types";
import { RoleForm } from "../components/RoleForm";
import { PermissionMatrix } from "../components/PermissionMatrix";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Search,
  MoreHorizontal,
  Key,
  Edit2,
  Trash2,
  Users,
  Lock,
  Loader2,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export function KelolaRolePage() {
  // Data fetching
  const { data: roles = [], isLoading, error } = useRoles();

  // Mutations
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();
  const updateRolePermissionsMutation = useUpdateRolePermissions();

  // Local UI states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "system" | "custom">("all");

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null);
  const [managingPermissionsRole, setManagingPermissionsRole] = useState<RoleItem | null>(null);

  // Selected permissions state for the permission dialog
  const [selectedPermissionCodes, setSelectedPermissionCodes] = useState<string[]>([]);

  // Fetch permissions when opening the permissions dialog
  const { data: rolePermissions = [], isLoading: isLoadingPermissions } = useRolePermissions(
    managingPermissionsRole?.id_role ?? null
  );

  // Sync permissions when dialog opens or data arrives
  const handleOpenPermissions = (role: RoleItem) => {
    setManagingPermissionsRole(role);
    // If role already has included permissions from list, initialize with them
    const initialCodes =
      role.permissions?.map((rp) => rp.permission.code) || [];
    setSelectedPermissionCodes(initialCodes);
  };

  // When query loads permissions from endpoint, update selectedCodes if dialog is open
  useMemo(() => {
    if (managingPermissionsRole && rolePermissions.length > 0) {
      setSelectedPermissionCodes(rolePermissions.map((p) => p.code));
    }
  }, [managingPermissionsRole, rolePermissions]);

  // Filtered roles
  const filteredRoles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return roles.filter((r) => {
      // Tab filter
      if (activeTab === "system" && !r.is_system) return false;
      if (activeTab === "custom" && r.is_system) return false;

      // Search filter
      if (!q) return true;
      return (
        r.nama_role.toLowerCase().includes(q) ||
        r.kode_role.toLowerCase().includes(q)
      );
    });
  }, [roles, activeTab, searchQuery]);

  // Stats calculation
  const totalRoles = roles.length;
  const systemRolesCount = roles.filter((r) => r.is_system).length;
  const customRolesCount = roles.filter((r) => !r.is_system).length;

  const handleCreateSubmit = async (data: { nama_role: string; kode_role: string }) => {
    await createRoleMutation.mutateAsync(data);
    setIsCreateOpen(false);
  };

  const handleEditSubmit = async (data: { nama_role: string; kode_role: string }) => {
    if (!editingRole) return;
    await updateRoleMutation.mutateAsync({
      id_role: editingRole.id_role,
      payload: data,
    });
    setEditingRole(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRole) return;
    await deleteRoleMutation.mutateAsync(deletingRole.id_role);
    setDeletingRole(null);
  };

  const handleSavePermissions = async () => {
    if (!managingPermissionsRole) return;
    await updateRolePermissionsMutation.mutateAsync({
      id_role: managingPermissionsRole.id_role,
      permissions: selectedPermissionCodes,
    });
    setManagingPermissionsRole(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Shield className="h-6 w-6 text-primary" />
            Kelola Role & Perizinan
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Atur peran pengguna (roles) dan matriks hak akses perizinan (permissions) dalam sistem.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Tambah Role Kustom
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card shadow-xs">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Role
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalRoles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Role terdaftar untuk instansi ini
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-xs">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Role Sistem
            </CardTitle>
            <Lock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">
              {systemRolesCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Role bawaan inti yang dilindungi
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-xs">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Role Kustom
            </CardTitle>
            <Sliders className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
              {customRolesCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Role fleksibel buatan admin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">Daftar Role</CardTitle>
            <CardDescription className="text-xs">
              Klik &quot;Atur Hak Akses&quot; untuk mengonfigurasi matriks perizinan setiap role.
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Tabs Filter */}
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as any)}
              className="w-auto"
            >
              <TabsList className="grid grid-cols-3 h-9">
                <TabsTrigger value="all" className="text-xs">
                  Semua ({totalRoles})
                </TabsTrigger>
                <TabsTrigger value="system" className="text-xs">
                  Sistem ({systemRolesCount})
                </TabsTrigger>
                <TabsTrigger value="custom" className="text-xs">
                  Kustom ({customRolesCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau kode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-destructive text-sm">
              Gagal memuat data role. Pastikan Anda memiliki hak akses.
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-2">
              <ShieldAlert className="h-10 w-10 text-muted-foreground/50 mx-auto" />
              <p className="font-medium text-sm">Tidak ada role yang ditemukan</p>
              <p className="text-xs">
                {searchQuery
                  ? `Tidak ada hasil untuk pencarian "${searchQuery}"`
                  : "Belum ada role yang terdaftar."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Nama Role</TableHead>
                    <TableHead>Kode Role</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead className="text-center">Pengguna Terkait</TableHead>
                    <TableHead className="text-center">Izin Aktif</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role, idx) => {
                    const assignedUsersCount = role._count?.user_roles ?? 0;
                    const permissionsCount = role.permissions?.length ?? 0;

                    return (
                      <TableRow key={role.id_role} className="hover:bg-muted/20">
                        <TableCell className="text-center text-xs text-muted-foreground font-mono">
                          {idx + 1}
                        </TableCell>

                        <TableCell>
                          <div className="font-medium text-sm text-foreground flex items-center gap-2">
                            {role.is_system ? (
                              <ShieldCheck className="h-4 w-4 text-amber-500 shrink-0" />
                            ) : (
                              <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
                            )}
                            <span>{role.nama_role}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <code className="px-2 py-0.5 rounded bg-muted text-xs font-mono font-medium text-muted-foreground">
                            {role.kode_role}
                          </code>
                        </TableCell>

                        <TableCell>
                          {role.is_system ? (
                            <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[11px] font-normal"
                            >
                              Sistem
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[11px] font-normal"
                            >
                              Kustom
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>{assignedUsersCount} user</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs px-2 py-0.5"
                          >
                            {role.kode_role === "SUPERADMIN"
                              ? "Semua (Full)"
                              : `${permissionsCount} izin`}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenPermissions(role)}
                              className="h-8 text-xs gap-1.5 cursor-pointer"
                            >
                              <Key className="h-3.5 w-3.5 text-primary" />
                              <span className="hidden sm:inline">Hak Akses</span>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 cursor-pointer"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  onClick={() => handleOpenPermissions(role)}
                                  className="gap-2 text-xs cursor-pointer"
                                >
                                  <Key className="h-3.5 w-3.5" />
                                  Atur Hak Akses
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => setEditingRole(role)}
                                  className="gap-2 text-xs cursor-pointer"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                  Edit Nama / Kode
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {role.is_system ? (
                                  <DropdownMenuItem
                                    disabled
                                    className="gap-2 text-xs text-muted-foreground cursor-not-allowed"
                                  >
                                    <Lock className="h-3.5 w-3.5" />
                                    Role Sistem (Terkunci)
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => setDeletingRole(role)}
                                    className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Hapus Role
                                  </DropdownMenuItem>
                                )}
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

      {/* Dialog: Create Custom Role */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Buat Role Kustom Baru
            </DialogTitle>
            <DialogDescription className="text-xs">
              Tambahkan role baru sesuai kebutuhan struktur organisasi lembaga Anda.
            </DialogDescription>
          </DialogHeader>

          <RoleForm
            isSubmitting={createRoleMutation.isPending}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog: Edit Role */}
      <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" />
              Edit Informasi Role
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ubah nama atau kode identitas role.
            </DialogDescription>
          </DialogHeader>

          {editingRole && (
            <RoleForm
              initialData={{
                nama_role: editingRole.nama_role,
                kode_role: editingRole.kode_role,
                is_system: editingRole.is_system,
              }}
              isEdit
              isSubmitting={updateRoleMutation.isPending}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingRole(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog: Permission Matrix Configuration */}
      <Dialog
        open={!!managingPermissionsRole}
        onOpenChange={(open) => !open && setManagingPermissionsRole(null)}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Key className="h-5 w-5 text-primary" />
                  Konfigurasi Hak Akses: {managingPermissionsRole?.nama_role}
                </DialogTitle>
                <DialogDescription className="text-xs mt-1">
                  Pilih hak akses (permissions) granular yang diizinkan untuk role{" "}
                  <code className="font-mono font-medium text-foreground bg-muted px-1.5 py-0.5 rounded">
                    {managingPermissionsRole?.kode_role}
                  </code>
                </DialogDescription>
              </div>

              {managingPermissionsRole?.is_system && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">
                  Role Sistem
                </Badge>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoadingPermissions ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Memuat daftar izin...</p>
              </div>
            ) : (
              <PermissionMatrix
                selectedCodes={selectedPermissionCodes}
                onChange={setSelectedPermissionCodes}
                readOnly={managingPermissionsRole?.kode_role === "SUPERADMIN"}
              />
            )}
          </div>

          <div className="p-4 border-t bg-muted/30 flex items-center justify-between shrink-0">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>
                <strong>{selectedPermissionCodes.length}</strong> hak akses aktif
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setManagingPermissionsRole(null)}
                disabled={updateRolePermissionsMutation.isPending}
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleSavePermissions}
                disabled={
                  updateRolePermissionsMutation.isPending ||
                  managingPermissionsRole?.kode_role === "SUPERADMIN"
                }
              >
                {updateRolePermissionsMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan Hak Akses
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog: Confirm Delete Role */}
      <AlertDialog
        open={!!deletingRole}
        onOpenChange={(open) => !open && setDeletingRole(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Hapus Role Kustom?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Apakah Anda yakin ingin menghapus role{" "}
                <strong>&quot;{deletingRole?.nama_role}&quot;</strong> (
                <code className="font-mono text-xs">{deletingRole?.kode_role}</code>)?
              </p>
              {deletingRole?._count?.user_roles && deletingRole._count.user_roles > 0 ? (
                <p className="text-destructive font-medium text-xs bg-destructive/10 p-2 rounded">
                  Peringatan: Ada {deletingRole._count.user_roles} pengguna yang sedang
                  menggunakan role ini. Menghapus role ini akan mencabut akses terkait dari
                  pengguna tersebut.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteRoleMutation.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteRoleMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRoleMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Hapus Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default KelolaRolePage;
