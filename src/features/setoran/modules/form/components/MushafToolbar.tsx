import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layers, BookOpen } from "lucide-react";
import { type MushafSelection } from "../../../types";
import { surahNameToNumber, SURAH_PAGE_START } from "@/utils/mushafUtils";
import { DRAFT_STORAGE_KEY } from "../constants/form.constants";

interface MushafToolbarProps {
  form: any;
  mushafSelection: MushafSelection | null;
  setMushafSelection: (s: MushafSelection | null) => void;
}

export function MushafToolbar({
  form,
  mushafSelection,
  setMushafSelection,
}: MushafToolbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenMushaf = () => {
    const currentValues = form.getValues();
    sessionStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify(currentValues)
    );
    const currentSurat = form.getValues("surat_mulai");
    const surahNum = currentSurat
      ? surahNameToNumber(currentSurat)
      : undefined;
    const initialPage = surahNum ? (SURAH_PAGE_START[surahNum] ?? 1) : 1;
    const basePath = location.pathname.startsWith("/kepala-muhafidz")
      ? "/kepala-muhafidz"
      : "/muhafidz";
    navigate(`${basePath}/setoran/mushaf?page=${initialPage}`, {
      state: {
        initialSurahNumber: surahNum,
        currentSelection: mushafSelection,
      },
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-muted/30 border border-muted/50 rounded-2xl">
      <div className="flex-1 min-w-0">
        {mushafSelection ? (
          <div className="flex items-center gap-1.5 text-xs text-primary">
            <Layers className="h-3.5 w-3.5 shrink-0" />
            <span className="font-semibold">
              {mushafSelection.startSurahName} {mushafSelection.startAyah} →{" "}
              {mushafSelection.endSurahName} {mushafSelection.endAyah}
            </span>
            <span className="text-muted-foreground">
              ({mushafSelection.totalBaris} baris)
            </span>
            <button
              type="button"
              onClick={() => setMushafSelection(null)}
              className="ml-1 text-destructive/70 hover:text-destructive underline text-xs"
            >
              Hapus
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Pilih ayat langsung dari tampilan Mushaf Al-Quran interaktif
          </p>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleOpenMushaf}
        className="gap-2 h-9 text-sm font-medium shrink-0"
      >
        <BookOpen className="h-4 w-4" />
        <span>Pilih dari Mushaf</span>
      </Button>
    </div>
  );
}