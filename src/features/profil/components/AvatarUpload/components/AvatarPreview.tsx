import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "../../../utils/format-initials";
import { cn } from "@/lib/utils";

interface AvatarPreviewProps {
  name: string;
  photoUrl?: string | null;
  disabled?: boolean;
  isUploading: boolean;
  isRemoving: boolean;
  onCameraClick: () => void;
}

export function AvatarPreview({
  name,
  photoUrl,
  disabled,
  isUploading,
  isRemoving,
  onCameraClick,
}: AvatarPreviewProps) {
  const initials = getInitials(name);

  return (
    <div className="relative group">
      <Avatar className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-background shadow-xl ring-2 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
        <AvatarImage
          src={photoUrl || undefined}
          alt={name}
          className="object-cover"
        />
        <AvatarFallback className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground font-bold text-2xl sm:text-3xl">
          {initials}
        </AvatarFallback>
      </Avatar>

      <button
        type="button"
        onClick={onCameraClick}
        disabled={disabled || isUploading || isRemoving}
        aria-label="Ubah foto profil"
        className={cn(
          "absolute bottom-0 right-0 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg border-2 border-background",
          "transition-all duration-200 hover:bg-primary/90 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50",
          (disabled || isUploading || isRemoving) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
