import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { HalaqahForm } from "@/components/forms/HalaqahForm";

interface EditHalaqahProps {
  halaqah: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditHalaqah({ halaqah, isOpen, onClose, onSuccess }: EditHalaqahProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Halaqah</DialogTitle>
          <DialogDescription>
            Edit informasi halaqah #{halaqah?.id_halaqah}
          </DialogDescription>
        </DialogHeader>
        
        {halaqah && (
          <HalaqahForm
            initialData={{
              id_halaqah: halaqah.id_halaqah,
              nama_halaqah: halaqah.nama_halaqah,
              jenis: halaqah.jenis,
              muhafidz_id: halaqah.muhafidz_id
            }}
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}