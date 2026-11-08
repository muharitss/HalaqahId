import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search } from "lucide-react";
import type { SurahProgressItem, StatusProgress } from "../types";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface QuranProgressGridProps {
  suratList: SurahProgressItem[];
  isLoading?: boolean;
  onSelectSurah?: (surah: SurahProgressItem) => void;
}

const STATUS_STYLES: Record<
  StatusProgress,
  { label: string; bg: string; border: string; text: string; badgeVariant: "default" | "secondary" | "outline" }
> = {
  BELUM: {
    label: "Belum",
    bg: "bg-muted/40 hover:bg-muted/70",
    border: "border-border/60",
    text: "text-muted-foreground",
    badgeVariant: "outline",
  },
  PROSES: {
    label: "Proses",
    bg: "bg-amber-500/10 hover:bg-amber-500/15 dark:bg-amber-950/20",
    border: "border-amber-300 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-400",
    badgeVariant: "secondary",
  },
  SELESAI: {
    label: "Selesai",
    bg: "bg-emerald-500/10 hover:bg-emerald-500/15 dark:bg-emerald-950/20",
    border: "border-emerald-300 dark:border-emerald-800",
    text: "text-emerald-800 dark:text-emerald-400",
    badgeVariant: "default",
  },
  LANCAR: {
    label: "Lancar",
    bg: "bg-sky-500/10 hover:bg-sky-500/15 dark:bg-sky-950/20",
    border: "border-sky-300 dark:border-sky-800",
    text: "text-sky-800 dark:text-sky-400",
    badgeVariant: "default",
  },
};

export function QuranProgressGrid({
  suratList,
  isLoading,
  onSelectSurah,
}: QuranProgressGridProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusProgress | "ALL">("ALL");

  const filteredSurat = useMemo(() => {
    return suratList.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        item.id_surat.toString().includes(q) ||
        item.nama_latin.toLowerCase().includes(q) ||
        item.nama_surat.toLowerCase().includes(q)
      );
    });
  }, [suratList, search, statusFilter]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nomor atau nama surat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1 bg-muted/60 p-1 rounded-lg">
          <Button
            variant={statusFilter === "ALL" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs px-2.5"
            onClick={() => setStatusFilter("ALL")}
          >
            Semua ({suratList.length})
          </Button>
          {(["LANCAR", "SELESAI", "PROSES", "BELUM"] as StatusProgress[]).map((st) => {
            const count = suratList.filter((s) => s.status === st).length;
            const style = STATUS_STYLES[st];
            return (
              <Button
                key={st}
                variant={statusFilter === st ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs px-2.5 gap-1"
                onClick={() => setStatusFilter(st)}
              >
                <span>{style.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Grid of Surahs */}
      {filteredSurat.length === 0 ? (
        <div className="p-8 border border-dashed rounded-lg text-center text-xs text-muted-foreground">
          Tidak ada surat yang cocok dengan filter atau kata kunci pencarian.
        </div>
      ) : (
        <TooltipProvider delayDuration={150}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {filteredSurat.map((surah) => {
              const style = STATUS_STYLES[surah.status] || STATUS_STYLES.BELUM;

              return (
                <Tooltip key={surah.id_surat}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onSelectSurah?.(surah)}
                      className={`relative p-3 rounded-xl border text-left transition-all ${style.bg} ${style.border} hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-muted-foreground/80">
                          #{surah.id_surat}
                        </span>
                        <Badge
                          variant={style.badgeVariant}
                          className={`text-[9px] px-1.5 py-0 h-4 font-semibold ${style.text}`}
                        >
                          {style.label}
                        </Badge>
                      </div>

                      <div className="font-semibold text-xs truncate" title={surah.nama_latin}>
                        {surah.nama_latin}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                        <span>{surah.jumlah_ayat} Ayat</span>
                        <span className="font-bold text-primary">{Math.round(surah.persentase)}%</span>
                      </div>

                      {/* Small Progress bar */}
                      <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-1.5">
                        <div
                          className={`h-full transition-all ${
                            surah.status === "LANCAR"
                              ? "bg-sky-500"
                              : surah.status === "SELESAI"
                              ? "bg-emerald-500"
                              : surah.status === "PROSES"
                              ? "bg-amber-500"
                              : "bg-muted-foreground/30"
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, surah.persentase))}%` }}
                        />
                      </div>
                    </button>
                  </TooltipTrigger>

                  <TooltipContent side="top" className="max-w-xs p-3 text-xs space-y-2">
                    <div className="border-b pb-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">
                          {surah.id_surat}. {surah.nama_latin}
                        </span>
                        <span className="font-serif text-sm text-primary font-bold">
                          {surah.nama_surat}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {surah.arti} · {surah.tempat_turun} · {surah.jumlah_ayat} ayat
                      </p>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-semibold">{style.label} ({Math.round(surah.persentase)}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ayat Terakhir:</span>
                        <span className="font-semibold">
                          {surah.ayat_terakhir ? `Ayat ${surah.ayat_terakhir}` : "Belum mulai"}
                        </span>
                      </div>
                      {surah.halaman_terakhir && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Halaman Terakhir:</span>
                          <span className="font-semibold">Hal. {surah.halaman_terakhir}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Pengulangan:</span>
                        <span className="font-semibold">{surah.total_pengulangan} kali</span>
                      </div>
                      {surah.last_setoran && (
                        <div className="flex justify-between pt-1 border-t text-[10px] text-muted-foreground">
                          <span>Setoran:</span>
                          <span>
                            {format(new Date(surah.last_setoran), "dd MMM yyyy", { locale: idLocale })}
                          </span>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
}
