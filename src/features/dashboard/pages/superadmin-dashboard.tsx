import { useState } from "react";
import { useSekolahList } from "@/features/sekolah/hooks/useSekolahList";
import { SuperadminKpiCards } from "../components/SuperadminKpiCards";
import { SekolahTable } from "../components/SekolahTable";
import { JenisLembagaChart } from "../components/JenisLembagaChart";
import { SekolahDetailSheet } from "../components/SekolahDetailSheet";
import type { SekolahWithCount, JenisLembaga } from "@/types/domain/sekolah";
import { useQuery } from "@tanstack/react-query";
import { sekolahService } from "@/features/sekolah";
import { SystemHealthPanel } from "../components/SystemHealthPanel";

export function SuperadminDashboard() {
  const {
    sekolahList,
    isLoading,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    total,
    filterJenis,
    setFilterJenis,
    kpi,
    jenisDistribusi,
  } = useSekolahList();

  const [selectedSekolah, setSelectedSekolah] = useState<SekolahWithCount | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Fetch live server health and database global counts
  const { data: healthData, isLoading: isHealthLoading } = useQuery({
    queryKey: ["superadmin-system-health"],
    queryFn: async () => {
      const res = await sekolahService.getSystemHealth();
      return res.data;
    },
    refetchInterval: 30000, // Auto refresh every 30s
  });

  const platformKpis = {
    totalSekolah: healthData?.stats?.totalSchools ?? kpi.totalSekolah,
    totalSantri: healthData?.stats?.totalSantri ?? kpi.totalSantri,
    totalHalaqah: healthData?.stats?.totalHalaqah ?? kpi.totalHalaqah,
    totalUser: healthData?.stats?.totalUsers ?? kpi.totalUser,
  };

  const handleDetail = (sekolah: SekolahWithCount) => {
    setSelectedSekolah(sekolah);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Superadmin Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Monitor semua tenant sekolah dan aktivitas platform Halaqah.id
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <SuperadminKpiCards kpi={platformKpis} isLoading={isLoading || isHealthLoading} />

      {/* Chart + Table */}
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-5">
        {/* Tenant Table — 3/5 */}
        <div className="lg:col-span-3">
          <SekolahTable
            sekolahList={sekolahList}
            isLoading={isLoading}
            search={search}
            onSearch={setSearch}
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            filterJenis={filterJenis}
            onFilterJenis={(v) => setFilterJenis(v as JenisLembaga | "ALL")}
            onDetail={handleDetail}
          />
        </div>

        {/* Sidebar Widgets — 2/5 */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <JenisLembagaChart data={jenisDistribusi} isLoading={isLoading} />
          <SystemHealthPanel health={healthData?.health} isLoading={isHealthLoading} />
        </div>
      </div>

      {/* Detail Sheet */}
      <SekolahDetailSheet
        sekolah={selectedSekolah}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
