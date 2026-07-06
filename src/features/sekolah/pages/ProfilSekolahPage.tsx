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

export default function ProfilSekolahPage() {
  const { sekolah, loading, saving, updateProfile } = useProfilSekolah();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();

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
      <div className="flex items-center gap-4 border-b pb-6">
        <button
          onClick={() => navigate("/kepala-muhafidz/settings")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-1 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
