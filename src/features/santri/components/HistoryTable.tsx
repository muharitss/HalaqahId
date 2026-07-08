import { useMemo, useState } from "react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  History,
  CalendarDays,
  FileDown,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { type SetoranRecord } from "../../setoran/types";
import { type ProgresSantri } from "../types";
import { useSantriHistoryPdf } from "../hooks/useSantriHistoryPdf";
import { cn } from "@/lib/utils";
import { EditSetoranModal } from "@/features/setoran/components/EditSetoranModal";
import { useAuth } from "@/features/auth/components/auth-provider";
import { Role } from "@/types/domain/enums";
import { useSetoran } from "../../setoran/hooks/useSetoran";
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

interface HistoryTableProps {
  santri: ProgresSantri;
  history: SetoranRecord[];
}

const KATEGORI_OPTIONS = [
  { value: "all", label: "Semua Kategori" },
  { value: "HAFALAN", label: "Hafalan" },
  { value: "MURAJAAH", label: "Muraja'ah" },
  { value: "ZIYADAH", label: "Ziyadah" },
  { value: "INTENS", label: "Intensif" },
  { value: "BACAAN", label: "Bacaan" },
];

const DATE_FILTER_OPTIONS = [
  { value: "all", label: "Semua Waktu" },
  { value: "week", label: "7 Hari Terakhir" },
  { value: "month", label: "Bulan Ini" },
  { value: "custom", label: "Kustom Tanggal" },
];

const KATEGORI_BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline"
> = {
  HAFALAN: "default",
  MURAJAAH: "secondary",
  ZIYADAH: "outline",
  INTENS: "secondary",
  BACAAN: "outline",
};

export function HistoryTable({ santri, history }: HistoryTableProps) {
  const { generateSantriHistoryPdf, isGenerating } = useSantriHistoryPdf();
  const { user } = useAuth();
  const { updateSetoran, deleteSetoran } = useSetoran();

  const [editingSetoran, setEditingSetoran] = useState<SetoranRecord | null>(null);
  const [deletingSetoranId, setDeletingSetoranId] = useState<number | null>(null);

  const isAdmin =
    user?.role === Role.SUPERADMIN ||
    user?.role === Role.ADMIN ||
    user?.role === Role.KOORDINATOR_TAHFIZ;

  const canEditOrDelete = (item: SetoranRecord) => {
    if (isAdmin) return true;

    // Muhafiz can edit if setoran date is today
    const setoranDate = new Date(item.tanggal_setoran);
    const today = new Date();
    return (
      setoranDate.getDate() === today.getDate() &&
      setoranDate.getMonth() === today.getMonth() &&
      setoranDate.getFullYear() === today.getFullYear()
    );
  };

  // Local Filter States
  const [selectedKategori, setSelectedKategori] = useState("all");
  const [dateFilterType, setDateFilterType] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [calFromOpen, setCalFromOpen] = useState(false);
  const [calToOpen, setCalToOpen] = useState(false);

  // Helper resolver nama kategori
  const getKategoriName = (item: SetoranRecord) => {
    if (typeof item.kategori === "object" && item.kategori) {
      return item.kategori.nama_kategori;
    }
    return (item.kategori as unknown as string) || "HAFALAN";
  };

  // Filter history records in real-time
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // 1. Kategori Filter
      const catName = getKategoriName(item);
      if (
        selectedKategori !== "all" &&
        catName.toUpperCase() !== selectedKategori.toUpperCase()
      ) {
        return false;
      }

      // 2. Date Range Filter
      const date = new Date(item.tanggal_setoran);
      const now = new Date();
      if (dateFilterType === "week") {
        const sevenDaysAgo = subDays(now, 7);
        if (date < sevenDaysAgo) return false;
      } else if (dateFilterType === "month") {
        const currentMonthStart = startOfMonth(now);
        const currentMonthEnd = endOfMonth(now);
        if (date < currentMonthStart || date > currentMonthEnd) return false;
      } else if (dateFilterType === "custom") {
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
      }

      return true;
    });
  }, [history, selectedKategori, dateFilterType, dateFrom, dateTo]);

  // Sort chronological (newest first)
  const sortedHistory = useMemo(() => {
    return [...filteredHistory].sort(
      (a, b) =>
        new Date(b.tanggal_setoran).getTime() -
        new Date(a.tanggal_setoran).getTime(),
    );
  }, [filteredHistory]);

  // Metrics summary based on filtered list
  const stats = useMemo(() => {
    const totalSetoran = sortedHistory.length;
    const totalBaris = sortedHistory.reduce(
      (sum, item) => sum + (item.total_baris || 0),
      0,
    );
    const totalHalaman = sortedHistory.reduce((sum, item) => {
      const startPage = item.start_page ?? item.startPage;
      const endPage = item.end_page ?? item.endPage;
      if (startPage && endPage) {
        return sum + (endPage - startPage + 1);
      }
      return sum;
    }, 0);

    const estimasiHalaman = totalBaris > 0 ? (totalBaris / 15).toFixed(1) : "0";

    return {
      totalSetoran,
      totalBaris,
      totalHalaman:
        totalHalaman > 0 ? totalHalaman.toString() : estimasiHalaman,
    };
  }, [sortedHistory]);

  // Generate period label for PDF filename/header
  const getPeriodLabel = () => {
    if (dateFilterType === "week") return "7-Hari-Terakhir";
    if (dateFilterType === "month")
      return format(new Date(), "MMMM-yyyy", { locale: idLocale });
    if (dateFilterType === "custom") {
      const fromStr = dateFrom ? format(dateFrom, "dd-MM-yyyy") : "Awal";
      const toStr = dateTo ? format(dateTo, "dd-MM-yyyy") : "Akhir";
      return `${fromStr}-s.d.-${toStr}`;
    }
    return "Semua-Periode";
  };

  const handleDownloadSinglePdf = async (type: "filtered" | "all") => {
    try {
      const pdfHistory = type === "filtered" ? sortedHistory : history;
      const pdfPeriodLabel =
        type === "filtered"
          ? getPeriodLabel().replace(/-/g, " ")
          : "Semua Periode";

      await generateSantriHistoryPdf({
        santri,
        history: pdfHistory,
        periodLabel: pdfPeriodLabel,
        namaSekolah: "Halaqah ID",
      });
      toast.success(`PDF Riwayat ${santri.nama_santri} berhasil diunduh!`);
    } catch (err) {
      console.error("Single PDF export error:", err);
      toast.error("Gagal mengunduh PDF riwayat");
    }
  };

  return (
    <div className="space-y-4">
      {/* PDF Download Dropdown positioned absolutely in Dialog Header */}
      {sortedHistory.length > 0 && (
        <div className="absolute right-12 top-[18px] z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-8 gap-2 px-3"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>{" "}
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4" />
                    <span className="text-sm font-medium">pdf</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs">
                Opsi Ekspor Laporan
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDownloadSinglePdf("filtered")}
                disabled={isGenerating}
                className="cursor-pointer text-xs"
              >
                Unduh Hasil Filter ({sortedHistory.length} Setoran)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDownloadSinglePdf("all")}
                disabled={isGenerating}
                className="cursor-pointer text-xs"
              >
                Unduh Semua Riwayat ({history.length} Setoran)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* ── FILTER SECTION ── */}
      <div className="flex flex-wrap gap-2 items-center justify-between bg-muted/20 p-3 rounded-lg border">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Category Selector */}
          <Select value={selectedKategori} onValueChange={setSelectedKategori}>
            <SelectTrigger className="h-9 w-[160px] bg-background">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              {KATEGORI_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Option Selector */}
          <Select value={dateFilterType} onValueChange={setDateFilterType}>
            <SelectTrigger className="h-9 w-[160px] bg-background">
              <SelectValue placeholder="Pilih Waktu" />
            </SelectTrigger>
            <SelectContent>
              {DATE_FILTER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Custom Date Pickers */}
          {dateFilterType === "custom" && (
            <div className="flex items-center gap-2">
              <Popover open={calFromOpen} onOpenChange={setCalFromOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 gap-1.5 text-xs bg-background font-normal min-w-32 justify-start",
                      dateFrom && "border-primary/50 text-primary bg-primary/5",
                    )}
                  >
                    <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {dateFrom
                      ? format(dateFrom, "dd MMM yyyy", { locale: idLocale })
                      : "Mulai Tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-2 border-b flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Mulai Dari
                    </p>
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

              <Popover open={calToOpen} onOpenChange={setCalToOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 gap-1.5 text-xs bg-background font-normal min-w-32 justify-start",
                      dateTo && "border-primary/50 text-primary bg-primary/5",
                    )}
                  >
                    <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {dateTo
                      ? format(dateTo, "dd MMM yyyy", { locale: idLocale })
                      : "Hingga Tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-2 border-b flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Hingga
                    </p>
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
            </div>
          )}
        </div>
      </div>

      {/* ── STATS CARDS ROW ── */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-sm">
          <CardContent className="p-3">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">
              Total Setoran
            </p>
            <h4 className="text-base font-bold mt-0.5">
              {stats.totalSetoran} kali
            </h4>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-3">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">
              Total Halaman
            </p>
            <h4 className="text-base font-bold mt-0.5">
              {stats.totalHalaman} hal
            </h4>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-3">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">
              Total Baris
            </p>
            <h4 className="text-base font-bold mt-0.5">
              {stats.totalBaris} baris
            </h4>
          </CardContent>
        </Card>
      </div>

      {/* ── TABLE VIEW ── */}
      <div className="border rounded-xl overflow-hidden bg-card">
        {sortedHistory.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
            <History className="h-8 w-8 text-muted-foreground/40" />
            <span>Tidak ada riwayat setoran yang cocok dengan filter.</span>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[60px] pl-4 text-xs">#</TableHead>
                <TableHead className="w-[120px] text-xs">Tanggal</TableHead>
                <TableHead className="text-xs">Materi Setoran</TableHead>
                <TableHead className="w-[110px] text-xs">Kategori</TableHead>
                <TableHead className="w-[80px] text-xs text-center">
                  Taqwim
                </TableHead>
                <TableHead className="text-xs">Keterangan</TableHead>
                <TableHead className="w-[90px] text-right pr-4 text-xs">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHistory.map((item, idx) => {
                const date = new Date(item.tanggal_setoran);
                const dateLabel = format(date, "dd/MM/yyyy", {
                  locale: idLocale,
                });
                const timeLabel = format(date, "HH:mm");
                const catName = getKategoriName(item);
                const startPage = item.start_page ?? item.startPage;
                const endPage = item.end_page ?? item.endPage;
                const totalBaris = item.total_baris ?? item.totalBaris;

                return (
                  <TableRow key={item.id_setoran}>
                    <TableCell className="pl-4 py-3 text-xs text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="py-3 text-xs">
                      <div className="font-semibold">{dateLabel}</div>
                      <div className="text-muted-foreground text-[10px]">
                        {timeLabel} WIB
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="text-xs font-semibold">
                        Juz {item.juz}: {item.surat}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Ayat {item.ayat}
                        {startPage &&
                          ` · Hal ${startPage === endPage ? startPage : `${startPage}-${endPage}`} (${totalBaris} baris)`}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant={
                          KATEGORI_BADGE_VARIANT[catName.toUpperCase()] ??
                          "outline"
                        }
                      >
                        {catName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center py-3 text-xs font-semibold">
                      {item.taqwim}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground py-3 max-w-[120px] truncate">
                      {item.keterangan || "—"}
                    </TableCell>
                    <TableCell className="text-right pr-4 py-3">
                      <div className="flex justify-end gap-1">
                        {canEditOrDelete(item) && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => setEditingSetoran(item)}
                              title="Edit setoran"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive/80"
                              onClick={() => setDeletingSetoranId(item.id_setoran)}
                              title="Hapus setoran"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Setoran Modal */}
      <EditSetoranModal
        isOpen={!!editingSetoran}
        onClose={() => setEditingSetoran(null)}
        setoran={editingSetoran}
        onSubmit={updateSetoran}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={deletingSetoranId !== null}
        onOpenChange={(open) => !open && setDeletingSetoranId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Setoran Hafalan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data setoran ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={async () => {
                if (deletingSetoranId !== null) {
                  await deleteSetoran(deletingSetoranId);
                  setDeletingSetoranId(null);
                }
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
