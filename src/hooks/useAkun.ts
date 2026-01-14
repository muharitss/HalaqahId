import { useState, useCallback } from "react";
import { akunService, type Muhafiz } from "@/services/akunService";

export const useAkun = () => {
  const [muhafiz, setMuhafiz] = useState<Muhafiz[]>([]);
  const [deletedMuhafiz, setDeletedMuhafiz] = useState<Muhafiz[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMuhafiz = useCallback(async () => {
    setLoading(true);
    try {
      const response = await akunService.getAllMuhafiz();
      setMuhafiz(response.data);
    } catch (err) {
      console.error("Gagal mengambil data muhafiz", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeletedMuhafiz = useCallback(async () => {
    setLoading(true);
    try {
      const response = await akunService.getDeletedMuhafiz();
      setDeletedMuhafiz(response.data);
    } catch (err) {
      console.error("Gagal mengambil tempat sampah muhafiz", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    muhafiz,
    deletedMuhafiz,
    loading,
    fetchMuhafiz,
    fetchDeletedMuhafiz,
  };
};