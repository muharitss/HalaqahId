import { useState, useCallback } from "react";
import { progresService } from "../services/progresService";
import { type ProgresSantri } from "../types";

export const useProgres = () => {
  const [progresData, setProgresData] = useState<ProgresSantri[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await progresService.getAllProgres();
      setProgresData(response.data);
    } catch (err) {
      setError("Gagal mengambil data progres");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { progresData, loading, error, fetchProgres };
};