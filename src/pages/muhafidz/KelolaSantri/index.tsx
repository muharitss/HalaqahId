import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, 
  faPlus, 
  faEdit, 
  faTrash,
  faSearch,
  faUserGraduate,
  faBook,
  faCheck,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

// Type untuk data Santri (sesuai schema Prisma)
interface Santri {
  id_santri: number;
  nama: string;
  target: "RINGAN" | "SEDANG" | "INTENS" | "CUSTOM_KHUSUS";
  halaqah_id: number;
}

export default function KelolaSantriPage() {
//   const { user } = useAuth();
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Data dummy untuk simulasi (nanti akan diganti dengan API)
  const dummySantri: Santri[] = [
    { id_santri: 1, nama: "Ahmad Farhan", target: "SEDANG", halaqah_id: 1 },
    { id_santri: 2, nama: "Zaid Ramadhan", target: "INTENS", halaqah_id: 1 },
    { id_santri: 3, nama: "Umar Mukhtar", target: "RINGAN", halaqah_id: 1 },
    { id_santri: 4, nama: "Abdullah Haikal", target: "CUSTOM_KHUSUS", halaqah_id: 1 },
    { id_santri: 5, nama: "Muhammad Al-Fatih", target: "SEDANG", halaqah_id: 1 },
    { id_santri: 6, nama: "Ali Zainal", target: "RINGAN", halaqah_id: 1 },
  ];

  // Load data santri (dummy untuk sekarang)
  useEffect(() => {
    const loadSantri = () => {
      setIsLoading(true);
      setError("");
      
      // Simulasi loading dari API
      setTimeout(() => {
        try {
          setSantriList(dummySantri);
        } catch (err) {
          setError("Gagal memuat data santri");
          console.error("Error loading santri:", err);
        } finally {
          setIsLoading(false);
        }
      }, 800);
    };

    loadSantri();
  }, []);

  // Filter santri berdasarkan pencarian
  const filteredSantri = santriList.filter(santri =>
    santri.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Warna berdasarkan target
  const getTargetColor = (target: string) => {
    switch (target) {
      case "RINGAN": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "SEDANG": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "INTENS": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
      case "CUSTOM_KHUSUS": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Format target menjadi teks yang lebih mudah dibaca
  const formatTarget = (target: string) => {
    switch (target) {
      case "RINGAN": return "Ringan";
      case "SEDANG": return "Sedang";
      case "INTENS": return "Intens";
      case "CUSTOM_KHUSUS": return "Khusus";
      default: return target;
    }
  };

  // Handle tambah santri baru
  const handleAddSantri = () => {
    setSuccess("Fitur tambah santri akan segera tersedia!");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Handle edit santri
  const handleEditSantri = (santri: Santri) => {
    setSuccess(`Edit santri ${santri.nama} akan segera tersedia!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  // Handle hapus santri
  const handleDeleteSantri = (santri: Santri) => {
    if (window.confirm(`Hapus santri ${santri.nama}?`)) {
      // Simulasi delete dari state
      setSantriList(prev => prev.filter(s => s.id_santri !== santri.id_santri));
      setSuccess(`Santri ${santri.nama} berhasil dihapus!`);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Search Skeleton */}
        <Skeleton className="h-12 w-full" />

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Kelola Santri</h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
            Kelola data santri di halaqah Anda
          </p>
        </div>

        {/* Tombol Tambah Santri */}
        <Button 
          onClick={handleAddSantri}
          className="bg-primary hover:bg-primary-dark text-white"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah Santri
        </Button>
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
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <Input
          type="search"
          placeholder="Cari nama santri..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Total Santri</p>
              <p className="text-2xl font-bold dark:text-white">{santriList.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faUserGraduate} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Target Ringan</p>
              <p className="text-2xl font-bold dark:text-white">
                {santriList.filter(s => s.target === "RINGAN").length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faBook} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Target Sedang</p>
              <p className="text-2xl font-bold dark:text-white">
                {santriList.filter(s => s.target === "SEDANG").length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 dark:bg-surface-dark shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <FontAwesomeIcon icon={faUserGraduate} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">Target Khusus</p>
              <p className="text-2xl font-bold dark:text-white">
                {santriList.filter(s => s.target === "CUSTOM_KHUSUS").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Daftar Santri */}
      <div className="rounded-xl border border-border bg-card dark:bg-surface-dark shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border dark:border-border-dark">
          <h3 className="font-semibold text-lg dark:text-white">Daftar Santri</h3>
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Menampilkan {filteredSantri.length} dari {santriList.length} santri
          </p>
        </div>

        {filteredSantri.length === 0 ? (
          <div className="p-12 text-center">
            <FontAwesomeIcon icon={faUsers} className="text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4" />
            <h4 className="font-medium dark:text-white mb-2">Tidak ada santri</h4>
            <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
              {searchTerm ? "Santri tidak ditemukan" : "Mulai dengan menambahkan santri"}
            </p>
            <Button onClick={handleAddSantri}>
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Tambah Santri Pertama
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent/30 dark:bg-background-dark/50 text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Nama Santri</th>
                  <th className="px-6 py-4 text-left">Target Hafalan</th>
                  <th className="px-6 py-4 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-border-dark">
                {filteredSantri.map((santri) => (
                  <tr 
                    key={santri.id_santri} 
                    className="hover:bg-accent/5 dark:hover:bg-background-dark/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        #{santri.id_santri}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <FontAwesomeIcon icon={faUserGraduate} className="text-primary text-sm" />
                        </div>
                        <span className="font-medium dark:text-white">{santri.nama}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getTargetColor(santri.target)}`}>
                        {formatTarget(santri.target)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSantri(santri)}
                          className="h-8"
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSantri(santri)}
                          className="h-8"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-1" />
                          Hapus
                        </Button>
                      </div>
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
            <FontAwesomeIcon icon={faBook} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold dark:text-white mb-2">Keterangan Target Hafalan</h4>
            <ul className="text-sm text-text-secondary dark:text-text-secondary-dark space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500">• Ringan:</span>
                <span>1-2 halaman per pertemuan (untuk pemula)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">• Sedang:</span>
                <span>3-4 halaman per pertemuan (rata-rata)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">• Intens:</span>
                <span>5-6 halaman per pertemuan (lanjutan)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">• Khusus:</span>
                <span>Target khusus sesuai kesepakatan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}