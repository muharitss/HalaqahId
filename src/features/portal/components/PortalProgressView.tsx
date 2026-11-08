import { useState, useMemo } from "react";
import { BookOpen, CheckCircle2, Clock, Sparkles, Search, Layers, BookCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { surahNumberToName } from "@/utils/mushafUtils";
import type { PortalProgressResponse } from "../types";

interface PortalProgressViewProps {
  progress?: PortalProgressResponse;
  isLoading: boolean;
}

export function PortalProgressView({ progress, isLoading }: PortalProgressViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const summary = progress?.summary;
  const records = useMemo(() => {
    return (progress?.daftar_progress || []).map((item) => {
      const surat_ke = item.id_surat ?? item.surat_ke ?? 0;
      const nama_surat = item.nama_surat || (surat_ke ? surahNumberToName(surat_ke) : "");
      return {
        ...item,
        surat_ke,
        nama_surat,
      };
    });
  }, [progress]);

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchSearch =
        (item.nama_surat || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.surat_ke.toString().includes(searchTerm);
      const matchStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [records, searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const percentage = summary?.persentase_keseluruhan ?? 0;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="border-primary/20 bg-linear-to-br from-white via-primary/5 to-emerald-50/30 overflow-hidden shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-base sm:text-lg">Ringkasan Hafalan Santri</CardTitle>
            </div>
            <Badge variant="outline" className="bg-background/80 font-semibold text-primary border-primary/30">
              {percentage}% Al-Qur'an
            </Badge>
          </div>
          <CardDescription>
            Estimasi pencapaian hafalan berdasarkan data setoran yang telah disahkan muhafiz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>Progress Keseluruhan</span>
              <span className="font-semibold text-foreground">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-card/90 p-3 rounded-xl border border-border/60 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>Juz Selesai</span>
              </div>
              <p className="text-xl font-bold mt-1 text-foreground">
                {summary?.total_juz_selesai ?? 0} <span className="text-xs font-normal text-muted-foreground">Juz</span>
              </p>
            </div>

            <div className="bg-card/90 p-3 rounded-xl border border-border/60 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                <span>Halaman</span>
              </div>
              <p className="text-xl font-bold mt-1 text-foreground">
                {summary?.total_halaman_selesai ?? 0} <span className="text-xs font-normal text-muted-foreground">Hal</span>
              </p>
            </div>

            <div className="bg-card/90 p-3 rounded-xl border border-border/60 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>Total Ayat</span>
              </div>
              <p className="text-xl font-bold mt-1 text-foreground">
                {summary?.total_ayat_selesai ?? 0} <span className="text-xs font-normal text-muted-foreground">Ayat</span>
              </p>
            </div>

            <div className="bg-card/90 p-3 rounded-xl border border-border/60 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                <span>Surat Selesai</span>
              </div>
              <p className="text-xl font-bold mt-1 text-foreground">
                {summary?.total_surat_selesai ?? 0} <span className="text-xs font-normal text-muted-foreground">/ 114</span>
              </p>
            </div>
          </div>

          {/* Last Activity */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Setoran Terakhir:{" "}
                <strong className="text-foreground">
                  {summary?.last_setoran
                    ? new Date(summary.last_setoran).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Belum ada"}
                </strong>
              </span>
            </div>
            {summary?.last_murajaah && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                <span>
                  Muraja'ah Terakhir:{" "}
                  <strong className="text-foreground">
                    {new Date(summary.last_murajaah).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Surah List / Progress Details */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-base text-foreground">Detail Progress Per Surat</h3>
            <p className="text-xs text-muted-foreground">
              Status kelancaran dan pengulangan hafalan santri
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari surat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs h-9 bg-background"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant={statusFilter === "ALL" ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => setStatusFilter("ALL")}
          >
            Semua ({records.length})
          </Badge>
          <Badge
            variant={statusFilter === "LANCAR" ? "default" : "outline"}
            className="cursor-pointer text-xs border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
            onClick={() => setStatusFilter("LANCAR")}
          >
            Lancar ({summary?.total_surat_lancar ?? 0})
          </Badge>
          <Badge
            variant={statusFilter === "SELESAI" ? "default" : "outline"}
            className="cursor-pointer text-xs border-blue-300 text-blue-800 bg-blue-50 hover:bg-blue-100"
            onClick={() => setStatusFilter("SELESAI")}
          >
            Selesai ({summary?.total_surat_selesai ?? 0})
          </Badge>
          <Badge
            variant={statusFilter === "PROSES" ? "default" : "outline"}
            className="cursor-pointer text-xs border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100"
            onClick={() => setStatusFilter("PROSES")}
          >
            Proses ({summary?.total_surat_proses ?? 0})
          </Badge>
          <Badge
            variant={statusFilter === "BELUM" ? "default" : "outline"}
            className="cursor-pointer text-xs border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100"
            onClick={() => setStatusFilter("BELUM")}
          >
            Belum ({summary?.total_surat_belum ?? 0})
          </Badge>
        </div>

        {/* Cards Grid */}
        {filteredRecords.length === 0 ? (
          <Card className="p-8 text-center bg-card shadow-2xs">
            <p className="text-sm text-muted-foreground">Tidak ada data surat yang cocok.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredRecords.map((item) => {
              const isLancar = item.status === "LANCAR";
              const isSelesai = item.status === "SELESAI";
              const isProses = item.status === "PROSES";

              return (
                <div
                  key={item.id_progress || item.surat_ke}
                  className={`p-3.5 rounded-xl border transition-colors bg-card shadow-2xs flex flex-col justify-between ${
                    isLancar
                      ? "border-emerald-300 ring-1 ring-emerald-100"
                      : isSelesai
                      ? "border-blue-300 ring-1 ring-blue-100"
                      : isProses
                      ? "border-amber-300 ring-1 ring-amber-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {item.surat_ke}
                      </span>
                      <span className="font-semibold text-sm text-foreground">
                        {item.nama_surat}
                      </span>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold px-2 py-0.5 ${
                        isLancar
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : isSelesai
                          ? "bg-blue-50 text-blue-700 border-blue-300"
                          : isProses
                          ? "bg-amber-50 text-amber-700 border-amber-300"
                          : "bg-slate-50 text-slate-600 border-slate-300"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Ayat Terakhir: <strong className="text-foreground">{item.ayat_terakhir || "-"}</strong></span>
                    {item.total_pengulangan > 0 && (
                      <span>{item.total_pengulangan}x Setor</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
