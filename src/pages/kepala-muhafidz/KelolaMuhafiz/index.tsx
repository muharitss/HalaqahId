import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { akunService, type Muhafiz } from "@/services/akunService";
import { toast } from "sonner"; 

import { BuatAkun } from "./BuatAkun";
import { DaftarAkun } from "./DaftarAkun";
import { EditAkun } from "./EditAkun";
import { DeleteAkun } from "./DeleteAkun";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserTie, 
  faInfoCircle,
  faLock,
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";

export default function KelolaMuhafizPage() {
  const { user, impersonate } = useAuth();
  const [muhafizList, setMuhafizList] = useState<Muhafiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingMuhafiz, setEditingMuhafiz] = useState<Muhafiz | null>(null);
  const [deletingMuhafiz, setDeletingMuhafiz] = useState<Muhafiz | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    loadMuhafiz();
  }, []);

  const loadMuhafiz = async () => {
    setIsLoading(true);
    try {
      const response = await akunService.getAllMuhafiz();
      if (response.success) setMuhafizList(response.data);
    } catch (err: any) {
      toast.error("Gagal memuat data muhafiz");
    } finally {
      setIsLoading(false);
    }
  };

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

  if (user?.role !== "superadmin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-destructive/10 p-6 rounded-full mb-6">
          <FontAwesomeIcon icon={faShieldHalved} className="text-6xl text-destructive" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Akses Ditolak</h2>
        <p className="text-muted-foreground mt-2 max-w-[300px] text-center">
          Maaf, halaman ini hanya dapat diakses oleh administrator pusat.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kelola Akun Muhafidz</h2>
          <p className="text-muted-foreground">
            Manajemen hak akses dan profil pengampu halaqah
          </p>
        </div>
        <BuatAkun onSuccess={handleRegisterSuccess} />
      </div>

      {/* Main Table Card */}
      <Card className="shadow-sm border-border">
        <CardHeader className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Akun</CardTitle>
              <CardDescription>
                Total terdaftar: <span className="font-bold text-foreground">{muhafizList.length} Akun</span>
              </CardDescription>
            </div>
            <FontAwesomeIcon icon={faUserTie} className="text-muted-foreground/30 h-8 w-8" />
          </div>
        </CardHeader>
        <Separator />
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
      </Card>

      {/* Security & Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Alert className="bg-primary/5 border-primary/20 md:col-span-2">
          <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4 text-primary" />
          <AlertTitle className="font-bold text-primary">Panduan Pengelolaan</AlertTitle>
          <AlertDescription className="mt-2 text-muted-foreground text-sm space-y-1">
            <p>• Gunakan fitur <strong>Login Sebagai</strong> untuk pengecekan data muhafidz.</p>
            <p>• Penghapusan akun menggunakan metode <em>soft-delete</em>.</p>
            <p>• Email muhafidz harus unik dan valid untuk pengiriman laporan.</p>
          </AlertDescription>
        </Alert>

        <Card className="bg-muted/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border shadow-sm">
              <FontAwesomeIcon icon={faLock} className="text-muted-foreground h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Keamanan Akun</p>
              <p className="text-[11px] leading-tight text-muted-foreground mt-1 italic">
                Password dienkripsi otomatis oleh sistem menggunakan hash Bcrypt.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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