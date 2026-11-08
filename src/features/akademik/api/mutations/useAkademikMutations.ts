import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { akademikService } from "../services/akademikService";
import { akademikKeys } from "../queries/useAkademikQueries";
import type {
  CreateTahunAjaranPayload,
  UpdateTahunAjaranPayload,
  CreateSemesterPayload,
  UpdateSemesterPayload,
  CreateHariLiburPayload,
  UpdateHariLiburPayload,
  NationalHolidayItem,
} from "../../types";

export function useAkademikMutations() {
  const queryClient = useQueryClient();

  const invalidateTahunAjaran = () => {
    queryClient.invalidateQueries({ queryKey: akademikKeys.tahunAjaranList() });
  };

  const invalidateSemesters = (idTahunAjaran?: number) => {
    if (idTahunAjaran) {
      queryClient.invalidateQueries({
        queryKey: akademikKeys.semesters(idTahunAjaran),
      });
    }
    queryClient.invalidateQueries({ queryKey: akademikKeys.tahunAjaranList() });
  };

  const invalidateHariLibur = () => {
    queryClient.invalidateQueries({ queryKey: [...akademikKeys.all, "hari-libur"] });
  };

  // --- TAHUN AJARAN MUTATIONS ---
  const createTahunAjaranMutation = useMutation({
    mutationFn: (payload: CreateTahunAjaranPayload) =>
      akademikService.createTahunAjaran(payload),
    onSuccess: () => {
      invalidateTahunAjaran();
      toast.success("Tahun ajaran berhasil ditambahkan");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan tahun ajaran";
      toast.error(msg);
    },
  });

  const updateTahunAjaranMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateTahunAjaranPayload;
    }) => akademikService.updateTahunAjaran(id, payload),
    onSuccess: () => {
      invalidateTahunAjaran();
      toast.success("Tahun ajaran berhasil diperbarui");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui tahun ajaran";
      toast.error(msg);
    },
  });

  const setAktifTahunAjaranMutation = useMutation({
    mutationFn: (id: number) =>
      akademikService.updateTahunAjaran(id, { is_aktif: true }),
    onSuccess: () => {
      invalidateTahunAjaran();
      toast.success("Tahun ajaran aktif berhasil diubah");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal mengubah tahun ajaran aktif";
      toast.error(msg);
    },
  });

  const deleteTahunAjaranMutation = useMutation({
    mutationFn: (id: number) => akademikService.deleteTahunAjaran(id),
    onSuccess: () => {
      invalidateTahunAjaran();
      toast.success("Tahun ajaran berhasil dihapus");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menghapus tahun ajaran";
      toast.error(msg);
    },
  });

  // --- SEMESTER MUTATIONS ---
  const createSemesterMutation = useMutation({
    mutationFn: ({
      idTahunAjaran,
      payload,
    }: {
      idTahunAjaran: number;
      payload: CreateSemesterPayload;
    }) => akademikService.createSemester(idTahunAjaran, payload),
    onSuccess: (_, vars) => {
      invalidateSemesters(vars.idTahunAjaran);
      toast.success("Semester berhasil ditambahkan");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan semester";
      toast.error(msg);
    },
  });

  const updateSemesterMutation = useMutation({
    mutationFn: ({
      idTahunAjaran,
      idSemester,
      payload,
    }: {
      idTahunAjaran: number;
      idSemester: number;
      payload: UpdateSemesterPayload;
    }) => akademikService.updateSemester(idTahunAjaran, idSemester, payload),
    onSuccess: (_, vars) => {
      invalidateSemesters(vars.idTahunAjaran);
      toast.success("Semester berhasil diperbarui");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui semester";
      toast.error(msg);
    },
  });

  const deleteSemesterMutation = useMutation({
    mutationFn: ({
      idTahunAjaran,
      idSemester,
    }: {
      idTahunAjaran: number;
      idSemester: number;
    }) => akademikService.deleteSemester(idTahunAjaran, idSemester),
    onSuccess: (_, vars) => {
      invalidateSemesters(vars.idTahunAjaran);
      toast.success("Semester berhasil dihapus");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menghapus semester";
      toast.error(msg);
    },
  });

  // --- HARI LIBUR MUTATIONS ---
  const createHariLiburMutation = useMutation({
    mutationFn: (payload: CreateHariLiburPayload) =>
      akademikService.createHariLibur(payload),
    onSuccess: () => {
      invalidateHariLibur();
      toast.success("Hari libur berhasil ditambahkan");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan hari libur";
      toast.error(msg);
    },
  });

  const updateHariLiburMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateHariLiburPayload;
    }) => akademikService.updateHariLibur(id, payload),
    onSuccess: () => {
      invalidateHariLibur();
      toast.success("Hari libur berhasil diperbarui");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui hari libur";
      toast.error(msg);
    },
  });

  const deleteHariLiburMutation = useMutation({
    mutationFn: (id: number) => akademikService.deleteHariLibur(id),
    onSuccess: () => {
      invalidateHariLibur();
      toast.success("Hari libur berhasil dihapus");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menghapus hari libur";
      toast.error(msg);
    },
  });

  const importHariLiburMutation = useMutation({
    mutationFn: async (items: NationalHolidayItem[]) => {
      let created = 0;
      for (const item of items) {
        try {
          await akademikService.createHariLibur({
            tanggal: item.tanggal,
            keterangan: item.keterangan,
          });
          created++;
        } catch (e: unknown) {
          console.warn(`Gagal import libur ${item.keterangan}:`, e);
        }
      }
      return created;
    },
    onSuccess: (count) => {
      invalidateHariLibur();
      toast.success(`Berhasil mengimpor ${count} hari libur nasional`);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal mengimpor hari libur";
      toast.error(msg);
    },
  });

  return {
    createTahunAjaranMutation,
    updateTahunAjaranMutation,
    setAktifTahunAjaranMutation,
    deleteTahunAjaranMutation,
    createSemesterMutation,
    updateSemesterMutation,
    deleteSemesterMutation,
    createHariLiburMutation,
    updateHariLiburMutation,
    deleteHariLiburMutation,
    importHariLiburMutation,
  };
}
