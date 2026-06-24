import { useMemo, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { format, getDate, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { useAbsensi } from "./absensi-provider";
import { useAbsensiRekapQuery } from "../hooks/use-absensi-query";
import { type AbsensiStatusType } from "../types/absensi.schema";

export function AbsensiRekapTable() {
  const { halaqahId, viewDate, setViewDate, santriList, filteredSesiList, loadingSantri } = useAbsensi();

  const month = (viewDate.getMonth() + 1).toString();
  const year = viewDate.getFullYear().toString();

  const { data: monthlyData = [], isLoading: isLoadingData } = useAbsensiRekapQuery(month, year, halaqahId);

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

        if (status && status in totals) {
          totals[status]++;
        }
      });
      return totals;
    },
    [monthlyData]
  );

  const getStatusStyle = (status?: AbsensiStatusType | null) => {
    switch (status) {
      case "HADIR": return "bg-green-500 text-white font-bold";
      case "IZIN": return "bg-blue-500 text-white font-bold";
      case "SAKIT": return "bg-yellow-500 text-white font-bold";
      case "TERLAMBAT": return "bg-orange-500 text-white font-bold";
      case "ALFA": return "bg-red-500 text-white font-bold";
      default: return "text-muted-foreground/30 font-medium";
    }
  };

  const getStatusInitial = (status?: AbsensiStatusType | null) => (status ? status.charAt(0) : "-");

  const isDataLoading = isLoadingData || loadingSantri;

  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-end">
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
                  (s) => !s.id_halaqah || s.id_halaqah === santri.id_halaqah
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
                      <span
                        className="truncate block w-32 md:w-40 font-bold"
                        title={santri.nama_santri}
                      >
                        {santri.nama_santri}
                      </span>
                    </TableCell>
                    {daysInMonth.map((date) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      return renderSesi.map((sesi) => {
                        const status = getStatusForCell(id_santri, sesi.id_sesi, dateStr);
                        return (
                          <TableCell
                            key={`${date.toString()}-${sesi.id_sesi}`}
                            className={cn("p-0 border-r border-b text-center text-[10px]", getStatusStyle(status))}
                            title={`${santri.nama_santri} - ${format(date, "dd MMM")} - ${sesi.nama_sesi} : ${status || "Belum Ada"}`}
                          >
                            <div className="flex h-9 w-full items-center justify-center">
                              {getStatusInitial(status)}
                            </div>
                          </TableCell>
                        );
                      });
                    })}
                    <TableCell className="text-center font-bold border-b border-r bg-green-50/40 text-green-700 text-xs">
                      {grandTotals.HADIR}
                    </TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-blue-50/40 text-blue-700 text-xs">
                      {grandTotals.IZIN}
                    </TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-yellow-50/40 text-yellow-700 text-xs">
                      {grandTotals.SAKIT}
                    </TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-orange-50/40 text-orange-700 text-xs">
                      {grandTotals.TERLAMBAT}
                    </TableCell>
                    <TableCell className="text-center font-bold border-b border-r bg-red-50/40 text-red-700 text-xs">
                      {grandTotals.ALFA}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6">
        <div className="flex items-start gap-3 text-muted-foreground italic text-xs max-w-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            Tabel ini menampilkan rekapitulasi kehadiran santri per bulan. Gunakan filter di atas tabel untuk melihat data bulan lainnya.
          </p>
        </div>
      </div>
    </div>
  );
}
