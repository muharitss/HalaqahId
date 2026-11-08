import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HalaqahForm } from "./HalaqahForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPlus } from "@fortawesome/free-solid-svg-icons";
import type { BuatHalaqahProps } from "@/features/halaqah/types";
import { Term } from "@/components/ui/Term";

export function BuatHalaqah({ onSuccess }: BuatHalaqahProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    onSuccess();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-dark text-white">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah <Term code="HALAQAH" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faBook} />
            Buat <Term code="HALAQAH" /> Baru
          </DialogTitle>
        </DialogHeader>
        <HalaqahForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
