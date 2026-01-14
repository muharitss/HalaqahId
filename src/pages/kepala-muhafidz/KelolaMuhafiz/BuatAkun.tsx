import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AkunForm } from "@/components/forms/AkunForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faPlus } from "@fortawesome/free-solid-svg-icons";

interface BuatAkunProps {
  onSuccess: () => void;
}

export function BuatAkun({ onSuccess }: BuatAkunProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false); // Tutup dialog otomatis
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah Muhafiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUserTie} className="text-primary" />
            Buat Akun Muhafiz Baru
          </DialogTitle>
          <DialogDescription>
            Isi formulir di bawah ini untuk mendaftarkan akun muhafiz baru ke dalam sistem.
          </DialogDescription>
        </DialogHeader>
        <AkunForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}