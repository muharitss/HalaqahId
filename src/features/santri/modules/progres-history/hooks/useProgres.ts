import { useProgresList } from "../../../api";
import { useAuth } from "@/features/auth/components/auth-provider";
import { type ProgresSantri } from "../../../types";

export const useProgres = (scope: string = "target") => {
  const { user } = useAuth();

  const { 
    data: progresData = [], 
    isFetching: loading, 
    error,
    refetch: fetchProgres 
  } = useProgresList(user?.id_user, scope);

  return { 
    progresData: progresData as ProgresSantri[], 
    loading, 
    error: error ? "Gagal mengambil data progres" : null, 
    fetchProgres 
  };
};
