import { type Halaqah } from "@/services/halaqahService";
import { HalaqahForm } from "@/components/forms/HalaqahForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface EditHalaqahProps {
  halaqah: Halaqah | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditHalaqah({ halaqah, isOpen, onClose, onSuccess }: EditHalaqahProps) {
  if (!halaqah) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faEdit} className="text-primary" />
            Edit Data Halaqah
          </DialogTitle>
          <DialogDescription>
            Perbarui informasi untuk halaqah ID #{halaqah.id_halaqah}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-4">
          <HalaqahForm 
            initialData={{
              id_halaqah: halaqah.id_halaqah,
              name_halaqah: halaqah.name_halaqah,
              muhafiz_id: halaqah.muhafiz_id
            }}
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}