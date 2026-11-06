import { useState } from "react";
import { BookOpen, User, Calendar, ChevronLeft, ChevronRight, Award, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PortalSetoranResponse, PortalSetoranRecord } from "../types";

interface PortalSetoranHistoryProps {
  data?: PortalSetoranResponse;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export function PortalSetoranHistory({
  data,
  isLoading,
  page,
  onPageChange,
}: PortalSetoranHistoryProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const records = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.total_pages || 1;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <Card className="p-12 text-center bg-card shadow-2xs">
        <div className="flex flex-col items-center justify-center gap-2">
          <BookOpen className="h-10 w-10 text-muted-foreground/50" />
          <h3 className="font-semibold text-base">Belum Ada Riwayat Setoran</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Santri belum memiliki catatan setoran hafalan yang tercatat pada sistem.
          </p>
        </div>
      </Card>
    );
  }

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-base">Riwayat Setoran Hafalan</h3>
          <p className="text-xs text-muted-foreground">
            Total {pagination?.total ?? records.length} catatan setoran santri
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {records.map((item: PortalSetoranRecord) => {
          const isExpanded = expandedId === item.id_setoran;
          const hasRubrik = item.nilai_kriteria && item.nilai_kriteria.length > 0;

          const suratRangeText =
            item.surat_mulai === item.surat_selesai
              ? `${item.nama_surat_mulai || `Surat ${item.surat_mulai}`} : ${item.ayat_mulai} - ${item.ayat_selesai}`
              : `${item.nama_surat_mulai || `Surat ${item.surat_mulai}`} (${item.ayat_mulai}) - ${item.nama_surat_selesai || `Surat ${item.surat_selesai}`} (${item.ayat_selesai})`;

          return (
            <Card
              key={item.id_setoran}
              className="bg-card border-border/70 hover:border-border transition-all shadow-2xs overflow-hidden"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-semibold text-xs">
                      {item.kategori?.nama_kategori || "Hafalan"}
                    </Badge>
                    {item.nilai && (
                      <Badge variant="outline" className="text-xs font-medium border-emerald-300 text-emerald-700 bg-emerald-50">
                        {item.nilai}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-bold text-sm text-foreground">
                        {suratRangeText}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>Muhafiz: <strong className="text-foreground">{item.muhafiz?.name || "-"}</strong></span>
                    </div>
                  </div>

                  {hasRubrik && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(item.id_setoran)}
                      className="text-xs text-primary h-8 px-2"
                    >
                      {isExpanded ? "Tutup Nilai" : "Lihat Nilai"}
                    </Button>
                  )}
                </div>

                {item.keterangan && (
                  <div className="flex items-start gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <span>Catatan: <span className="text-foreground">{item.keterangan}</span></span>
                  </div>
                )}

                {/* Rubrik detail breakdown if expanded */}
                {isExpanded && hasRubrik && (
                  <div className="pt-2 border-t border-border/50 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Award className="h-3.5 w-3.5 text-amber-600" />
                      <span>Penilaian Rubrik:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {item.nilai_kriteria?.map((kriteriaItem) => (
                        <div
                          key={kriteriaItem.id_nilai}
                          className="p-2 rounded-md bg-muted/40 border text-xs flex justify-between items-center"
                        >
                          <span className="text-muted-foreground truncate">
                            {kriteriaItem.kriteria?.nama_kriteria || "Kriteria"}
                          </span>
                          <span className="font-bold text-foreground ml-2">
                            {kriteriaItem.nilai}
                          </span>
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
