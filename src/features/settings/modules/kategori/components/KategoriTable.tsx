import { Edit2, Trash2, Layers, CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { KategoriSetoran } from "../types/kategori.types";

interface KategoriTableProps {
  kategoriList: KategoriSetoran[];
  isLoading: boolean;
  error: Error | null | unknown;
  handleOpenEdit: (kat: KategoriSetoran) => void;
  handleOpenDelete: (kat: KategoriSetoran) => void;
}

export function KategoriTable({
  kategoriList,
  isLoading,
  error,
  handleOpenEdit,
  handleOpenDelete,
}: KategoriTableProps) {
  if (isLoading) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        Memuat kategori...
      </div>
    );
  }

  if (error) {
    const errorMsg = error instanceof Error ? error.message : "Terjadi kesalahan";
    return (
      <div className="p-10 text-center text-sm text-destructive font-medium">
        Gagal memuat kategori setoran: {errorMsg}
      </div>
    );
  }

  if (kategoriList.length === 0) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground space-y-2">
        <Layers className="h-8 w-8 mx-auto opacity-30 text-muted-foreground" />
        <p className="font-medium">Belum ada kategori setoran kustom</p>
        <p className="text-xs">Klik tombol &quot;Tambah Kategori&quot; di atas untuk membuat.</p>
      </div>
    );
  }

  return (
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
  );
}
