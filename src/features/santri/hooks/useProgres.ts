import { useQuery } from "@tanstack/react-query";
import { progresService } from "../api/progresService";
import { useAuth } from "@/features/auth/components/auth-provider";

export const useProgres = (scope: string = "target") => {
  const { user } = useAuth();

  const { 
    data: progresData = [], 
    isFetching: loading, 
    error,
    refetch: fetchProgres 
  } = useQuery({
    queryKey: ["progres", user?.id_user, scope],
    queryFn: async () => {
      const response = await progresService.getAllProgres(scope);
      return response.data || [];
    },
    enabled: !!user?.id_user,
  });

  return { 
    progresData, 
    loading, 
    error: error ? "Gagal mengambil data progres" : null, 
    fetchProgres 
  };
};
