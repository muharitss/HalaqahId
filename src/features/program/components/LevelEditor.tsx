import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Info,
} from "lucide-react";
import type { ProgramTahfidz, LevelHafalan } from "../types";

interface LevelEditorProps {
  program: ProgramTahfidz;
  levels: LevelHafalan[];
  isLoading?: boolean;
  onAddClick: () => void;
  onEditClick: (level: LevelHafalan) => void;
  onDeleteClick: (level: LevelHafalan) => void;
  onReorder: (orderedIds: number[]) => Promise<void>;
}

export const LevelEditor: React.FC<LevelEditorProps> = ({
  program,
  levels,
  isLoading = false,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onReorder,
}) => {
  const [levelToDelete, setLevelToDelete] = useState<LevelHafalan | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // Sort levels by urutan asc
  const sortedLevels = [...levels].sort((a, b) => a.urutan - b.urutan);

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (isReordering) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedLevels.length) return;

    const newLevels = [...sortedLevels];
    const [moved] = newLevels.splice(index, 1);
    newLevels.splice(targetIndex, 0, moved);

    const orderedIds = newLevels.map((l) => l.id_level);
    setIsReordering(true);
    try {
      await onReorder(orderedIds);
    } finally {
      setIsReordering(false);
    }
  };

  const formatTargetJuz = (min: number | null, max: number | null) => {
    if (min === null && max === null) {
      return null;
    }
    if (min !== null && max !== null) {
      return min === max ? `Juz ${min}` : `Juz ${min} - ${max}`;
    }
    if (min !== null) return `Min Juz ${min}`;
    return `Max Juz ${max}`;
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">
              Jenjang Level: {program.nama_program}
            </CardTitle>
            <Badge variant="secondary" className="ml-2 font-normal">
              {levels.length} Level
            </Badge>
          </div>
          <CardDescription className="mt-1">
            Atur urutan tingkatan dan target capaian juz untuk program ini.
          </CardDescription>
        </div>

        <Button size="sm" onClick={onAddClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Level
        </Button>
      </CardHeader>

      <CardContent className="pt-5">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Memuat daftar level hafalan...
          </div>
        ) : sortedLevels.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-foreground">Belum ada level hafalan</p>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">
                Program ini belum memiliki tingkatan level. Tambahkan level bertingkat seperti Level 1 (Juz 30), Level 2 (Juz 29), dll.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onAddClick} className="gap-2 mt-2">
              <Plus className="h-4 w-4" />
              Tambah Level Pertama
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedLevels.map((lvl, idx) => {
              const targetText = formatTargetJuz(lvl.target_juz_min, lvl.target_juz_max);
              const isFirst = idx === 0;
              const isLast = idx === sortedLevels.length - 1;

              return (
                <div
                  key={lvl.id_level}
                  className="flex items-center justify-between p-3.5 rounded-lg border bg-card hover:bg-muted/30 transition-colors gap-3"
                >
                  {/* Left: Reorder controls & Urutan */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        disabled={isFirst || isReordering}
                        onClick={() => handleMove(idx, "up")}
                        title="Geser Naik"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        disabled={isLast || isReordering}
                        onClick={() => handleMove(idx, "down")}
                        title="Geser Turun"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="h-7 w-7 rounded-md bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {lvl.nama_level}
                        </span>
                        {targetText ? (
                          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 gap-1 py-0 h-5">
                            <BookOpen className="h-3 w-3" />
                            {targetText}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Tanpa batasan target juz
                          </span>
                        )}
                      </div>

                      {lvl.keterangan && (
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Info className="h-3 w-3 flex-shrink-0" />
                          {lvl.keterangan}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEditClick(lvl)}
                      title="Edit Level"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => setLevelToDelete(lvl)}
                      title="Hapus Level"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={!!levelToDelete}
        onOpenChange={(open) => !open && setLevelToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Level Hafalan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus level{" "}
              <strong>"{levelToDelete?.nama_level}"</strong>? Tindakan ini tidak dapat dibatalkan jika level sudah memiliki santri terkait.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLevelToDelete(null)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (levelToDelete) {
                  onDeleteClick(levelToDelete);
                  setLevelToDelete(null);
                }
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
