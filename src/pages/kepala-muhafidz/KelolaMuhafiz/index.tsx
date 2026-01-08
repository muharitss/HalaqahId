import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { akunService, type Muhafiz } from "@/services/akunService";
import { AkunForm } from "@/components/forms/AkunForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserTie, 
  faPlus, 
  faEnvelope,
  faIdCard,
//   faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function KelolaMuhafizPage() {
  const { user } = useAuth();
  const [muhafizList, setMuhafizList] = useState<Muhafiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    setIsDialogOpen(false);
    loadMuhafiz(); // Refresh list setelah berhasil register
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

        {/* Dialog Trigger Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark text-white">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Tambah Muhafidz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserTie} />
                Buat Akun Muhafidz Baru
              </DialogTitle>
            </DialogHeader>
            <AkunForm onSuccess={handleRegisterSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
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

      {/* Table Section */}
      <div className="rounded-xl border border-border bg-card dark:bg-surface-dark shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border dark:border-border-dark">
          <h3 className="font-semibold text-lg dark:text-white">Daftar Muhafidz</h3>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Semua akun muhafidz yang terdaftar
          </p>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : muhafizList.length === 0 ? (
          <div className="p-12 text-center">
            <FontAwesomeIcon icon={faUserTie} className="text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4" />
            <h4 className="font-medium dark:text-white mb-2">Belum ada muhafidz</h4>
            <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
              Mulai dengan menambahkan akun muhafidz baru
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Tambah Muhafidz Pertama
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/30 dark:bg-background-dark/50 text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Username</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {muhafizList.map((muhafiz) => (
                  <tr key={muhafiz.id_user} className="hover:bg-accent/5 dark:hover:bg-background-dark/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        #{muhafiz.id_user}
                      </span>
                    </td>
                    <td className="px-6 py-4 dark:text-text-secondary-dark">
                      {muhafiz.username || "Belum diisi"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-sm text-text-secondary-light dark:text-text-secondary-dark" />
                        <span className="font-medium dark:text-white">{muhafiz.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                        {muhafiz.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
                <span>Rekomendasi password: minimal 8 karakter dengan kombinasi huruf dan angka</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}