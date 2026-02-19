import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, RotateCcw, User, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { halaqahService, type Halaqah } from "@/services/halaqahService";
import { akunService, type Muhafiz } from "@/services/akunService";

export default function TrashSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  const [deletedHalaqah, setDeletedHalaqah] = useState<Halaqah[]>([]);
  const [deletedMuhafiz, setDeletedMuhafiz] = useState<Muhafiz[]>([]);

  const fetchData = async () => {
    try {
      const [resHalaqah, resMuhafiz] = await Promise.all([
        halaqahService.getDeletedHalaqah(),
        akunService.getDeletedMuhafiz()
      ]);
      setDeletedHalaqah(resHalaqah.data);
      setDeletedMuhafiz(resMuhafiz.data);
    } catch {


      toast.error("Gagal mengambil data sampah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRestoreHalaqah = async (id: number) => {
    setProcessingId(id);
    try {
      await halaqahService.restoreHalaqah(id);
      toast.success("Halaqah berhasil dipulihkan");
      await fetchData();
    } catch {


      toast.error("Gagal memulihkan halaqah");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRestoreMuhafiz = async (id: number) => {
    setProcessingId(id);
    try {
      await akunService.restoreMuhafiz(id);
      toast.success("Akun muhafiz berhasil dipulihkan");
      await fetchData();
    } catch {


      toast.error("Gagal memulihkan muhafiz");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tempat Sampah</h1>
          <p className="text-sm text-muted-foreground">Pulihkan data yang telah dihapus sebelumnya</p>
        </div>
      </div>

      <Tabs defaultValue="muhafiz" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-11 p-1 bg-muted/50">
          <TabsTrigger value="muhafiz" className="flex items-center gap-2 data-[state=active]:shadow-sm">
            <User className="h-4 w-4" /> Muhafiz
          </TabsTrigger>
          <TabsTrigger value="halaqah" className="flex items-center gap-2 data-[state=active]:shadow-sm">
            <Home className="h-4 w-4" /> Halaqah
          </TabsTrigger>
        </TabsList>

        {/* CONTENT: MUHAFIZ (Tanpa Card) */}
        <TabsContent value="muhafiz" className="space-y-4 focus-visible:outline-none">
          <div className="px-1">
            <h3 className="text-lg font-semibold tracking-tight">Muhafiz Terhapus</h3>
            <p className="text-sm text-muted-foreground">Akun pengajar dalam daftar ini dapat dipulihkan ke sistem.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
          ) : deletedMuhafiz.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground italic border-2 border-dashed rounded-xl">
              Tidak ada data muhafiz terhapus
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">Username</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedMuhafiz.map((item) => (
                  <TableRow key={item.id_user} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{item.username}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{item.email}</TableCell>
                    <TableCell className="text-right py-4">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="h-8 px-4"
                        disabled={processingId === item.id_user}
                        onClick={() => handleRestoreMuhafiz(item.id_user)}
                      >
                        {processingId === item.id_user ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5 mr-2" />
                        )}
                        Pulihkan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* CONTENT: HALAQAH (Tanpa Card) */}
        <TabsContent value="halaqah" className="space-y-4 focus-visible:outline-none">
          <div className="px-1">
            <h3 className="text-lg font-semibold tracking-tight">Halaqah Terhapus</h3>
            <p className="text-sm text-muted-foreground">Daftar kelompok halaqah yang tersedia untuk pemulihan.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>
          ) : deletedHalaqah.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground italic border-2 border-dashed rounded-xl">
              Tidak ada data halaqah terhapus
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead>Nama Halaqah</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedHalaqah.map((item) => (
                  <TableRow key={item.id_halaqah} className="hover:bg-muted/30">
                    <TableCell className="font-medium py-4">{item.name_halaqah}</TableCell>
                    <TableCell className="text-right py-4">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="h-8 px-4"
                        disabled={processingId === item.id_halaqah}
                        onClick={() => handleRestoreHalaqah(item.id_halaqah)}
                      >
                        {processingId === item.id_halaqah ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5 mr-2" />
                        )}
                        Pulihkan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}