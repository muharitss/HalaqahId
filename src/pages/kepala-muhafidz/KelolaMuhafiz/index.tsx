import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { akunService, type Muhafiz } from "@/services/akunService";
import { BuatAkun } from "./BuatAkun";
import { DaftarAkun } from "./DaftarAkun";
import { EditAkun } from "./EditAkun";
import { DeleteAkun } from "./DeleteAkun";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserTie, 
  faEnvelope,
  faIdCard,
  faCheck,
  faXmark
} from "@fortawesome/free-solid-svg-icons";

export default function KelolaMuhafizPage() {
  const { user } = useAuth();
  const [muhafizList, setMuhafizList] = useState<Muhafiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // State untuk edit dan delete
  const [editingMuhafiz, setEditingMuhafiz] = useState<Muhafiz | null>(null);
  const [deletingMuhafiz, setDeletingMuhafiz] = useState<Muhafiz | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Load data muhafiz
  useEffect(() => {
    loadMuhafiz();
  }, []);

  const loadMuhafiz = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await akunService.getAllMuhafiz();
      if (response.success) {
        setMuhafizList(response.data);
      }
    } catch (err: any) {
      setError("Gagal memuat data muhafiz: " + err.message);
      console.error("Load muhafiz error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSuccess = () => {
    setSuccess("Akun muhafidz berhasil dibuat!");
    loadMuhafiz();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEditClick = (muhafiz: Muhafiz) => {
    setEditingMuhafiz(muhafiz);
    setIsEditOpen(true);
  };

  const handleEditSuccess = () => {
    setSuccess("Data muhafidz berhasil diperbarui!");
    loadMuhafiz();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteClick = (muhafiz: Muhafiz) => {
    setDeletingMuhafiz(muhafiz);
    setIsDeleteOpen(true);
  };

  const handleDeleteSuccess = () => {
    setSuccess("Muhafidz berhasil dihapus!");
    loadMuhafiz();
    setTimeout(() => setSuccess(""), 3000);
  };

  // Cek apakah user adalah superadmin
  if (user?.role !== "superadmin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <FontAwesomeIcon icon={faUserTie} className="text-6xl text-destructive mb-4" />
        <h2 className="text-2xl font-bold dark:text-white mb-2">Akses Ditolak</h2>
        <p className="text-text-secondary dark:text-text-secondary-dark">
          Hanya Kepala Muhafidz yang dapat mengakses halaman ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Kelola Akun Muhafidz</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Kelola akun muhafidz di bawah yayasan Anda
          </p>
        </div>

        {/* Tombol Buat Akun */}
        <BuatAkun onSuccess={handleRegisterSuccess} />
      </div>

      {/* Success Alert */}
      {success && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
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
              <FontAwesomeIcon icon={faUserTie} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Total Muhafidz</p>
              <p className="text-2xl font-bold dark:text-white">
                {isLoading ? "--" : muhafizList.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faIdCard} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Role</p>
              <p className="text-2xl font-bold dark:text-white">Muhafiz</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Status</p>
              <p className="text-2xl font-bold dark:text-white">Aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Daftar Akun */}
      <div className="rounded-xl border border-border bg-card dark:bg-surface-dark shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border dark:border-border-dark">
          <h3 className="font-semibold text-lg dark:text-white">Daftar Muhafidz</h3>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Semua akun muhafidz yang terdaftar
          </p>
        </div>

        <DaftarAkun
          muhafizList={muhafizList}
          isLoading={isLoading}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onRefresh={loadMuhafiz}
          onCreateClick={handleRegisterSuccess}
        />
      </div>

      {/* Dialog Edit Akun */}
      <EditAkun
        muhafiz={editingMuhafiz}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleEditSuccess}
      />

      {/* Dialog Konfirmasi Delete */}
      <DeleteAkun
        muhafiz={deletingMuhafiz}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
      />

      {/* Informasi Tambahan */}
      <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faIdCard} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold dark:text-white mb-2">Informasi Penting</h4>
            <ul className="text-sm text-text-secondary dark:text-text-secondary-dark space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Password akan di-hash secara otomatis oleh sistem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Akun yang dibuat langsung aktif dan dapat digunakan untuk login</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Pastikan email yang digunakan belum terdaftar sebelumnya</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Edit hanya mengubah username/email, tidak bisa mengubah password</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Hapus muhafidz bersifat soft delete (data tidak benar-benar hilang)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}