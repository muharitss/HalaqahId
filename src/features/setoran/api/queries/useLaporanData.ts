import { useQuery } from "@tanstack/react-query";
import { laporanService } from "../laporanService";
import { sekolahService } from "@/features/sekolah";
import { useAuth } from "@/features/auth/components/auth-provider";

export function useLaporanDataQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["laporan-data", user?.id_user],
    queryFn: async () => {
      try {
        const [setoranData, halaqahData, santriData, kategoriRes] = await Promise.all([
          laporanService.getAllSetoran(),
          laporanService.getAllHalaqah(),
          laporanService.getAllSantri(),
          sekolahService.getKategori(),
        ]);
        return {
          allSetoran: setoranData,
          listHalaqah: halaqahData,
          masterSantri: santriData,
          kategoriList: kategoriRes.data || [],
        };
      } catch (error) {
        console.error("Gagal mengambil data laporan:", error);
        throw error;
      }
    },
  });
}
