import { useState, useCallback } from "react";
import { santriService } from "../services/santriService";
import { type Santri, type CreateSantriData, type UpdateSantriData } from "../types";
import { getErrorMessage } from "@/utils/error";
import { useParams } from "react-router-dom";

export const useSantri = () => {
  const { halaqahId } = useParams();
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load semua santri
  const loadSantri = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data: Santri[] = []; // Inisialisasi sebagai array kosong
      
      if (halaqahId) {
        data = await santriService.getByHalaqahId(Number(halaqahId));
      } else {
        data = await santriService.getAll();
      }
      
      // Pastikan data yang di-set adalah array
      setSantriList(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setSantriList([]); // Jika error, set ke array kosong
      setError(getErrorMessage(err, "Gagal memuat data santri"));
    } finally {
      setIsLoading(false);
    }
  }, [halaqahId]);

  // Tambah santri baru
  const createSantri = useCallback(async (data: CreateSantriData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSantri = await santriService.create(data);
      setSantriList(prev => [...prev, newSantri]);
      return newSantri;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal menambah santri"));
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
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal memperbarui data santri"));
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
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal menghapus santri"));
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
    isLoading,
    error,
    
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