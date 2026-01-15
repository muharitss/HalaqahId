import { useState, useCallback } from "react";
import { setoranService, type SetoranPayload } from "@/services/setoranService";
import { toast } from "sonner";

export const useSetoran = () => {
  const [loading, setLoading] = useState(false);
  const [history, _setHistory] = useState<any[]>([]);
  const [santriList, setSantriList] = useState<any[]>([]); // Tambahkan state ini

  // Fungsi untuk mengambil daftar santri (untuk dropdown)
  const fetchSantri = useCallback(async () => {
    try {
      const res = await setoranService.getSantriList();
      // Pastikan backend mengembalikan array di dalam res.data
      setSantriList(res.data || []);
    } catch (err: any) {
      console.error("Gagal mengambil daftar santri:", err);
      toast.error("Gagal memuat daftar santri");
    }
  }, []);

  // Fungsi untuk mengambil riwayat setoran berdasarkan tanggal
    // const fetchHistory = useCallback(async (date: string) => {
    // setLoading(true); // Mulai loading
    // try {
    //     const res = await setoranService.getSetoranByDate(date);
    //     setHistory(res.data || []); // Update state dengan data terbaru
    // } catch (err) {
    //     console.error(err);
    //     setHistory([]); // Kosongkan jika error
    // } finally {
    //     setLoading(false); // Selesai loading
    // }
    // }, []);

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

  return { 
    addSetoran, 
    history, 
    // fetchHistory, 
    santriList, 
    fetchSantri, 
    loading 
  };
};