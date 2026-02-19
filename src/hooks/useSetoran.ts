import { useState, useCallback } from "react";
import { setoranService, type SetoranPayload, type SetoranRecord } from "@/services/setoranService";
import { type Santri } from "@/services/santriService";
import { getErrorMessage } from "@/utils/error";
import { toast } from "sonner";

export const useSetoran = () => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<SetoranRecord[]>([]);
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [allSetoran, setAllSetoran] = useState<SetoranRecord[]>([]);

  // Fungsi untuk mengambil daftar santri (untuk dropdown)
  const fetchSantri = useCallback(async () => {
    try {
      const res = await setoranService.getSantriList();
      setSantriList(res.data || []);
    } catch (err: unknown) {
      console.error("Gagal mengambil daftar santri:", err);
      toast.error(getErrorMessage(err, "Gagal memuat daftar santri"));
    }
  }, []);

  // FUNGSI BARU: Mengambil riwayat per santri
  const fetchSetoranBySantri = useCallback(async (santriId: number) => {
    setLoading(true);
    try {
      const res = await setoranService.getSetoranBySantri(santriId);
      setHistory(res.data || []);
    } catch (err: unknown) {
      console.error("Gagal mengambil riwayat santri:", err);
      toast.error(getErrorMessage(err, "Gagal memuat riwayat setoran santri"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi untuk menambah setoran baru
  const addSetoran = async (values: SetoranPayload) => {
    setLoading(true);
    try {
      const response = await setoranService.createSetoran(values);
      toast.success(response.message || "Setoran berhasil dicatat");
      return { success: true };
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Gagal mencatat setoran"));
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSetoran = useCallback(async () => {
    setLoading(true);
    try {
      const res = await setoranService.getAllSetoran();
      setAllSetoran(res.data || []);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal mengambil semua data setoran"));
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    addSetoran, 
    history, 
    santriList, 
    fetchSantri, 
    loading,
    allSetoran,
    fetchAllSetoran,
    fetchSetoranBySantri 
  };
};
