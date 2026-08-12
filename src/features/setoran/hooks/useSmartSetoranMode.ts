import { useState, useEffect, useRef, useCallback } from "react";
import { setoranService } from "../api/services/setoranService";
import { type SetoranRecord } from "../types";
import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type FormMode = "idle" | "create" | "edit";

export interface SmartSetoranModeState {
  /** Mode saat ini: idle (belum trigger), create (data belum ada), edit (data ditemukan) */
  mode: FormMode;
  /** true saat request GET /setoran/check sedang berjalan */
  isChecking: boolean;
  /** Pesan error saat pengecekan gagal (network/timeout) */
  checkError: string | null;
  /** id_setoran yang ditemukan saat mode = edit */
  recordId: number | null;
  /** Seluruh data setoran yang ditemukan, untuk pre-fill form */
  existingData: SetoranRecord | null;
}

export interface SmartSetoranModeActions {
  /** Panggil saat Santri berubah */
  setSelectedSantriId: (id: number | null) => void;
  /** Panggil saat Tanggal berubah */
  setSelectedTanggal: (tanggal: string | null) => void;
  /** Panggil saat Sesi berubah */
  setSelectedSesiId: (id: number | null) => void;
  /** Reset ke state awal (setelah submit sukses) */
  resetMode: () => void;
  /** Trigger pengecekan ulang secara manual */
  retryCheck: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

const DEBOUNCE_MS = 400;

export function useSmartSetoranMode(): SmartSetoranModeState &
  SmartSetoranModeActions {
  const [selectedSantriId, setSelectedSantriId] = useState<number | null>(null);
  const [selectedTanggal, setSelectedTanggal] = useState<string | null>(null);
  const [selectedSesiId, setSelectedSesiId] = useState<number | null>(null);

  const [mode, setMode] = useState<FormMode>("idle");
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [existingData, setExistingData] = useState<SetoranRecord | null>(null);

  // Untuk mencegah race condition — batalkan request lama saat trigger baru masuk
  const abortControllerRef = useRef<AbortController | null>(null);
  // Debounce timer
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Core check logic ────────────────────────────────────────────────────

  const runCheck = useCallback(
    async (santriId: number, tanggal: string, sesiId: number) => {
      // 1. Batalkan request sebelumnya (race condition prevention)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsChecking(true);
      setCheckError(null);

      try {
        const res = await setoranService.checkSetoran(
          { id_santri: santriId, tanggal, id_sesi: sesiId },
          abortControllerRef.current.signal,
        );

        if (res.data && res.data.exists && res.data.setoran) {
          setMode("edit");
          setRecordId(res.data.setoran.id_setoran);
          setExistingData(res.data.setoran);
        } else {
          setMode("create");
          setRecordId(null);
          setExistingData(null);
        }
      } catch (err: unknown) {
        // AbortError = intentional cancellation, abaikan
        if (axios.isCancel(err)) return;
        if (err instanceof Error && err.name === "AbortError") return;
        if (err instanceof Error && err.name === "CanceledError") return;

        console.error("[useSmartSetoranMode] Check failed:", err);
        setCheckError("Gagal memeriksa riwayat setoran santri untuk sesi ini. Silakan periksa koneksi internet Anda dan coba lagi.");
        setMode("idle");
        setRecordId(null);
        setExistingData(null);
      } finally {
        setIsChecking(false);
      }
    },
    [],
  );

  // ─── Trigger saat salah satu field berubah ───────────────────────────────

  useEffect(() => {
    // Bersihkan debounce timer sebelumnya
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!selectedSantriId || !selectedTanggal || !selectedSesiId) {
      // Belum lengkap — reset ke idle
      setMode("idle");
      setCheckError(null);
      setRecordId(null);
      setExistingData(null);
      // Batalkan request yang sedang berjalan (jika ada)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      return;
    }

    // Debounce: tunggu 400ms setelah user berhenti mengubah
    debounceTimerRef.current = setTimeout(() => {
      runCheck(selectedSantriId, selectedTanggal, selectedSesiId);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [selectedSantriId, selectedTanggal, selectedSesiId, runCheck]);

  // ─── Cleanup saat unmount ────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const resetMode = useCallback(() => {
    setMode("idle");
    setCheckError(null);
    setRecordId(null);
    setExistingData(null);
  }, []);

  const retryCheck = useCallback(() => {
    if (selectedSantriId && selectedTanggal && selectedSesiId) {
      runCheck(selectedSantriId, selectedTanggal, selectedSesiId);
    }
  }, [selectedSantriId, selectedTanggal, selectedSesiId, runCheck]);

  return {
    // State
    mode,
    isChecking,
    checkError,
    recordId,
    existingData,
    // Actions
    setSelectedSantriId,
    setSelectedTanggal,
    setSelectedSesiId,
    resetMode,
    retryCheck,
  };
}
