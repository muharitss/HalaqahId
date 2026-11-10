import { useState } from "react";
import { useSekolahList } from "@/features/sekolah/hooks/useSekolahList";
import { SuperadminKpiCards } from "../components/SuperadminKpiCards";
import { SekolahTable } from "../components/SekolahTable";
import { JenisLembagaChart } from "../components/JenisLembagaChart";
import { TenantGrowthChart } from "../components/TenantGrowthChart";
import { RecentActivityCard } from "../components/RecentActivityCard";
import { SekolahDetailSheet } from "../components/SekolahDetailSheet";
import type { SekolahWithCount, JenisLembaga } from "@/types/domain/sekolah";
import { useQuery } from "@tanstack/react-query";
import { sekolahService } from "@/features/sekolah/api/services/sekolahService";
import { SystemHealthPanel } from "../components/SystemHealthPanel";
import { tenantAdminApi } from "@/features/tenant/api/tenant-admin.api";
import { useAuditLogs } from "@/features/auth/api/queries/useAuditLogs";

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

  // Fetch tenants for tenant count & monthly growth chart
  const { data: tenantResult, isLoading: isTenantsLoading } = useQuery({
    queryKey: ["superadmin-tenants-summary"],
    queryFn: async () => {
      return await tenantAdminApi.listTenants({ limit: 100 });
    },
  });

  // Fetch recent audit logs for activity feed
  const { data: auditLogData, isLoading: isLogsLoading } = useAuditLogs({ limit: 6 });

  const tenants = tenantResult?.tenants || [];
  const totalTenantCount = tenantResult?.meta?.total ?? tenants.length;

  const platformKpis = {
    totalTenant: totalTenantCount,
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
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-0">
            Superadmin Dashboard
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-0">
            Monitor semua tenant sekolah dan aktivitas platform secara terpusat.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <SuperadminKpiCards kpi={platformKpis} isLoading={isLoading || isHealthLoading || isTenantsLoading} />

      {/* Section: Pertumbuhan Tenant & Recent Activity */}
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TenantGrowthChart tenants={tenants} isLoading={isTenantsLoading} />
        </div>
        <div className="lg:col-span-2">
          <RecentActivityCard logs={auditLogData?.data || []} isLoading={isLogsLoading} />
        </div>
      </div>

      {/* Section: Tenant Table + Health & Jenis */}
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
