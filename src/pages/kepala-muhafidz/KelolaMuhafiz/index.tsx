import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { akunService, type Muhafiz } from "@/services/akunService";
import { toast } from "sonner"; 

import { BuatAkun } from "./BuatAkun";
import { DaftarAkun } from "./DaftarAkun";
import { EditAkun } from "./EditAkun";
import { DeleteAkun } from "./DeleteAkun";

import { CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { MuhafizManagement } from "@/components/ui/TypedText";

export default function KelolaMuhafizPage() {
  const { user, impersonate } = useAuth();
  const [muhafizList, setMuhafizList] = useState<Muhafiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingMuhafiz, setEditingMuhafiz] = useState<Muhafiz | null>(null);
  const [deletingMuhafiz, setDeletingMuhafiz] = useState<Muhafiz | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadMuhafiz = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await akunService.getAllMuhafiz();
      if (response.success) setMuhafizList(response.data);
    } catch {
      toast.error("Gagal memuat data muhafiz");
    } finally {

      setIsLoading(false);
    }
  }, []);

  const handleRegisterSuccess = () => {
    toast.success("Akun muhafidz berhasil dibuat");
    loadMuhafiz();
  };

  const handleEditSuccess = () => {
    toast.success("Data muhafidz berhasil diperbarui");
    loadMuhafiz();
  };

  const handleDeleteSuccess = () => {
    toast.success("Muhafidz berhasil dihapus");
    loadMuhafiz();
  };

  const handleImpersonateClick = async (muhafiz: Muhafiz) => {
    const promise = async () => {
      const response = await akunService.impersonateMuhafiz(muhafiz.id_user);
      if (response.success && user) {
        const impersonatedUser = {
          ...response.data.user,
          token: response.data.token,
          isImpersonating: true
        };
        await impersonate(impersonatedUser, user);
        return response;
      }
      throw new Error("Gagal login");
    };

    toast.promise(promise(), {
      loading: `Menyiapkan sesi untuk ${muhafiz.username}...`,
      success: `Berhasil login sebagai ${muhafiz.username}`,
      error: "Gagal login sebagai muhafidz",
    });
  };

  useEffect(() => {
    loadMuhafiz();
  }, [loadMuhafiz]);

  if (user?.role !== "superadmin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-125 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-destructive/10 p-6 rounded-full mb-6">
          <FontAwesomeIcon icon={faShieldHalved} className="text-6xl text-destructive" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Akses Ditolak</h2>
        <p className="text-muted-foreground mt-2 max-w-75 text-center">
          Maaf, halaman ini hanya dapat diakses oleh administrator pusat.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 md:px-0">
        <div>
          <MuhafizManagement/>
          <p className="text-sm md:text-base text-muted-foreground">
            Manajemen hak akses dan profil pengampu halaqah
          </p>
        </div>
        <div className="w-full md:w-auto">
          <BuatAkun onSuccess={handleRegisterSuccess} />
        </div>
      </div>

        <CardContent className="p-0">
          <DaftarAkun
            muhafizList={muhafizList}
            isLoading={isLoading}
            onEditClick={(m) => { setEditingMuhafiz(m); setIsEditOpen(true); }}
            onDeleteClick={(m) => { setDeletingMuhafiz(m); setIsDeleteOpen(true); }}
            onImpersonateClick={handleImpersonateClick}
            onRefresh={loadMuhafiz}
            onCreateClick={handleRegisterSuccess}
          />
        </CardContent>

      {/* Modals */}
      <EditAkun
        muhafiz={editingMuhafiz}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleEditSuccess}
      />

      <DeleteAkun
        muhafiz={deletingMuhafiz}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}