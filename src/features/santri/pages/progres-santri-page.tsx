import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { sekolahService } from "@/features/sekolah";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Components & hooks will be imported from sub-modules below

import {
  Search,
  Filter,
  FilterX,
  RefreshCw,
  FileDown,
  Loader2,
  ChevronDown,
  Check,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useProgres, useProgresPdf } from "../modules";
import { useSetoranHistory } from "@/features/setoran";
import { useAuth } from "@/features/auth/components/auth-provider";
import { PdfPreviewDialog } from "@/components/custom/pdf-preview-dialog";
import { Role } from "@/types/domain/enums";
import {
  SATUAN_TARGET_LABELS,
  TIPE_TARGET_LABELS,
} from "@/types/domain/target";
import type { ProgresSantri } from "../types";

type SortKey = "nama_santri" | "nama_halaqah" | "target" | "persentase" | "status";
type SortDir = "asc" | "desc";

interface SantriProgresCollapsibleDetailProps {
  santri: ProgresSantri;
  filters: {
    selectedMonth: number | null;
    selectedYear: number | null;
    dateFrom: Date | null;
    dateTo: Date | null;
    selectedKategori: string;
  };
}

function SantriProgresCollapsibleDetail({ santri, filters }: SantriProgresCollapsibleDetailProps) {
  const { selectedMonth, selectedYear, dateFrom, dateTo, selectedKategori } = filters;
  const { data: history = [], isFetching: loadingHistory } = useSetoranHistory(santri.id_santri);

  const getKategoriName = (item: any) => {
    if (typeof item.kategori === "object" && item.kategori) {
      return item.kategori.nama_kategori;
    }
    return item.kategori || "HAFALAN";
  };

  const getKategoriBadgeVariant = (kategoriName: string) => {
    switch (kategoriName.toUpperCase()) {
      case "HAFALAN":
        return "default";
      case "MURAJAAH":
        return "secondary";
      case "ZIYADAH":
        return "outline";
      default:
        return "outline";
    }
  };

  const isDateRangeMode = dateFrom !== null || dateTo !== null;

  const filteredHistory = useMemo(() => {
    return history.filter((item: any) => {
      // 1. Kategori Filter
      const catName = getKategoriName(item);
      if (
        selectedKategori &&
        selectedKategori !== "all" &&
        selectedKategori !== "" &&
        catName.toUpperCase() !== selectedKategori.toUpperCase()
      ) {
        return false;
      }

      // 2. Date Range / Month-Year Filter
      const date = new Date(item.tanggal_setoran);
      if (isDateRangeMode) {
        if (dateFrom) {
          const start = new Date(dateFrom);
          start.setHours(0, 0, 0, 0);
          if (date < start) return false;
        }
        if (dateTo) {
          const end = new Date(dateTo);
          end.setHours(23, 59, 59, 999);
          if (date > end) return false;
        }
      } else {
        if (selectedMonth !== null) {
          if (date.getMonth() !== selectedMonth) return false;
        }
        if (selectedYear !== null) {
          if (date.getFullYear() !== selectedYear) return false;
        }
      }

      return true;
    });
  }, [history, selectedKategori, dateFrom, dateTo, selectedMonth, selectedYear, isDateRangeMode]);

  return (
    <div className="bg-muted/5 dark:bg-muted/10">
      {loadingHistory ? (
        <div className="py-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-xs">Mengambil riwayat setoran...</span>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground italic">
          Belum ada riwayat setoran yang cocok dengan filter.
        </div>
      ) : (
        <div className="overflow-x-auto border-t">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold text-xs pl-6">Tanggal</TableHead>
                <TableHead className="font-bold text-xs">Materi</TableHead>
                <TableHead className="font-bold text-xs">Kategori</TableHead>
                <TableHead className="font-bold text-xs pr-6">Evaluasi / Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item: any) => {
                const date = new Date(item.tanggal_setoran);
                const dateLabel = format(date, "dd/MM/yyyy");
                const timeLabel = format(date, "HH:mm");
                const catName = getKategoriName(item);
                const startPage = item.start_page ?? item.startPage;
                const endPage = item.end_page ?? item.endPage;
                const totalBaris = item.total_baris ?? item.totalBaris;

                return (
                  <TableRow key={item.id_setoran}>
                    <TableCell className="text-xs pl-6 py-3">
                      <div className="font-semibold text-foreground">{dateLabel}</div>
                      <div className="text-muted-foreground font-light text-[10px]">{timeLabel} WIB</div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="font-semibold text-xs text-foreground">Juz {item.juz}: {item.surat}</span>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Ayat {item.ayat}
                        {startPage && ` · Hal ${startPage === endPage ? startPage : `${startPage}-${endPage}`} (${totalBaris} baris)`}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant={getKategoriBadgeVariant(catName)}
                        className="text-[10px] font-normal"
                      >
                        {catName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs pr-6 py-3">
                      <div className="flex flex-col gap-0.5">
                        {item.taqwim !== null && item.taqwim !== undefined && (
                          <span className={cn("font-bold text-xs", item.taqwim === 0 ? "text-primary" : "text-orange-600")}>
                            Taqwim: {item.taqwim}
                          </span>
                        )}
                        {item.keterangan && (
                          <span className="italic text-[10px] text-muted-foreground leading-normal">
                            {item.keterangan}
                          </span>
                        )}
                        {item.taqwim === null && !item.keterangan && <span className="text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const YEARS = Array.from(
  { length: 5 },
  (_, i) => new Date().getFullYear() - 2 + i
);

export function ProgresSantriPage() {
  const [scope, setScope] = useState<string>("target");
  const { user } = useAuth();
  const { halaqahId } = useParams<{ halaqahId?: string }>();
  const { progresData, loading: loadingProgres, fetchProgres } = useProgres(scope);
  const { getPdfDocument } = useProgresPdf();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfDocInfo, setPdfDocInfo] = useState<{
    doc: React.ReactElement;
    filename: string;
    title: string;
  } | null>(null);

  // New Filter States (just like admin page)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [selectedKategori, setSelectedKategori] = useState<string>("all");
  const [calFromOpen, setCalFromOpen] = useState(false);
  const [calToOpen, setCalToOpen] = useState(false);

  // Fetch Kategori Data
  const { data: kategoriList = [] } = useQuery({
    queryKey: ["kategori-setoran-progres"],
    queryFn: async () => {
      const res = await sekolahService.getKategori();
      return res.data || [];
    },
  });

  const kategoriNames = useMemo(() => {
    const list = kategoriList.map((k: any) => k.nama_kategori);
    return Array.from(new Set(list)) as string[];
  }, [kategoriList]);

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
      const match = progresData.find(
        (s) => s.id_halaqah.toString() === halaqahId,
      );
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

  const isDateRangeMode = dateFrom !== null || dateTo !== null;

  const handleResetFilters = () => {
    setSearch("");
    setActiveHalaqah(
      halaqahId && progresData.length > 0
        ? progresData.find((s) => s.id_halaqah.toString() === halaqahId)
            ?.nama_halaqah || "all"
        : "all",
    );
    setSelectedStatus("all");
    setScope("target");
    setSelectedMonth(null);
    setSelectedYear(null);
    setDateFrom(null);
    setDateTo(null);
    setSelectedKategori("all");
  };

  const isFilterActive =
    search !== "" ||
    scope !== "target" ||
    (activeHalaqah !== "" && activeHalaqah !== "all") ||
    selectedStatus !== "all" ||
    selectedMonth !== null ||
    selectedYear !== null ||
    dateFrom !== null ||
    dateTo !== null ||
    (selectedKategori !== "" && selectedKategori !== "all");

  const handleScopeChange = (value: string) => {
    setScope(value);
  };

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
        const order = {
          TERCAPAI: 0,
          DALAM_PROSES: 1,
          BELUM_MULAI: 2,
          BEBAS: 3,
        };
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
    const tercapai = dataForStats.filter(
      (s) => s.progres.status === "TERCAPAI",
    ).length;
    const dalamProses = dataForStats.filter(
      (s) => s.progres.status === "DALAM_PROSES",
    ).length;
    const belumMulai = dataForStats.filter(
      (s) => s.progres.status === "BELUM_MULAI",
    ).length;
    const bebas = dataForStats.filter(
      (s) => s.progres.status === "BEBAS",
    ).length;

    const butuhPerhatian = dataForStats.filter((s) => {
      const lastDateStr = s.progres.tanggal_setoran_terakhir;
      if (!lastDateStr) {
        return s.target ? true : false;
      }
      const lastDate = new Date(lastDateStr);
      const diffDays = Math.floor(
        (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diffDays >= 3;
    }).length;

    return { total, tercapai, dalamProses, belumMulai, bebas, butuhPerhatian };
  }, [progresData, effectiveActiveHalaqah]);

  // PDF preview handler
  const handlePreviewPdf = () => {
    if (filteredProgresData.length === 0) {
      toast.warning("Tidak ada data progres untuk di-export");
      return;
    }

    try {
      const info = getPdfDocument({
        progresData: filteredProgresData,
        stats,
        activeHalaqah: effectiveActiveHalaqah,
        periodLabel: "Periode Target Aktif",
        namaSekolah: "Halaqah ID",
      });
      setPdfDocInfo(info);
      setPreviewOpen(true);
    } catch (err) {
      console.error("Progress PDF preview preparation error:", err);
      toast.error("Gagal menyiapkan pratinjau PDF");
    }
  };




  // const getStatusBadgeVariant = (status: string) => {
  //   switch (status) {
  //     case "TERCAPAI":
  //       return "default";
  //     case "DALAM_PROSES":
  //       return "secondary";
  //     case "BELUM_MULAI":
  //       return "destructive";
  //     default:
  //       return "outline";
  //   }
  // };

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
            <RefreshCw
              className={cn("h-4 w-4 mr-2", loadingProgres && "animate-spin")}
            />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handlePreviewPdf}
            disabled={
              loadingProgres || filteredProgresData.length === 0
            }
          >
            <FileDown className="h-4 w-4 mr-2" />
            Unduh PDF Progres
          </Button>
        </div>
      </div>

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
              <Select value={scope} onValueChange={handleScopeChange}>
                <SelectTrigger className="h-9 w-[180px] bg-background">
                  <SelectValue placeholder="Cakupan Data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="target">Periode Target Aktif</SelectItem>
                  <SelectItem value="all">Semua Riwayat</SelectItem>
                </SelectContent>
              </Select>
              {isAdmin && (
                <Select
                  value={effectiveActiveHalaqah}
                  onValueChange={setActiveHalaqah}
                >
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder="Semua Halaqah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Halaqah</SelectItem>
                    {halaqahNames.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Popover
                open={santriSearchOpen}
                onOpenChange={setSantriSearchOpen}
              >
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
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            search === "" ? "opacity-100" : "opacity-0",
                          )}
                        />
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
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              search === s ? "opacity-100" : "opacity-0",
                            )}
                          />
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

              {/* Month Selector (Admin page style) */}
              <Select
                value={selectedMonth !== null && !isDateRangeMode ? String(selectedMonth) : "__all__"}
                onValueChange={(v) => setSelectedMonth(v === "__all__" ? null : Number(v))}
                disabled={isDateRangeMode}
              >
                <SelectTrigger className="h-9 gap-1.5 text-xs w-[160px] bg-background">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Semua Bulan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Semua Bulan</SelectItem>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Selector */}
              <Select
                value={selectedYear !== null && !isDateRangeMode ? String(selectedYear) : "__all__"}
                onValueChange={(v) => setSelectedYear(v === "__all__" ? null : Number(v))}
                disabled={isDateRangeMode}
              >
                <SelectTrigger className="h-9 text-xs w-[120px] bg-background">
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Semua Tahun</SelectItem>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date From popover picker */}
              <Popover open={calFromOpen} onOpenChange={setCalFromOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 gap-1.5 text-xs font-normal min-w-[140px] bg-background",
                      dateFrom && "border-primary/50 text-primary bg-primary/5"
                    )}
                  >
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {dateFrom
                      ? format(dateFrom, "dd MMM yyyy", { locale: idLocale })
                      : "Dari tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-2 border-b flex items-center justify-between bg-muted/20">
                    <p className="text-xs font-semibold text-muted-foreground">Tanggal Mulai</p>
                    {dateFrom && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 text-[10px] text-muted-foreground px-1"
                        onClick={() => {
                          setDateFrom(null);
                          setCalFromOpen(false);
                        }}
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                  <Calendar
                    mode="single"
                    selected={dateFrom ?? undefined}
                    onSelect={(d) => {
                      setDateFrom(d ?? null);
                      setCalFromOpen(false);
                    }}
                    disabled={(d) => (dateTo ? d > dateTo : false)}
                    locale={idLocale}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Date To popover picker */}
              <Popover open={calToOpen} onOpenChange={setCalToOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 gap-1.5 text-xs font-normal min-w-[140px] bg-background",
                      dateTo && "border-primary/50 text-primary bg-primary/5"
                    )}
                  >
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {dateTo
                      ? format(dateTo, "dd MMM yyyy", { locale: idLocale })
                      : "Hingga tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-2 border-b flex items-center justify-between bg-muted/20">
                    <p className="text-xs font-semibold text-muted-foreground">Tanggal Selesai</p>
                    {dateTo && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 text-[10px] text-muted-foreground px-1"
                        onClick={() => {
                          setDateTo(null);
                          setCalToOpen(false);
                        }}
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                  <Calendar
                    mode="single"
                    selected={dateTo ?? undefined}
                    onSelect={(d) => {
                      setDateTo(d ?? null);
                      setCalToOpen(false);
                    }}
                    disabled={(d) => (dateFrom ? d < dateFrom : false)}
                    locale={idLocale}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Category Selector */}
              <Select
                value={selectedKategori || "all"}
                onValueChange={(v) => setSelectedKategori(v)}
              >
                <SelectTrigger className="h-9 gap-1.5 text-xs w-[160px] bg-background">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {kategoriNames.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sorting Select */}
              <Select value={`${sortKey}-${sortDir}`} onValueChange={(val) => {
                const [key, dir] = val.split("-");
                setSortKey(key as SortKey);
                setSortDir(dir as SortDir);
              }}>
                <SelectTrigger className="h-9 w-[160px] bg-background">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nama_santri-asc">Nama Santri (A-Z)</SelectItem>
                  <SelectItem value="nama_santri-desc">Nama Santri (Z-A)</SelectItem>
                  <SelectItem value="persentase-desc">Capaian Tertinggi</SelectItem>
                  <SelectItem value="persentase-asc">Capaian Terendah</SelectItem>
                  <SelectItem value="target-desc">Target Tertinggi</SelectItem>
                  <SelectItem value="target-asc">Target Terendah</SelectItem>
                  {isAdmin && <SelectItem value="nama_halaqah-asc">Halaqah (A-Z)</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filter Badges */}
            {isFilterActive && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-dashed mt-2">
                {activeHalaqah !== "" && activeHalaqah !== "all" && (
                  <Badge variant="secondary" className="text-[10px]">
                    Halaqah: {activeHalaqah}
                    <button onClick={() => setActiveHalaqah("all")} className="ml-1 opacity-50 hover:opacity-100 font-bold">✕</button>
                  </Badge>
                )}
                {search !== "" && (
                  <Badge variant="secondary" className="text-[10px]">
                    Santri: {search}
                    <button onClick={() => setSearch("")} className="ml-1 opacity-50 hover:opacity-100 font-bold">✕</button>
                  </Badge>
                )}
                {selectedStatus !== "all" && (
                  <Badge variant="secondary" className="text-[10px]">
                    Status: {selectedStatus}
                    <button onClick={() => setSelectedStatus("all")} className="ml-1 opacity-50 hover:opacity-100 font-bold">✕</button>
                  </Badge>
                )}
                {isDateRangeMode && (
                  <Badge variant="secondary" className="text-[10px]">
                    Tanggal: {dateFrom && format(dateFrom, "dd MMM", { locale: idLocale })}
                    {dateFrom && dateTo && " – "}
                    {dateTo && format(dateTo, "dd MMM yyyy", { locale: idLocale })}
                    <button
                      onClick={() => {
                        setDateFrom(null);
                        setDateTo(null);
                      }}
                      className="ml-1 opacity-50 hover:opacity-100 font-bold"
                    >✕</button>
                  </Badge>
                )}
                {!isDateRangeMode && selectedMonth !== null && (
                  <Badge variant="secondary" className="text-[10px]">
                    Bulan: {MONTHS[selectedMonth]}
                    <button onClick={() => setSelectedMonth(null)} className="ml-1 opacity-50 hover:opacity-100 font-bold">✕</button>
                  </Badge>
                )}
                {!isDateRangeMode && selectedYear !== null && (
                  <Badge variant="secondary" className="text-[10px]">
                    Tahun: {selectedYear}
                    <button onClick={() => setSelectedYear(null)} className="ml-1 opacity-50 hover:opacity-100 font-bold">✕</button>
                  </Badge>
                )}
                {selectedKategori !== "" && selectedKategori !== "all" && (
                  <Badge variant="secondary" className="text-[10px]">
                    Kategori: {selectedKategori}
                    <button onClick={() => setSelectedKategori("all")} className="ml-1 opacity-50 hover:opacity-100 font-bold">✕</button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Accordion Collapsible List */}
        <div className="p-4 md:p-6">
          {loadingProgres ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span>Memuat data progres...</span>
            </div>
          ) : sortedFilteredData.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground border border-dashed rounded-xl bg-card">
              Data progres tidak ditemukan.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3">
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
                  const diffDays = Math.floor(
                    (new Date().getTime() - lastDate.getTime()) /
                      (1000 * 60 * 60 * 24),
                  );
                  if (diffDays >= 3) {
                    ewsLabel = `Pasif ${diffDays} Hari`;
                  }
                }

                const statusLabels = {
                  TERCAPAI: "Tercapai",
                  DALAM_PROSES: "Dalam Proses",
                  BELUM_MULAI: "Belum Mulai",
                  BEBAS: "Tanpa Target",
                };
                const statusStyles = {
                  TERCAPAI: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
                  DALAM_PROSES: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
                  BELUM_MULAI: "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20 dark:text-red-400",
                  BEBAS: "bg-muted text-muted-foreground border-muted-foreground/20",
                };

                return (
                  <AccordionItem
                    key={row.id_santri}
                    value={row.id_santri.toString()}
                    className="border rounded-xl bg-card overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md [&[data-state=open]]:border-primary/45"
                  >
                    <AccordionTrigger className="hover:no-underline py-4 px-4 sm:px-6">
                      <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-4 text-left pr-4">
                        {/* Nama & Initial */}
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase shrink-0">
                            {row.nama_santri.charAt(0)}
                          </div>
                          <div className="space-y-1">
                            <div className="font-semibold text-sm sm:text-base text-foreground leading-snug">
                              {row.nama_santri}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                              {isAdmin && (
                                <span className="font-medium bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                  {row.nama_halaqah}
                                </span>
                              )}
                              <span>Target: {targetLabel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar (Middle) */}
                        <div className="flex items-center gap-4 min-w-[120px] sm:min-w-[180px]">
                          {row.target ? (
                            <div className="flex flex-col gap-1 w-full max-w-[200px]">
                              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium">
                                <span>
                                  {row.progres.capaian}/{row.target.nilai_target} {SATUAN_TARGET_LABELS[row.target.satuan as keyof typeof SATUAN_TARGET_LABELS] ?? row.target.satuan}
                                </span>
                                <span className="font-bold text-primary">{row.progres.persentase}%</span>
                              </div>
                              <Progress
                                value={row.progres.persentase}
                                className="h-1.5"
                              />
                            </div>
                          ) : (
                            <span className="text-xs font-medium text-muted-foreground bg-muted/40 px-2 py-1 rounded">
                              {row.progres.jumlah_setoran} setoran
                            </span>
                          )}
                        </div>

                        {/* Status Badges (Right) */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0", statusStyles[row.progres.status as keyof typeof statusStyles])}
                          >
                            {statusLabels[row.progres.status as keyof typeof statusLabels] ?? row.progres.status}
                          </Badge>
                          {ewsLabel && (
                            <Badge
                              variant="destructive"
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                            >
                              {ewsLabel}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-0 border-t">
                      <SantriProgresCollapsibleDetail
                        santri={row}
                        filters={{
                          selectedMonth,
                          selectedYear,
                          dateFrom,
                          dateTo,
                          selectedKategori,
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </div>
      {/* Dialog Pratinjau PDF */}
      <PdfPreviewDialog
        isOpen={previewOpen}
        onOpenChange={setPreviewOpen}
        document={pdfDocInfo?.doc ?? null}
        filename={pdfDocInfo?.filename ?? ""}
        title={pdfDocInfo?.title}
      />
    </div>
  );
}
