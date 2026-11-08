import { useQuery } from "@tanstack/react-query";
import { akademikService } from "../services/akademikService";

export const akademikKeys = {
  all: ["akademik"] as const,
  tahunAjaranList: () => [...akademikKeys.all, "tahun-ajaran"] as const,
  tahunAjaranDetail: (id: number) => [...akademikKeys.all, "tahun-ajaran", id] as const,
  semesters: (idTahunAjaran: number) =>
    [...akademikKeys.all, "semesters", idTahunAjaran] as const,
  hariLiburList: (tahun?: number) =>
    [...akademikKeys.all, "hari-libur", { tahun }] as const,
  hariLiburDetail: (id: number) =>
    [...akademikKeys.all, "hari-libur", id] as const,
};

export function useTahunAjaranList() {
  return useQuery({
    queryKey: akademikKeys.tahunAjaranList(),
    queryFn: async () => {
      const res = await akademikService.getTahunAjaranList();
      return res.data || [];
    },
  });
}

export function useTahunAjaranDetail(id?: number) {
  return useQuery({
    queryKey: id ? akademikKeys.tahunAjaranDetail(id) : ["akademik", "tahun-ajaran", "empty"],
    queryFn: async () => {
      if (!id) return null;
      const res = await akademikService.getTahunAjaranById(id);
      return res.data || null;
    },
    enabled: !!id,
  });
}

export function useSemesterList(idTahunAjaran?: number) {
  return useQuery({
    queryKey: idTahunAjaran
      ? akademikKeys.semesters(idTahunAjaran)
      : ["akademik", "semesters", "empty"],
    queryFn: async () => {
      if (!idTahunAjaran) return [];
      const res = await akademikService.getSemesters(idTahunAjaran);
      return res.data || [];
    },
    enabled: !!idTahunAjaran,
  });
}

export function useHariLiburList(tahun?: number) {
  return useQuery({
    queryKey: akademikKeys.hariLiburList(tahun),
    queryFn: async () => {
      const res = await akademikService.getHariLiburList(tahun);
      return res.data || [];
    },
  });
}
