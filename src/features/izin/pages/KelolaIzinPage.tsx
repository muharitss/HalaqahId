import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-primary" />
            Kelola Izin <Term code="SANTRI" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pencatatan dan persetujuan izin santri yang otomatis terintegrasi dengan absensi halaqah.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchIzin()}
            disabled={isLoading}
            className="h-9 gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAjukanOpen(true)}
            className="h-9 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Ajukan Izin
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-xs border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Pengajuan</p>
              <p className="text-2xl font-bold mt-1 text-foreground">{counts.all}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Menunggu Persetujuan</p>
              <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
                {counts.pending}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Disetujui</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                {counts.disetujui}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Ditolak</p>
              <p className="text-2xl font-bold mt-1 text-destructive">
                {counts.ditolak}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive">
              <XCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
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
