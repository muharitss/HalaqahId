import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { type MushafSelection } from "../../../types";
import { DRAFT_STORAGE_KEY, MUSHAF_SELECTION_KEY } from "../constants/form.constants";
import { findJuzBySurahAndAyah } from "../utils/findJuz";

export function useDraftManager(
  form: any,
  setMushafSelection: (s: MushafSelection | null) => void
) {
  const location = useLocation();

  // Restore draft dari sessionStorage
  useEffect(() => {
    const storedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (storedDraft) {
      try {
        const draft = JSON.parse(storedDraft);
        if (draft) {
          Object.entries(draft).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
              form.setValue(key as any, val as any);
            }
          });
          form.trigger();
        }
      } catch (err) {
        console.error("Gagal memulihkan draf form:", err);
      }
    }

    // Restore mushaf selection
    const stored = sessionStorage.getItem(MUSHAF_SELECTION_KEY);
    if (stored) {
      try {
        const { selection, juzNumber } = JSON.parse(stored);
        if (selection) {
          setMushafSelection(selection);
          form.setValue("surat_mulai", selection.startSurahName);
          form.setValue("surat_selesai", selection.endSurahName);
          form.setValue("ayat_mulai", selection.startAyah);
          form.setValue("ayat_selesai", selection.endAyah);
          const calculatedJuz =
            juzNumber ||
            findJuzBySurahAndAyah(
              selection.startSurahName,
              selection.startAyah
            );
          form.setValue("juz", calculatedJuz);
          form.trigger([
            "juz",
            "surat_mulai",
            "surat_selesai",
            "ayat_mulai",
            "ayat_selesai",
          ]);
        }
      } catch (err) {
        console.error("Gagal memulihkan mushaf selection:", err);
      }
    }

    return () => {
      // Clear draft ONLY if we are navigating to a page that is NOT the mushaf page
      const nextPath = window.location.pathname;
      const isGoingToMushaf = nextPath.endsWith("/setoran/mushaf");
      if (!isGoingToMushaf) {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
        sessionStorage.removeItem(MUSHAF_SELECTION_KEY);
      }
    };
  }, [location]);
}