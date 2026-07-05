/**
 * MushafViewer.tsx
 * Komponen visual Mushaf Al-Quran interaktif.
 *
 * Fitur:
 * - Menampilkan halaman mushaf dari UmmahAPI (per baris, RTL)
 * - Klik ayat untuk memilih start/end setoran (dual-select mode)
 * - Highlight range ayat yang dipilih
 * - Navigasi antar halaman
 * - Responsive: side panel di desktop, sheet di mobile
 */

import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMushafPage } from "../hooks/useMushafPage";
import { surahNumberToName, hitungTotalBaris } from "@/utils/mushafUtils";
import type { MushafWord, MushafSelection } from "../types";
import { cn } from "@/lib/utils";

interface MushafViewerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  selection: MushafSelection | null;
  onSelectionChange: (selection: MushafSelection | null) => void;
  /** Mode seleksi: "start" = menunggu klik pertama, "end" = menunggu klik kedua */
  selectionMode: "start" | "end";
  onSelectionModeChange: (mode: "start" | "end") => void;
}

/** Kelompokkan kata berdasarkan line_number */
function groupWordsByLine(words: MushafWord[]): Map<number, MushafWord[]> {
  const lines = new Map<number, MushafWord[]>();
  for (const word of words) {
    const existing = lines.get(word.line_number) ?? [];
    existing.push(word);
    lines.set(word.line_number, existing);
  }
  return lines;
}

/** Cek apakah suatu ayat berada dalam range seleksi */
function isAyahInRange(
  surahNum: number,
  ayahNum: number,
  selection: MushafSelection | null,
): boolean {
  if (!selection) return false;

  // Gunakan multiplier 10000 agar aman untuk surah dengan ayat banyak (Al-Baqarah: 286)
  const globalId = surahNum * 10000 + ayahNum;
  const startId = selection.startSurahNumber * 10000 + selection.startAyah;
  const endId = selection.endSurahNumber * 10000 + selection.endAyah;

  return globalId >= startId && globalId <= endId;
}

export function MushafViewer({
  currentPage,
  onPageChange,
  selection,
  onSelectionChange,
  selectionMode,
  onSelectionModeChange,
}: MushafViewerProps) {
  const { page, isLoading, isError } = useMushafPage(currentPage);

  const lineGroups = useMemo(() => {
    if (!page) return new Map<number, MushafWord[]>();
    return groupWordsByLine(page.words);
  }, [page]);

  const sortedLineNumbers = useMemo(
    () => Array.from(lineGroups.keys()).sort((a, b) => a - b),
    [lineGroups],
  );

  const handleWordClick = (word: MushafWord) => {
    if (word.char_type_name === "end") return; // Abaikan klik nomor ayat

    const surahName = surahNumberToName(word.surah_number);

    if (selectionMode === "start") {
      // Set titik awal
      const newSel: MushafSelection = {
        startSurahNumber: word.surah_number,
        startSurahName: surahName,
        startAyah: word.ayah_number,
        startPage: currentPage,
        startLine: word.line_number,
        endSurahNumber: word.surah_number,
        endSurahName: surahName,
        endAyah: word.ayah_number,
        endPage: currentPage,
        endLine: word.line_number,
        totalBaris: 1,
      };
      onSelectionChange(newSel);
      onSelectionModeChange("end");
    } else {
      // Set titik akhir
      if (!selection) return;

      const startId = selection.startSurahNumber * 10000 + selection.startAyah;
      const endId = word.surah_number * 10000 + word.ayah_number;

      // Jika klik sebelum start → tukar jadi start baru
      if (endId < startId) {
        onSelectionChange({
          startSurahNumber: word.surah_number,
          startSurahName: surahName,
          startAyah: word.ayah_number,
          startPage: currentPage,
          startLine: word.line_number,
          endSurahNumber: selection.startSurahNumber,
          endSurahName: selection.startSurahName,
          endAyah: selection.startAyah,
          endPage: selection.startPage,
          endLine: selection.startLine,
          totalBaris: hitungTotalBaris(
            currentPage,
            word.line_number,
            selection.startPage,
            selection.startLine,
            page?.lines_per_page ?? 15,
          ),
        });
      } else {
        onSelectionChange({
          ...selection,
          endSurahNumber: word.surah_number,
          endSurahName: surahName,
          endAyah: word.ayah_number,
          endPage: currentPage,
          endLine: word.line_number,
          totalBaris: hitungTotalBaris(
            selection.startPage,
            selection.startLine,
            currentPage,
            word.line_number,
            page?.lines_per_page ?? 15,
          ),
        });
      }
      onSelectionModeChange("start");
    }
  };

  const handleClearSelection = () => {
    onSelectionChange(null);
    onSelectionModeChange("start");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Memuat halaman {currentPage}...</p>
      </div>
    );
  }

  if (isError || !page) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm font-medium">Gagal memuat halaman mushaf</p>
        <p className="text-xs text-muted-foreground">Periksa koneksi internet Anda</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* ── Header: Info Halaman + Selection Mode ── */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground">
            Halaman {currentPage} / {page.total_pages}
          </span>
        </div>
        <Badge
          variant={selectionMode === "start" ? "secondary" : "default"}
          className="text-xs h-5 px-2"
        >
          {selectionMode === "start" ? "Klik → Mulai" : "Klik → Selesai"}
        </Badge>
      </div>

      {/* ── Mushaf Content (RTL) ── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 select-none"
        dir="rtl"
        style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
      >
        {sortedLineNumbers.map((lineNum) => {
          const lineWords = lineGroups.get(lineNum) ?? [];
          return (
            <div
              key={lineNum}
              className="flex flex-wrap justify-center items-baseline gap-x-1 gap-y-0.5 py-1 border-b border-dashed border-border/30 last:border-0"
            >
              {lineWords.map((word, idx) => {
                const isSelected = isAyahInRange(
                  word.surah_number,
                  word.ayah_number,
                  selection,
                );
                const isStart =
                  selection !== null &&
                  word.surah_number === selection.startSurahNumber &&
                  word.ayah_number === selection.startAyah;
                const isEnd =
                  selection !== null &&
                  word.surah_number === selection.endSurahNumber &&
                  word.ayah_number === selection.endAyah;
                const isEndChar = word.char_type_name === "end";

                // Tentukan rounded corners untuk RTL (Mulai di kanan, Selesai di kiri)
                let roundedClass = "rounded-none";
                if (isStart && isEnd) {
                  roundedClass = "rounded-lg";
                } else if (isStart) {
                  roundedClass = "rounded-r-lg";
                } else if (isEnd) {
                  roundedClass = "rounded-l-lg";
                }

                return (
                  <span
                    key={`${word.verse_key}-${word.position}-${idx}`}
                    onClick={() => handleWordClick(word)}
                    title={isEndChar ? undefined : word.verse_key}
                    className={cn(
                      "inline-block text-xl leading-relaxed transition-all duration-150",
                      isEndChar
                        ? "text-primary/70 text-base cursor-default mx-0.5"
                        : "cursor-pointer hover:scale-110 px-0.5",
                      isSelected &&
                        !isEndChar &&
                        "bg-primary/20 text-foreground px-1 -mx-0.5 py-0.5",
                      isSelected && !isEndChar && roundedClass,
                      (isStart || isEnd) &&
                        !isEndChar &&
                        "bg-primary/30 font-semibold",
                      !isSelected && !isEndChar && "hover:bg-primary/10 rounded-md",
                    )}
                  >
                    {word.text_uthmani}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── Footer: Selection Summary + Navigation ── */}
      <div className="border-t bg-background px-3 py-2 space-y-2">
        {/* Selection summary */}
        {selection ? (
          <div className="flex items-start justify-between gap-2">
            <div className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">{selection.startSurahName} {selection.startAyah}</span>
              {" → "}
              <span className="font-medium text-foreground">{selection.endSurahName} {selection.endAyah}</span>
              <span className="ml-1 text-primary font-semibold">
                ({selection.totalBaris} baris)
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-xs text-destructive/70 hover:text-destructive underline shrink-0"
            >
              Hapus
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic text-center">
            Klik kata untuk memilih rentang setoran
          </p>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Sebelumnya
          </Button>

          <span className="text-xs font-mono text-muted-foreground">
            {currentPage} / {page.total_pages}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= page.total_pages}
          >
            Berikutnya
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
