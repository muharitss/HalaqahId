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
import { AkunForm } from "./AkunForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faPlus } from "@fortawesome/free-solid-svg-icons";
import type { BuatAkunProps } from "@/features/muhafiz/types";
import { Term } from "@/components/ui/Term";

export function BuatAkun({ onSuccess }: BuatAkunProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah <Term code="MUHAFIZ" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUserTie} className="text-primary" />
            Buat Akun <Term code="MUHAFIZ" /> Baru
          </DialogTitle>
          <DialogDescription>
            Isi formulir di bawah ini untuk mendaftarkan akun <Term code="MUHAFIZ" /> baru ke dalam sistem.
          </DialogDescription>
        </DialogHeader>
        <AkunForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
