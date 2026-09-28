import { useState, useRef } from "react";
import { toast } from "sonner";
import { validateAvatarFile } from "../../../utils/validate-image";
import { exportCroppedCanvasToFile } from "../../../utils/image-export";

interface UseAvatarUploadFlowOptions {
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
}

export function useAvatarUploadFlow({
  onUpload,
  onRemove,
}: UseAvatarUploadFlowOptions) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCropOpen, setIsCropOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("avatar.jpg");
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      toast.error(validation.error || "File tidak valid");
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result as string);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCrop = async (
    img: HTMLImageElement | null,
    zoom: number,
    rotation: number,
    offset: { x: number; y: number }
  ) => {
    if (!img) return;

    setIsUploading(true);
    try {
      const croppedFile = await exportCroppedCanvasToFile({
        img,
        zoom,
        rotation,
        offset,
        fileName: selectedFileName,
      });

      await onUpload(croppedFile);
      setIsCropOpen(false);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Gagal memproses gambar";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!onRemove) return;
    setIsRemoving(true);
    try {
      await onRemove();
    } finally {
      setIsRemoving(false);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    isCropOpen,
    setIsCropOpen,
    selectedImageSrc,
    isUploading,
    isRemoving,
    handleFileChange,
    handleApplyCrop,
    handleRemovePhoto,
    openFilePicker,
  };
}
