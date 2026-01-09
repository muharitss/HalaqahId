import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HalaqahForm } from "@/components/forms/HalaqahForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPlus } from "@fortawesome/free-solid-svg-icons";

interface BuatHalaqahProps {
  onSuccess: () => void;
}

export function BuatHalaqah({ onSuccess }: BuatHalaqahProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-dark text-white">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah Halaqah
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faBook} />
            Buat Halaqah Baru
          </DialogTitle>
        </DialogHeader>
        <HalaqahForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}