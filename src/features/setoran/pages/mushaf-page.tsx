/**
 * mushaf-page.tsx
 * Halaman penuh khusus untuk tampilan Mushaf Al-Quran interaktif.
 *
 * - Diakses dari tombol "Pilih dari Mushaf" di SetoranForm
 * - Layout fullscreen dengan portal ke body — menghindari semua overflow-hidden ancestor
 * - Tombol "Terapkan Ayat" tetap di header atas kanan
 * - Menerima `initialPage` dari query string `?page=X`
 * - Mengembalikan selection ke halaman sebelumnya via sessionStorage
 */

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MushafViewer } from "../components/MushafViewer";
import { SURAH_PAGE_START, surahNameToNumber, adjustStartLine } from "@/utils/mushafUtils";
import { pemetaanJuz } from "@/utils/daftarSurah";
import { setoranService } from "../api/services/setoranService";
import { DRAFT_STORAGE_KEY } from "../modules/form/constants/form.constants";
import type { MushafSelection, SetoranRecord } from "../types";

export function MushafPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Ambil halaman awal dari query param atau dari state
  const initialPageFromQuery = parseInt(searchParams.get("page") ?? "1", 10);
  const initialSurahFromState: number | undefined = location.state?.initialSurahNumber;

  const resolvedInitialPage =
    initialSurahFromState
      ? (SURAH_PAGE_START[initialSurahFromState] ?? initialPageFromQuery)
      : (isNaN(initialPageFromQuery) ? 1 : Math.max(1, Math.min(604, initialPageFromQuery)));

  const [currentPage, setCurrentPage] = useState(resolvedInitialPage);
  const [selectionMode, setSelectionMode] = useState<"start" | "end">("start");
  const [selection, setSelection] = useState<MushafSelection | null>(
    location.state?.currentSelection ?? null
  );
  const [completedRanges, setCompletedRanges] = useState<SetoranRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load history setoran santri untuk kategori terpilih
  useEffect(() => {
    const storedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!storedDraft) return;

    try {
      const draft = JSON.parse(storedDraft);
      const idSantri = draft.id_santri;
      const idKategori = draft.id_kategori;

      if (idSantri && idKategori) {
        setIsLoadingHistory(true);
        setoranService.getSetoranBySantri(idSantri)
          .then((res) => {
            if (res.data) {
              // Filter setoran berdasarkan kategori yang sama
              const filtered = res.data.filter((s) => s.id_kategori === idKategori);
              setCompletedRanges(filtered);

              // Cari setoran paling terakhir berdasarkan tanggal & id
              const sorted = [...filtered].sort((a, b) => {
                const dateA = new Date(a.tanggal_setoran).getTime();
                const dateB = new Date(b.tanggal_setoran).getTime();
                if (dateA !== dateB) return dateB - dateA;
                return b.id_setoran - a.id_setoran;
              });

              const latest = sorted[0];
              // Jika query param page tidak diset secara khusus, lompat ke halaman setoran terakhir
              if (latest && (initialPageFromQuery === 1 && !initialSurahFromState)) {
                const targetPage = latest.end_page ?? latest.start_page ?? (latest.end_surat_id ? SURAH_PAGE_START[latest.end_surat_id] : null);
                if (targetPage) {
                  setCurrentPage(targetPage);
                }
              }
            }
          })
          .catch((err) => {
            console.error("Gagal memuat riwayat setoran santri:", err);
          })
          .finally(() => {
            setIsLoadingHistory(false);
          });
      }
    } catch (e) {
      console.error("Error parsing form draft for history:", e);
    }
  }, [initialPageFromQuery, initialSurahFromState]);

  // Kunci scroll body saat mushaf page aktif
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= 604) {
      setCurrentPage(newPage);
    }
  };

  const handleApply = () => {
    let juzNumber: number | undefined;
    if (selection) {
      for (const [juzNumStr, surahs] of Object.entries(pemetaanJuz)) {
        const match = surahs.find(
          (s) =>
            s.nama.toLowerCase() === selection.startSurahName.toLowerCase() &&
            selection.startAyah >= s.ayatMulai &&
            selection.startAyah <= s.ayatSelesai
        );
        if (match) {
          juzNumber = Number(juzNumStr);
          break;
        }
      }
    }

    if (selection) {
      const surahNum = surahNameToNumber(selection.startSurahName) || 1;
      const adjustedStartLine = adjustStartLine(surahNum, selection.startAyah, selection.startLine);
      const adjustedSelection = {
        ...selection,
        startLine: adjustedStartLine,
      };

      sessionStorage.setItem(
        "mushaf_selection_pending",
        JSON.stringify({ selection: adjustedSelection, juzNumber })
      );
    }
    navigate(-1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const applyButton = (
    <Button
      type="button"
      size="sm"
      onClick={handleApply}
      disabled={!selection}
      className={
        selection
          ? "h-8 gap-1.5 text-xs px-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 animate-in fade-in zoom-in duration-200"
          : "h-8 gap-1.5 text-xs px-3 opacity-40 cursor-not-allowed"
      }
    >
      <CheckCircle2 className="h-3.5 w-3.5" />
      <span>Terapkan</span>
    </Button>
  );

  // Render via portal langsung ke document.body agar lolos dari semua
  // overflow-hidden ancestor (SidebarInset, main, dll)
  const content = (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
        // Gunakan dvh agar tidak tertutup browser bottom bar di mobile
        height: "100dvh",
        maxHeight: "100dvh",
        overflow: "hidden",
      }}
    >
      {/* ── Top Bar: Kembali + Judul + Info Seleksi + Terapkan ── */}
      <div
        style={{ flexShrink: 0 }}
        className="border-b bg-muted/30 w-full"
      >
        <div className="max-w-3xl mx-auto flex items-center gap-2 px-3 py-2">
          {/* Kembali */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 px-2 gap-1 text-xs shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>

          {/* Info seleksi aktif */}
          <div className="flex-1 text-xs text-center text-muted-foreground truncate min-w-0">
            {isLoadingHistory ? (
              <span className="inline-flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-primary/70 italic">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                Memuat riwayat setoran...
              </span>
            ) : selection ? (
              <span className="font-semibold text-primary text-[11px] sm:text-xs">
                {selection.startSurahName} {selection.startAyah} → {selection.endSurahName} {selection.endAyah}
                <span className="ml-1 text-muted-foreground font-normal">
                  ({selection.totalBaris} baris)
                </span>
              </span>
            ) : (
              <span className="italic text-[10px] sm:text-[11px]">
                Klik kata untuk pilih ayat awal, klik lagi untuk ayat akhir
              </span>
            )}
          </div>

          {/* Tombol Terapkan */}
          <div className="shrink-0">{applyButton}</div>
        </div>
      </div>

      {/* ── Mushaf Viewer — sisa tinggi, dengan scroll internal ── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <MushafViewer
          currentPage={currentPage}
          onPageChange={handlePageChange}
          selection={selection}
          onSelectionChange={setSelection}
          selectionMode={selectionMode}
          onSelectionModeChange={setSelectionMode}
          completedRanges={completedRanges}
        />
      </div>
    </div>
  );

  // Portal ke body untuk escape semua overflow-hidden ancestor
  return createPortal(content, document.body);
}
