import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Search,
  Key,
  Trash,
  Building,
  Shield,
  User,
  LogIn,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { authService } from "@/features/auth/api/authService";
import { sekolahService } from "@/features/sekolah/api/sekolahService";
import { useAuth } from "@/features/auth/components/auth-provider";
import { type Sekolah } from "@/types/domain/sekolah";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "@/types/domain/enums";

interface GlobalUser {
  id_user: number;
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
  id_sekolah: number | null;
  nomor_telepon?: string | null;
  sekolah: {
    nama_sekolah: string;
  } | null;
}

const formatWhatsApp = (phone: string | null | undefined) => {
  if (!phone) return "#";
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  return `https://wa.me/${cleaned}`;
};

const PAGE_SIZE = 10;

export default function KelolaUserPage() {
  const navigate = useNavigate();
  const { user: currentUser, impersonate } = useAuth();

  // Data States
  const [users, setUsers] = useState<GlobalUser[]>([]);
  const [schools, setSchools] = useState<Sekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [schoolFilter, setSchoolFilter] = useState<string>("ALL");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));

  // Dialog States
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GlobalUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<GlobalUser | null>(null);
  const [emailConfirmation, setEmailConfirmation] = useState("");

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, schoolFilter]);

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, schoolFilter, showAll]);

  const fetchSchools = async () => {
    try {
      const res = await sekolahService.getAll({ limit: 100 });
      if (res.success) {
        setSchools(res.data || []);
      }
    } catch (error) {
      console.error("Gagal memuat daftar sekolah:", error);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: showAll ? 1 : page,
        limit: showAll ? 1000 : PAGE_SIZE,
        search: search.trim() || undefined,
        role: roleFilter !== "ALL" ? roleFilter : undefined,
        id_sekolah: schoolFilter !== "ALL" ? parseInt(schoolFilter) : undefined,
      };

      const res = await authService.getAllUsers(params);
      if (res.success) {
        setUsers(res.data || []);
        setTotalUsers(res.pagination?.total ?? res.data?.length ?? 0);
      } else {
        toast.error(res.message || "Gagal memuat data pengguna");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data pengguna");
    } finally {
      setIsLoading(false);
    }
  };

  // ── IMPERSONATION ──
  const handleImpersonate = async (targetUser: GlobalUser) => {
    if (targetUser.id_user === currentUser?.id_user) {
      toast.error("Anda tidak dapat mengimpersonasi diri sendiri");
      return;
    }

    const confirmToast = toast.loading(`Mempersiapkan impersonasi sebagai ${targetUser.name}...`);
    try {
      const res = await authService.impersonateUser(targetUser.id_user);
      if (res.success && res.data) {
        toast.dismiss(confirmToast);
        toast.success(`Berhasil login sebagai ${targetUser.name}`);

        const impersonatedUserData = {
          id_user: res.data.user.id_user,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
          id_sekolah: res.data.user.id_sekolah,
          has_halaqah: !!(res.data.user as any).halaqah,
          token: res.data.token,
        } as any;

        // Trigger impersonate session in provider
        await impersonate(impersonatedUserData, currentUser!);

        // Redirect based on role
        if (targetUser.role === Role.SUPERADMIN) {
          navigate("/superadmin");
        } else if (targetUser.role === Role.ADMIN || targetUser.role === Role.KOORDINATOR_TAHFIZ) {
          navigate("/kepala-muhafidz");
        } else {
          navigate("/muhafidz");
        }
      } else {
        toast.dismiss(confirmToast);
        toast.error(res.message || "Gagal melakukan impersonasi");
      }
    } catch (error: unknown) {
      toast.dismiss(confirmToast);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    }
  };

  // ── VERIFY EMAIL ──
  const handleVerifyEmail = async (id: number) => {
    try {
      const res = await authService.verifyUser(id);
      if (res.success) {
        toast.success("Email pengguna berhasil diverifikasi secara manual!");
        fetchUsers();
      } else {
        toast.error(res.message || "Gagal memverifikasi email");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    }
  };

  // ── PASSWORD RESET ──
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const res = await authService.resetPassword(selectedUser.id_user, { password: newPassword });
      if (res.success) {
        toast.success(`Password untuk ${selectedUser.name} berhasil diperbarui!`);
        setIsPasswordOpen(false);
        setNewPassword("");
      } else {
        toast.error(res.message || "Gagal mereset password");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── DELETE USER ──
  const handleDeleteSubmit = async () => {
    if (!userToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await authService.deleteUser(userToDelete.id_user);
      if (res.success) {
        toast.success("Pengguna berhasil dihapus!");
        setIsDeleteOpen(false);
        setUserToDelete(null);
        setEmailConfirmation("");
        fetchUsers();
      } else {
        toast.error(res.message || "Gagal menghapus pengguna");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola Pengguna</h1>
          <p className="text-muted-foreground">
            Direktori global seluruh pengguna dan hak akses di platform Halaqah.id
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid gap-4 md:grid-cols-3 items-end">
        <div className="space-y-2">
          <Label htmlFor="search">Cari Pengguna</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Cari..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Filter Peran</Label>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Semua Peran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Peran</SelectItem>
              <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
              <SelectItem value="ADMIN">Admin Sekolah</SelectItem>
              <SelectItem value="KOORDINATOR_TAHFIZ">Koordinator Tahfiz</SelectItem>
              <SelectItem value="MUHAFIZ">Muhafiz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="school">Filter Sekolah</Label>
          <Select value={schoolFilter} onValueChange={setSchoolFilter}>
            <SelectTrigger id="school">
              <SelectValue placeholder="Semua Sekolah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Sekolah</SelectItem>
              {schools.map((s) => (
                <SelectItem key={s.id_sekolah} value={s.id_sekolah.toString()}>
                  {s.nama_sekolah}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Pengguna Global</CardTitle>
          <CardDescription>Menampilkan total {totalUsers} pengguna aktif di sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%] min-w-[150px]">Nama & Email</TableHead>
                <TableHead className="w-[18%] min-w-[140px]">Nomor Telepon</TableHead>
                <TableHead className="w-[17%] min-w-[120px]">Peran</TableHead>
                <TableHead className="w-[20%] min-w-[140px]">Lembaga / Sekolah</TableHead>
                <TableHead className="w-[10%] min-w-[100px]">Status Email</TableHead>
                <TableHead className="text-right w-[10%] min-w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Memuat data pengguna...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Tidak ditemukan data pengguna yang cocok
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id_user}>
                    <TableCell>
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </TableCell>
                    <TableCell>
                      {u.nomor_telepon ? (
                        <a
                          href={formatWhatsApp(u.nomor_telepon)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary hover:underline hover:text-primary/80 transition-colors text-xs md:text-sm"
                        >
                          <FontAwesomeIcon icon={faWhatsapp} />
                          <span>{u.nomor_telepon}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === "SUPERADMIN"
                          ? "bg-red-500/10 text-red-600"
                          : u.role === "ADMIN"
                            ? "bg-blue-500/10 text-blue-600"
                            : u.role === "KOORDINATOR_TAHFIZ"
                              ? "bg-purple-500/10 text-purple-600"
                              : "bg-green-500/10 text-green-600"
                      }`}>
                        {u.role === "SUPERADMIN" ? (
                          <Shield className="mr-1 h-3.5 w-3.5" />
                        ) : (
                          <User className="mr-1 h-3.5 w-3.5" />
                        )}
                        {u.role.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {u.sekolah ? (
                        <div className="flex items-center gap-1.5 text-sm">
                          <Building className="text-slate-400 h-4 w-4" />
                          {u.sekolah.nama_sekolah}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Platform (Global)</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {u.is_verified ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600">
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600">
                          Belum Verifikasi
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {u.id_user !== currentUser?.id_user && u.role !== "SUPERADMIN" && (
                            <DropdownMenuItem
                              onClick={() => handleImpersonate(u)}
                              className="cursor-pointer"
                            >
                              <LogIn className="mr-2 h-4 w-4" />
                              Login As
                            </DropdownMenuItem>
                          )}
                          {!u.is_verified && (
                            <DropdownMenuItem
                              onClick={() => handleVerifyEmail(u.id_user)}
                              className="cursor-pointer"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Verifikasi Manual
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(u);
                              setIsPasswordOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          {u.id_user !== currentUser?.id_user && u.role !== "SUPERADMIN" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setUserToDelete(u);
                                  setIsDeleteOpen(true);
                                  setEmailConfirmation("");
                                }}
                                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Hapus Pengguna
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          {(totalUsers > PAGE_SIZE || showAll) && (
            <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10 mt-4 rounded-xl">
              <div className="text-xs text-muted-foreground">
                {showAll ? (
                  <span>Menampilkan semua <strong>{totalUsers}</strong> pengguna</span>
                ) : (
                  <span>
                    Menampilkan <strong>{Math.min((page - 1) * PAGE_SIZE + 1, totalUsers)}</strong> -{" "}
                    <strong>{Math.min(page * PAGE_SIZE, totalUsers)}</strong> dari{" "}
                    <strong>{totalUsers}</strong> pengguna
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8 px-3"
                  onClick={() => {
                    setShowAll(!showAll);
                    setPage(1);
                  }}
                >
                  {showAll ? "Batasi 10 per Halaman" : "Tampilkan Semua"}
                </Button>
                
                {!showAll && totalPages > 1 && (
                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3"
                      disabled={page === 1}
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    >
                      Sebelumnya
                    </Button>
                    <span className="text-xs text-muted-foreground min-w-[45px] text-center">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3"
                      disabled={page === totalPages}
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DIALOG RESET PASSWORD */}
      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reset Password Pengguna</DialogTitle>
            <DialogDescription>
              Ubah kata sandi login untuk pengguna <strong>{selectedUser?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="new_password">Password Baru <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsPasswordOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Password Baru"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG CONFIRM DELETE */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Hapus Akun Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus akun milik <strong>{userToDelete?.name}</strong> secara permanen?
            </DialogDescription>
          </DialogHeader>

          <div className="bg-destructive/10 p-3 rounded-lg text-xs text-destructive border border-destructive/20 my-2">
            <strong>Perhatian:</strong> Tindakan ini akan menghentikan seluruh akses pengguna dan tidak dapat dibatalkan.
          </div>

          <div className="space-y-2 py-2">
            <Label htmlFor="email_confirm" className="text-xs">
              Ketik email pengguna <strong>{userToDelete?.email}</strong> untuk mengonfirmasi:
            </Label>
            <Input
              id="email_confirm"
              type="text"
              placeholder="Ketik email di sini..."
              value={emailConfirmation}
              onChange={(e) => setEmailConfirmation(e.target.value)}
              className="h-9"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={isSubmitting || emailConfirmation.trim() !== userToDelete?.email}
            >
              {isSubmitting ? "Menghapus..." : "Ya, Hapus Pengguna"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
