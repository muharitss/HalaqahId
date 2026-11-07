import { useQuery } from "@tanstack/react-query";
import { programService } from "../services/programService";

export const programKeys = {
  all: ["program"] as const,
  lists: () => [...programKeys.all, "list"] as const,
  detail: (id: number) => [...programKeys.all, "detail", id] as const,
  levels: (idProgram: number) => [...programKeys.all, "levels", idProgram] as const,
  levelDetail: (idProgram: number, idLevel: number) =>
    [...programKeys.all, "levelDetail", idProgram, idLevel] as const,
};

export function useProgramList() {
  return useQuery({
    queryKey: programKeys.lists(),
    queryFn: async () => {
      const res = await programService.getAllPrograms();
      return res.data || [];
    },
  });
}

export function useProgramDetail(id?: number) {
  return useQuery({
    queryKey: id ? programKeys.detail(id) : ["program", "detail", "empty"],
    queryFn: async () => {
      if (!id) return null;
      const res = await programService.getProgramById(id);
      return res.data || null;
    },
    enabled: !!id,
  });
}

export function useProgramLevels(idProgram?: number) {
  return useQuery({
    queryKey: idProgram
      ? programKeys.levels(idProgram)
      : ["program", "levels", "empty"],
    queryFn: async () => {
      if (!idProgram) return [];
      const res = await programService.getLevels(idProgram);
      return res.data || [];
    },
    enabled: !!idProgram,
  });
}

export function useProgramLevelDetail(idProgram?: number, idLevel?: number) {
  return useQuery({
    queryKey:
      idProgram && idLevel
        ? programKeys.levelDetail(idProgram, idLevel)
        : ["program", "levelDetail", "empty"],
    queryFn: async () => {
      if (!idProgram || !idLevel) return null;
      const res = await programService.getLevelById(idProgram, idLevel);
      return res.data || null;
    },
    enabled: !!idProgram && !!idLevel,
  });
}
