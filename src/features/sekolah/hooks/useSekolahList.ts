import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { sekolahService } from "../api/sekolahService";
import type { SekolahWithCount, JenisLembaga } from "@/types/domain/sekolah";

const PAGE_SIZE = 10;

export const useSekolahList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterJenis, setFilterJenis] = useState<JenisLembaga | "ALL">("ALL");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["sekolah-list", page, search],
    queryFn: () =>
      sekolahService.getAll({ page, limit: PAGE_SIZE, search: search || undefined }),
    placeholderData: (prev) => prev,
  });

  const sekolahList: SekolahWithCount[] = data?.data ?? [];
  const total: number = (data as any)?.pagination?.total ?? sekolahList.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Client-side filter by jenis_lembaga (since backend doesn't support it yet)
  const filteredList = useMemo(() => {
    if (filterJenis === "ALL") return sekolahList;
    return sekolahList.filter((s) => s.jenis_lembaga === filterJenis);
  }, [sekolahList, filterJenis]);

  // KPI aggregations
  const kpi = useMemo(() => {
    const totalSekolah = total;
    const totalSantri = sekolahList.reduce((acc, s) => acc + (s._count?.santri ?? 0), 0);
    const totalHalaqah = sekolahList.reduce((acc, s) => acc + (s._count?.halaqah ?? 0), 0);
    const totalUser = sekolahList.reduce((acc, s) => acc + (s._count?.users ?? 0), 0);
    return { totalSekolah, totalSantri, totalHalaqah, totalUser };
  }, [sekolahList, total]);

  // Chart data: distribusi jenis lembaga
  const jenisDistribusi = useMemo(() => {
    const counts: Record<string, number> = {
      PESANTREN: 0,
      MADRASAH: 0,
      SEKOLAH_UMUM: 0,
      TPA: 0,
      Lainnya: 0,
    };
    sekolahList.forEach((s) => {
      const jenis = s.jenis_lembaga;
      if (jenis && jenis in counts) {
        counts[jenis]++;
      } else {
        counts["Lainnya"]++;
      }
    });
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [sekolahList]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    sekolahList: filteredList,
    isLoading,
    isError,
    refetch,
    search,
    setSearch: handleSearch,
    page,
    setPage,
    totalPages,
    total,
    filterJenis,
    setFilterJenis,
    kpi,
    jenisDistribusi,
  };
};
