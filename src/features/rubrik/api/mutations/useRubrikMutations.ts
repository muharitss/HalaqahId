import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rubrikService } from "../services/rubrikService";
import { rubrikKeys } from "../queries/useRubrikQueries";
import type {
  CreateRubrikPayload,
  UpdateRubrikPayload,
  CreateKriteriaPayload,
  UpdateKriteriaPayload,
} from "../../types";

export function useRubrikMutations() {
  const queryClient = useQueryClient();

  const invalidateRubrik = () => {
    queryClient.invalidateQueries({ queryKey: rubrikKeys.all });
    queryClient.invalidateQueries({ queryKey: ["kategori-setoran"] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateRubrikPayload) => rubrikService.create(payload),
    onSuccess: invalidateRubrik,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRubrikPayload }) =>
      rubrikService.update(id, payload),
    onSuccess: invalidateRubrik,
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => rubrikService.remove(id),
    onSuccess: invalidateRubrik,
  });

  const addKriteriaMutation = useMutation({
    mutationFn: ({
      rubrikId,
      payload,
    }: {
      rubrikId: number;
      payload: CreateKriteriaPayload;
    }) => rubrikService.addKriteria(rubrikId, payload),
    onSuccess: invalidateRubrik,
  });

  const updateKriteriaMutation = useMutation({
    mutationFn: ({
      rubrikId,
      kriteriaId,
      payload,
    }: {
      rubrikId: number;
      kriteriaId: number;
      payload: UpdateKriteriaPayload;
    }) => rubrikService.updateKriteria(rubrikId, kriteriaId, payload),
    onSuccess: invalidateRubrik,
  });

  const deleteKriteriaMutation = useMutation({
    mutationFn: ({
      rubrikId,
      kriteriaId,
    }: {
      rubrikId: number;
      kriteriaId: number;
    }) => rubrikService.deleteKriteria(rubrikId, kriteriaId),
    onSuccess: invalidateRubrik,
  });

  const linkKategoriMutation = useMutation({
    mutationFn: ({
      rubrikId,
      id_kategori,
    }: {
      rubrikId: number;
      id_kategori: number;
    }) => rubrikService.linkKategori(rubrikId, id_kategori),
    onSuccess: invalidateRubrik,
  });

  const unlinkKategoriMutation = useMutation({
    mutationFn: ({
      rubrikId,
      id_kategori,
    }: {
      rubrikId: number;
      id_kategori: number;
    }) => rubrikService.unlinkKategori(rubrikId, id_kategori),
    onSuccess: invalidateRubrik,
  });

  return {
    createMutation,
    updateMutation,
    removeMutation,
    addKriteriaMutation,
    updateKriteriaMutation,
    deleteKriteriaMutation,
    linkKategoriMutation,
    unlinkKategoriMutation,
  };
}
