import { Award, User, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { PortalUjianRecord } from "../types";

interface PortalUjianViewProps {
  data?: PortalUjianRecord[];
  isLoading: boolean;
}

export function PortalUjianView({ data, isLoading }: PortalUjianViewProps) {
  const records = data || [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <Card className="p-12 text-center bg-card shadow-2xs">
        <div className="flex flex-col items-center justify-center gap-2">
          <Award className="h-10 w-10 text-muted-foreground/50" />
          <h3 className="font-semibold text-base">Belum Ada Hasil Ujian</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Santri belum memiliki riwayat penilaian ujian atau tasmi' resmi.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-base">Hasil Ujian & Tasmi'</h3>
        <p className="text-xs text-muted-foreground">
          Daftar ujian tahfidz yang telah ditempuh santri
        </p>
      </div>

      <div className="space-y-3">
        {records.map((item: PortalUjianRecord) => {
          const isLulus =
            item.is_lulus !== undefined
              ? item.is_lulus
              : item.status_kelulusan?.toUpperCase() === "LULUS";
          const statusText =
            item.status_kelulusan ||
            (item.is_lulus !== undefined
              ? item.is_lulus
                ? "LULUS"
                : "TIDAK LULUS"
              : null);
          const examTitle =
            item.jadwal?.judul_jadwal ||
            item.jadwal?.template?.nama_template ||
            "Ujian Tahfidz";

          const examDate = item.jadwal?.tanggal_ujian || item.created_at;

          return (
            <Card
              key={item.id_hasil}
              className="bg-card border-border/80 shadow-2xs overflow-hidden"
            >
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-foreground">{examTitle}</h4>
                      {item.jadwal?.template?.tipe_ujian && (
                        <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                          {item.jadwal.template.tipe_ujian}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {examDate
                          ? new Date(examDate).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.nilai_akhir !== null && item.nilai_akhir !== undefined && (
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-muted-foreground font-medium block">
                          Nilai Akhir
                        </span>
                        <span className="text-2xl font-black text-foreground">
                          {item.nilai_akhir}
                        </span>
                      </div>
                    )}

                    {statusText && (
                      <Badge
                        variant="outline"
                        className={`text-xs font-bold px-3 py-1 flex items-center gap-1 ${
                          isLulus
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : "bg-rose-50 text-rose-700 border-rose-300"
                        }`}
                      >
                        {isLulus ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {statusText}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Penguji: <strong className="text-foreground">{item.muhafiz?.name || "-"}</strong></span>
                </div>

                {item.catatan && (
                  <div className="p-2.5 rounded-lg bg-muted/40 border text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Catatan Penguji: </span>
                    {item.catatan}
                  </div>
                )}

                {/* Rubrik detail kriteria */}
                {item.nilai_rubrik && item.nilai_rubrik.length > 0 && (
                  <div className="pt-2 border-t border-border/50 space-y-2">
                    <p className="text-xs font-semibold text-foreground">Rincian Penilaian Rubrik:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {item.nilai_rubrik.map((nr) => (
                        <div
                          key={nr.id_nilai}
                          className="p-2 rounded-md bg-muted/40 border text-xs flex justify-between items-center"
                        >
                          <span className="text-muted-foreground truncate">
                            {nr.kriteria?.nama || nr.kriteria?.nama_kriteria || "Kriteria"}
                          </span>
                          <span className="font-bold text-foreground ml-2">{nr.nilai}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
