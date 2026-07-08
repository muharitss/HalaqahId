import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ExamHistoryTable } from "../components/ExamHistoryTable";

import {
  Search,
  Filter,
  FilterX,
  RefreshCw,
  FileDown,
  Loader2,
  ChevronDown,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useProgres } from "../hooks/useProgres";
import { useSetoran } from "../../setoran/hooks/useSetoran";
import { useProgresPdf } from "../hooks/useProgresPdf";
import { HistoryTable } from "../components/HistoryTable";
import { useAuth } from "@/features/auth/components/auth-provider";
import { Role } from "@/types/domain/enums";
import { SATUAN_TARGET_LABELS, TIPE_TARGET_LABELS } from "@/types/domain/target";
import type { ProgresSantri } from "../types";

type SortKey = "nama_santri" | "nama_halaqah" | "target" | "persentase" | "status";
type SortDir = "asc" | "desc";

export function ProgresSantriPage() {
  const { user } = useAuth();
  const { halaqahId } = useParams<{ halaqahId?: string }>();
  const { progresData, loading: loadingProgres, fetchProgres } = useProgres();
  const { fetchSetoranBySantri, history, loading: loadingHistory } = useSetoran();
  const { generatePdf, isGenerating } = useProgresPdf();

  const isAdmin =
    user?.role === Role.SUPERADMIN ||
    user?.role === Role.ADMIN ||
    user?.role === Role.KOORDINATOR_TAHFIZ;

  // Filter States
  const [search, setSearch] = useState("");
  const [activeHalaqah, setActiveHalaqah] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [santriSearchOpen, setSantriSearchOpen] = useState(false);

  // Sorting States
  const [sortKey, setSortKey] = useState<SortKey>("nama_santri");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Modal Detail State
  const [selectedSantriForHistory, setSelectedSantriForHistory] = useState<ProgresSantri | null>(null);

  // Derived list of unique Halaqahs
  const halaqahNames = useMemo(() => {
    const names = new Set<string>();
    progresData.forEach((s) => {
      if (s.nama_halaqah) names.add(s.nama_halaqah);
    });
    return Array.from(names).sort();
  }, [progresData]);

  // Computed effective active halaqah
  const effectiveActiveHalaqah = useMemo(() => {
    if (activeHalaqah !== "") {
      return activeHalaqah;
    }
    if (halaqahId && progresData.length > 0) {
      const match = progresData.find((s) => s.id_halaqah.toString() === halaqahId);
      if (match) return match.nama_halaqah;
    }
    return "all";
  }, [halaqahId, progresData, activeHalaqah]);

  // Derived list of unique Santri names
  const santriNames = useMemo(() => {
    const names = new Set<string>();
    progresData.forEach((s) => {
      if (
        effectiveActiveHalaqah === "all" ||
        effectiveActiveHalaqah === "" ||
        s.nama_halaqah === effectiveActiveHalaqah
      ) {
        names.add(s.nama_santri);
      }
    });
    return Array.from(names).sort();
  }, [progresData, effectiveActiveHalaqah]);

  const handleResetFilters = () => {
    setSearch("");
    setActiveHalaqah(halaqahId && progresData.length > 0 ? (progresData.find(s => s.id_halaqah.toString() === halaqahId)?.nama_halaqah || "all") : "all");
    setSelectedStatus("all");
  };

  const isFilterActive =
    search !== "" ||
    (activeHalaqah !== "" && activeHalaqah !== "all") ||
    selectedStatus !== "all";

  // Filter progress data based on active search & selections
  const filteredProgresData = useMemo(() => {
    return progresData.filter((item) => {
      if (search !== "") {
        const q = search.toLowerCase();
        const matchName = item.nama_santri.toLowerCase().includes(q);
        const matchHalaqah = item.nama_halaqah.toLowerCase().includes(q);
        if (!matchName && !matchHalaqah) return false;
      }
      if (effectiveActiveHalaqah !== "all" && effectiveActiveHalaqah !== "") {
        if (item.nama_halaqah !== effectiveActiveHalaqah) return false;
      }
      if (selectedStatus !== "all" && selectedStatus !== "") {
        if (item.progres.status !== selectedStatus) return false;
      }
      return true;
    });
  }, [progresData, search, effectiveActiveHalaqah, selectedStatus]);

  // Sort filtered data
  const sortedFilteredData = useMemo(() => {
    return [...filteredProgresData].sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";

      if (sortKey === "nama_santri") {
        av = a.nama_santri.toLowerCase();
        bv = b.nama_santri.toLowerCase();
      } else if (sortKey === "nama_halaqah") {
        av = a.nama_halaqah.toLowerCase();
        bv = b.nama_halaqah.toLowerCase();
      } else if (sortKey === "persentase") {
        av = a.progres.persentase;
        bv = b.progres.persentase;
      } else if (sortKey === "target") {
        av = a.target?.nilai_target ?? 0;
        bv = b.target?.nilai_target ?? 0;
      } else if (sortKey === "status") {
        const order = { TERCAPAI: 0, DALAM_PROSES: 1, BELUM_MULAI: 2, BEBAS: 3 };
        av = order[a.progres.status] ?? 4;
        bv = order[b.progres.status] ?? 4;
      }

      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [filteredProgresData, sortKey, sortDir]);

  // Count active stats based on active halaqah
  const stats = useMemo(() => {
    const dataForStats = progresData.filter((item) => {
      if (effectiveActiveHalaqah !== "all" && effectiveActiveHalaqah !== "") {
        return item.nama_halaqah === effectiveActiveHalaqah;
      }
      return true;
    });
    const total = dataForStats.length;
    const tercapai = dataForStats.filter((s) => s.progres.status === "TERCAPAI").length;
    const dalamProses = dataForStats.filter((s) => s.progres.status === "DALAM_PROSES").length;
    const belumMulai = dataForStats.filter((s) => s.progres.status === "BELUM_MULAI").length;
    const bebas = dataForStats.filter((s) => s.progres.status === "BEBAS").length;

    const butuhPerhatian = dataForStats.filter((s) => {
      const lastDateStr = s.progres.tanggal_setoran_terakhir;
      if (!lastDateStr) {
        return s.target ? true : false;
      }
      const lastDate = new Date(lastDateStr);
      const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 3;
    }).length;

    return { total, tercapai, dalamProses, belumMulai, bebas, butuhPerhatian };
  }, [progresData, effectiveActiveHalaqah]);

  // PDF download handler
  const handleDownloadPdf = async () => {
    if (filteredProgresData.length === 0) {
      toast.warning("Tidak ada data progres untuk di-export");
      return;
    }

    try {
      await generatePdf({
        progresData: filteredProgresData,
        stats,
        activeHalaqah: effectiveActiveHalaqah,
        periodLabel: "Periode Target Aktif",
        namaSekolah: "Halaqah ID",
      });
      toast.success("Laporan PDF progres berhasil diunduh!");
    } catch (err) {
      console.error("Progress PDF error:", err);
      toast.error("Gagal mengunduh laporan PDF, silakan coba lagi");
    }
  };

  const kpiCards = [
    {
      title: "Target Tercapai",
      value: stats.tercapai,
      subtitle: `${stats.total} santri terdaftar`,
    },
    {
      title: "Dalam Proses",
      value: stats.dalamProses,
      subtitle: "Sedang berprogres",
    },
    {
      title: "Belum Mulai",
      value: stats.belumMulai,
      subtitle: "Belum ada setoran",
    },
    {
      title: "Butuh Perhatian",
      value: stats.butuhPerhatian,
      subtitle: "Pasif > 3 hari",
    },
  ];

  const toggleSortHandler = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (col: SortKey) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 ml-1.5 opacity-30" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1.5 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1.5 text-primary" />
    );
  };

  const activeTargetLabel = selectedSantriForHistory?.target
    ? `${selectedSantriForHistory.target.nilai_target} ${SATUAN_TARGET_LABELS[selectedSantriForHistory.target.satuan as keyof typeof SATUAN_TARGET_LABELS] ?? selectedSantriForHistory.target.satuan} / ${TIPE_TARGET_LABELS[selectedSantriForHistory.target.tipe as keyof typeof TIPE_TARGET_LABELS]?.toLowerCase() ?? selectedSantriForHistory.target.tipe.toLowerCase()}`
    : "Tanpa Target";

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "TERCAPAI":
        return "default";
      case "DALAM_PROSES":
        return "secondary";
      case "BELUM_MULAI":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── STANDARD PAGE HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Progres Hafalan Santri
          </h1>
          <p className="text-sm text-muted-foreground">
            Realisasi target capaian setoran hafalan santri yang aktif saat ini.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchProgres()}
            disabled={loadingProgres}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loadingProgres && "animate-spin")} />
            Refresh
          </Button>
          
          <Button
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isGenerating || loadingProgres || filteredProgresData.length === 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Membuat PDF...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Unduh PDF Progres
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── KPI METRICS SECTION ── */}
      {!loadingProgres && progresData.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card) => (
            <Card key={card.title} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── MAIN TABLE CARD ── */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">Daftar Progres Hafalan</h3>
            <Badge variant="secondary" className="font-bold">
              {filteredProgresData.length} Santri
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama santri..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button
              variant={isFilterActive ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilter && (
          <div className="p-6 border-b bg-muted/20 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Saring Data Progres
              </h4>
              {isFilterActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-semibold"
                  onClick={handleResetFilters}
                >
                  <FilterX className="h-4 w-4 mr-2" />
                  Reset Filter
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {isAdmin && (
                <Select value={effectiveActiveHalaqah} onValueChange={setActiveHalaqah}>
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder="Semua Halaqah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Halaqah</SelectItem>
                    {halaqahNames.map((name) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Popover open={santriSearchOpen} onOpenChange={setSantriSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 justify-between w-[180px] font-normal"
                  >
                    <span className="truncate">{search || "Pilih Santri"}</span>
                    <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Cari nama..." className="h-9" />
                    <CommandEmpty>Santri tidak ditemukan</CommandEmpty>
                    <CommandGroup className="max-h-52 overflow-y-auto">
                      <CommandItem
                        value=""
                        onSelect={() => {
                          setSearch("");
                          setSantriSearchOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", search === "" ? "opacity-100" : "opacity-0")} />
                        Semua Santri
                      </CommandItem>
                      {santriNames.map((s) => (
                        <CommandItem
                          key={s}
                          value={s}
                          onSelect={() => {
                            setSearch(s);
                            setSantriSearchOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", search === s ? "opacity-100" : "opacity-0")} />
                          {s}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-9 w-[160px]">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="TERCAPAI">Tercapai</SelectItem>
                  <SelectItem value="DALAM_PROSES">Dalam Proses</SelectItem>
                  <SelectItem value="BELUM_MULAI">Belum Mulai</SelectItem>
                  <SelectItem value="BEBAS">Tanpa Target</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>
        )}

        {/* Table list */}
        <div className="overflow-x-auto">
          {loadingProgres ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span>Memuat data progres...</span>
            </div>
          ) : sortedFilteredData.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Data progres tidak ditemukan.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSortHandler("nama_santri")}
                      className="hover:bg-transparent -ml-4"
                    >
                      Santri {renderSortIcon("nama_santri")}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSortHandler("nama_halaqah")}
                      className="hover:bg-transparent -ml-4"
                    >
                      Halaqah {renderSortIcon("nama_halaqah")}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSortHandler("target")}
                      className="hover:bg-transparent -ml-4"
                    >
                      Target Aktif {renderSortIcon("target")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSortHandler("persentase")}
                      className="hover:bg-transparent -ml-4"
                    >
                      Capaian {renderSortIcon("persentase")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSortHandler("status")}
                      className="hover:bg-transparent -ml-4"
                    >
                      Status {renderSortIcon("status")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedFilteredData.map((row) => {
                  const targetLabel = row.target
                    ? `${row.target.nilai_target} ${SATUAN_TARGET_LABELS[row.target.satuan as keyof typeof SATUAN_TARGET_LABELS] ?? row.target.satuan} / ${TIPE_TARGET_LABELS[row.target.tipe as keyof typeof TIPE_TARGET_LABELS]?.toLowerCase() ?? row.target.tipe.toLowerCase()}`
                    : "Tanpa Target";

                  const lastDateStr = row.progres.tanggal_setoran_terakhir;
                  let ewsLabel = "";
                  if (!lastDateStr) {
                    if (row.target) {
                      ewsLabel = "Belum Mulai";
                    }
                  } else {
                    const lastDate = new Date(lastDateStr);
                    const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (diffDays >= 3) {
                      ewsLabel = `Pasif ${diffDays} Hari`;
                    }
                  }

                  return (
                    <TableRow key={row.id_santri}>
                      <TableCell className="pl-6 py-4">
                        <div className="font-semibold">{row.nama_santri}</div>
                        <div className="text-xs text-muted-foreground md:hidden mt-0.5">{row.nama_halaqah}</div>
                        {ewsLabel && (
                          <div className="mt-1">
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                              {ewsLabel}
                            </Badge>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {row.nama_halaqah}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {targetLabel}
                      </TableCell>
                      <TableCell>
                        {row.target ? (
                          <div className="flex flex-col gap-1 w-28">
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                              <span>{row.progres.capaian}/{row.target.nilai_target}</span>
                              <span>{row.progres.persentase}%</span>
                            </div>
                            <Progress value={row.progres.persentase} className="h-1.5" />
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">{row.progres.jumlah_setoran} setoran</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(row.progres.status)}>
                          {row.progres.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            fetchSetoranBySantri(row.id_santri);
                            setSelectedSantriForHistory(row);
                          }}
                        >
                          <History className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          Riwayat
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* ── DETAIL MODAL DIALOG ── */}
      <Dialog
        open={!!selectedSantriForHistory}
        onOpenChange={(open) => !open && setSelectedSantriForHistory(null)}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-lg font-bold">
              Riwayat Setoran — {selectedSantriForHistory?.nama_santri}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              {selectedSantriForHistory?.nama_halaqah} · Target: {activeTargetLabel}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedSantriForHistory && (
              <Tabs defaultValue="setoran" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-6">
                  <TabsTrigger value="setoran">Riwayat Setoran</TabsTrigger>
                  <TabsTrigger value="ujian">Riwayat Ujian</TabsTrigger>
                </TabsList>
                
                <TabsContent value="setoran">
                  {loadingHistory ? (
                    <div className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span>Mengambil riwayat setoran...</span>
                    </div>
                  ) : (
                    <HistoryTable
                      santri={selectedSantriForHistory}
                      history={history}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="ujian">
                  <ExamHistoryTable santri={selectedSantriForHistory} />
                </TabsContent>
              </Tabs>
            )}
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
