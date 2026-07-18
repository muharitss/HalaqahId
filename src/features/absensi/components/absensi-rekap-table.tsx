import { useMemo, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle, Loader2, FileDown, CheckCheck } from "lucide-react";
import { format, getDate, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useAbsensi } from "./absensi-provider";
import { useAbsensiRekapQuery, useAbsensiRekapMutation } from "../api";
import { useAbsensiPdf } from "../hooks/useAbsensiPdf";
import { PdfPreviewDialog } from "@/components/custom/pdf-preview-dialog";
import { type AbsensiStatusType, absensiStatusSchema } from "../validation/absensi.schema";
import { absensiKeys } from "../api/queries/queryKeys";
import { useAuth } from "@/features/auth";
import { type MonthlyAbsensiData } from "../types";
import { getErrorMessage } from "@/utils/error";

// Status config
const STATUS_CONFIG: {
  value: AbsensiStatusType;
  label: string;
  initial: string;
  cellClass: string;
  btnClass: string;
}[] = [
  { value: "HADIR", label: "Hadir", initial: "H", cellClass: "bg-green-500 text-white font-bold", btnClass: "bg-green-500 hover:bg-green-600 text-white" },
  { value: "IZIN", label: "Izin", initial: "I", cellClass: "bg-blue-500 text-white font-bold", btnClass: "bg-blue-500 hover:bg-blue-600 text-white" },
  { value: "SAKIT", label: "Sakit", initial: "S", cellClass: "bg-yellow-500 text-white font-bold", btnClass: "bg-yellow-500 hover:bg-yellow-600 text-white" },
  { value: "TERLAMBAT", label: "Terlambat", initial: "T", cellClass: "bg-orange-500 text-white font-bold", btnClass: "bg-orange-500 hover:bg-orange-600 text-white" },
  { value: "ALFA", label: "Alfa", initial: "A", cellClass: "bg-red-500 text-white font-bold", btnClass: "bg-red-500 hover:bg-red-600 text-white" },
];

const getStatusConfig = (status?: AbsensiStatusType | null) =>
  STATUS_CONFIG.find((s) => s.value === status);

export function AbsensiRekapTable() {
  const { halaqahId, viewDate, setViewDate, santriList, filteredSesiList, loadingSantri } = useAbsensi();
  const { getPdfDocument } = useAbsensiPdf();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pdfDocInfo, setPdfDocInfo] = useState<{
    doc: React.ReactElement;
    filename: string;
    title: string;
  } | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handlePreviewPdf = () => {
    if (santriList.length === 0) {
      toast.warning("Tidak ada data untuk di-export");
      return;
    }
    try {
      const info = getPdfDocument({
        santriList,
        monthlyData,
        filteredSesiList,
        viewDate,
        halaqahId,
      });
      setPdfDocInfo(info);
      setPreviewOpen(true);
    } catch (err) {
      console.error("PDF preview preparation error:", err);
      toast.error("Gagal menyiapkan pratinjau PDF");
    }
  };

  const month = (viewDate.getMonth() + 1).toString();
  const year = viewDate.getFullYear().toString();

  const { data: monthlyData = [], isLoading: isLoadingData } = useAbsensiRekapQuery(month, year, halaqahId);
  const { updateCell, isUpdating, pendingVariables } = useAbsensiRekapMutation();

  const [openCell, setOpenCell] = useState<string | null>(null);
  const [bulkingDate, setBulkingDate] = useState<string | null>(null);

  const daysInMonth = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(viewDate), end: endOfMonth(viewDate) }),
    [viewDate]
  );

  const getStatusForCell = useCallback(
    (santriId: number, sesiId: number, dateStr: string) => {
      const dayData = monthlyData.find((m) => m.tanggal === dateStr);
      if (!dayData) return null;
      const found = dayData.data.find(
        (item) =>
          Number(item.id_santri) === Number(santriId) &&
          (Number(item.id_sesi) === Number(sesiId) || sesiId === 0)
      );
      return found?.status as AbsensiStatusType | undefined;
    },
    [monthlyData]
  );

  const calculateTotal = useCallback(
    (santriId: number, sesiId: number) => {
      const totals = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
      monthlyData.forEach((day) => {
        const found = day.data.find(
          (item) =>
            Number(item.id_santri) === Number(santriId) &&
            (Number(item.id_sesi) === Number(sesiId) || sesiId === 0)
        );
        const status = found?.status as keyof typeof totals | undefined;
        if (status && status in totals) totals[status]++;
      });
      return totals;
    },
    [monthlyData]
  );

  const handleCellEdit = async (
    santriId: number,
    sesiId: number,
    dateStr: string,
    status: AbsensiStatusType
  ) => {
    setOpenCell(null);
    await updateCell({ id_santri: santriId, id_sesi: sesiId, status, tanggal: dateStr });
  };

  const isCellPending = (santriId: number, sesiId: number, dateStr: string) =>
    isUpdating &&
    pendingVariables?.id_santri === santriId &&
    pendingVariables?.id_sesi === sesiId &&
    pendingVariables?.tanggal === dateStr;

  const handleBulkHadirDateSesi = async (dateStr: string, sesiId: number) => {
    const bulkKey = `${dateStr}-${sesiId}`;
    if (bulkingDate === bulkKey) return;

    // --- Optimistic update ---
    const queryKey = halaqahId
      ? absensiKeys.rekapHalaqah(user?.id_user, halaqahId, month, year)
      : absensiKeys.rekapAll(user?.id_user, month, year);

    // Ambil santri yang relevan untuk sesi ini
    const relevantSantri = santriList.filter((santri) => {
      const sesi = filteredSesiList.find((s) => s.id_sesi === sesiId);
      if (!sesi) return true;
      return (
        !sesi.halaqahs ||
        sesi.halaqahs.length === 0 ||
        sesi.halaqahs.some((h) => h.id_halaqah === santri.id_halaqah)
      );
    });

    // Snapshot data sebelum diubah (untuk rollback jika gagal)
    const previousData = queryClient.getQueryData<MonthlyAbsensiData[]>(queryKey);

    // Update cache langsung (tanpa menunggu server)
    queryClient.setQueryData<MonthlyAbsensiData[]>(queryKey, (old = []) => {
      const updated = old.map((day) => {
        if (day.tanggal !== dateStr) return day;
        // Buat set id_santri yang akan diupdate
        const updatingIds = new Set(relevantSantri.map((s) => s.id_santri));
        // Hapus entri lama untuk santri+sesi yang akan diupdate
        const filtered = day.data.filter(
          (item) => !(updatingIds.has(Number(item.id_santri)) && Number(item.id_sesi) === sesiId)
        );
        // Tambahkan entri baru HADIR
        const newEntries = relevantSantri.map((santri) => ({
          id_santri: santri.id_santri,
          id_sesi: sesiId,
          status: "HADIR" as AbsensiStatusType,
        }));
        return { ...day, data: [...filtered, ...newEntries] };
      });

      // Jika tanggal belum ada di data (belum ada absensi apapun di hari itu)
      const hasDate = updated.some((d) => d.tanggal === dateStr);
      if (!hasDate) {
        updated.push({
          tanggal: dateStr,
          data: relevantSantri.map((santri) => ({
            id_santri: santri.id_santri,
            id_sesi: sesiId,
            status: "HADIR" as AbsensiStatusType,
          })),
        });
      }
      return updated;
    });

    setBulkingDate(bulkKey);
    const tasks = relevantSantri.map((santri) =>
      updateCell({
        id_santri: santri.id_santri,
        id_sesi: sesiId,
        status: "HADIR",
        tanggal: dateStr,
        silent: true,
      })
    );

    const results = await Promise.allSettled(tasks);
    const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");

    if (failures.length > 0) {
      // Rollback ke data sebelumnya jika ada yang gagal
      queryClient.setQueryData(queryKey, previousData);
      const firstError = failures[0].reason;
      toast.error(getErrorMessage(firstError, "Gagal menyimpan absensi, perubahan dibatalkan"));
    } else {
      // Semua sukses — sync dengan server di background
      queryClient.invalidateQueries({ queryKey });
      toast.success("Semua santri dicatat HADIR");
    }

    setBulkingDate(null);
  };

  const isDataLoading = isLoadingData || loadingSantri;

  return (
    <div className="space-y-4 pt-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground italic flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
          Klik sel untuk langsung input absensi
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviewPdf}
            disabled={isDataLoading}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Unduh PDF
          </Button>
          <Select
            value={format(viewDate, "yyyy-MM")}
            onValueChange={(val) => setViewDate(new Date(val + "-01"))}
          >
            <SelectTrigger className="w-48 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, i) => {
                const d = new Date();
                d.setDate(1);
                d.setMonth(d.getMonth() - i);
                return (
                  <SelectItem key={i} value={format(d, "yyyy-MM")}>
                    {format(d, "MMMM yyyy", { locale: localeId })}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table — overflow-auto + fixed height agar scroll 2 arah (horizontal & vertikal) bekerja */}
      <div className="rounded-md border overflow-auto relative shadow-sm scrollbar-thin h-[calc(100dvh-260px)] min-h-64">
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                rowSpan={2}
                className="min-w-40 sticky left-0 top-0 z-50 bg-muted font-bold border-r border-b text-xs align-middle"
              >
                Nama Santri
              </TableHead>
              {daysInMonth.map((date) => {
                const relevantSesi = filteredSesiList.length > 0 ? filteredSesiList : [{ id_sesi: 0, nama_sesi: "Sesi" }];
                return (
                  <TableHead
                    key={date.toString()}
                    colSpan={relevantSesi.length}
                    className="text-center p-1 text-[10px] font-bold border-r border-b sticky top-0 z-40 bg-muted"
                  >
                    {getDate(date)}
                  </TableHead>
                );
              })}
              <TableHead
                colSpan={5}
                className="text-center min-w-10 bg-muted/80 font-black border-r border-b text-primary text-[10px] sticky top-0 z-40"
              >
                Total
              </TableHead>
            </TableRow>
            <TableRow className="bg-muted/30">
              {daysInMonth.map((date) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const relevantSesi = filteredSesiList.length > 0 ? filteredSesiList : [{ id_sesi: 0, nama_sesi: "Sesi", singkatan: "-" }];
                return relevantSesi.map((sesi) => {
                  const bulkKey = `${dateStr}-${sesi.id_sesi}`;
                  const isBulkingThis = bulkingDate === bulkKey;
                  return (
                    <TableHead
                      key={`${date.toString()}-${sesi.id_sesi}`}
                      className="text-center p-0 text-[9px] min-w-[35px] border-r border-b text-muted-foreground sticky top-[32px] z-40 bg-muted group/sesi"
                      title={sesi.nama_sesi}
                    >
                      <div className="flex flex-col items-center justify-center h-full py-1 gap-0.5">
                        <span className="truncate max-w-full px-1">{sesi.nama_sesi.substring(0, 3)}</span>
                        <button
                          onClick={() => handleBulkHadirDateSesi(dateStr, sesi.id_sesi)}
                          disabled={isBulkingThis || isUpdating}
                          title={`Hadir semua santri — ${sesi.nama_sesi} ${format(date, "dd MMM")}`}
                          className={cn(
                            "opacity-0 group-hover/sesi:opacity-100 transition-opacity duration-150",
                            "flex items-center justify-center w-4 h-4 rounded-sm",
                            "bg-green-500 hover:bg-green-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                          )}
                        >
                          {isBulkingThis ? (
                            <Loader2 className="h-2 w-2 animate-spin" />
                          ) : (
                            <CheckCheck className="h-2 w-2" />
                          )}
                        </button>
                      </div>
                    </TableHead>
                  );
                });
              })}
              {["H", "I", "S", "T", "A"].map((label) => (
                <TableHead
                  key={label}
                  className="text-center min-w-[40px] bg-muted/50 font-bold border-r border-b text-primary text-[10px] sticky top-[52px] z-40"
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isDataLoading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="sticky left-0 bg-background border-r border-b">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    {daysInMonth.map((d) => {
                      const relevantSesi = filteredSesiList.length > 0 ? filteredSesiList : [1];
                      return relevantSesi.map((_, idx) => (
                        <TableCell key={`${d.toString()}-${idx}`} className="p-1 border-r border-b">
                          <Skeleton className="h-6 w-6 rounded-sm mx-auto" />
                        </TableCell>
                      ));
                    })}
                    {Array(5)
                      .fill(0)
                      .map((_, idx) => (
                        <TableCell key={idx} className="p-1 border-r border-b">
                          <Skeleton className="h-6 w-6 rounded-sm mx-auto" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            ) : santriList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={daysInMonth.length * Math.max(filteredSesiList.length, 1) + 6}
                  className="text-center py-10 text-muted-foreground"
                >
                  Data santri tidak ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              santriList.map((santri) => {
                const id_santri = santri.id_santri;
                const availableSesi = filteredSesiList.filter(
                  (s) =>
                    !s.halaqahs ||
                    s.halaqahs.length === 0 ||
                    s.halaqahs.some((h) => h.id_halaqah === santri.id_halaqah)
                );
                const renderSesi = availableSesi.length > 0 ? availableSesi : [{ id_sesi: 0, nama_sesi: "-" }];

                const grandTotals = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
                renderSesi.forEach((sesi) => {
                  const t = calculateTotal(id_santri, sesi.id_sesi);
                  grandTotals.HADIR += t.HADIR;
                  grandTotals.IZIN += t.IZIN;
                  grandTotals.SAKIT += t.SAKIT;
                  grandTotals.TERLAMBAT += t.TERLAMBAT;
                  grandTotals.ALFA += t.ALFA;
                });

                return (
                  <TableRow key={id_santri} className="group hover:bg-muted/30">
                    <TableCell className="font-medium sticky left-0 z-20 bg-background border-r border-b py-2 text-xs align-middle">
                      <span className="truncate block w-32 md:w-40 font-bold" title={santri.nama_santri}>
                        {santri.nama_santri}
                      </span>
                    </TableCell>

                    {daysInMonth.map((date) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      return renderSesi.map((sesi) => {
                        const status = getStatusForCell(id_santri, sesi.id_sesi, dateStr);
                        const config = getStatusConfig(status);
                        const cellKey = `${id_santri}-${sesi.id_sesi}-${dateStr}`;
                        const pending = isCellPending(id_santri, sesi.id_sesi, dateStr);

                        return (
                          <TableCell
                            key={`${date.toString()}-${sesi.id_sesi}`}
                            className={cn(
                              "p-0 border-r border-b text-center text-[10px] transition-all duration-150",
                              config?.cellClass ?? "text-muted-foreground/30 font-medium",
                              !pending && "hover:brightness-110 hover:ring-2 hover:ring-inset hover:ring-white/40"
                            )}
                          >
                            <Popover
                              open={openCell === cellKey}
                              onOpenChange={(open) => {
                                if (!isUpdating) setOpenCell(open ? cellKey : null);
                              }}
                            >
                              <PopoverTrigger asChild>
                                <button
                                  className="flex h-9 w-full items-center justify-center cursor-pointer disabled:cursor-wait focus:outline-none"
                                  disabled={pending}
                                  title={`${santri.nama_santri} � ${format(date, "dd MMM")} � ${sesi.nama_sesi}: ${status ?? "Belum Ada"}`}
                                >
                                  {pending ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    config?.initial ?? "-"
                                  )}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-2 shadow-xl"
                                align="center"
                                side="top"
                                sideOffset={4}
                              >
                                <div className="flex flex-col gap-1 min-w-0">
                                  <p className="text-[10px] text-muted-foreground font-medium px-1 pb-1 border-b truncate max-w-[180px]">
                                    {santri.nama_santri} &middot; {format(date, "dd MMM")} &middot; {sesi.nama_sesi}
                                  </p>
                                  <div className="flex gap-1 pt-1">
                                    {absensiStatusSchema.options.map((st) => {
                                      const stConfig = getStatusConfig(st);
                                      const isActive = status === st;
                                      return (
                                        <button
                                          key={st}
                                          onClick={() => handleCellEdit(id_santri, sesi.id_sesi, dateStr, st)}
                                          title={stConfig?.label ?? st}
                                          className={cn(
                                            "w-9 h-9 rounded-md text-xs font-bold transition-all",
                                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                            stConfig?.btnClass,
                                            isActive && "ring-2 ring-offset-1 ring-white scale-110 shadow-md"
                                          )}
                                        >
                                          {stConfig?.initial ?? st[0]}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <p className="text-[9px] text-muted-foreground text-center pt-0.5">
                                    Klik status untuk menyimpan
                                  </p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                        );
                      });
                    })}

                    {/* Totals */}
                    <TableCell className="text-center font-bold border-b border-r bg-green-50/40 text-green-700 dark:bg-green-950/20 dark:text-green-400 text-xs">{grandTotals.HADIR}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-blue-50/40 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 text-xs">{grandTotals.IZIN}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-yellow-50/40 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 text-xs">{grandTotals.SAKIT}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-orange-50/40 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 text-xs">{grandTotals.TERLAMBAT}</TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-red-50/40 text-red-700 dark:bg-red-950/20 dark:text-red-400 text-xs">{grandTotals.ALFA}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
        <div className="flex items-start gap-3 text-muted-foreground italic text-xs max-w-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            Klik langsung pada sel untuk mengubah status absensi. Perubahan disimpan secara otomatis.
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {STATUS_CONFIG.map((s) => (
            <span
              key={s.value}
              title={s.label}
              className={cn("w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center", s.cellClass)}
            >
              {s.initial}
            </span>
          ))}
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
