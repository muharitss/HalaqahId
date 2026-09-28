import axiosClient from "@/lib/axiosClient";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getErrorMessage } from "@/utils/error";
import type { GlobalResponse } from "@/types/api/global-response";
import type {
  UserProfileData,
  UpdateProfilePayload,
  GantiPasswordFormValues,
  AvatarUploadResponse,
} from "../types";

export const profileApi = {
  /**
   * Mengambil data profil user yang sedang login.
   */
  getProfile: async (): Promise<UserProfileData> => {
    try {
      const response = await axiosClient.get("/halaqah/auth/me");
      const data = response.data?.data?.user || response.data?.data || response.data;
      
      return {
        id_user: data.id_user,
        nama_lengkap: data.nama_lengkap || data.name || "",
        name: data.name || data.nama_lengkap || "",
        email: data.email || "",
        role: data.role,
        foto: data.foto || data.foto_url || data.avatarUrl || null,
        foto_url: data.foto_url || data.foto || data.avatarUrl || null,
        avatarUrl: data.avatarUrl || data.foto_url || data.foto || null,
        bio: data.bio || null,
        nomor_telepon: data.nomor_telepon || null,
        spesialisasi: data.spesialisasi || null,
        no_ijazah: data.no_ijazah || null,
        id_sekolah: data.id_sekolah || null,
        id_tenant: data.id_tenant || null,
        is_verified: data.is_verified,
        has_halaqah: data.has_halaqah,
        id_halaqah: data.id_halaqah,
        halaqah: data.halaqah || null,
      };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memuat profil"));
    }
  },

  /**
   * Memperbarui profil user (nama_lengkap, bio, nomor_telepon, spesialisasi, no_ijazah, foto).
   */
  updateProfile: async (
    payload: UpdateProfilePayload
  ): Promise<UserProfileData> => {
    try {
      const response = await axiosClient.patch("/halaqah/auth/me", {
        name: payload.name || payload.nama_lengkap,
        nama_lengkap: payload.nama_lengkap || payload.name,
        nomor_telepon: payload.nomor_telepon,
        bio: payload.bio,
        spesialisasi: payload.spesialisasi,
        no_ijazah: payload.no_ijazah,
        foto: payload.foto,
        foto_url: payload.foto_url || payload.foto,
      });

      const data = response.data?.data?.user || response.data?.data || response.data;
      return {
        id_user: data.id_user,
        nama_lengkap: data.nama_lengkap || data.name || payload.nama_lengkap || payload.name || "",
        name: data.name || data.nama_lengkap || payload.name || payload.nama_lengkap || "",
        email: data.email,
        role: data.role,
        foto: data.foto || data.foto_url || payload.foto || null,
        foto_url: data.foto_url || data.foto || payload.foto_url || payload.foto || null,
        bio: data.bio ?? payload.bio ?? null,
        nomor_telepon: data.nomor_telepon ?? payload.nomor_telepon ?? null,
        spesialisasi: data.spesialisasi ?? payload.spesialisasi ?? null,
        no_ijazah: data.no_ijazah ?? payload.no_ijazah ?? null,
        id_sekolah: data.id_sekolah,
        id_tenant: data.id_tenant,
        is_verified: data.is_verified,
        has_halaqah: data.has_halaqah,
        id_halaqah: data.id_halaqah,
        halaqah: data.halaqah,
      };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui profil"));
    }
  },

  /**
   * Upload foto profil (mendukung Cloudinary & Multipart backend fallback).
   */
  uploadFoto: async (file: File): Promise<AvatarUploadResponse> => {
    try {
      // 1. Coba upload via Cloudinary jika konfigurasi tersedia
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (cloudName && uploadPreset) {
        const result = await uploadToCloudinary(file, "halaqah/avatars");
        return {
          url: result.secure_url,
          secure_url: result.secure_url,
          public_id: result.public_id,
        };
      }

      // 2. Fallback: Upload langsung ke backend halaqah multipart
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("foto", file);

      const response = await axiosClient.post("/halaqah/auth/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const responseUrl =
        response.data?.data?.url ||
        response.data?.data?.foto_url ||
        response.data?.data?.foto ||
        response.data?.url;

      if (!responseUrl) {
        throw new Error("Respon upload foto tidak mengembalikan URL yang valid.");
      }

      return {
        url: responseUrl,
        secure_url: responseUrl,
      };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengunggah foto profil"));
    }
  },

  /**
   * Ganti password user yang sedang login.
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
