/**
 * MushafViewer.tsx
 * Komponen visual Mushaf Al-Quran interaktif.
 *
 * Fitur:
 * - Menampilkan halaman mushaf dari UmmahAPI (per baris, RTL)
 * - Klik ayat untuk memilih start/end setoran (dual-select mode)
 * - Highlight range ayat yang dipilih
 * - Navigasi antar halaman (header atas + tombol bawah)
 * - ✅ Quick Jump Input: klik nomor halaman → ketik langsung → Enter
 * - ✅ Navigasi Surah: combobox 114 surah → lompat langsung
 * - ✅ Navigasi Juz: select Juz 1–30 → lompat ke halaman awal juz
 * - ✅ Format 15 Baris Mushaf: CSS Grid repeat(15,1fr) — selalu 15 baris memenuhi layar
 * - ✅ Penanda Ayat: border lingkaran khas mushaf untuk nomor ayat
 * - ✅ Navigasi RTL: urutan navigasi disesuaikan arah baca Al-Quran (kanan-ke-kiri)
 * - ✅ Prefetch: 5 halaman sebelum & sesudah di-prefetch otomatis
 */

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
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
import { useMushafPage, usePrefetchMushafPages } from "../hooks/useMushafPage";
import {
  surahNumberToName,
  hitungTotalBaris,
  hitungTotalBarisPresisi,
  SURAH_PAGE_START,
  adjustStartLine,
} from "@/utils/mushafUtils";
import type { MushafWord, MushafSelection, SetoranRecord } from "../types";
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
          className="w-14 h-7 text-center text-xs px-1 font-mono"
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
      className="text-xs font-mono text-muted-foreground hover:text-foreground hover:underline cursor-pointer px-1.5 py-1 rounded hover:bg-muted transition-colors"
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
          className="h-7 gap-1 text-xs px-2 font-medium"
          title="Lompat ke Surah"
        >
          <Search className="h-3 w-3 text-primary" />
          <span className="hidden sm:inline">Surah</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0 z-[10000]" align="start" side="bottom">
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
                  value={`${surah.number} ${surah.name}`.toLowerCase()}
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
      <SelectTrigger className="h-7 text-xs w-[78px] gap-1 px-2">
        <BookMarked className="h-3 w-3 text-primary shrink-0" />
        <SelectValue placeholder="Juz" />
      </SelectTrigger>
      <SelectContent className="z-[10000]">
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

/** Cek apakah suatu kata berada dalam range seleksi */
function isWordInRange(
  word: MushafWord,
  selection: MushafSelection | null,
): boolean {
  if (!selection) return false;

  if (!selection.isPartialAyah) {
    const globalId = word.surah_number * 10000 + word.ayah_number;
    const startId = selection.startSurahNumber * 10000 + selection.startAyah;
    const endId = selection.endSurahNumber * 10000 + selection.endAyah;
    return globalId >= startId && globalId <= endId;
  }

  const getWordVal = (sNum: number, aNum: number, pos: number) => {
    return sNum * 10000000 + aNum * 1000 + pos;
  };

  const currentVal = getWordVal(word.surah_number, word.ayah_number, word.position);
  const startVal = getWordVal(
    selection.startSurahNumber,
    selection.startAyah,
    selection.startWordPosition ?? 1
  );
  const endVal = getWordVal(
    selection.endSurahNumber,
    selection.endAyah,
    selection.endWordPosition ?? 1
  );

  return currentVal >= startVal && currentVal <= endVal;
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
  /** Callback tambahan untuk tombol aksi di atas (misal "Terapkan Ayat") */
  headerAction?: React.ReactNode;
  completedRanges?: SetoranRecord[];
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
  headerAction,
  completedRanges = [],
}: MushafViewerProps) {
  const { page, isLoading, isError } = useMushafPage(currentPage);

  const [selectGranularity, setSelectGranularity] = useState<"ayah" | "word">(() => {
    return selection?.isPartialAyah ? "word" : "ayah";
  });

  useEffect(() => {
    if (selection?.isPartialAyah) {
      setSelectGranularity("word");
    }
  }, [selection?.isPartialAyah]);

  // Prefetch 5 halaman sebelum & sesudah untuk navigasi instan
  usePrefetchMushafPages(currentPage);

  const isWordCompleted = useCallback(
    (word: MushafWord): boolean => {
      if (!completedRanges || completedRanges.length === 0) return false;

      const getWordVal = (sNum: number, aNum: number, pos: number) => {
        return sNum * 10000000 + aNum * 1000 + pos;
      };
      const currentWordVal = getWordVal(word.surah_number, word.ayah_number, word.position);

      return completedRanges.some((record) => {
        const startSurat = record.start_surat_id ?? 1;
        const startAyat = record.start_ayat ?? 1;
        const endSurat = record.end_surat_id ?? startSurat;
        const endAyat = record.end_ayat ?? startAyat;

        const customValues = record.custom_values as any;
        const isPartial = customValues?.is_partial_ayah;

        if (!isPartial) {
          const currentAyahVal = word.surah_number * 10000 + word.ayah_number;
          const recordStartAyahVal = startSurat * 10000 + startAyat;
          const recordEndAyahVal = endSurat * 10000 + endAyat;
          return currentAyahVal >= recordStartAyahVal && currentAyahVal <= recordEndAyahVal;
        } else {
          const recordStartWordPos = customValues.start_word_pos ?? 1;
          const recordEndWordPos = customValues.end_word_pos ?? 1;

          const recordStartVal = getWordVal(startSurat, startAyat, recordStartWordPos);
          const recordEndVal = getWordVal(endSurat, endAyat, recordEndWordPos);

          return currentWordVal >= recordStartVal && currentWordVal <= recordEndVal;
        }
      });
    },
    [completedRanges]
  );

  // Gesture swipe untuk navigasi halaman di perangkat handphone (mobile)
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // Reset touch coordinates
    touchStartX.current = null;
    touchStartY.current = null;

    // Menghindari swipe diagonal atau scroll vertikal tidak sengaja
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe ke kanan (Drag dari kiri ke kanan) -> Halaman berikutnya (halaman bertambah)
        if (currentPage < (page?.total_pages ?? 604)) {
          onPageChange(currentPage + 1);
        }
      } else {
        // Swipe ke kiri (Drag dari kanan ke kiri) -> Halaman sebelumnya (halaman berkurang)
        if (currentPage > 1) {
          onPageChange(currentPage - 1);
        }
      }
    }
  };

  const [animationClass, setAnimationClass] = useState("");
  const prevPageRef = useRef(currentPage);

  useEffect(() => {
    if (currentPage !== prevPageRef.current) {
      const direction = currentPage > prevPageRef.current ? "next" : "prev";
      prevPageRef.current = currentPage;

      const anim = direction === "next" ? "animate-mushaf-next" : "animate-mushaf-prev";
      setAnimationClass(anim);

      const timer = setTimeout(() => {
        setAnimationClass("");
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const linesPerPage = 15; // // Selalu 15 baris

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

  const handleAyahClick = (word: MushafWord) => {
    const surahName = surahNumberToName(word.surah_number);

    if (selectionMode === "start") {
      const adjustedLine = adjustStartLine(word.surah_number, word.ayah_number, word.line_number);
      const newSel: MushafSelection = {
        startSurahNumber: word.surah_number,
        startSurahName: surahName,
        startAyah: word.ayah_number,
        startPage: currentPage,
        startLine: word.line_number, // Simpan original line agar swap tidak terganggu
        endSurahNumber: word.surah_number,
        endSurahName: surahName,
        endAyah: word.ayah_number,
        endPage: currentPage,
        endLine: word.line_number,
        totalBaris: hitungTotalBaris(
          currentPage,
          adjustedLine,
          currentPage,
          word.line_number,
          linesPerPage,
        ),
        isPartialAyah: false,
      };
      onSelectionChange(newSel);
      onSelectionModeChange("end");
    } else {
      if (!selection) return;

      const startId = selection.startSurahNumber * 10000 + selection.startAyah;
      const endId = word.surah_number * 10000 + word.ayah_number;

      if (endId < startId) {
        // Swap selection: clicked word is new start, selection.start becomes end
        const adjustedStartLine = adjustStartLine(word.surah_number, word.ayah_number, word.line_number);
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
            adjustedStartLine,
            selection.startPage,
            selection.startLine,
            linesPerPage,
          ),
          isPartialAyah: false,
        });
      } else {
        const adjustedStartLine = adjustStartLine(
          selection.startSurahNumber,
          selection.startAyah,
          selection.startLine,
        );
        onSelectionChange({
          ...selection,
          endSurahNumber: word.surah_number,
          endSurahName: surahName,
          endAyah: word.ayah_number,
          endPage: currentPage,
          endLine: word.line_number,
          totalBaris: hitungTotalBaris(
            selection.startPage,
            adjustedStartLine,
            currentPage,
            word.line_number,
            linesPerPage,
          ),
          isPartialAyah: false,
        });
      }
      onSelectionModeChange("start");
    }
  };

  const handleWordClick = (word: MushafWord) => {
    if (word.char_type_name === "end") {
      handleAyahClick(word);
      return;
    }

    if (selectGranularity === "ayah") {
      handleAyahClick(word);
      return;
    }

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
        totalBaris: 1, // Akan dihitung presisi
        isPartialAyah: true,
        startWordPosition: word.position,
        endWordPosition: word.position,
        startWordText: word.text_uthmani,
        endWordText: word.text_uthmani,
      };
      newSel.totalBaris = hitungTotalBarisPresisi(newSel, page?.words || []);
      onSelectionChange(newSel);
      onSelectionModeChange("end");
    } else {
      if (!selection) return;

      const getWordVal = (sNum: number, aNum: number, pos: number) => {
        return sNum * 10000000 + aNum * 1000 + pos;
      };

      const startWordPos = selection.startWordPosition ?? 1;
      const startVal = getWordVal(selection.startSurahNumber, selection.startAyah, startWordPos);
      const currentVal = getWordVal(word.surah_number, word.ayah_number, word.position);

      if (currentVal < startVal) {
        // Swap selection: clicked word is new start
        const updatedSel: MushafSelection = {
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
          totalBaris: 1,
          isPartialAyah: true,
          startWordPosition: word.position,
          endWordPosition: startWordPos,
          startWordText: word.text_uthmani,
          endWordText: selection.startWordText,
        };
        updatedSel.totalBaris = hitungTotalBarisPresisi(updatedSel, page?.words || []);
        onSelectionChange(updatedSel);
      } else {
        const updatedSel: MushafSelection = {
          ...selection,
          endSurahNumber: word.surah_number,
          endSurahName: surahName,
          endAyah: word.ayah_number,
          endPage: currentPage,
          endLine: word.line_number,
          totalBaris: 1,
          isPartialAyah: true,
          endWordPosition: word.position,
          endWordText: word.text_uthmani,
        };
        updatedSel.totalBaris = hitungTotalBarisPresisi(updatedSel, page?.words || []);
        onSelectionChange(updatedSel);
      }
      onSelectionModeChange("start");
    }
  };

  const handleClearSelection = () => {
    onSelectionChange(null);
    onSelectionModeChange("start");
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background overflow-hidden" style={{ height: "100%" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mushafSlideInNext {
          from {
            opacity: 0.3;
            transform: translateX(-24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes mushafSlideInPrev {
          from {
            opacity: 0.3;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-mushaf-next {
          animation: mushafSlideInNext 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-mushaf-prev {
          animation: mushafSlideInPrev 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
      {/* ── Header: Navigasi + Info + Action ── */}
      <div className="border-b bg-muted/20 shrink-0 w-full">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-1.5 px-3 py-1.5 flex-wrap">
          {/* Kiri: Tombol Berikutnya (RTL: halaman bertambah) */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 gap-1 text-xs shrink-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!page || currentPage >= page.total_pages}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">Berikutnya</span>
          </Button>

          {/* Tengah: navigasi surah + juz + halaman */}
          <div className="flex items-center gap-1 flex-1 justify-center flex-wrap min-w-0">
            {/* Surah Combobox */}
            <SurahJumpCombobox onJump={onPageChange} />

            {/* Juz Select */}
            <JuzJumpSelect onJump={onPageChange} />

            {/* Quick Jump Input */}
            {page && (
              <PageJumpInput
                currentPage={currentPage}
                totalPages={page.total_pages}
                onJump={onPageChange}
              />
            )}
          </div>

          {/* Kanan: badge mode + headerAction (tombol Terapkan Ayat dsb) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs px-2 py-0 border-primary/20 hover:border-primary/40 text-primary hover:bg-primary/5 shrink-0 transition-colors"
              onClick={() => {
                setSelectGranularity((prev) => (prev === "ayah" ? "word" : "ayah"));
                handleClearSelection();
              }}
            >
              {selectGranularity === "ayah" ? "Pilih: Ayat" : "Pilih: Kata"}
            </Button>
            <Badge
              variant={selectionMode === "start" ? "secondary" : "default"}
              className="text-[10px] h-5 px-1.5 shrink-0"
            >
              {selectionMode === "start" ? "Klik Mulai" : "Klik Akhir"}
            </Badge>
            {headerAction}
          </div>
        </div>
      </div>

      {/* ── Loading / Error State ── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 flex-1 text-muted-foreground">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm">Memuat halaman {currentPage}...</p>
        </div>
      )}

      {(isError || (!isLoading && !page)) && (
        <div className="flex flex-col items-center justify-center gap-3 flex-1 text-destructive">
          <AlertCircle className="h-7 w-7" />
          <p className="text-sm font-medium">Gagal memuat halaman mushaf</p>
          <p className="text-xs text-muted-foreground">Periksa koneksi internet Anda</p>
        </div>
      )}

      {/* ── Mushaf Content (RTL) — flex column tanpa scroll agar fix 15 baris ── */}
      {page && !isLoading && (
        <div
          className={cn(
            "flex-1 min-h-0 overflow-hidden select-none px-0.5 max-w-3xl mx-auto w-full",
            animationClass
          )}
          dir="rtl"
          style={{
            fontFamily: "'Scheherazade New', 'Amiri', serif",
            display: "flex",
            flexDirection: "column",
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {Array.from({ length: linesPerPage }, (_, i) => i + 1).map((lineNum) => {
            const specialLine = specialLines.get(lineNum);

            if (specialLine) {
              if (specialLine.type === "surah_header") {
                return (
                <div
                    key={`header-${lineNum}`}
                    className="flex flex-1 items-center justify-center px-2 select-none"
                    dir="rtl"
                  >
                    <div className="relative w-full border border-primary/45 rounded-md bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-0.5 px-4 text-center shadow-sm border-double">
                      <div className="absolute inset-y-0.5 left-1.5 right-1.5 border-y border-dashed border-primary/20 pointer-events-none" />
                      <span className="font-serif text-[clamp(10px,2.8vw,13px)] font-bold text-primary tracking-wide z-10 relative">
                        سُورَةُ {specialLine.surahName}
                      </span>
                    </div>
                  </div>
                );
              }

              if (specialLine.type === "bismillah") {
                return (
                <div
                    key={`bismillah-${lineNum}`}
                    className="flex flex-1 items-center justify-center font-serif text-[clamp(13px,3.8vw,18px)] font-medium text-primary/90 select-none tracking-normal"
                  >
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </div>
                );
              }
            }

            const lineWords = lineGroups.get(lineNum) ?? [];
            if (lineWords.length === 0) {
              return <div key={`empty-${lineNum}`} className="flex-1 border-b border-dashed border-border/10 last:border-0" />;
            }

            return (
              <div
                key={lineNum}
                className="flex flex-1 flex-nowrap justify-center items-center gap-x-0.5 border-b border-dashed border-border/20 last:border-0 overflow-hidden whitespace-nowrap"
              >
                {lineWords.map((word, idx) => {
                  const isSelected = isWordInRange(
                    word,
                    selection,
                  );
                  const isStart =
                    selection !== null &&
                    word.surah_number === selection.startSurahNumber &&
                    word.ayah_number === selection.startAyah &&
                    (!selection.isPartialAyah || word.position === selection.startWordPosition);
                  const isEnd =
                    selection !== null &&
                    word.surah_number === selection.endSurahNumber &&
                    word.ayah_number === selection.endAyah &&
                    (!selection.isPartialAyah || word.position === selection.endWordPosition);
                  const isEndChar = word.char_type_name === "end";

                  if (isEndChar) {
                    const isEndCompleted = completedRanges.some(record => {
                      const startSurat = record.start_surat_id ?? 1;
                      const startAyat = record.start_ayat ?? 1;
                      const endSurat = record.end_surat_id ?? startSurat;
                      const endAyat = record.end_ayat ?? startAyat;
                      const currentAyahVal = word.surah_number * 10000 + word.ayah_number;
                      const recordStartAyahVal = startSurat * 10000 + startAyat;
                      const recordEndAyahVal = endSurat * 10000 + endAyat;
                      return currentAyahVal >= recordStartAyahVal && currentAyahVal <= recordEndAyahVal;
                    });

                    return (
                      <span
                        key={`${word.verse_key}-${word.position}-${idx}`}
                        onClick={() => handleAyahClick(word)}
                        className={cn(
                          "inline-flex items-center justify-center border rounded-full w-[clamp(12px,3.5vw,18px)] h-[clamp(12px,3.5vw,18px)] mx-0.5 text-[clamp(6px,2vw,10px)] font-sans font-bold align-middle select-none shrink-0 cursor-pointer transition-all duration-100",
                          isEndCompleted 
                            ? "border-muted-foreground/30 text-muted-foreground/40 bg-muted/10 opacity-50 hover:bg-muted/20"
                            : "border-primary/75 text-primary bg-primary/5 shadow-sm hover:bg-primary/20 hover:scale-110"
                        )}
                        title={`Klik untuk pilih seluruh Ayat ${word.ayah_number}`}
                      >
                        {word.ayah_number}
                      </span>
                    );
                  }

                  let roundedClass = "rounded-none";
                  if (isStart && isEnd) {
                    roundedClass = "rounded-md";
                  } else if (isStart) {
                    roundedClass = "rounded-r-md";
                  } else if (isEnd) {
                    roundedClass = "rounded-l-md";
                  }

                  const isCompleted = isWordCompleted(word);

                  return (
                    <span
                      key={`${word.verse_key}-${word.position}-${idx}`}
                      onClick={() => handleWordClick(word)}
                      title={word.verse_key}
                      className={cn(
                        "inline-block leading-tight transition-all duration-100 cursor-pointer hover:scale-110",
                        // Fluid font size agar text menyusut otomatis pada lebar layar sempit
                        "text-[clamp(11px,4vw,23px)] sm:text-xl md:text-2xl",
                        isSelected &&
                          "bg-primary/20 text-foreground px-0.5 py-0.5",
                        isSelected && roundedClass,
                        (isStart || isEnd) &&
                          "bg-primary/30 font-semibold",
                        !isSelected && isCompleted && "opacity-45 text-muted-foreground bg-muted/10 rounded-sm hover:opacity-80",
                        !isSelected && !isCompleted && "hover:bg-primary/10 rounded-sm",
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
      )}

      {/* ── Footer: Selection Summary + Navigasi bawah (prev/next) ── */}
      {page && !isLoading && (
        <div className="border-t bg-background shrink-0 w-full">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 px-3 py-1.5">
            {/* Selection summary */}
            {selection ? (
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <div className="text-xs text-muted-foreground leading-tight truncate">
                  <span className="font-medium text-foreground">
                    {selection.startSurahName} {selection.startAyah}
                    {selection.isPartialAyah && ` (K.${selection.startWordPosition})`}
                  </span>
                  {" → "}
                  <span className="font-medium text-foreground">
                    {selection.endSurahName} {selection.endAyah}
                    {selection.isPartialAyah && ` (K.${selection.endWordPosition})`}
                  </span>
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
              <p className="text-xs text-muted-foreground italic flex-1 text-center">
                Klik kata untuk memilih rentang setoran
              </p>
            )}

            {/* Navigasi bawah — compact */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= page.total_pages}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs font-mono text-muted-foreground px-1">
                {currentPage}/{page.total_pages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
