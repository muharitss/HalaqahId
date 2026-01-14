import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { halaqahService, type Halaqah } from "@/services/halaqahService";
import { BuatHalaqah } from "./BuatHalaqah";
import { DaftarHalaqah } from "./DaftarHalaqah";
import { EditHalaqah } from "./EditHalaqah";
import { DeleteHalaqah } from "./DeleteHalaqah";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBook, 
  // faUserTie,
  // faUsers,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function KelolaHalaqahPage() {
  const { user } = useAuth();
  const [halaqahList, setHalaqahList] = useState<Halaqah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [_error, setError] = useState("");
  const [_success, setSuccess] = useState("");
  
  // State untuk edit dan delete
  const [editingHalaqah, setEditingHalaqah] = useState<Halaqah | null>(null);
  const [deletingHalaqah, setDeletingHalaqah] = useState<Halaqah | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Load data halaqah
  useEffect(() => {
    loadHalaqah();
  }, []);

  const loadHalaqah = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await halaqahService.getAllHalaqah();
      if (response.success) {
        // Hitung jumlah santri jika belum ada di response
        const halaqahWithCount = response.data.map(h => ({
          ...h,
          jumlah_santri: h._count.santri || 0
        }));
        setHalaqahList(halaqahWithCount);
      }
    } catch (err: any) {
      setError("Gagal memuat data halaqah: " + (err.message || "Server error"));
      console.error("Load halaqah error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setSuccess("Halaqah berhasil dibuat!");
    loadHalaqah();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEditClick = (halaqah: Halaqah) => {
    setEditingHalaqah(halaqah);
    setIsEditOpen(true);
  };

  const handleEditSuccess = () => {
    setSuccess("Data halaqah berhasil diperbarui!");
    loadHalaqah();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteClick = (halaqah: Halaqah) => {
    setDeletingHalaqah(halaqah);
    setIsDeleteOpen(true);
  };

  const handleDeleteSuccess = () => {
    setSuccess("Halaqah berhasil dihapus!");
    loadHalaqah();
    setTimeout(() => setSuccess(""), 3000);
  };

  // Cek apakah user adalah superadmin
  if (user?.role !== "superadmin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <FontAwesomeIcon icon={faBook} className="text-6xl text-destructive mb-4" />
        <h2 className="text-2xl font-bold dark:text-white mb-2">Akses Ditolak</h2>
        <p className="text-text-secondary dark:text-text-secondary-dark">
          Hanya Kepala Muhafidz yang dapat mengakses halaman ini.
        </p>
      </div>
    );
  }

  // Hitung statistik
  // const totalSantri = halaqahList.reduce((sum, h) => sum + (h._count.santri || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kelola Halaqah</h2>
          <p className="text-muted-foreground">
            Manajemen unit halaqah dan penugasan muhafidz
          </p>
        </div>
        <BuatHalaqah onSuccess={handleCreateSuccess} />
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Halaqah", value: halaqahList.length, icon: faBook, color: "text-primary" },
          { label: "Total Santri", value: totalSantri, icon: faUsers },
          { label: "Muhafidz Aktif", value: new Set(halaqahList.map(h => h.muhafiz_id)).size, icon: faUserTie },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <FontAwesomeIcon icon={stat.icon} className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}

      {/* Main Table Card */}
      <Card className="shadow-sm">
        <CardHeader className="px-6 py-4">
          <CardTitle>Daftar Halaqah</CardTitle>
          <CardDescription>
            Menampilkan semua unit halaqah yang aktif dalam sistem
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <DaftarHalaqah
            halaqahList={halaqahList}
            isLoading={isLoading}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onRefresh={loadHalaqah}
            onCreateClick={handleCreateSuccess}
          />
        </CardContent>
      </Card>

      {/* Info & Guidelines */}
      <Alert className="bg-primary/5 border-primary/20">
        <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4 text-primary" />
        <AlertTitle className="font-bold text-primary">Informasi Sistem</AlertTitle>
        <AlertDescription className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2 text-muted-foreground text-xs italic">
          <p>• Satu muhafidz hanya bisa mengampu satu halaqah aktif.</p>
          <p>• Penghapusan halaqah bersifat permanen (Irreversible).</p>
          <p>• Perubahan muhafidz akan memperbarui riwayat santri terkait.</p>
          <p>• Gunakan fitur "Edit" untuk mengubah nama atau pengampu.</p>
        </AlertDescription>
      </Alert>

      {/* Modals & Dialogs */}
      <EditHalaqah
        halaqah={editingHalaqah}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleEditSuccess}
      />

      <DeleteHalaqah
        halaqah={deletingHalaqah}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}