import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Plus, Edit2, Trash2, Layers, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { sekolahService } from "@/features/sekolah/api/sekolahService";
import { toast } from "sonner";

interface KategoriSetoran {
  id_kategori: number;
  nama_kategori: string;
  deskripsi: string | null;
  perlu_validasi_urutan: boolean;
}

export default function KategoriSettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedKategori, setSelectedKategori] = useState<KategoriSetoran | null>(null);
  
  // Form State
  const [namaKategori, setNamaKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [perluValidasiUrutan, setPerluValidasiUrutan] = useState(false);

  // Fetch Kategori Data
  const { data: kategoriList = [], isLoading, error } = useQuery<KategoriSetoran[]>({
    queryKey: ["kategori-setoran"],
    queryFn: async () => {
      const res = await sekolahService.getKategori();
      return res.data || [];
    }
  });

  // Mutation: Create
  const createMutation = useMutation({
    mutationFn: (data: { nama_kategori: string; deskripsi?: string; perlu_validasi_urutan?: boolean }) => 
      sekolahService.createKategori(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori-setoran"] });
      toast.success("Kategori setoran berhasil ditambahkan!");
      resetForm();
      setIsCreateOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menambahkan kategori");
    }
  });

  // Mutation: Update
  const updateMutation = useMutation({
    mutationFn: (args: { id: number; data: { nama_kategori?: string; deskripsi?: string | null; perlu_validasi_urutan?: boolean } }) => 
      sekolahService.updateKategori(args.id, args.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori-setoran"] });
      toast.success("Kategori setoran berhasil diperbarui!");
      resetForm();
      setIsEditOpen(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal memperbarui kategori");
    }
  });

  // Mutation: Delete
  const deleteMutation = useMutation({
    mutationFn: (id: number) => sekolahService.deleteKategori(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori-setoran"] });
      toast.success("Kategori setoran berhasil dihapus!");
      setIsDeleteOpen(false);
      setSelectedKategori(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Gagal menghapus kategori");
    }
  });

  const resetForm = () => {
    setNamaKategori("");
    setDeskripsi("");
    setPerluValidasiUrutan(false);
    setSelectedKategori(null);
  };

  const handleOpenEdit = (kat: KategoriSetoran) => {
    setSelectedKategori(kat);
    setNamaKategori(kat.nama_kategori);
    setDeskripsi(kat.deskripsi || "");
    setPerluValidasiUrutan(kat.perlu_validasi_urutan);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (kat: KategoriSetoran) => {
    setSelectedKategori(kat);
    setIsDeleteOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKategori.trim()) {
      toast.warning("Nama kategori tidak boleh kosong");
      return;
    }
    createMutation.mutate({
      nama_kategori: namaKategori,
      deskripsi: deskripsi || undefined,
      perlu_validasi_urutan: perluValidasiUrutan
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKategori) return;
    if (!namaKategori.trim()) {
      toast.warning("Nama kategori tidak boleh kosong");
      return;
    }
    updateMutation.mutate({
      id: selectedKategori.id_kategori,
      data: {
        nama_kategori: namaKategori,
        deskripsi: deskripsi || null,
        perlu_validasi_urutan: perluValidasiUrutan
      }
    });
  };

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
          {isLoading ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Memuat kategori...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-sm text-destructive font-medium">
              Gagal memuat kategori setoran: {error.message}
            </div>
          ) : kategoriList.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground space-y-2">
              <Layers className="h-8 w-8 mx-auto opacity-30 text-muted-foreground" />
              <p className="font-medium">Belum ada kategori setoran kustom</p>
              <p className="text-xs">Klik tombol &quot;Tambah Kategori&quot; di atas untuk membuat.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-1/4 font-semibold text-xs">Nama Kategori</TableHead>
                  <TableHead className="w-2/5 font-semibold text-xs">Deskripsi</TableHead>
                  <TableHead className="w-1/5 font-semibold text-xs text-center">Validasi Urutan</TableHead>
                  <TableHead className="w-[120px] font-semibold text-xs text-right pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kategoriList.map((kat) => (
                  <TableRow key={kat.id_kategori} className="transition-all hover:bg-muted/10">
                    <TableCell className="font-bold text-sm text-foreground py-3.5">
                      {kat.nama_kategori}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3.5 max-w-[300px] truncate">
                      {kat.deskripsi || "—"}
                    </TableCell>
                    <TableCell className="text-center py-3.5">
                      {kat.perlu_validasi_urutan ? (
                        <Badge variant="default" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                          <CheckCircle2 className="h-3 w-3 mr-1 inline" /> Aktif
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-muted-foreground border-transparent text-[10px] px-2 py-0.5 rounded-full font-medium">
                          Tidak
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-3.5 pr-6">
                      <div className="flex justify-end items-center gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenEdit(kat)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Ubah"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenDelete(kat)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── DIALOG: TAMBAH ────────────────────────────────────────────────── */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Tambah Kategori Baru</DialogTitle>
              <DialogDescription className="text-xs">
                Buat kategori setoran hafalan baru untuk sekolah ini.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="create-nama" className="text-xs font-semibold">Nama Kategori</Label>
                <Input 
                  id="create-nama" 
                  value={namaKategori} 
                  onChange={(e) => setNamaKategori(e.target.value)}
                  placeholder="Contoh: Ziyadah Harian, Murajaah Akbar"
                  className="h-9 text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-deskripsi" className="text-xs font-semibold">Deskripsi (Opsional)</Label>
                <Textarea 
                  id="create-deskripsi" 
                  value={deskripsi} 
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Keterangan mengenai kategori ini..."
                  className="text-sm min-h-[80px]"
                />
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Checkbox 
                  id="create-validasi" 
                  checked={perluValidasiUrutan} 
                  onCheckedChange={(checked) => setPerluValidasiUrutan(!!checked)}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label htmlFor="create-validasi" className="text-xs font-semibold block cursor-pointer">
                    Validasi Urutan (Sequence Validation)
                  </Label>
                  <span className="text-[10px] text-muted-foreground block leading-tight">
                    Jika dicentang, setoran berikutnya dalam kategori ini harus berlanjut tepat dari ayat terakhir setoran sebelumnya.
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)} className="text-xs h-8.5">
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={createMutation.isPending} className="text-xs h-8.5 font-semibold">
                {createMutation.isPending ? "Menyimpan..." : "Simpan Kategori"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── DIALOG: UBAH ────────────────────────────────────────────────── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleUpdate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Ubah Kategori</DialogTitle>
              <DialogDescription className="text-xs">
                Perbarui detail kategori setoran.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="edit-nama" className="text-xs font-semibold">Nama Kategori</Label>
                <Input 
                  id="edit-nama" 
                  value={namaKategori} 
                  onChange={(e) => setNamaKategori(e.target.value)}
                  placeholder="Nama Kategori"
                  className="h-9 text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-deskripsi" className="text-xs font-semibold">Deskripsi (Opsional)</Label>
                <Textarea 
                  id="edit-deskripsi" 
                  value={deskripsi} 
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Keterangan..."
                  className="text-sm min-h-[80px]"
                />
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Checkbox 
                  id="edit-validasi" 
                  checked={perluValidasiUrutan} 
                  onCheckedChange={(checked) => setPerluValidasiUrutan(!!checked)}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label htmlFor="edit-validasi" className="text-xs font-semibold block cursor-pointer">
                    Validasi Urutan (Sequence Validation)
                  </Label>
                  <span className="text-[10px] text-muted-foreground block leading-tight">
                    Jika dicentang, setoran berikutnya dalam kategori ini harus berlanjut tepat dari ayat terakhir setoran sebelumnya.
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)} className="text-xs h-8.5">
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={updateMutation.isPending} className="text-xs h-8.5 font-semibold">
                {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── DIALOG: HAPUS (CONFIRMATION) ─────────────────────────────────── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Hapus Kategori?
            </DialogTitle>
            <DialogDescription className="text-xs pt-1.5 leading-relaxed">
              Apakah Anda yakin ingin menghapus kategori <strong>&quot;{selectedKategori?.nama_kategori}&quot;</strong>?
              <br />
              <span className="text-muted-foreground block mt-1.5 text-[11px] bg-muted/40 p-2 rounded border border-border">
                <strong>Catatan:</strong> Penghapusan ini bersifat aman. Riwayat setoran lama yang telah dicatat di bawah kategori ini tidak akan hilang dari database. Namun, kategori ini tidak dapat dipilih lagi untuk setoran baru.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-3">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)} className="text-xs h-8.5">
              Batal
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => selectedKategori && deleteMutation.mutate(selectedKategori.id_kategori)}
              disabled={deleteMutation.isPending}
              className="text-xs h-8.5 font-semibold"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
