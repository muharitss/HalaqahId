import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfilSekolahInfo } from "../components/ProfilSekolahInfo";
import { ProfilSekolahForm } from "../components/ProfilSekolahForm";
import { useProfilSekolah } from "../hooks/useProfilSekolah";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Edit, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Term } from "@/components/ui/Term";
import { useTerminology } from "@/hooks/useTerminology";

export default function ProfilSekolahPage() {
  const { sekolah, loading, saving, updateProfile } = useProfilSekolah();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();
  const labelSekolah = useTerminology("SEKOLAH");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (!sekolah) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Gagal memuat profil {labelSekolah.toLowerCase()}.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/kepala-muhafidz/settings")}
            className="rounded-full h-9 w-9 shrink-0 shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-0">
              Profil <Term code="SEKOLAH" />
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-0">
              Kelola informasi dan profil {labelSekolah.toLowerCase()} Anda.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="shadow-sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profil
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Profil <Term code="SEKOLAH" /></DialogTitle>
              <DialogDescription>
                Ubah informasi nama dan alamat {labelSekolah.toLowerCase()} Anda di sini.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 max-h-[70vh] overflow-y-auto pr-2">
              <ProfilSekolahForm 
                sekolah={sekolah} 
                saving={saving} 
                onSubmit={updateProfile}
                onSuccess={() => setIsEditOpen(false)}
              />
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-6">
        <ProfilSekolahInfo sekolah={sekolah} />
      </div>
    </div>
  );
}
