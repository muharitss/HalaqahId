import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RefreshCw, BookOpen, BarChart3, Users, Sparkles } from "lucide-react";
import { Term } from "@/components/ui/Term";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

import { santriService } from "@/features/santri";
import { halaqahManagementService } from "@/features/halaqah/api/halaqahManagementService";
import {
  useSantriProgressList,
  useSantriProgressSummary,
} from "../api/queries/useProgressQueries";
import { useProgressMutations } from "../api/mutations/useProgressMutations";
import {
  ProgressOverviewCards,
  QuranProgressGrid,
  ProgressChart,
  UpdateSurahProgressModal,
} from "../components";
import type { SurahProgressItem } from "../types";

export function ProgressDashboard() {
  const [selectedHalaqahId, setSelectedHalaqahId] = useState<string>("ALL");
  const [selectedSantriId, setSelectedSantriId] = useState<number | undefined>(undefined);
  const [selectedSurah, setSelectedSurah] = useState<SurahProgressItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [backfillConfirmOpen, setBackfillConfirmOpen] = useState(false);
  const [isBackfilling, setIsBackfilling] = useState(false);

  // Fetch halaqah list
  const { data: halaqahList = [] } = useQuery({
    queryKey: ["halaqah", "list"],
    queryFn: () => halaqahManagementService.getAllHalaqah(),
  });

  // Fetch santri list
  const { data: rawSantriList = [], isLoading: isLoadingSantri } = useQuery({
    queryKey: ["santri", "all"],
    queryFn: () => santriService.getAll(),
  });

  // Filter santri based on halaqah
  const filteredSantriList = useMemo(() => {
    if (selectedHalaqahId === "ALL") return rawSantriList;
    return rawSantriList.filter(
      (s) => s.id_halaqah?.toString() === selectedHalaqahId
    );
  }, [rawSantriList, selectedHalaqahId]);

  // Auto-select first santri if none selected
  useEffect(() => {
    if (filteredSantriList.length > 0) {
      if (!selectedSantriId || !filteredSantriList.some((s) => s.id_santri === selectedSantriId)) {
        setSelectedSantriId(filteredSantriList[0].id_santri);
      }
    } else {
      setSelectedSantriId(undefined);
    }
  }, [filteredSantriList, selectedSantriId]);

  // Fetch progress & summary for selected santri
  const { data: summaryData = null, isLoading: isLoadingSummary } =
    useSantriProgressSummary(selectedSantriId);
  const { data: suratList = [], isLoading: isLoadingSurat } =
    useSantriProgressList(selectedSantriId);

  const { backfillMutation } = useProgressMutations(selectedSantriId);

  const handleOpenSurahDetail = (surah: SurahProgressItem) => {
    setSelectedSurah(surah);
    setModalOpen(true);
  };

  const handleBackfill = async () => {
    if (!selectedSantriId) return;
    setIsBackfilling(true);
    try {
      const res = await backfillMutation.mutateAsync();
      const updated = res.data?.total_surat_updated ?? 0;
      toast.success(
        `Sinkronisasi berhasil! ${updated} status surat telah diperbarui dari riwayat setoran.`
      );
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal melakukan sinkronisasi"));
    } finally {
      setIsBackfilling(false);
      setBackfillConfirmOpen(false);
    }
  };

  const currentSantri = filteredSantriList.find((s) => s.id_santri === selectedSantriId);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Progress Hafalan <Term code="SANTRI" />
            </h1>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3 text-primary" />
              114 Surat
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            Visualisasi peta capaian hafalan 30 Juz dan 114 surat Al-Quran per <Term code="SANTRI" />.
          </p>
        </div>

        {/* Action: Sinkronkan dari Setoran */}
        {selectedSantriId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBackfillConfirmOpen(true)}
            disabled={isBackfilling}
            className="gap-2 shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isBackfilling ? "animate-spin" : ""}`} />
            Sinkronkan Setoran
          </Button>
        )}
      </div>

      {/* Filter Bar: Halaqah & Santri */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-center">
            {/* Halaqah Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Pilih <Term code="HALAQAH" />
              </label>
              <Select
                value={selectedHalaqahId}
                onValueChange={(val) => setSelectedHalaqahId(val)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder={`Semua ${<Term code="HALAQAH" />}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Halaqah</SelectItem>
                  {halaqahList.map((h) => (
                    <SelectItem key={h.id_halaqah} value={h.id_halaqah.toString()}>
                      {h.name_halaqah}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Santri Filter */}
            <div className="space-y-1.5 sm:col-span-1 md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Pilih <Term code="SANTRI" />
              </label>
              <Select
                value={selectedSantriId?.toString() || ""}
                onValueChange={(val) => setSelectedSantriId(Number(val))}
                disabled={isLoadingSantri || filteredSantriList.length === 0}
              >
                <SelectTrigger className="h-9 text-xs font-medium">
                  <SelectValue placeholder={isLoadingSantri ? "Memuat data santri..." : `Pilih ${<Term code="SANTRI" />}`} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {filteredSantriList.map((s) => (
                    <SelectItem key={s.id_santri} value={s.id_santri.toString()}>
                      {s.nama_santri} {s.nomor_induk_santri ? `(${s.nomor_induk_santri})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {!selectedSantriId ? (
        <Card className="p-12 text-center space-y-3 border-dashed">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
          <p className="text-sm font-semibold text-muted-foreground">
            Pilih seorang <Term code="SANTRI" /> untuk melihat peta progres hafalannya.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Overview Metric Cards */}
          <ProgressOverviewCards
            summaryData={summaryData}
            isLoading={isLoadingSummary}
          />

          {/* Visual Tabs: Quran Grid vs Charts */}
          <Tabs defaultValue="grid" className="w-full space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <TabsList className="h-9">
                <TabsTrigger value="grid" className="gap-1.5 text-xs">
                  <BookOpen className="h-3.5 w-3.5" />
                  Peta 114 Surat
                </TabsTrigger>
                <TabsTrigger value="charts" className="gap-1.5 text-xs">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Grafik & Capaian 30 Juz
                </TabsTrigger>
              </TabsList>

              {currentSantri && (
                <div className="text-xs text-muted-foreground hidden sm:block">
                  Santri: <span className="font-semibold text-foreground">{currentSantri.nama_santri}</span>
                </div>
              )}
            </div>

            <TabsContent value="grid" className="space-y-4 pt-1">
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Peta Status 114 Surat Al-Quran</CardTitle>
                  <CardDescription className="text-xs">
                    Klik pada kotak surat untuk melihat rincian atau mengubah status hafalan secara manual.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuranProgressGrid
                    suratList={suratList}
                    isLoading={isLoadingSurat}
                    onSelectSurah={handleOpenSurahDetail}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="charts" className="space-y-4 pt-1">
              <ProgressChart summaryData={summaryData} suratList={suratList} />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Edit Surah Progress Modal */}
      <UpdateSurahProgressModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        surah={selectedSurah}
        santriId={selectedSantriId}
      />

      {/* Confirm Backfill Dialog */}
      <AlertDialog
        open={backfillConfirmOpen}
        onOpenChange={setBackfillConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sinkronkan Riwayat Setoran?</AlertDialogTitle>
            <AlertDialogDescription>
              Sistem akan memindai seluruh data setoran historis santri ini dan menghitung ulang status ketuntasan tiap surat secara otomatis.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBackfilling}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBackfill}
              disabled={isBackfilling}
            >
              {isBackfilling ? "Memproses..." : "Sinkronkan Sekarang"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ProgressDashboard;
