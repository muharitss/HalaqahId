import { useState, useCallback } from "react";
import { setoranService, type SetoranPayload, type SetoranResponse } from "@/services/setoranService";
import { toast } from "sonner";

export const useSetoran = () => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<SetoranResponse[]>([]); // UPDATE: Gunakan setHistory
  const [santriList, setSantriList] = useState<any[]>([]);
  const [allSetoran, setAllSetoran] = useState<any[]>([]);

  // Fungsi untuk mengambil daftar santri (untuk dropdown)
  const fetchSantri = useCallback(async () => {
    try {
      const res = await setoranService.getSantriList();
      setSantriList(res.data || []);
    } catch (err: any) {
      console.error("Gagal mengambil daftar santri:", err);
      toast.error("Gagal memuat daftar santri");
    }
  }, []);

  // FUNGSI BARU: Mengambil riwayat per santri
  const fetchSetoranBySantri = useCallback(async (santriId: number) => {
    setLoading(true);
    try {
      const res = await setoranService.getSetoranBySantri(santriId);
      setHistory(res.data || []);
    } catch (err: any) {
      console.error("Gagal mengambil riwayat santri:", err);
      toast.error("Gagal memuat riwayat setoran santri");
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
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 403) toast.error("Akses ditolak: Santri bukan anggota halaqah Anda!");
      else if (status === 400) toast.error("Data tidak valid: " + message);
      else if (status === 404) toast.error("Santri tidak ditemukan");
      else toast.error("Terjadi kesalahan pada server");

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
    } catch (err) {
      toast.error("Gagal mengambil semua data setoran");
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