import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { KategoriSetoran } from "../types/kategori.types";

interface KategoriDialogsProps {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedKategori: KategoriSetoran | null;
  namaKategori: string;
  setNamaKategori: (val: string) => void;
  deskripsi: string;
  setDeskripsi: (val: string) => void;
  perluValidasiUrutan: boolean;
  setPerluValidasiUrutan: (val: boolean) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  handleCreate: (e: React.FormEvent) => void;
  handleUpdate: (e: React.FormEvent) => void;
  handleDelete: () => void;
}

export function KategoriDialogs({
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
  isCreating,
  isUpdating,
  isDeleting,
  handleCreate,
  handleUpdate,
  handleDelete,
}: KategoriDialogsProps) {
  return (
    <>
      {/* ── DIALOG: TAMBAH ── */}
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
              <Button type="submit" size="sm" disabled={isCreating} className="text-xs h-8.5 font-semibold">
                {isCreating ? "Menyimpan..." : "Simpan Kategori"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── DIALOG: UBAH ── */}
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
              <Button type="submit" size="sm" disabled={isUpdating} className="text-xs h-8.5 font-semibold">
                {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── DIALOG: HAPUS ── */}
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
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs h-8.5 font-semibold"
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
