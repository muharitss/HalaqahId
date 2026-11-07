import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { programService } from "../services/programService";
import { programKeys } from "../queries/useProgramQueries";
import type {
  CreateProgramPayload,
  UpdateProgramPayload,
  CreateLevelPayload,
  UpdateLevelPayload,
} from "../../types";

export function useProgramMutations() {
  const queryClient = useQueryClient();

  const invalidatePrograms = (idProgram?: number) => {
    queryClient.invalidateQueries({ queryKey: programKeys.lists() });
    if (idProgram) {
      queryClient.invalidateQueries({ queryKey: programKeys.detail(idProgram) });
      queryClient.invalidateQueries({ queryKey: programKeys.levels(idProgram) });
    }
  };

  // --- PROGRAM MUTATIONS ---
  const createProgramMutation = useMutation({
    mutationFn: (payload: CreateProgramPayload) =>
      programService.createProgram(payload),
    onSuccess: (res) => {
      invalidatePrograms(res.data?.id_program);
      toast.success("Program tahfidz berhasil ditambahkan");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan program tahfidz";
      toast.error(msg);
    },
  });

  const updateProgramMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateProgramPayload;
    }) => programService.updateProgram(id, payload),
    onSuccess: (_, vars) => {
      invalidatePrograms(vars.id);
      toast.success("Program tahfidz berhasil diperbarui");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui program tahfidz";
      toast.error(msg);
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: (id: number) => programService.deleteProgram(id),
    onSuccess: (_, id) => {
      invalidatePrograms(id);
      toast.success("Program tahfidz berhasil dihapus");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menghapus program tahfidz";
      toast.error(msg);
    },
  });

  // --- LEVEL MUTATIONS ---
  const createLevelMutation = useMutation({
    mutationFn: ({
      idProgram,
      payload,
    }: {
      idProgram: number;
      payload: CreateLevelPayload;
    }) => programService.createLevel(idProgram, payload),
    onSuccess: (_, vars) => {
      invalidatePrograms(vars.idProgram);
      toast.success("Level hafalan berhasil ditambahkan");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan level hafalan";
      toast.error(msg);
    },
  });

  const updateLevelMutation = useMutation({
    mutationFn: ({
      idProgram,
      idLevel,
      payload,
    }: {
      idProgram: number;
      idLevel: number;
      payload: UpdateLevelPayload;
    }) => programService.updateLevel(idProgram, idLevel, payload),
    onSuccess: (_, vars) => {
      invalidatePrograms(vars.idProgram);
      toast.success("Level hafalan berhasil diperbarui");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui level hafalan";
      toast.error(msg);
    },
  });

  const deleteLevelMutation = useMutation({
    mutationFn: ({
      idProgram,
      idLevel,
    }: {
      idProgram: number;
      idLevel: number;
    }) => programService.deleteLevel(idProgram, idLevel),
    onSuccess: (_, vars) => {
      invalidatePrograms(vars.idProgram);
      toast.success("Level hafalan berhasil dihapus");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menghapus level hafalan";
      toast.error(msg);
    },
  });

  const reorderLevelsMutation = useMutation({
    mutationFn: async ({
      idProgram,
      orderedIds,
    }: {
      idProgram: number;
      orderedIds: number[];
    }) => {
      await Promise.all(
        orderedIds.map((idLevel, index) =>
          programService.updateLevel(idProgram, idLevel, { urutan: index + 1 })
        )
      );
    },
    onSuccess: (_, vars) => {
      invalidatePrograms(vars.idProgram);
      toast.success("Urutan level berhasil diperbarui");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui urutan level";
      toast.error(msg);
    },
  });

  return {
    createProgramMutation,
    updateProgramMutation,
    deleteProgramMutation,
    createLevelMutation,
    updateLevelMutation,
    deleteLevelMutation,
    reorderLevelsMutation,
  };
}
