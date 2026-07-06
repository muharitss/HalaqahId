import { useMemo, useCallback, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle, Loader2 } from "lucide-react";
import { format, getDate, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { useAbsensi } from "./absensi-provider";
import { useAbsensiRekapQuery } from "../hooks/use-absensi-query";
import { useAbsensiRekapMutation } from "../hooks/use-absensi-mutation";
import { type AbsensiStatusType, absensiStatusSchema } from "../types/absensi.schema";

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

  const month = (viewDate.getMonth() + 1).toString();
  const year = viewDate.getFullYear().toString();

  const { data: monthlyData = [], isLoading: isLoadingData } = useAbsensiRekapQuery(month, year, halaqahId);
  const { updateCell, isUpdating, pendingVariables } = useAbsensiRekapMutation();

  const [openCell, setOpenCell] = useState<string | null>(null);

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

  const isDataLoading = isLoadingData || loadingSantri;

  return (
    <div className="space-y-4 pt-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground italic flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
          Klik sel untuk langsung input absensi
        </p>
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

      {/* Table */}
      <div className="rounded-md border overflow-x-auto relative shadow-sm scrollbar-thin">
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                rowSpan={2}
                className="min-w-40 sticky left-0 z-30 bg-muted font-bold border-r border-b text-xs align-middle"
              >
                Nama Santri
              </TableHead>
              {daysInMonth.map((date) => {
                const relevantSesi = filteredSesiList.length > 0 ? filteredSesiList : [{ id_sesi: 0, nama_sesi: "Sesi" }];
                return (
                  <TableHead
                    key={date.toString()}
                    colSpan={relevantSesi.length}
                    className="text-center p-1 text-[10px] font-bold border-r border-b"
                  >
                    {getDate(date)}
                  </TableHead>
                );
              })}
              <TableHead
                colSpan={5}
                className="text-center min-w-10 bg-muted/80 font-black border-r border-b text-primary text-[10px]"
              >
                Total
              </TableHead>
            </TableRow>
            <TableRow className="bg-muted/30">
              {daysInMonth.map((date) => {
                const relevantSesi = filteredSesiList.length > 0 ? filteredSesiList : [{ id_sesi: 0, nama_sesi: "Sesi", singkatan: "-" }];
                return relevantSesi.map((sesi) => (
                  <TableHead
                    key={`${date.toString()}-${sesi.id_sesi}`}
                    className="text-center p-1 text-[9px] min-w-[35px] border-r border-b text-muted-foreground truncate"
                    title={sesi.nama_sesi}
                  >
                    {sesi.nama_sesi.substring(0, 3)}
                  </TableHead>
                ));
              })}
              {["H", "I", "S", "T", "A"].map((label) => (
                <TableHead
                  key={label}
                  className="text-center min-w-[40px] bg-muted/50 font-bold border-r border-b text-primary text-[10px]"
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
                                  title={`${santri.nama_santri} — ${format(date, "dd MMM")} — ${sesi.nama_sesi}: ${status ?? "Belum Ada"}`}
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
    </div>
  );
}
