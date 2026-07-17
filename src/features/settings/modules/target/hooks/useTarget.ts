import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { targetService } from "../../../api";
import type { TargetSekolah, CreateTargetRequest, UpdateTargetRequest } from "@/types/domain/target";
import { toast } from "sonner";

const QUERY_KEY = ["target-sekolah"];

/**
 * Hook untuk mengambil daftar target sekolah.
 * Data di-cache dan hanya refetch jika stale.
 */
export const useTargetList = () => {
  return useQuery<TargetSekolah[], Error>({
    queryKey: QUERY_KEY,
    queryFn: () => targetService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 menit
  });
};

/**
 * Hook untuk membuat target baru.
 */
export const useCreateTarget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTargetRequest) => targetService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Target berhasil ditambahkan");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
};

/**
 * Hook untuk mengupdate target yang sudah ada.
 */
export const useUpdateTarget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTargetRequest }) =>
      targetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Target berhasil diperbarui");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
};

/**
 * Hook untuk menghapus target.
 */
export const useDeleteTarget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => targetService.remove(id),
    onSuccess: (data: { affected_santri: number }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      if (data.affected_santri > 0) {
        toast.warning(
          `Target dihapus. ${data.affected_santri} santri kini tidak memiliki target.`
        );
      } else {
        toast.success("Target berhasil dihapus");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
};
