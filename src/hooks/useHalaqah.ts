import { useState, useCallback } from "react";
import { halaqahService, type Halaqah } from "@/services/halaqahService"; 

export const useHalaqah = () => {
  const [halaqah, setHalaqah] = useState<Halaqah[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedHalaqah, setDeletedHalaqah] = useState<Halaqah[]>([]);

  const fetchHalaqah = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await halaqahService.getAllHalaqah(); 
      setHalaqah(response.data);
    
    } catch (err) {
      setError("Gagal mengambil data halaqah");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeletedHalaqah = useCallback(async () => {
    setLoading(true);
    try {
      const response = await halaqahService.getDeletedHalaqah();
      setDeletedHalaqah(response.data);
    } catch (err) {
      console.error("Gagal mengambil tempat sampah halaqah");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    halaqah,
    loading,
    error,
    fetchHalaqah,
    deletedHalaqah,
    fetchDeletedHalaqah
  };
};