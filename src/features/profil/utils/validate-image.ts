export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

/**
 * Validasi tipe dan ukuran file gambar untuk avatar.
 */
export function validateAvatarFile(file: File): ImageValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Hanya format gambar JPG, PNG, atau WebP yang diperbolehkan.",
    };
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return {
      valid: false,
      error: "Ukuran file terlalu besar. Maksimal 5 MB.",
    };
  }

  return { valid: true };
}
