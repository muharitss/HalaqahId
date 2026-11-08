import { User, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditProfilHeaderProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
}

export function EditProfilHeader({
  isEditing,
  isSubmitting,
  onStartEdit,
  onCancel,
}: EditProfilHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Informasi Profil</h3>
      </div>
      {!isEditing ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onStartEdit}
          className="gap-1.5 text-xs h-8"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit Profil
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
          className="gap-1.5 text-xs h-8 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Batal
        </Button>
      )}
    </div>
  );
}
