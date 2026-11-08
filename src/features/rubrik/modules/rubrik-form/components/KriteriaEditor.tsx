import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ArrowUp, ArrowDown, CheckCircle2, AlertCircle } from "lucide-react";
import type { KriteriaItemFormValues } from "../validation/rubrik.schema";

interface KriteriaEditorProps {
  kriteria: KriteriaItemFormValues[];
  onChange: (items: KriteriaItemFormValues[]) => void;
  error?: string;
}

export function KriteriaEditor({ kriteria, onChange, error }: KriteriaEditorProps) {
  const totalBobot = kriteria.reduce((sum, item) => sum + (Number(item.bobot) || 0), 0);
  const isBobotValid = totalBobot === 100;

  const handleAdd = () => {
    const nextUrutan = kriteria.length + 1;
    const remainingBobot = Math.max(0, 100 - totalBobot);
    onChange([
      ...kriteria,
      {
        nama: "",
        bobot: remainingBobot > 0 ? remainingBobot : 10,
        skala_min: 1,
        skala_max: 4,
        urutan: nextUrutan,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    const next = kriteria.filter((_, i) => i !== index);
    onChange(next.map((item, idx) => ({ ...item, urutan: idx + 1 })));
  };

  const handleChange = (index: number, field: keyof KriteriaItemFormValues, value: unknown) => {
    const next = [...kriteria];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= kriteria.length) return;

    const next = [...kriteria];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next.map((item, idx) => ({ ...item, urutan: idx + 1 })));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold">Daftar Kriteria Penilaian</Label>
          <p className="text-xs text-muted-foreground">
            Tentukan kriteria, skala penilaian, dan bobot (total wajib 100%)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isBobotValid ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 gap-1 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Total Bobot: 100%
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              Total Bobot: {totalBobot}% {totalBobot < 100 ? `(Kurang ${100 - totalBobot}%)` : `(Lebih ${totalBobot - 100}%)`}
            </Badge>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="h-8 gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Kriteria
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-xs text-destructive font-medium flex items-center gap-1.5 p-2 bg-destructive/10 rounded-md">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {kriteria.length === 0 ? (
        <div className="p-6 border border-dashed rounded-lg text-center space-y-2">
          <p className="text-sm text-muted-foreground">Belum ada kriteria penilaian yang ditambahkan.</p>
          <Button type="button" variant="secondary" size="sm" onClick={handleAdd} className="gap-1 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Tambah Kriteria Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {kriteria.map((item, index) => (
            <div
              key={index}
              className="p-3 border rounded-lg bg-card/60 space-y-2 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground w-6 text-center">
                  #{index + 1}
                </span>

                <div className="flex-1">
                  <Input
                    placeholder="Nama Kriteria (misal: Tajwid, Kelancaran, Makhraj)"
                    value={item.nama}
                    onChange={(e) => handleChange(index, "nama", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="w-24">
                  <div className="relative">
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      placeholder="Bobot"
                      value={item.bobot || ""}
                      onChange={(e) => handleChange(index, "bobot", Number(e.target.value))}
                      className="h-8 text-xs pr-6"
                    />
                    <span className="absolute right-2 top-2 text-[10px] text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                    title="Pindah ke atas"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={index === kriteria.length - 1}
                    onClick={() => handleMove(index, "down")}
                    title="Pindah ke bawah"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(index)}
                    title="Hapus kriteria"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Skala Min & Max */}
              <div className="flex items-center gap-4 pl-8 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span>Skala Nilai:</span>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={item.skala_min}
                    onChange={(e) => handleChange(index, "skala_min", Number(e.target.value))}
                    className="h-6 w-14 text-center text-xs px-1"
                  />
                  <span>s.d.</span>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={item.skala_max}
                    onChange={(e) => handleChange(index, "skala_max", Number(e.target.value))}
                    className="h-6 w-14 text-center text-xs px-1"
                  />
                </div>
                <span className="text-[11px] italic">
                  (Contoh: skala 1-4 untuk nilai 1, 2, 3, 4 atau skala 0-100)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
