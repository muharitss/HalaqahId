import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { santriService } from "@/features/santri/api/services/santriService";
import { useAuthStore } from "@/store/useAuthStore";
import { usePermission } from "@/lib/hooks/usePermission";
import { isKepalaRole, Role } from "@/types/domain/enums";
import { useIzinList } from "../api/queries/useIzinQueries";
import { useIzinMutations } from "../api/mutations/useIzinMutations";
import {
  type IzinFilterState,
  type IzinStatusTab,
  type IzinSantri,
  StatusIzin,
} from "../types";
import type { AjukanIzinFormValues } from "../validation/izin.schema";

export function useIzinManagement() {
  const user = useAuthStore((s) => s.user);

  // Permission evaluation: Kepala, Superadmin, or explicit izin:approve permission
  const hasApprovePerm = usePermission("izin:approve");
  const isSuperadminOrKepala = Boolean(
    user && (user.role === Role.SUPERADMIN || isKepalaRole(user.role))
  );
  const canApprove = hasApprovePerm || isSuperadminOrKepala;

  // Filter state
  const [filterState, setFilterState] = useState<IzinFilterState>({
    statusTab: "ALL",
    idSantri: undefined,
    tanggal: undefined,
    page: 1,
    limit: 50,
  });

  // Query parameters derived from filter state
  const queryParams = useMemo(() => {
    return {
      status: filterState.statusTab === "ALL" ? undefined : filterState.statusTab,
      santri: filterState.idSantri,
      tanggal: filterState.tanggal,
      page: filterState.page,
      limit: filterState.limit,
    };
  }, [filterState]);

  // Fetch Izin list
  const { data: izinResponse, isLoading: isLoadingIzin, refetch: refetchIzin } = useIzinList(queryParams);

  // Fetch unfiltered count list to display accurate badge counts on tabs
  const { data: allIzinResponse } = useIzinList({
    santri: filterState.idSantri,
    tanggal: filterState.tanggal,
    limit: 1000,
  });

  // Compute counts for tabs
  const counts = useMemo(() => {
    const list = allIzinResponse?.data || [];
    let pending = 0;
    let disetujui = 0;
    let ditolak = 0;

    for (const item of list) {
      if (item.status === StatusIzin.PENDING) pending++;
      else if (item.status === StatusIzin.DISETUJUI) disetujui++;
      else if (item.status === StatusIzin.DITOLAK) ditolak++;
    }

    return {
      all: list.length,
      pending,
      disetujui,
      ditolak,
    };
  }, [allIzinResponse?.data]);

  // Fetch Santri options for select & filter
  const { data: santriList = [] } = useQuery({
    queryKey: ["santri", "options-list"],
    queryFn: async () => {
      try {
        return await santriService.getAll();
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Dialog states
  const [isAjukanOpen, setIsAjukanOpen] = useState(false);
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    type: "approve" | "reject";
    item: IzinSantri | null;
  }>({
    open: false,
    type: "approve",
    item: null,
  });

  // Mutations
  const { ajukanIzinMutation, approveIzinMutation, rejectIzinMutation } = useIzinMutations();

  // Handlers
  const setStatusTab = (statusTab: IzinStatusTab) => {
    setFilterState((prev) => ({ ...prev, statusTab, page: 1 }));
  };

  const setSantriFilter = (idSantri?: number) => {
    setFilterState((prev) => ({ ...prev, idSantri, page: 1 }));
  };

  const setTanggalFilter = (tanggal?: string) => {
    setFilterState((prev) => ({ ...prev, tanggal, page: 1 }));
  };

  const resetFilters = () => {
    setFilterState((prev) => ({
      ...prev,
      idSantri: undefined,
      tanggal: undefined,
      page: 1,
    }));
  };

  const openApproveDialog = (item: IzinSantri) => {
    setApprovalDialog({
      open: true,
      type: "approve",
      item,
    });
  };

  const openRejectDialog = (item: IzinSantri) => {
    setApprovalDialog({
      open: true,
      type: "reject",
      item,
    });
  };

  const closeApprovalDialog = () => {
    setApprovalDialog((prev) => ({ ...prev, open: false, item: null }));
  };

  const handleAjukanSubmit = (values: AjukanIzinFormValues) => {
    ajukanIzinMutation.mutate(
      {
        id_santri: values.id_santri,
        jenis: values.jenis,
        alasan: values.alasan,
        tanggal_mulai: values.tanggal_mulai,
        tanggal_selesai: values.tanggal_selesai,
      },
      {
        onSuccess: () => {
          setIsAjukanOpen(false);
        },
      }
    );
  };

  const handleConfirmApproval = (catatan_approval?: string) => {
    if (!approvalDialog.item) return;

    const id = approvalDialog.item.id_izin;
    const isApprove = approvalDialog.type === "approve";

    if (isApprove) {
      approveIzinMutation.mutate(
        { id, payload: { catatan_approval } },
        {
          onSuccess: () => {
            closeApprovalDialog();
          },
        }
      );
    } else {
      rejectIzinMutation.mutate(
        { id, payload: { catatan_approval } },
        {
          onSuccess: () => {
            closeApprovalDialog();
          },
        }
      );
    }
  };

  return {
    izinList: izinResponse?.data || [],
    pagination: izinResponse?.pagination,
    isLoading: isLoadingIzin,
    counts,
    santriList,
    filterState,
    canApprove,
    isAjukanOpen,
    approvalDialog,
    isSubmittingAjukan: ajukanIzinMutation.isPending,
    isSubmittingApproval:
      approveIzinMutation.isPending || rejectIzinMutation.isPending,
    refetchIzin,
    setIsAjukanOpen,
    setStatusTab,
    setSantriFilter,
    setTanggalFilter,
    resetFilters,
    openApproveDialog,
    openRejectDialog,
    closeApprovalDialog,
    handleAjukanSubmit,
    handleConfirmApproval,
  };
}
