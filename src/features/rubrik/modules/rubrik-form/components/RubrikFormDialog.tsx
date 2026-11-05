import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { KriteriaEditor } from "./KriteriaEditor";
import {
  rubrikFormSchema,
  type KriteriaItemFormValues,
} from "../validation/rubrik.schema";
import { useRubrikMutations } from "../../../api/mutations/useRubrikMutations";
import type { RubrikTemplate, TipeRubrik, RubrikKriteria } from "../../../types";
import { getErrorMessage } from "@/utils/error";

interface RubrikFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: RubrikTemplate | null;
}

const DEFAULT_KRITERIA: KriteriaItemFormValues[] = [
  { nama: "Tajwid & Makhorijul Huruf", bobot: 40, skala_min: 1, skala_max: 4, urutan: 1 },
  { nama: "Kelancaran & Fashohah", bobot: 40, skala_min: 1, skala_max: 4, urutan: 2 },
  { nama: "Adab & Kesopanan", bobot: 20, skala_min: 1, skala_max: 4, urutan: 3 },
];

export function RubrikFormDialog({
  open,
  onOpenChange,
  initialData,
}: RubrikFormDialogProps) {
  const isEdit = !!initialData;
  const { createMutation, updateMutation, addKriteriaMutation, updateKriteriaMutation, deleteKriteriaMutation } =
    useRubrikMutations();

  const [nama, setNama] = useState("");
  const [tipe, setTipe] = useState<TipeRubrik>("SETORAN");
  const [isDefault, setIsDefault] = useState(false);
  const [kriteria, setKriteria] = useState<KriteriaItemFormValues[]>(DEFAULT_KRITERIA);
  const [kriteriaError, setKriteriaError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama);
      setTipe(initialData.tipe);
      setIsDefault(initialData.is_default);
      setKriteria(
        initialData.kriteria?.length > 0
          ? initialData.kriteria.map((k: RubrikKriteria) => ({
              id_kriteria: k.id_kriteria,
              nama: k.nama,
              bobot: k.bobot,
              skala_min: k.skala_min,
              skala_max: k.skala_max,
              urutan: k.urutan,
            }))
          : DEFAULT_KRITERIA
      );
    } else {
      setNama("");
      setTipe("SETORAN");
      setIsDefault(false);
      setKriteria(DEFAULT_KRITERIA);
    }
    setKriteriaError(undefined);
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setKriteriaError(undefined);

    const validationResult = rubrikFormSchema.safeParse({
      nama,
      tipe,
      is_default: isDefault,
      kriteria,
    });

    if (!validationResult.success) {
      const issue = validationResult.error.issues[0];
      if (issue.path.includes("kriteria")) {
        setKriteriaError(issue.message);
      } else {
        toast.error(issue.message);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isEdit) {
        // Create new rubrik with kriteria
        await createMutation.mutateAsync({
          nama: nama.trim(),
          tipe,
          is_default: isDefault,
          kriteria: kriteria.map((k, idx) => ({
            nama: k.nama.trim(),
            bobot: Number(k.bobot),
            skala_min: Number(k.skala_min),
            skala_max: Number(k.skala_max),
            urutan: idx + 1,
          })),
        });
        toast.success("Template rubrik penilaian berhasil dibuat");
      } else {
        // Update basic rubrik data
        await updateMutation.mutateAsync({
          id: initialData.id_rubrik,
          payload: {
            nama: nama.trim(),
            tipe,
            is_default: isDefault,
          },
        });

        // Sync criteria changes
        const currentIds = new Set<number>(kriteria.filter((k: KriteriaItemFormValues) => !!k.id_kriteria).map((k: KriteriaItemFormValues) => k.id_kriteria!));
        const initialIds = new Set<number>(initialData.kriteria.map((k: RubrikKriteria) => k.id_kriteria));

        // Delete removed criteria
        for (const initialId of Array.from(initialIds)) {
          if (!currentIds.has(initialId)) {
            await deleteKriteriaMutation.mutateAsync({
              rubrikId: initialData.id_rubrik,
              kriteriaId: initialId,
            });
          }
        }

        // Add new & update existing criteria
        for (let idx = 0; idx < kriteria.length; idx++) {
          const item = kriteria[idx];
          if (item.id_kriteria) {
            // Update
            await updateKriteriaMutation.mutateAsync({
              rubrikId: initialData.id_rubrik,
              kriteriaId: item.id_kriteria,
              payload: {
                nama: item.nama.trim(),
                bobot: Number(item.bobot),
                skala_min: Number(item.skala_min),
                skala_max: Number(item.skala_max),
                urutan: idx + 1,
              },
            });
          } else {
            // Add new
            await addKriteriaMutation.mutateAsync({
              rubrikId: initialData.id_rubrik,
              payload: {
                nama: item.nama.trim(),
                bobot: Number(item.bobot),
                skala_min: Number(item.skala_min),
                skala_max: Number(item.skala_max),
                urutan: idx + 1,
              },
            });
          }
        }

        toast.success("Rubrik penilaian berhasil diperbarui");
      }

      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal menyimpan rubrik penilaian"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Template Rubrik" : "Tambah Template Rubrik Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui parameter penilaian dan kriteria pada template rubrik ini."
              : "Buat panduan penilaian terstandar untuk evaluasi setoran atau ujian tahfidz."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rubrik-nama" className="text-xs font-semibold">
                Nama Rubrik Penilaian <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rubrik-nama"
                placeholder="Misal: Rubrik Standar Ziyadah"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="h-9 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rubrik-tipe" className="text-xs font-semibold">
                Peruntukan / Tipe Rubrik <span className="text-destructive">*</span>
              </Label>
              <Select
                value={tipe}
                onValueChange={(val) => setTipe(val as TipeRubrik)}
              >
                <SelectTrigger id="rubrik-tipe" className="h-9 text-sm">
                  <SelectValue placeholder="Pilih Tipe Rubrik" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SETORAN">Setoran Harian (Ziyadah/Murajaah)</SelectItem>
                  <SelectItem value="UJIAN">Ujian Tahfidz / Tasmi'</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1 pb-1">
            <Checkbox
              id="rubrik-default"
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(!!checked)}
            />
            <Label
              htmlFor="rubrik-default"
              className="text-xs font-medium cursor-pointer"
            >
              Jadikan sebagai rubrik standar utama untuk tipe ini
            </Label>
          </div>

          <div className="border-t pt-4">
            <KriteriaEditor
              kriteria={kriteria}
              onChange={(next) => {
                setKriteria(next);
                setKriteriaError(undefined);
              }}
              error={kriteriaError}
            />
          </div>

          <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : isEdit ? "Perbarui Rubrik" : "Simpan Rubrik"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
