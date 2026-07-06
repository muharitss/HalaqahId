/**
 * MushafViewer.tsx
 * Komponen visual Mushaf Al-Quran interaktif.
 *
 * Fitur:
 * - Menampilkan halaman mushaf dari UmmahAPI (per baris, RTL)
 * - Klik ayat untuk memilih start/end setoran (dual-select mode)
 * - Highlight range ayat yang dipilih
 * - Navigasi antar halaman
 * - ✅ Quick Jump Input: klik nomor halaman → ketik langsung → Enter
 * - ✅ Navigasi Surah: combobox 114 surah → lompat langsung
 * - ✅ Navigasi Juz: select Juz 1–30 → lompat ke halaman awal juz
 * - ✅ Format 15 Baris Mushaf: render header surah & bismillah di baris yang sesuai
 * - ✅ Penanda Ayat: border lingkaran khas mushaf untuk nomor ayat
 * - ✅ Navigasi RTL: urutan navigasi footer disesuaikan arah baca Al-Quran (kanan-ke-kiri)
 */

import { useMemo, useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  BookOpen,
  Search,
  BookMarked,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMushafPage } from "../hooks/useMushafPage";
import {
  surahNumberToName,
  hitungTotalBaris,
  SURAH_PAGE_START,
} from "@/utils/mushafUtils";
import type { MushafWord, MushafSelection } from "../types";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Data: mapping Juz → halaman awal
// ─────────────────────────────────────────────
const JUZ_PAGE_START: Record<number, number> = {
  1: 1,   2: 22,  3: 42,  4: 62,  5: 82,
  6: 102, 7: 121, 8: 142, 9: 162, 10: 182,
  11: 201, 12: 221, 13: 241, 14: 261, 15: 281,
  16: 301, 17: 321, 18: 341, 19: 361, 20: 381,
  21: 401, 22: 421, 23: 441, 24: 461, 25: 481,
  26: 501, 27: 521, 28: 541, 29: 561, 30: 581,
};

// ─────────────────────────────────────────────
// Data: daftar 114 surah dengan nomor + nama
// ─────────────────────────────────────────────
const SURAH_LIST = Array.from({ length: 114 }, (_, i) => ({
  number: i + 1,
  name: surahNumberToName(i + 1),
  page: SURAH_PAGE_START[i + 1] ?? 1,
}));

// ─────────────────────────────────────────────
// Sub-komponen: Quick Jump Input
// ─────────────────────────────────────────────
function PageJumpInput({
  currentPage,
  totalPages,
  onJump,
}: {
  currentPage: number;
  totalPages: number;
  onJump: (page: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.select();
    }
  }, [editing]);

  const handleCommit = () => {
    const num = parseInt(inputVal, 10);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      onJump(num);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCommit();
    if (e.key === "Escape") setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          type="number"
          min={1}
          max={totalPages}
          inputMode="numeric"
          className="w-16 h-7 text-center text-xs px-1 font-mono"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={handleCommit}
          onKeyDown={handleKeyDown}
        />
        <span className="text-xs text-muted-foreground">/ {totalPages}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setInputVal(String(currentPage));
        setEditing(true);
      }}
      title="Klik untuk loncat ke halaman tertentu"
      className="text-xs font-mono text-muted-foreground hover:text-foreground hover:underline cursor-pointer px-2 py-1 rounded hover:bg-muted transition-colors"
    >
      {currentPage} / {totalPages}
    </button>
  );
}

// ─────────────────────────────────────────────
// Sub-komponen: Surah Jump Combobox
// ─────────────────────────────────────────────
function SurahJumpCombobox({
  onJump,
}: {
  onJump: (page: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 text-xs px-2.5 font-medium"
          title="Lompat ke Surah"
        >
          <Search className="h-3 w-3 text-primary" />
          <span className="hidden sm:inline">Ke Surah</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start" side="top">
        <Command>
          <CommandInput placeholder="Cari nama surah..." className="h-9 text-xs" />
          <CommandList className="max-h-[240px]">
            <CommandEmpty className="py-4 text-xs text-center text-muted-foreground">
              Surah tidak ditemukan.
            </CommandEmpty>
            <CommandGroup>
              {SURAH_LIST.map((surah) => (
                <CommandItem
                  key={surah.number}
                  value={`${surah.number} ${surah.name}`}
                  onSelect={() => {
                    onJump(surah.page);
                    setOpen(false);
                  }}
                  className="text-xs cursor-pointer"
                >
                  <span className="w-7 text-muted-foreground font-mono shrink-0">
                    {surah.number}.
                  </span>
                  <span className="flex-1">{surah.name}</span>
                  <span className="text-muted-foreground/60 ml-2">hal. {surah.page}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ─────────────────────────────────────────────
// Sub-komponen: Juz Jump Selector
// ─────────────────────────────────────────────
function JuzJumpSelect({
  onJump,
}: {
  onJump: (page: number) => void;
}) {
  return (
    <Select
      onValueChange={(val) => {
        const juzNum = parseInt(val, 10);
        const page = JUZ_PAGE_START[juzNum] ?? 1;
        onJump(page);
      }}
    >
      <SelectTrigger className="h-7 text-xs w-[90px] gap-1 px-2">
        <BookMarked className="h-3 w-3 text-primary shrink-0" />
        <SelectValue placeholder="Juz" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
          <SelectItem key={juz} value={String(juz)} className="text-xs">
            Juz {juz}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

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

  const globalId = surahNum * 10000 + ayahNum;
  const startId = selection.startSurahNumber * 10000 + selection.startAyah;
  const endId = selection.endSurahNumber * 10000 + selection.endAyah;

  return globalId >= startId && globalId <= endId;
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface MushafViewerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  selection: MushafSelection | null;
  onSelectionChange: (selection: MushafSelection | null) => void;
  /** Mode seleksi: "start" = menunggu klik pertama, "end" = menunggu klik kedua */
  selectionMode: "start" | "end";
  onSelectionModeChange: (mode: "start" | "end") => void;
}

// ─────────────────────────────────────────────
// Komponen Utama
// ─────────────────────────────────────────────
export function MushafViewer({
  currentPage,
  onPageChange,
  selection,
  onSelectionChange,
  selectionMode,
  onSelectionModeChange,
}: MushafViewerProps) {
  const { page, isLoading, isError } = useMushafPage(currentPage);

  const linesPerPage = page?.lines_per_page ?? 15;
  const allLineNumbers = useMemo(() => {
    return Array.from({ length: linesPerPage }, (_, i) => i + 1);
  }, [linesPerPage]);

  const lineGroups = useMemo(() => {
    if (!page) return new Map<number, MushafWord[]>();
    return groupWordsByLine(page.words);
  }, [page]);

  const specialLines = useMemo(() => {
    const map = new Map<number, { type: "surah_header" | "bismillah"; surahNumber: number; surahName: string }>();
    if (!page) return map;

    const surahStarts = new Map<number, { surahNumber: number; startLine: number }>();
    for (const word of page.words) {
      if (word.ayah_number === 1 && !surahStarts.has(word.surah_number)) {
        surahStarts.set(word.surah_number, {
          surahNumber: word.surah_number,
          startLine: word.line_number,
        });
      }
    }

    for (const [surahNum, info] of surahStarts.entries()) {
      const { startLine } = info;
      const name = surahNumberToName(surahNum);

      if (surahNum === 1) {
        map.set(1, { type: "surah_header", surahNumber: surahNum, surahName: name });
      } else if (surahNum === 9) {
        map.set(startLine - 1, { type: "surah_header", surahNumber: surahNum, surahName: name });
      } else {
        map.set(startLine - 2, { type: "surah_header", surahNumber: surahNum, surahName: name });
        map.set(startLine - 1, { type: "bismillah", surahNumber: surahNum, surahName: name });
      }
    }

    return map;
  }, [page]);

  const handleWordClick = (word: MushafWord) => {
    if (word.char_type_name === "end") return; // Abaikan klik nomor ayat

    const surahName = surahNumberToName(word.surah_number);

    if (selectionMode === "start") {
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
      if (!selection) return;

      const startId = selection.startSurahNumber * 10000 + selection.startAyah;
      const endId = word.surah_number * 10000 + word.ayah_number;

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
      {/* ── Header: Info Halaman + Quick Navigation ── */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30 gap-2 flex-wrap">
        {/* Kiri: icon + label halaman */}
        <div className="flex items-center gap-2 shrink-0">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
            Mushaf
          </span>
        </div>

        {/* Tengah: navigasi surah + juz + halaman */}
        <div className="flex items-center gap-2 flex-1 justify-center flex-wrap">
          {/* Surah Combobox */}
          <SurahJumpCombobox onJump={onPageChange} />

          {/* Juz Select */}
          <JuzJumpSelect onJump={onPageChange} />

          {/* Quick Jump Input */}
          <PageJumpInput
            currentPage={currentPage}
            totalPages={page.total_pages}
            onJump={onPageChange}
          />
        </div>

        {/* Kanan: badge mode seleksi */}
        <Badge
          variant={selectionMode === "start" ? "secondary" : "default"}
          className="text-xs h-5 px-2 shrink-0"
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
        {allLineNumbers.map((lineNum) => {
          const specialLine = specialLines.get(lineNum);

          if (specialLine) {
            if (specialLine.type === "surah_header") {
              return (
                <div key={`header-${lineNum}`} className="w-full flex items-center justify-center py-1.5 px-4 select-none my-1" dir="rtl">
                  <div className="relative w-full max-w-md border border-primary/45 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-1 px-6 text-center shadow-sm border-double">
                    <div className="absolute inset-y-1 left-2 right-2 border-y border-dashed border-primary/20 pointer-events-none" />
                    <span className="font-serif text-sm font-bold text-primary tracking-wide z-10 relative">
                      سُورَةُ {specialLine.surahName}
                    </span>
                  </div>
                </div>
              );
            }

            if (specialLine.type === "bismillah") {
              return (
                <div key={`bismillah-${lineNum}`} className="w-full text-center py-2 font-serif text-lg font-medium text-primary/90 select-none tracking-normal leading-normal">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
              );
            }
          }

          const lineWords = lineGroups.get(lineNum) ?? [];
          if (lineWords.length === 0) {
            return <div key={`empty-${lineNum}`} className="h-8 border-b border-dashed border-border/10 last:border-0" />;
          }

          return (
            <div
              key={lineNum}
              className="flex flex-wrap justify-center items-baseline gap-x-1 gap-y-0.5 py-1 border-b border-dashed border-border/30 last:border-0 min-h-8"
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

                if (isEndChar) {
                  return (
                    <span
                      key={`${word.verse_key}-${word.position}-${idx}`}
                      className="inline-flex items-center justify-center border border-primary/75 rounded-full w-5 h-5 mx-1 text-[9px] font-sans font-bold text-primary bg-primary/5 shadow-sm align-middle select-none"
                      title={`Ayat ${word.ayah_number}`}
                    >
                      {word.ayah_number}
                    </span>
                  );
                }

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
                    title={word.verse_key}
                    className={cn(
                      "inline-block text-xl leading-relaxed transition-all duration-150 cursor-pointer hover:scale-110 px-0.5",
                      isSelected &&
                        "bg-primary/20 text-foreground px-1 -mx-0.5 py-0.5",
                      isSelected && roundedClass,
                      (isStart || isEnd) &&
                        "bg-primary/30 font-semibold",
                      !isSelected && "hover:bg-primary/10 rounded-md",
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

        {/* Navigation buttons + Quick Jump Input */}
        <div className="flex items-center justify-between gap-2">
          {/* Tombol Berikutnya (ke kiri / halaman bertambah) */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= page.total_pages}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Berikutnya</span>
          </Button>

          <span className="text-xs font-mono text-muted-foreground px-2">
            {currentPage} / {page.total_pages}
          </span>

          {/* Tombol Sebelumnya (ke kanan / halaman berkurang) */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <span className="hidden sm:inline">Sebelumnya</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
