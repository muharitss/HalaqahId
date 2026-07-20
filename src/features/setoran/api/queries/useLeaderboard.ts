import { useQuery } from "@tanstack/react-query";
import { setoranService, type LeaderboardParams } from "../services/setoranService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useLeaderboard(params: LeaderboardParams) {
  return useQuery({
    queryKey: ["setoran-leaderboard", params],
    queryFn: async () => {
      try {
        const res = await setoranService.getLeaderboard(params);
        return res.data || [];
      } catch (err: unknown) {
        toast.error(
          getErrorMessage(err, "Gagal mengambil data leaderboard")
        );
        throw err;
      }
    },
  });
}
