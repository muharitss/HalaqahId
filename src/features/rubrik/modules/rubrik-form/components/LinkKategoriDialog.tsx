import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { sekolahService, type KategoriSetoranResponse } from "@/features/sekolah";
import { useRubrikMutations } from "../../../api/mutations/useRubrikMutations";
import type { RubrikTemplate, LinkedKategori } from "../../../types";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { Layers } from "lucide-react";

interface LinkKategoriDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rubrik: RubrikTemplate | null;
}

export function LinkKategoriDialog({
  open,
  onOpenChange,
  rubrik,
}: LinkKategoriDialogProps) {
  const { linkKategoriMutation, unlinkKategoriMutation } = useRubrikMutations();
  const [processingId, setProcessingId] = useState<number | null>(null);

  const { data: kategoriList = [], isLoading } = useQuery<KategoriSetoranResponse[]>({
    queryKey: ["kategori-setoran"],
    queryFn: async () => {
      const res = await sekolahService.getKategori();
      return res.data || [];
    },
    enabled: open && !!rubrik,
  });

  if (!rubrik) return null;

  const linkedCategoryIds = new Set(
    rubrik.kategori?.map((k: LinkedKategori) => k.id_kategori) || []
  );

  const handleToggle = async (kategori: KategoriSetoranResponse) => {
    const isCurrentlyLinked = linkedCategoryIds.has(kategori.id_kategori);
    setProcessingId(kategori.id_kategori);
    try {
      if (isCurrentlyLinked) {
        await unlinkKategoriMutation.mutateAsync({
          rubrikId: rubrik.id_rubrik,
          id_kategori: kategori.id_kategori,
        });
        toast.success(`Kategori "${kategori.nama_kategori}" berhasil dilepas`);
      } else {
        await linkKategoriMutation.mutateAsync({
          rubrikId: rubrik.id_rubrik,
          id_kategori: kategori.id_kategori,
        });
        toast.success(`Kategori "${kategori.nama_kategori}" berhasil ditautkan`);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal mengubah tautan kategori"));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base">Tautkan ke Kategori Setoran</DialogTitle>
              <DialogDescription className="text-xs">
                Pilih kategori setoran yang menggunakan rubrik "{rubrik.nama}"
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 space-y-2">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-10 bg-muted animate-pulse rounded-md" />
              <div className="h-10 bg-muted animate-pulse rounded-md" />
            </div>
          ) : kategoriList.length === 0 ? (
            <div className="p-4 border border-dashed rounded-lg text-center text-xs text-muted-foreground">
              Belum ada kategori setoran yang dibuat. Buat kategori terlebih dahulu di menu Pengaturan Kategori.
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {kategoriList.map((kat) => {
                const isLinked = linkedCategoryIds.has(kat.id_kategori);
                const isBusy = processingId === kat.id_kategori;

                return (
                  <div
                    key={kat.id_kategori}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => !isBusy && handleToggle(kat)}
                  >
                    <div className="flex items-center gap-2.5">
                      <Checkbox
                        checked={isLinked}
                        disabled={isBusy}
                        onCheckedChange={() => handleToggle(kat)}
                      />
                      <div>
                        <div className="text-sm font-medium">{kat.nama_kategori}</div>
                        {kat.deskripsi && (
                          <div className="text-xs text-muted-foreground">{kat.deskripsi}</div>
                        )}
                      </div>
                    </div>

                    <Badge variant={isLinked ? "default" : "outline"} className="text-[10px]">
                      {isLinked ? "Tertaut" : "Tidak Tertaut"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
