import { CalendarCheck, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PortalAbsensiResponse, PortalAbsensiRecord } from "../types";

interface PortalAbsensiViewProps {
  data?: PortalAbsensiResponse;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export function PortalAbsensiView({
  data,
  isLoading,
  page,
  onPageChange,
}: PortalAbsensiViewProps) {
  const records = data?.data || [];
  const summary = data?.summary;
  const pagination = data?.pagination;
  const totalPages = pagination?.total_pages || 1;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  const total = summary?.total || 0;
  const hadir = summary?.hadir || 0;
  const izin = summary?.izin || 0;
  const sakit = summary?.sakit || 0;
  const alfa = summary?.alfa || 0;

  const attendanceRate = total > 0 ? Math.round((hadir / total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Attendance Summary Banner */}
      <Card className="bg-card border-border/80 shadow-2xs">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-base">Rekapitulasi Kehadiran</h3>
            </div>
            <Badge variant="outline" className="font-bold text-xs bg-primary/5 text-primary border-primary/20">
              Tingkat Kehadiran: {attendanceRate}%
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[11px] text-emerald-800 font-medium">Hadir</p>
                <p className="text-lg font-bold text-emerald-950">{hadir}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-[11px] text-blue-800 font-medium">Izin</p>
                <p className="text-lg font-bold text-blue-950">{izin}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-[11px] text-amber-800 font-medium">Sakit</p>
                <p className="text-lg font-bold text-amber-950">{sakit}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/60 flex items-center gap-2.5">
              <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <div>
                <p className="text-[11px] text-rose-800 font-medium">Alfa</p>
                <p className="text-lg font-bold text-rose-950">{alfa}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List Records */}
      {records.length === 0 ? (
        <Card className="p-10 text-center bg-card shadow-2xs">
          <p className="text-sm text-muted-foreground">Belum ada riwayat absensi halaqah tercatat.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {records.map((item: PortalAbsensiRecord) => {
            const isHadir = item.status === "HADIR";
            const isIzin = item.status === "IZIN";
            const isSakit = item.status === "SAKIT";
            const isAlfa = item.status === "ALFA";

            return (
              <div
                key={item.id_absensi}
                className="p-3.5 rounded-xl border bg-card flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-0.5">
                  <p className="font-semibold text-sm text-foreground">
                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sesi: {item.sesi?.nama_sesi || "Halaqah Rutin"}
                    {item.keterangan && ` • Ket: ${item.keterangan}`}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={`text-xs font-semibold px-2.5 py-0.5 ${
                    isHadir
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : isIzin
                      ? "bg-blue-50 text-blue-700 border-blue-300"
                      : isSakit
                      ? "bg-amber-50 text-amber-700 border-amber-300"
                      : isAlfa
                      ? "bg-rose-50 text-rose-700 border-rose-300"
                      : "bg-slate-50 text-slate-700 border-slate-300"
                  }`}
                >
                  {item.status}
                </Badge>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-8 px-2.5 text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 px-2.5 text-xs"
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
