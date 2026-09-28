import { Upload, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvatarActionsProps {
  hasPhoto: boolean;
  disabled?: boolean;
  isUploading: boolean;
  isRemoving: boolean;
  onUploadClick: () => void;
  onRemoveClick?: () => void;
}

export function AvatarActions({
  hasPhoto,
  disabled,
  isUploading,
  isRemoving,
  onUploadClick,
  onRemoveClick,
}: AvatarActionsProps) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onUploadClick}
        disabled={disabled || isUploading || isRemoving}
        className="h-8 text-xs gap-1.5 rounded-full px-3.5 shadow-sm"
      >
        <Upload className="h-3.5 w-3.5 text-primary" />
        Unggah Foto
      </Button>

      {hasPhoto && onRemoveClick && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemoveClick}
          disabled={disabled || isUploading || isRemoving}
          className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full px-2.5"
          title="Hapus foto"
        >
          {isRemoving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      )}
    </div>
  );
}
