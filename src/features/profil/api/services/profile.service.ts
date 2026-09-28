import axiosClient from "@/lib/axiosClient";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getErrorMessage } from "@/utils/error";
import type { GlobalResponse } from "@/types/api/global-response";
import type {
  UserProfileData,
  UpdateProfilePayload,
  GantiPasswordFormValues,
  AvatarUploadResponse,
} from "../../types";

export const profileService = {
  /**
   * Mengambil data profil user yang sedang login sesuai API backend (/api/profil).
   */
  getProfile: async (): Promise<UserProfileData> => {
    try {
      // 1. Panggil endpoint resmi backend /api/profil
      let res;
      try {
        res = await axiosClient.get("/profil");
      } catch {
        // Fallback jika backend versi lama
        res = await axiosClient.get("/halaqah/auth/me");
      }

      const raw = res.data?.data || res.data;
      const profile = raw?.profile || {};
      const user = raw?.user || raw;

      return {
        id_user: user.id_user ?? raw.id_user,
        nama_lengkap: profile.nama_lengkap || user.name || raw.name || "",
        name: user.name || profile.nama_lengkap || raw.name || "",
        email: user.email || raw.email || "",
        role: user.role || raw.role,
        foto: profile.foto_url || user.foto || raw.foto || null,
        foto_url: profile.foto_url || user.foto_url || raw.foto_url || null,
        avatarUrl: profile.foto_url || user.avatarUrl || raw.avatarUrl || null,
        bio: profile.bio ?? user.bio ?? null,
        nomor_telepon: profile.no_telepon ?? user.nomor_telepon ?? raw.nomor_telepon ?? null,
        spesialisasi: profile.spesialisasi ?? user.spesialisasi ?? null,
        no_ijazah: profile.no_ijazah ?? user.no_ijazah ?? null,
        id_sekolah: user.id_sekolah ?? raw.id_sekolah ?? null,
        id_tenant: user.id_tenant ?? raw.id_tenant ?? null,
        is_verified: user.is_verified ?? raw.is_verified,
        has_halaqah: user.has_halaqah ?? raw.has_halaqah,
        id_halaqah: user.id_halaqah ?? raw.id_halaqah,
        halaqah: user.halaqah || raw.halaqah || null,
      };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memuat profil"));
    }
  },

  /**
   * Memperbarui profil user sesuai API backend (PUT /api/profil).
   */
  updateProfile: async (
    payload: UpdateProfilePayload
  ): Promise<UserProfileData> => {
    try {
      const body = {
        nama_lengkap: payload.nama_lengkap || payload.name,
        no_telepon: payload.no_telepon ?? payload.nomor_telepon ?? null,
        bio: payload.bio ?? null,
        spesialisasi: payload.spesialisasi ?? null,
        no_ijazah: payload.no_ijazah ?? null,
        foto_url: payload.foto_url ?? payload.foto ?? null,
      };

      let res;
      try {
        res = await axiosClient.put("/profil", body);
      } catch {
        // Fallback jika backend versi lama
        res = await axiosClient.patch("/halaqah/auth/me", {
          ...body,
          name: body.nama_lengkap,
          nomor_telepon: body.no_telepon,
        });
      }

      const raw = res.data?.data || res.data;
      const profile = raw?.profile || raw;

      return {
        id_user: raw.id_user || profile.id_user,
        nama_lengkap: profile.nama_lengkap || payload.nama_lengkap || payload.name || "",
        name: profile.nama_lengkap || payload.name || payload.nama_lengkap || "",
        email: raw.email || "",
        role: raw.role,
        foto: profile.foto_url || payload.foto || null,
        foto_url: profile.foto_url || payload.foto_url || payload.foto || null,
        avatarUrl: profile.foto_url || payload.foto_url || null,
        bio: profile.bio ?? payload.bio ?? null,
        nomor_telepon: profile.no_telepon ?? payload.no_telepon ?? payload.nomor_telepon ?? null,
        spesialisasi: profile.spesialisasi ?? payload.spesialisasi ?? null,
        no_ijazah: profile.no_ijazah ?? payload.no_ijazah ?? null,
        id_sekolah: raw.id_sekolah,
        id_tenant: raw.id_tenant,
        is_verified: raw.is_verified,
        has_halaqah: raw.has_halaqah,
        id_halaqah: raw.id_halaqah,
        halaqah: raw.halaqah,
      };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui profil"));
    }
  },

  /**
   * Upload foto profil dan simpan URL ke backend (PUT /api/profil/foto).
   */
  uploadFoto: async (file: File): Promise<AvatarUploadResponse> => {
    try {
      let finalUrl = "";

      // 1. Upload via Cloudinary jika konfigurasi tersedia
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (cloudName && uploadPreset) {
        const result = await uploadToCloudinary(file, "halaqah/avatars");
        finalUrl = result.secure_url;
      } else {
        // Fallback: upload multipart ke backend
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("foto", file);

        const response = await axiosClient.post("/halaqah/auth/me/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        finalUrl =
          response.data?.data?.url ||
          response.data?.data?.foto_url ||
          response.data?.url;
      }

      if (!finalUrl) {
        throw new Error("Gagal mendapatkan URL foto setelah upload.");
      }

      // 2. Simpan URL foto ke profil via endpoint PUT /api/profil/foto
      try {
        await axiosClient.put("/profil/foto", { foto_url: finalUrl });
      } catch {
        // Fallback jika endpoint belum tersedia
      }

      return {
        url: finalUrl,
        secure_url: finalUrl,
      };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengunggah foto profil"));
    }
  },

  /**
   * Ganti password user yang sedang login via backend /halaqah/auth/me/password.
   */
  gantiPassword: async (
    data: Omit<GantiPasswordFormValues, "konfirmasi_password">
  ): Promise<GlobalResponse<null>> => {
    try {
      const response = await axiosClient.patch(
        "/halaqah/auth/me/password",
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengganti password"));
    }
  },
};
