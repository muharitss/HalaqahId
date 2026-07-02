import { useQuery } from "@tanstack/react-query";
import { progresService } from "../api/progresService";

export const useProgres = () => {
  const { 
    data: progresData = [], 
    isFetching: loading, 
    error,
    refetch: fetchProgres 
  } = useQuery({
    queryKey: ["progres"],
    queryFn: async () => {
      const response = await progresService.getAllProgres();
      return response.data || [];
    }
  });

  return { 
    progresData, 
    loading, 
    error: error ? "Gagal mengambil data progres" : null, 
    fetchProgres 
  };
};
