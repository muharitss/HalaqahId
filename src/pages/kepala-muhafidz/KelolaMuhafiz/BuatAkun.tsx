import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AkunForm } from "@/components/forms/AkunForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faPlus } from "@fortawesome/free-solid-svg-icons";

interface BuatAkunProps {
  onSuccess: () => void;
}

export function BuatAkun({ onSuccess }: BuatAkunProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-dark text-white">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah Muhafidz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUserTie} />
            Buat Akun Muhafidz Baru
          </DialogTitle>
        </DialogHeader>
        <AkunForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}