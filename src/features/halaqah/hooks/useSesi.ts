import { useState, useCallback } from "react";
import { toast } from "sonner";
import { sesiService } from "@/features/halaqah/api/sesiService";
import type { 
  SesiHalaqah, 
  CreateSesiHalaqahRequest, 
  UpdateSesiHalaqahRequest 
} from "@/types/domain/sesi-halaqah";

export function useSesi() {
  const [sesiList, setSesiList] = useState<SesiHalaqah[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSesi = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await sesiService.getSesiHalaqah();
      setSesiList(response.data || []);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengambil sesi halaqah");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSesi = async (payload: CreateSesiHalaqahRequest) => {
    setIsLoading(true);
    try {
      await sesiService.createSesi(payload);
      toast.success("Sesi halaqah berhasil ditambahkan");
      await fetchSesi();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat sesi halaqah");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createMultipleSesi = async (payloads: CreateSesiHalaqahRequest[]) => {
    setIsLoading(true);
    let successCount = 0;
    try {
      const results = await Promise.allSettled(payloads.map(p => sesiService.createSesi(p)));
      successCount = results.filter(r => r.status === "fulfilled").length;
      
      if (successCount === payloads.length) {
        toast.success(`Berhasil menambahkan ${successCount} sesi halaqah`);
        return true;
      } else {
        toast.error(`Berhasil menambahkan ${successCount} sesi, gagal ${payloads.length - successCount} sesi`);
        return successCount > 0;
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat beberapa sesi halaqah");
      return false;
    } finally {
      if (successCount > 0) await fetchSesi();
      else setIsLoading(false);
    }
  };

  const updateSesi = async (id: number, payload: UpdateSesiHalaqahRequest) => {
    setIsLoading(true);
    try {
      await sesiService.updateSesi(id, payload);
      toast.success("Sesi halaqah berhasil diperbarui");
      await fetchSesi();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui sesi halaqah");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSesi = async (id: number) => {
    setIsLoading(true);
    try {
      await sesiService.deleteSesi(id);
      toast.success("Sesi halaqah berhasil dihapus");
      await fetchSesi();
      return true;
    } catch (error: any) {
      // Menangkap error 400 dari backend
      toast.error(error.message || "Gagal menghapus sesi halaqah");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sesiList,
    isLoading,
    fetchSesi,
    createSesi,
    createMultipleSesi,
    updateSesi,
    deleteSesi,
  };
}
