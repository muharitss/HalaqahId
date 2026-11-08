import { cn } from "@/lib/utils";
import { AvatarPreview } from "./components/AvatarPreview";
import { AvatarActions } from "./components/AvatarActions";
import { AvatarCropDialog } from "./components/AvatarCropDialog";
import { useAvatarUploadFlow } from "./hooks/use-avatar-upload-flow";
import type { AvatarUploadProps } from "./types";

export function AvatarUpload({
  currentPhotoUrl,
  name,
  onUpload,
  onRemove,
  disabled = false,
  className,
}: AvatarUploadProps) {
  const {
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
  } = useAvatarUploadFlow({ onUpload, onRemove });

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading || isRemoving}
      />

      {/* 1. Avatar Preview */}
      <AvatarPreview
        name={name}
        photoUrl={currentPhotoUrl}
        disabled={disabled}
        isUploading={isUploading}
        isRemoving={isRemoving}
        onCameraClick={openFilePicker}
      />

      {/* 2. Action Buttons */}
      <AvatarActions
        hasPhoto={Boolean(currentPhotoUrl)}
        disabled={disabled}
        isUploading={isUploading}
        isRemoving={isRemoving}
        onUploadClick={openFilePicker}
        onRemoveClick={onRemove ? handleRemovePhoto : undefined}
      />

      {/* 3. Crop & Resize Dialog */}
      <AvatarCropDialog
        isOpen={isCropOpen}
        onOpenChange={setIsCropOpen}
        imageSrc={selectedImageSrc}
        isUploading={isUploading}
        onApplyCrop={handleApplyCrop}
      />
    </div>
  );
}

export default AvatarUpload;
