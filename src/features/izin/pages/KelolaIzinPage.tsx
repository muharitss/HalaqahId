import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Term } from "@/components/ui/Term";
import { useIzinManagement } from "../hooks/useIzinManagement";
import { IzinFilterBar } from "../components/IzinFilterBar";
import { IzinTable } from "../components/IzinTable";
import { AjukanIzinDialog } from "../components/AjukanIzinDialog";
import { ApprovalConfirmDialog } from "../components/ApprovalConfirmDialog";
import { StatusIzin, type IzinStatusTab } from "../types";

export function KelolaIzinPage() {
  const {
    izinList,
    isLoading,
    counts,
    santriList,
    filterState,
    canApprove,
    isAjukanOpen,
    approvalDialog,
    isSubmittingAjukan,
    isSubmittingApproval,
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
  } = useIzinManagement();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Kelola Izin <Term code="SANTRI" />
          </h1>
          <p className="text-muted-foreground text-sm">
            Pencatatan dan persetujuan izin santri yang otomatis terintegrasi dengan absensi halaqah
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchIzin()}
            disabled={isLoading}
            className="shadow-sm gap-1.5 text-xs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAjukanOpen(true)}
            className="shadow-sm gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            Ajukan Izin
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Pengajuan",
            value: counts.all,
            desc: "Semua riwayat izin santri",
            icon: FileCheck2,
            color: "text-primary",
          },
          {
            label: "Menunggu Persetujuan",
            value: counts.pending,
            desc: "Perlu verifikasi & persetujuan",
            icon: Clock,
            color: "text-amber-500",
          },
          {
            label: "Disetujui",
            value: counts.disetujui,
            desc: "Telah diverifikasi & disetujui",
            icon: CheckCircle2,
            color: "text-emerald-500",
          },
          {
            label: "Ditolak",
            value: counts.ditolak,
            desc: "Pengajuan izin tidak disetujui",
            icon: XCircle,
            color: "text-destructive",
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground mt-1 truncate">
                  {card.desc}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Tabs
            value={filterState.statusTab}
            onValueChange={(val) => setStatusTab(val as IzinStatusTab)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-4 sm:flex h-auto p-1 bg-muted/60">
              <TabsTrigger value="ALL" className="text-xs sm:text-sm gap-1.5 py-1.5">
                Semua
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4">
                  {counts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value={StatusIzin.PENDING} className="text-xs sm:text-sm gap-1.5 py-1.5">
                Pending
                {counts.pending > 0 && (
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-1.5 py-0 text-[10px] h-4">
                    {counts.pending}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value={StatusIzin.DISETUJUI} className="text-xs sm:text-sm gap-1.5 py-1.5">
                Disetujui
                <Badge variant="outline" className="px-1.5 py-0 text-[10px] h-4 text-emerald-600 border-emerald-300">
                  {counts.disetujui}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value={StatusIzin.DITOLAK} className="text-xs sm:text-sm gap-1.5 py-1.5">
                Ditolak
                <Badge variant="outline" className="px-1.5 py-0 text-[10px] h-4 text-destructive border-destructive/30">
                  {counts.ditolak}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filter Bar */}
        <IzinFilterBar
          santriList={santriList}
          selectedSantriId={filterState.idSantri}
          selectedTanggal={filterState.tanggal}
          onSantriChange={setSantriFilter}
          onTanggalChange={setTanggalFilter}
          onReset={resetFilters}
        />

        {/* Table of Izin */}
        <IzinTable
          data={izinList}
          isLoading={isLoading}
          canApprove={canApprove}
          onApprove={openApproveDialog}
          onReject={openRejectDialog}
        />
      </div>

      {/* Dialogs */}
      <AjukanIzinDialog
        open={isAjukanOpen}
        onOpenChange={setIsAjukanOpen}
        santriList={santriList}
        onSubmit={handleAjukanSubmit}
        isLoading={isSubmittingAjukan}
      />

      <ApprovalConfirmDialog
        open={approvalDialog.open}
        onOpenChange={(open) => !open && closeApprovalDialog()}
        type={approvalDialog.type}
        item={approvalDialog.item}
        onConfirm={handleConfirmApproval}
        isLoading={isSubmittingApproval}
      />
    </div>
  );
}

export default KelolaIzinPage;
