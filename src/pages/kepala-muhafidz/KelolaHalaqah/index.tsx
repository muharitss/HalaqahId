import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { halaqahService, type Halaqah } from "@/services/halaqahService";
import { BuatHalaqah } from "./BuatHalaqah";
import { DaftarHalaqah } from "./DaftarHalaqah";
import { EditHalaqah } from "./EditHalaqah";
import { DeleteHalaqah } from "./DeleteHalaqah";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBook, 
  faUsers,
  faCheck,
  faXmark
} from "@fortawesome/free-solid-svg-icons";

export default function KelolaHalaqahPage() {
  const { user } = useAuth();
  const [halaqahList, setHalaqahList] = useState<Halaqah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
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
        setHalaqahList(response.data);
      }
    } catch (err: any) {
      setError("Gagal memuat data halaqah");
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
    setSuccess("Halaqah berhasil diperbarui!");
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
  const totalHalaqah = halaqahList.length;
  const totalMuhafiz = new Set(halaqahList.map(h => h.muhafidz_id)).size;
  const totalSantri = halaqahList.reduce((sum, h) => sum + (h.jumlah_santri || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Kelola Halaqah</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Kelola halaqah di bawah yayasan Anda
          </p>
        </div>

        {/* Tombol Buat Halaqah */}
        <BuatHalaqah onSuccess={handleCreateSuccess} />
      </div>

      {/* Success Alert */}
      {success && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
          <FontAwesomeIcon icon={faCheck} className="mr-2" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <FontAwesomeIcon icon={faXmark} className="mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faBook} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Total Halaqah</p>
              <p className="text-2xl font-bold dark:text-white">{totalHalaqah}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Total Muhafidz</p>
              <p className="text-2xl font-bold dark:text-white">{totalMuhafiz}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Total Santri</p>
              <p className="text-2xl font-bold dark:text-white">{totalSantri}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Daftar Halaqah */}
      <div className="rounded-xl border border-border bg-card dark:bg-surface-dark shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border dark:border-border-dark">
          <h3 className="font-semibold text-lg dark:text-white">Daftar Halaqah</h3>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Semua halaqah yang terdaftar
          </p>
        </div>

        <DaftarHalaqah
          halaqahList={halaqahList}
          isLoading={isLoading}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onRefresh={loadHalaqah}
          onCreateClick={handleCreateSuccess}
        />
      </div>

      {/* Dialog Edit Halaqah */}
      <EditHalaqah
        halaqah={editingHalaqah}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleEditSuccess}
      />

      {/* Dialog Konfirmasi Delete */}
      <DeleteHalaqah
        halaqah={deletingHalaqah}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
      />

      {/* Informasi Tambahan */}
      <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faBook} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold dark:text-white mb-2">Informasi Penting</h4>
            <ul className="text-sm text-text-secondary dark:text-text-secondary-dark space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Bacaan:</strong> Fokus pada pembelajaran membaca Al-Quran</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Hafalan:</strong> Fokus pada menghafal Al-Quran</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Khusus:</strong> Program khusus seperti Tahfidz, Tafsir, dll.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Setiap muhafidz hanya dapat memimpin 1 halaqah</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Hapus halaqah akan memutus relasi dengan muhafidz dan santri</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}