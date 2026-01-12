import { useState, useCallback } from "react";
import { halaqahService, type HalaqahData } from "@/services/halaqahService";

export const useHalaqah = () => {
  const [halaqah, setHalaqah] = useState<HalaqahData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHalaqah = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await halaqahService.getAll();
      setHalaqah(response.data);
      
      // Mock data untuk sementara
      await new Promise(resolve => setTimeout(resolve, 500));
      setHalaqah([]); // nanti ganti dengan data real
    } catch (err) {
      setError("Gagal mengambil data halaqah");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    halaqah,
    loading,
    error,
    fetchHalaqah
  };
};