import { Pencil, Trash2, CalendarDays, Target, Loader2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TargetSekolah } from "@/types/domain/target";
import {
  TIPE_TARGET_LABELS,
  SATUAN_TARGET_LABELS,
  parseHariAktif,
  formatHariAktif,
} from "@/types/domain/target";

const STATUS_COLORS: Record<string, string> = {
  HARIAN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
  MINGGUAN: "bg-violet-100 text-violet-700 dark:bg-violet-900/30",
  BULANAN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30",
  SEMESTER: "bg-amber-100 text-amber-700 dark:bg-amber-900/30",
  GLOBAL: "bg-slate-100 text-slate-700 dark:bg-slate-800",
};

interface TargetListProps {
  targets: TargetSekolah[];
  isLoading: boolean;
  openCreate: () => void;
  openEdit: (target: TargetSekolah) => void;
  setDeletingTarget: (target: TargetSekolah) => void;
}

export function TargetList({
  targets,
  isLoading,
  openCreate,
  openEdit,
  setDeletingTarget,
}: TargetListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Memuat target...
      </div>
    );
  }

  if (targets.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-xl space-y-3">
        <Target className="h-10 w-10 mx-auto text-muted-foreground/40" />
        <p className="font-medium text-muted-foreground">Belum ada target</p>
        <p className="text-sm text-muted-foreground">
          Klik &quot;Tambah Target&quot; untuk membuat target pertama Anda.
        </p>
        <Button onClick={openCreate} variant="outline" className="mt-2">
          <Plus className="h-4 w-4 mr-2" />
          Buat Target Pertama
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {targets.map((target) => {
        const hariArr = target.tipe === "HARIAN" ? parseHariAktif(target.hari_aktif) : null;
        return (
          <Card key={target.id_target} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-base truncate">{target.nama_target}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[target.tipe] ?? "bg-muted"}`}
                    >
                      {TIPE_TARGET_LABELS[target.tipe]}
                    </span>
                    {target.kategori && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {target.kategori.nama_kategori}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="font-mono font-semibold text-foreground text-lg">
                      {target.nilai_target}
                    </span>
                    <span>{SATUAN_TARGET_LABELS[target.satuan]}</span>
                    <span className="text-xs">per {TIPE_TARGET_LABELS[target.tipe].toLowerCase()}</span>
                  </div>

                  {/* Tampilan kustomisasi arah & batasan juz/surat */}
                  {((target.arah && target.arah !== "BEBAS") || target.start_juz || target.daftar_surat) && (
                    <div className="flex flex-wrap gap-1.5 text-xs py-1">
                      {target.arah && target.arah !== "BEBAS" && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
                          Arah: {target.arah === "MAJU" ? "Maju" : "Mundur"}
                        </span>
                      )}
                      {target.start_juz !== null && target.start_juz !== undefined && target.end_juz !== null && target.end_juz !== undefined && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                          Rentang: Juz {target.start_juz} s.d {target.end_juz}
                        </span>
                      )}
                      {target.daftar_surat && (
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30">
                          Surah: Pilihan
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tampilan hari aktif untuk target HARIAN */}
                  {target.tipe === "HARIAN" && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <CalendarDays className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      {hariArr && hariArr.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          {hariArr.map((d) => (
                            <span
                              key={d}
                              className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium"
                            >
                              {formatHariAktif([d])}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Tidak ada hari setoran aktif (Bebas)
                        </span>
                      )}
                    </div>
                  )}

                  {target.deskripsi && (
                    <p className="text-xs text-muted-foreground border-t pt-2 mt-1">
                      {target.deskripsi}
                    </p>
                  )}
                </div>

                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(target)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => setDeletingTarget(target)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
