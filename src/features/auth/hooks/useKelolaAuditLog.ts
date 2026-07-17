import { useState } from "react";
import { useAuditLogs } from "../api";
import { useSekolahQueryList } from "@/features/sekolah";
import { type AuditLog } from "../types";

const PAGE_SIZE = 15;

export function useKelolaAuditLog() {
  // Filters
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [schoolFilter, setSchoolFilter] = useState<string>("ALL");

  // Pagination
  const [page, setPage] = useState(1);

  // Fetch schools using React Query
  const { data: schoolsData } = useSekolahQueryList(1, 100);
  const schools = schoolsData?.data || [];

  // React Query Hook for Audit Logs
  const { data: logsData, isLoading } = useAuditLogs({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
    action: actionFilter !== "ALL" ? actionFilter : undefined,
    id_sekolah: schoolFilter !== "ALL" ? parseInt(schoolFilter) : undefined,
  });

  const logs = (logsData?.data || []) as AuditLog[];
  const totalLogs = logsData?.pagination?.total ?? logsData?.data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalLogs / PAGE_SIZE));

  const handleSetSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleSetActionFilter = (val: string) => {
    setActionFilter(val);
    setPage(1);
  };

  const handleSetSchoolFilter = (val: string) => {
    setSchoolFilter(val);
    setPage(1);
  };

  return {
    search,
    setSearch: handleSetSearch,
    actionFilter,
    setActionFilter: handleSetActionFilter,
    schoolFilter,
    setSchoolFilter: handleSetSchoolFilter,
    page,
    setPage,
    schools,
    logs,
    isLoading,
    totalLogs,
    totalPages,
  };
}
