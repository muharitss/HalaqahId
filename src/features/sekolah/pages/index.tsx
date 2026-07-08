import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBuilding, faPen, faTrash, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { sekolahService } from "@/features/sekolah/api/sekolahService";
import { type Sekolah } from "@/types/domain/sekolah";
import { toast } from "sonner";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function KelolaSekolahPage() {
  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Add State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama_sekolah: "",
    jenis_lembaga: "",
    alamat: "",
    admin_name: "",
    admin_email: "",
    admin_password: "",
  });

  // Modal Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSekolah, setSelectedSekolah] = useState<Sekolah | null>(null);
  const [editFormData, setEditFormData] = useState({
    nama_sekolah: "",
    jenis_lembaga: "",
    alamat: "",
  });

  // Modal Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sekolahToDelete, setSekolahToDelete] = useState<Sekolah | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    fetchSekolah();
  }, []);

  const fetchSekolah = async () => {
    setIsLoading(true);
    try {
      const res = await sekolahService.getAll();
      if (res.success) {
        setSekolahList(res.data || []);
      } else {
        toast.error(res.message || "Gagal memuat data sekolah");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data sekolah");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await sekolahService.createSekolah(formData);
      if (res.success) {
        toast.success("Sekolah & Admin berhasil dibuat!");
        setIsAddOpen(false);
        setFormData({
          nama_sekolah: "",
          jenis_lembaga: "",
          alamat: "",
          admin_name: "",
          admin_email: "",
          admin_password: "",
        });
        fetchSekolah();
      } else {
        toast.error(res.message || "Gagal membuat sekolah");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (sekolah: Sekolah) => {
    setSelectedSekolah(sekolah);
    setEditFormData({
      nama_sekolah: sekolah.nama_sekolah,
      jenis_lembaga: sekolah.jenis_lembaga || "",
      alamat: sekolah.alamat || "",
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSekolah) return;
    setIsSubmitting(true);
    try {
      const res = await sekolahService.updateSekolah(selectedSekolah.id_sekolah, {
        nama_sekolah: editFormData.nama_sekolah,
        jenis_lembaga: editFormData.jenis_lembaga as any,
        alamat: editFormData.alamat,
      });
      if (res.success) {
        toast.success("Data sekolah berhasil diperbarui!");
        setIsEditOpen(false);
        fetchSekolah();
      } else {
        toast.error(res.message || "Gagal memperbarui data sekolah");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (sekolah: Sekolah) => {
    setSekolahToDelete(sekolah);
    setDeleteConfirmText("");
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sekolahToDelete) return;
    if (deleteConfirmText !== sekolahToDelete.nama_sekolah) {
      toast.error("Nama sekolah yang Anda masukkan tidak cocok!");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await sekolahService.deleteSekolah(sekolahToDelete.id_sekolah);
      if (res.success) {
        toast.success("Sekolah berhasil dinonaktifkan!");
        setIsDeleteOpen(false);
        setSekolahToDelete(null);
        fetchSekolah();
      } else {
        toast.error(res.message || "Gagal menghapus sekolah");
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola Sekolah</h1>
          <p className="text-muted-foreground">
            Daftar tenant sekolah yang menggunakan Halaqah.id
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
          Tambah Sekolah & Admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Sekolah</CardTitle>
          <CardDescription>Menampilkan daftar semua tenant sekolah di sistem</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Sekolah</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Memuat data sekolah...
                    </TableCell>
                  </TableRow>
                ) : sekolahList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Belum ada data sekolah
                    </TableCell>
                  </TableRow>
                ) : (
                  sekolahList.map((sekolah) => (
                    <TableRow key={sekolah.id_sekolah}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                            {sekolah.logo_url ? (
                              <img
                                src={sekolah.logo_url}
                                alt={sekolah.nama_sekolah}
                                className="h-full w-full object-contain bg-white p-0.5"
                              />
                            ) : (
                              <FontAwesomeIcon icon={faBuilding} className="text-primary" />
                            )}
                          </div>
                          {sekolah.nama_sekolah}
                        </div>
                      </TableCell>
                      <TableCell>{sekolah.alamat || "-"}</TableCell>
                      <TableCell>{sekolah.email || "-"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleEditClick(sekolah)}
                              className="cursor-pointer"
                            >
                              <FontAwesomeIcon icon={faPen} className="h-3 w-3 mr-2" />
                              Ubah
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(sekolah)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <FontAwesomeIcon icon={faTrash} className="h-3 w-3 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>

      {/* MODAL ADD SEKOLAH */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Sekolah & Admin</DialogTitle>
            <DialogDescription>
              Buat tenant sekolah baru beserta akun Administrator utamanya.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-5 py-4">
            {/* DATA SEKOLAH */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold border-b pb-1 text-primary">Informasi Sekolah</h3>
              <div className="grid gap-2">
                <Label htmlFor="nama_sekolah">Nama Sekolah <span className="text-destructive">*</span></Label>
                <Input
                  id="nama_sekolah"
                  required
                  placeholder="Contoh: Pesantren Daarul Qur'an"
                  value={formData.nama_sekolah}
                  onChange={(e) => setFormData({ ...formData, nama_sekolah: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="jenis_lembaga">Jenis Lembaga</Label>
                <Select
                  value={formData.jenis_lembaga}
                  onValueChange={(val) => setFormData({ ...formData, jenis_lembaga: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis lembaga" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PESANTREN">Pesantren</SelectItem>
                    <SelectItem value="MADRASAH">Madrasah</SelectItem>
                    <SelectItem value="SEKOLAH_UMUM">Sekolah Umum</SelectItem>
                    <SelectItem value="TPA">TPA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Input
                  id="alamat"
                  placeholder="Contoh: Jl. Sukamaju No. 12, Bandung"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                />
              </div>
            </div>

            {/* DATA ADMIN */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold border-b pb-1 text-primary">Akun Administrator Utama</h3>
              <div className="grid gap-2">
                <Label htmlFor="admin_name">Nama Lengkap Admin <span className="text-destructive">*</span></Label>
                <Input
                  id="admin_name"
                  required
                  placeholder="Contoh: Muhammad Akhyar"
                  value={formData.admin_name}
                  onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="admin_email">Email Admin <span className="text-destructive">*</span></Label>
                <Input
                  id="admin_email"
                  type="email"
                  required
                  placeholder="Contoh: admin.daurulquran@halaqah.id"
                  value={formData.admin_email}
                  onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="admin_password">Password Admin <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Input
                    id="admin_password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Minimal 6 karakter"
                    value={formData.admin_password}
                    onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon 
                      icon={showPassword ? faEyeSlash : faEye} 
                      className="h-4 w-4 text-muted-foreground" 
                    />
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan & Buat Admin"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL EDIT SEKOLAH */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ubah Profil Sekolah</DialogTitle>
            <DialogDescription>
              Ubah data sekolah tenant yang menggunakan platform ini.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 py-3">
            <div className="grid gap-2">
              <Label htmlFor="edit_nama_sekolah">Nama Sekolah <span className="text-destructive">*</span></Label>
              <Input
                id="edit_nama_sekolah"
                required
                value={editFormData.nama_sekolah}
                onChange={(e) => setEditFormData({ ...editFormData, nama_sekolah: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_jenis_lembaga">Jenis Lembaga</Label>
              <Select
                value={editFormData.jenis_lembaga}
                onValueChange={(val) => setEditFormData({ ...editFormData, jenis_lembaga: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis lembaga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PESANTREN">Pesantren</SelectItem>
                  <SelectItem value="MADRASAH">Madrasah</SelectItem>
                  <SelectItem value="SEKOLAH_UMUM">Sekolah Umum</SelectItem>
                  <SelectItem value="TPA">TPA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit_alamat">Alamat</Label>
              <Input
                id="edit_alamat"
                value={editFormData.alamat}
                onChange={(e) => setEditFormData({ ...editFormData, alamat: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL DELETE SEKOLAH */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <FontAwesomeIcon icon={faTrash} />
              Konfirmasi Hapus Sekolah
            </DialogTitle>
            <DialogDescription>
              Tindakan ini akan menonaktifkan sekolah dan menonaktifkan seluruh akun Muhafiz, Halaqah, serta data Santri di bawah sekolah ini.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDeleteSubmit} className="space-y-4 py-2">
            <div className="bg-destructive/10 p-3 rounded-lg text-sm text-destructive border border-destructive/20">
              <strong>Peringatan!</strong> Seluruh akses pengguna di bawah sekolah <strong>{sekolahToDelete?.nama_sekolah}</strong> akan ditutup setelah penghapusan ini.
            </div>

            <div className="grid gap-2">
              <Label htmlFor="delete_confirm_text">
                Ketik kembali nama sekolah untuk konfirmasi: <br />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {sekolahToDelete?.nama_sekolah}
                </span>
              </Label>
              <Input
                id="delete_confirm_text"
                required
                placeholder="Masukkan nama sekolah dengan tepat"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isSubmitting || deleteConfirmText !== sekolahToDelete?.nama_sekolah}
              >
                {isSubmitting ? "Menghapus..." : "Ya, Hapus Permanen"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
