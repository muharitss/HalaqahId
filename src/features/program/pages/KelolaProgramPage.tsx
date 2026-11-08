import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Term } from "@/components/ui/Term";
import {
  useProgramList,
  useProgramLevels,
  useProgramMutations,
} from "../api";
import type {
  ProgramTahfidz,
  LevelHafalan,
  CreateProgramPayload,
  UpdateProgramPayload,
  CreateLevelPayload,
  UpdateLevelPayload,
} from "../types";
import { ProgramFormModal } from "../components/ProgramFormModal";
import { LevelFormModal } from "../components/LevelFormModal";
import { LevelEditor } from "../components/LevelEditor";

export const KelolaProgramPage: React.FC = () => {
  const { data: programs = [], isLoading: isLoadingPrograms } = useProgramList();
  const {
    createProgramMutation,
    updateProgramMutation,
    deleteProgramMutation,
    createLevelMutation,
    updateLevelMutation,
    deleteLevelMutation,
    reorderLevelsMutation,
  } = useProgramMutations();

  // Selected program state (default to first program if available)
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);

  // Modals state
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramTahfidz | null>(null);
  const [programToDelete, setProgramToDelete] = useState<ProgramTahfidz | null>(null);

  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelHafalan | null>(null);

  // Active program determination
  const activeProgram = useMemo(() => {
    if (!programs.length) return null;
    if (selectedProgramId) {
      const found = programs.find((p) => p.id_program === selectedProgramId);
      if (found) return found;
    }
    return programs[0];
  }, [programs, selectedProgramId]);

  // Query levels for the currently active program
  const { data: levels = [], isLoading: isLoadingLevels } = useProgramLevels(
    activeProgram?.id_program
  );

  // Handlers for Program CRUD
  const handleOpenCreateProgram = () => {
    setEditingProgram(null);
    setIsProgramModalOpen(true);
  };

  const handleOpenEditProgram = (program: ProgramTahfidz) => {
    setEditingProgram(program);
    setIsProgramModalOpen(true);
  };

  const handleProgramSubmit = async (
    payload: CreateProgramPayload | UpdateProgramPayload
  ) => {
    if (editingProgram) {
      await updateProgramMutation.mutateAsync({
        id: editingProgram.id_program,
        payload,
      });
    } else {
      const res = await createProgramMutation.mutateAsync(
        payload as CreateProgramPayload
      );
      if (res.data?.id_program) {
        setSelectedProgramId(res.data.id_program);
      }
    }
  };

  const handleDeleteProgram = async () => {
    if (!programToDelete) return;
    await deleteProgramMutation.mutateAsync(programToDelete.id_program);
    if (selectedProgramId === programToDelete.id_program) {
      setSelectedProgramId(null);
    }
    setProgramToDelete(null);
  };

  // Handlers for Level CRUD
  const handleOpenCreateLevel = () => {
    setEditingLevel(null);
    setIsLevelModalOpen(true);
  };

  const handleOpenEditLevel = (level: LevelHafalan) => {
    setEditingLevel(level);
    setIsLevelModalOpen(true);
  };

  const handleLevelSubmit = async (
    payload: CreateLevelPayload | UpdateLevelPayload
  ) => {
    if (!activeProgram) return;

    if (editingLevel) {
      await updateLevelMutation.mutateAsync({
        idProgram: activeProgram.id_program,
        idLevel: editingLevel.id_level,
        payload,
      });
    } else {
      await createLevelMutation.mutateAsync({
        idProgram: activeProgram.id_program,
        payload: payload as CreateLevelPayload,
      });
    }
  };

  const handleDeleteLevel = async (level: LevelHafalan) => {
    if (!activeProgram) return;
    await deleteLevelMutation.mutateAsync({
      idProgram: activeProgram.id_program,
      idLevel: level.id_level,
    });
  };

  const handleReorderLevels = async (orderedIds: number[]) => {
    if (!activeProgram) return;
    await reorderLevelsMutation.mutateAsync({
      idProgram: activeProgram.id_program,
      orderedIds,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            Program & Level Tahfidz
          </h1>
          <p className="text-muted-foreground text-sm">
            Kelola kurikulum program hafalan dan jenjang capaian <Term code="SANTRI" />.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/kepala-muhafidz/akademik">
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Kalender Akademik
            </Button>
          </Link>

          <Button size="sm" onClick={handleOpenCreateProgram} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Program
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {isLoadingPrograms ? (
        <div className="py-20 text-center text-sm text-muted-foreground">
          Memuat daftar program tahfidz...
        </div>
      ) : programs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                Belum Ada Program Tahfidz
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1">
                Buat program tahfidz pertama Anda (misalnya Program Reguler, Program Takhassus, dsb) untuk mulai menyusun tingkatan level.
              </p>
            </div>
            <Button onClick={handleOpenCreateProgram} className="gap-2 mt-2">
              <Plus className="h-4 w-4" />
              Tambah Program Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Programs List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Daftar Program ({programs.length})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleOpenCreateProgram}
                className="h-7 px-2 text-xs gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah
              </Button>
            </div>

            <div className="space-y-3">
              {programs.map((prog) => {
                const isSelected = activeProgram?.id_program === prog.id_program;
                const levelCount = prog.levels ? prog.levels.length : 0;

                return (
                  <Card
                    key={prog.id_program}
                    onClick={() => setSelectedProgramId(prog.id_program)}
                    className={`cursor-pointer transition-all border ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                        : "hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <CardTitle className="text-base font-semibold flex items-center gap-2">
                            {prog.nama_program}
                          </CardTitle>
                          {prog.deskripsi && (
                            <CardDescription className="text-xs line-clamp-2">
                              {prog.deskripsi}
                            </CardDescription>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditProgram(prog);
                            }}
                            title="Edit Program"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProgramToDelete(prog);
                            }}
                            title="Hapus Program"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-0 flex items-center justify-between text-xs text-muted-foreground border-t mt-3 pt-2.5">
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" />
                        <span>{levelCount} Level Hafalan</span>
                      </div>
                      {isSelected ? (
                        <Badge variant="default" className="text-[10px] py-0 px-2 h-5">
                          Dipilih
                        </Badge>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          Kelola Level
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right Column: Level Editor */}
          <div className="lg:col-span-7">
            {activeProgram && (
              <LevelEditor
                program={activeProgram}
                levels={levels}
                isLoading={isLoadingLevels}
                onAddClick={handleOpenCreateLevel}
                onEditClick={handleOpenEditLevel}
                onDeleteClick={handleDeleteLevel}
                onReorder={handleReorderLevels}
              />
            )}
          </div>
        </div>
      )}

      {/* Program Modal (Create/Edit) */}
      <ProgramFormModal
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        onSubmit={handleProgramSubmit}
        initialData={editingProgram}
        isLoading={
          createProgramMutation.isPending || updateProgramMutation.isPending
        }
      />

      {/* Level Modal (Create/Edit) */}
      <LevelFormModal
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        onSubmit={handleLevelSubmit}
        initialData={editingLevel}
        defaultUrutan={levels.length + 1}
        isLoading={
          createLevelMutation.isPending || updateLevelMutation.isPending
        }
      />

      {/* Program Delete Confirmation Dialog */}
      <Dialog
        open={!!programToDelete}
        onOpenChange={(open) => !open && setProgramToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Program Tahfidz</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus program{" "}
              <strong>"{programToDelete?.nama_program}"</strong>? Seluruh data tingkatan level di dalam program ini juga akan dinonaktifkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProgramToDelete(null)}
              disabled={deleteProgramMutation.isPending}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProgram}
              disabled={deleteProgramMutation.isPending}
            >
              {deleteProgramMutation.isPending ? "Menghapus..." : "Hapus Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
