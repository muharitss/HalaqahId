import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faSearch, 
  faCheck, 
  faTimes, 
  faEdit,
  faTrash,
  faEllipsisH,
  faUsers,
  faBullseye,
  faCalendarCheck,
  faPhone
} from "@fortawesome/free-solid-svg-icons";
import { useSantri } from "@/hooks/useSantri";
import { useAuth } from "@/hooks/useAuth";

interface Halaqah {
  id_halaqah: number;
  nama_halaqah: string;
  muhafidz_id: number;
}

export default function KelolaSantriPage() {
  // --- Hooks ---
  const { user, isAdmin } = useAuth();
  const {
    santriList,
    isLoading,
    error: santriError,
    loadSantri,
    createSantri,
    updateSantri,
    deleteSantri,
    resetError: resetSantriError
  } = useSantri();

  // --- Local States ---
  const [halaqahList, setHalaqahList] = useState<Halaqah[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data halaqah - dalam implementasi real, ini akan dari API
  const mockHalaqah = [
    { id_halaqah: 1, nama_halaqah: "Halaqah Al-Fatihah", muhafidz_id: 1 },
    { id_halaqah: 2, nama_halaqah: "Halaqah Al-Baqarah", muhafidz_id: 2 },
  ];

  // --- Load Data ---
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load halaqah data (mock untuk sekarang)
        setHalaqahList(mockHalaqah);
        
        // Load santri data dari hook
        await loadSantri();
      } catch (err: any) {
        showFeedback('error', err.message || "Gagal memuat data");
      }
    };
    
    loadInitialData();
  }, [loadSantri]);

  // Show error from hook
  useEffect(() => {
    if (santriError) {
      showFeedback('error', santriError);
      resetSantriError();
    }
  }, [santriError, resetSantriError]);

  // --- Helper Functions ---
  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredSantri = useMemo(() => 
    santriList.filter(s => 
      s.nama_santri.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nomor_telepon.includes(searchTerm)
    ),
  [santriList, searchTerm]);

  const getTargetColor = (target: string) => {
    switch (target) {
      case "RINGAN": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "SEDANG": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "INTENSE": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // --- Handlers ---
  const handleOpenAddModal = () => {
    setSelectedSantri(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (santri: any) => {
    setSelectedSantri(santri);
    setIsModalOpen(true);
  };

  const handleSaveSantri = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSubmitting(true);
    
    try {
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      
      const data = {
        nama_santri: formData.get("nama_santri") as string,
        nomor_telepon: formData.get("nomor_telepon") as string,
        target: formData.get("target") as "RINGAN" | "SEDANG" | "INTENSE",
        halaqah_id: isAdmin() 
          ? parseInt(formData.get("halaqah_id") as string) 
          : user?.halaqah_id || 0
      };

      if (selectedSantri) {
        // Update
        await updateSantri(selectedSantri.id_santri, data);
        showFeedback('success', `Berhasil memperbarui data ${data.nama_santri}`);
      } else {
        // Create
        await createSantri(data);
        showFeedback('success', `Berhasil menambah santri ${data.nama_santri}`);
      }
      
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving santri:", error);
      showFeedback('error', error.message || "Gagal menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSantri = async (santri: any) => {
    if (confirm(`Hapus santri ${santri.nama_santri}?`)) {
      try {
        await deleteSantri(santri.id_santri);
        showFeedback('success', "Santri berhasil dihapus");
      } catch (error: any) {
        showFeedback('error', error.message || "Gagal menghapus santri");
      }
    }
  };

  // Get current halaqah name
  const currentHalaqahName = user?.halaqah_id 
    ? halaqahList.find(h => h.id_halaqah === user.halaqah_id)?.nama_halaqah 
    : '-';

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="space-y-6 container mx-auto py-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto py-6 animate-in fade-in duration-500">
      
      {/* 1. Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Kelola Santri</h2>
          <p className="text-muted-foreground text-sm">
            {isAdmin() 
              ? "Kelola semua santri dari semua halaqah" 
              : `Kelola santri di halaqah Anda (${currentHalaqahName})`
            }
          </p>
        </div>
        <Button onClick={handleOpenAddModal} className="gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Tambah Santri
        </Button>
      </div>

      {/* 2. Feedback Alert */}
      {feedback && (
        <Alert variant={feedback.type === 'success' ? "default" : "destructive"}>
          <FontAwesomeIcon icon={feedback.type === 'success' ? faCheck : faTimes} className="mr-2" />
          <AlertDescription>{feedback.msg}</AlertDescription>
        </Alert>
      )}

      {/* 3. Search Bar */}
      <div className="relative">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Cari nama santri atau nomor telepon..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-10 h-12" 
        />
      </div>
      
      {/* 5. Main Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Santri</CardTitle>
              <CardDescription>
                {filteredSantri.length} santri ditemukan {searchTerm && `untuk "${searchTerm}"`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">ID</TableHead>
                  <TableHead className="font-bold">Nama Santri</TableHead>
                  <TableHead className="font-bold">Nomor Telepon</TableHead>
                  <TableHead className="font-bold">Target</TableHead>
                  {isAdmin() && <TableHead className="font-bold">Halaqah</TableHead>}
                  <TableHead className="text-right font-bold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSantri.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin() ? 6 : 5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Tidak ada santri yang sesuai dengan pencarian" : "Belum ada data santri"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSantri.map((santri) => (
                    <TableRow key={santri.id_santri}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          #{santri.id_santri}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {santri.nama_santri}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faPhone} className="text-xs text-muted-foreground" />
                          <span>{santri.nomor_telepon}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getTargetColor(santri.target)} border`}>
                          {santri.target}
                        </Badge>
                      </TableCell>
                      {isAdmin() && (
                        <TableCell>
                          <span className="text-sm">
                            {halaqahList.find(h => h.id_halaqah === santri.halaqah_id)?.nama_halaqah || `Halaqah ${santri.halaqah_id}`}
                          </span>
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FontAwesomeIcon icon={faEllipsisH} className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleOpenEditModal(santri)}>
                              <FontAwesomeIcon icon={faEdit} className="mr-2 h-3 w-3" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteSantri(santri)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <FontAwesomeIcon icon={faTrash} className="mr-2 h-3 w-3" />
                              <span>Hapus</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 6. Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Target Hafalan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                RINGAN
              </Badge>
              <span className="text-muted-foreground">- 1 halaman per 2 pekan</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                SEDANG
              </Badge>
              <span className="text-muted-foreground">- 2 halaman <strong>atau</strong> 1 lembar per 2 pekan</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                INTENSE
              </Badge>
              <span className="text-muted-foreground">- 4 halaman <strong>atau</strong> 2 lembar per 2 pekan</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. Dialog Form */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSaveSantri}>
            <DialogHeader>
              <DialogTitle>
                {selectedSantri ? "Edit Santri" : "Tambah Santri Baru"}
              </DialogTitle>
              <DialogDescription>
                {selectedSantri 
                  ? "Perbarui data santri di bawah ini."
                  : "Isi data santri baru di bawah ini."
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nama_santri">Nama Santri *</Label>
                <Input 
                  id="nama_santri" 
                  name="nama_santri" 
                  defaultValue={selectedSantri?.nama_santri || ""} 
                  required 
                  placeholder="Nama lengkap santri"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="nomor_telepon">Nomor Telepon *</Label>
                <Input 
                  id="nomor_telepon" 
                  name="nomor_telepon" 
                  defaultValue={selectedSantri?.nomor_telepon || ""} 
                  required 
                  placeholder="0812XXXXXX"
                  type="tel"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="target">Target Hafalan *</Label>
                <Select name="target" defaultValue={selectedSantri?.target || "SEDANG"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RINGAN">Ringan (1 halaman per 2 pekan)</SelectItem>
                    <SelectItem value="SEDANG">Sedang (2 halaman atau 1 lembar per 2 pekan)</SelectItem>
                    <SelectItem value="INTENSE">Intense (4 halaman atau 2 lembar per 2 pekan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isAdmin() && (
                <div className="grid gap-2">
                  <Label htmlFor="halaqah_id">Halaqah *</Label>
                  <Select name="halaqah_id" defaultValue={selectedSantri?.halaqah_id?.toString() || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih halaqah" />
                    </SelectTrigger>
                    <SelectContent>
                      {halaqahList.map((halaqah) => (
                        <SelectItem key={halaqah.id_halaqah} value={halaqah.id_halaqah.toString()}>
                          {halaqah.nama_halaqah}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : selectedSantri ? "Perbarui" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}