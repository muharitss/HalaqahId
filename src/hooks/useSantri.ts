import { useState, useCallback } from "react";
import { santriService, type Santri, type CreateSantriData, type UpdateSantriData, type SantriStats } from "@/services/santriService";

export const useSantri = () => {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [selectedSantri, _setSelectedSantri] = useState<Santri | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, _setStats] = useState<SantriStats | null>(null);

  // Load semua santri
  const loadSantri = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await santriService.getAll();
      setSantriList(data);
      return data;
    } catch (err: any) {
      if (err.message.includes("belum memiliki halaqah")) {
        setSantriList([]); 
      }
      setError(err.message);
      return []; 
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tambah santri baru
  const createSantri = useCallback(async (data: CreateSantriData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSantri = await santriService.create(data);
      setSantriList(prev => [...prev, newSantri]);
      return newSantri;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update santri
  const updateSantri = useCallback(async (id: number, data: UpdateSantriData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSantri = await santriService.update(id, data);
      setSantriList(prev => prev.map(s => 
        s.id_santri === id ? updatedSantri : s
      ));
      return updatedSantri;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSantri = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      await santriService.delete(id);
      setSantriList(prev => prev.filter(s => s.id_santri !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    santriList,
    selectedSantri,
    isLoading,
    error,
    stats,
    
    // Actions
    loadSantri,
    createSantri,
    updateSantri,
    deleteSantri,
    resetError,
    
    // Helper getters
    getSantriById: useCallback((id: number) => 
      santriList.find(s => s.id_santri === id), 
      [santriList]
    ),
  };
};