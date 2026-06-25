import { useState } from "react";
import { ProfilSekolahInfo } from "../components/ProfilSekolahInfo";
import { ProfilSekolahForm } from "../components/ProfilSekolahForm";
import { useProfilSekolah } from "../hooks/useProfilSekolah";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProfilSekolahPage() {
  const { sekolah, loading, saving, updateProfile } = useProfilSekolah();
  const [isEditOpen, setIsEditOpen] = useState(false);

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
        <AlertDescription>Gagal memuat profil sekolah.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil Sekolah</h1>
          <p className="text-muted-foreground">
            Kelola informasi dan profil sekolah Anda.
          </p>
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profil
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Profil Sekolah</DialogTitle>
              <DialogDescription>
                Ubah informasi nama dan alamat sekolah Anda di sini.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
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

      <div className="mt-6">
        <ProfilSekolahInfo sekolah={sekolah} />
      </div>
    </div>
  );
}
