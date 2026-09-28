import { useQuery } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import { PROFILE_QUERY_KEYS } from "../query-keys";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserProfileData } from "../../types";

export function useUserProfileQuery() {
  const authUser = useAuthStore((s) => s.user);

  return useQuery<UserProfileData>({
    queryKey: PROFILE_QUERY_KEYS.current(),
    queryFn: async () => {
      const data = await profileService.getProfile();
      return data;
    },
    initialData: authUser
      ? {
          id_user: authUser.id_user,
          nama_lengkap: authUser.name || "",
          name: authUser.name || "",
          email: authUser.email || "",
          role: authUser.role,
          foto: authUser.foto || authUser.foto_url || authUser.avatarUrl || null,
          foto_url: authUser.foto_url || authUser.foto || authUser.avatarUrl || null,
          avatarUrl: authUser.avatarUrl || authUser.foto_url || authUser.foto || null,
          bio: authUser.bio || null,
          nomor_telepon: authUser.nomor_telepon || null,
          spesialisasi: authUser.spesialisasi || null,
          no_ijazah: authUser.no_ijazah || null,
          id_sekolah: authUser.id_sekolah || null,
          id_tenant: authUser.id_tenant || null,
          is_verified: authUser.is_verified,
          has_halaqah: authUser.has_halaqah,
          id_halaqah: authUser.id_halaqah,
          halaqah: authUser.halaqah,
        }
      : undefined,
    staleTime: 1000 * 60 * 5, // 5 menit
  });
}
