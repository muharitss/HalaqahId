/**
 * MushafSelectorPanel.tsx
 * Panel wrapper untuk MushafViewer.
 *
 * - Desktop (≥ md): tampil sebagai slide-in side panel di sebelah form
 * - Mobile: tampil sebagai Sheet (bottom drawer) dari shadcn/ui
 * - Menyediakan tombol toggle "Buka/Tutup Mushaf"
 */

import { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MushafViewer } from "./MushafViewer";
import { SURAH_PAGE_START } from "@/utils/mushafUtils";
import type { MushafSelection } from "../types";
import { cn } from "@/lib/utils";

interface MushafSelectorPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  selection: MushafSelection | null;
  onSelectionChange: (selection: MushafSelection | null) => void;
  /** Nomor surah yang sedang dipilih di form, untuk navigasi awal halaman */
  initialSurahNumber?: number;
}

/**
 * Sub-komponen internal yang memegang state navigasi halaman.
 * Dipisah agar bisa di-reset via key prop ketika surah berubah.
 */
function MushafViewerWrapper({
  initialPage,
  selection,
  onSelectionChange,
}: {
  initialPage: number;
  selection: MushafSelection | null;
  onSelectionChange: (sel: MushafSelection | null) => void;
}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectionMode, setSelectionMode] = useState<"start" | "end">("start");

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= 604) {
      setCurrentPage(newPage);
    }
  };

  return (
    <MushafViewer
      currentPage={currentPage}
      onPageChange={handlePageChange}
      selection={selection}
      onSelectionChange={onSelectionChange}
      selectionMode={selectionMode}
      onSelectionModeChange={setSelectionMode}
    />
  );
}

export function MushafSelectorPanel({
  isOpen,
  onToggle,
  selection,
  onSelectionChange,
  initialSurahNumber,
}: MushafSelectorPanelProps) {
  const initialPage = initialSurahNumber
    ? (SURAH_PAGE_START[initialSurahNumber] ?? 1)
    : 1;

  // key={initialSurahNumber} memastikan MushafViewerWrapper di-remount
  // setiap kali surah berubah, sehingga halaman reset ke awal surah tersebut.
  const viewerKey = `surah-${initialSurahNumber ?? 0}`;

  const mushafContent = (
    <MushafViewerWrapper
      key={viewerKey}
      initialPage={initialPage}
      selection={selection}
      onSelectionChange={onSelectionChange}
    />
  );

  return (
    <>
      {/* ── Toggle Button ── */}
      <Button
        type="button"
        variant={isOpen ? "default" : "outline"}
        size="sm"
        onClick={onToggle}
        className={cn(
          "gap-2 h-9 text-sm font-medium transition-all duration-200",
          isOpen && "shadow-lg shadow-primary/20",
        )}
      >
        {isOpen ? (
          <>
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Tutup Mushaf</span>
          </>
        ) : (
          <>
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Pilih dari Mushaf</span>
          </>
        )}
      </Button>

      {/* ── Mobile: Sheet (Bottom Drawer) ── */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={onToggle}>
          <SheetContent
            side="bottom"
            className="h-[85dvh] p-0 flex flex-col rounded-t-2xl"
          >
            <SheetHeader className="px-4 py-3 border-b shrink-0">
              <SheetTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                Pilih Ayat dari Mushaf
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">{mushafContent}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ── Desktop: Inline panel (animasi slide-in) ── */}
      <div
        className={cn(
          "hidden md:block overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none",
        )}
        aria-hidden={!isOpen}
      >
        <div className="mt-4 border rounded-xl shadow-lg bg-card overflow-hidden h-[560px] flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/40 shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Mushaf Al-Quran</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Hal. {initialPage} (surah awal)
            </div>
          </div>
          <div className="flex-1 overflow-hidden">{mushafContent}</div>
        </div>
      </div>
    </>
  );
}
