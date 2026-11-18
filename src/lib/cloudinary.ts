import axiosClient from "@/lib/axiosClient";

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadToCloudinary(
  file: File,
  folder?: string
): Promise<CloudinaryUploadResult> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Tipe file harus berupa JPEG, PNG, atau WebP.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Ukuran file maksimal 2 MB.");
  }

  // Request authenticated signed upload parameters from backend (WS-0F)
  const sigRes = await axiosClient.post("/media/cloudinary-signature", {
    folder: folder || "general",
    file_type: file.type,
    file_size: file.size,
  });

  const sigData = sigRes.data?.data || sigRes.data;
  if (!sigData?.signature || !sigData?.upload_url) {
    throw new Error("Gagal mendapatkan tanda tangan upload dari server.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sigData.api_key);
  formData.append("timestamp", String(sigData.timestamp));
  formData.append("signature", sigData.signature);
  formData.append("folder", sigData.folder);
  if (sigData.transformation) {
    formData.append("transformation", sigData.transformation);
  }

  const response = await fetch(sigData.upload_url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error?.message ?? `Upload gagal: ${response.statusText}`
    );
  }

  return response.json() as Promise<CloudinaryUploadResult>;
}
