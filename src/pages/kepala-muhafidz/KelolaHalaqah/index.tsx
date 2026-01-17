import { useEffect, useState, useCallback } from "react";
import { halaqahService, type Halaqah } from "@/services/halaqahService";
import { useSantri } from "@/hooks/useSantri";
import { toast } from "sonner";

// Import Komponen CRUD Anda
import { BuatHalaqah } from "./BuatHalaqah";
import { EditHalaqah } from "./EditHalaqah";
import { DeleteHalaqah } from "./DeleteHalaqah";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserTie, faPhone, faBullseye, faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import { HalaqahManagement } from "@/components/ui/TypedText";

export default function KelolaHalaqah() {
  // States
  const [halaqahs, setHalaqahs] = useState<Halaqah[]>([]);
  const [deletedHalaqahs, setDeletedHalaqahs] = useState<Halaqah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [selectedHalaqah, setSelectedHalaqah] = useState<Halaqah | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { santriList, loadSantri } = useSantri();

  // Load Data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [activeRes, deletedRes] = await Promise.all([
        halaqahService.getAllHalaqah(),
        halaqahService.getDeletedHalaqah(),
        loadSantri()
      ]);
      setHalaqahs(activeRes.data);
      setDeletedHalaqahs(deletedRes.data || []);
    } catch (error) {
      toast.error("Gagal sinkronisasi data dari server");
    } finally {
      setIsLoading(false);
    }
  }, [loadSantri]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleEdit = (h: Halaqah) => {
    setSelectedHalaqah(h);
    setIsEditOpen(true);
  };

  const handleDelete = (h: Halaqah) => {
    setSelectedHalaqah(h);
    setIsDeleteOpen(true);
  };

  const handleRestore = async (id: number) => {
    try {
      await halaqahService.restoreHalaqah(id);
      toast.success("Halaqah berhasil dipulihkan");
      fetchData();
    } catch (error) {
      toast.error("Gagal memulihkan halaqah");
    }
  };

  if (isLoading) return <HalaqahLoadingSkeleton />;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <HalaqahManagement/>
          <p className="text-muted-foreground">Kelola kelompok bimbingan dan pantau santri di dalamnya.</p>
        </div>
        <div className="flex items-center gap-2">
          <BuatHalaqah onSuccess={fetchData} />
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">

        {/* Tab Halaqah Aktif */}
        <TabsContent value="active" className="space-y-4">
          {halaqahs.length === 0 ? (
            <EmptyState message="Belum ada halaqah yang dibuat." />
          ) : (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {halaqahs.map((h) => (
                <AccordionItem key={h.id_halaqah} value={h.id_halaqah.toString()} className="border rounded-xl bg-card px-4 shadow-sm">
                  <AccordionTrigger className="hover:no-underline py-5">
                    <div className="flex flex-1 items-center justify-between pr-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          {h.name_halaqah.charAt(0)}
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-lg leading-tight">{h.name_halaqah}</h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faUserTie} className="text-[10px]" />
                              {h.muhafiz.username}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
                              {h._count.santri} Santri
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-6">
                    <div className="flex justify-between items-center py-4 border-t border-dashed mb-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Daftar Anggota
                      </h4>
                      
                      {/* Dropdown Menu Titik Tiga */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Aksi Halaqah</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          {/* Opsi Edit */}
                          <DropdownMenuItem onClick={() => handleEdit(h)} className="cursor-pointer">
                            <Edit2 className="mr-2 h-4 w-4" />
                            <span>Edit Data</span>
                          </DropdownMenuItem>
                          
                          {/* Opsi Hapus */}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(h)} 
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-red-400" />
                            <span>Hapus Halaqah</span>
                          </DropdownMenuItem>
                          
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-slate-50/50">
                          <TableRow>
                            <TableHead><FontAwesomeIcon icon={faUserTie} className="mr-2 opacity-50"/>Nama Santri</TableHead>
                            <TableHead><FontAwesomeIcon icon={faPhone} className="mr-2 opacity-50"/>Kontak</TableHead>
                            <TableHead className="text-right"><FontAwesomeIcon icon={faBullseye} className="mr-2 opacity-50"/>Target</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {santriList.filter(s => s.halaqah_id === h.id_halaqah).length > 0 ? (
                            santriList.filter(s => s.halaqah_id === h.id_halaqah).map((s) => (
                              <TableRow key={s.id_santri}>
                                <TableCell className="font-medium">{s.nama_santri}</TableCell>
                                <TableCell className="text-muted-foreground">{s.nomor_telepon}</TableCell>
                                <TableCell className="text-right">
                                  <Badge variant={s.target === "INTENSE" ? "default" : "outline"}>
                                    {s.target}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground italic">
                                Tidak ada santri di kelompok ini.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>

        {/* Tab Trash */}
        <TabsContent value="trash">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tempat Sampah</CardTitle>
              <CardDescription>Halaqah yang dihapus sementara dapat dipulihkan kembali.</CardDescription>
            </CardHeader>
            <CardContent>
              {deletedHalaqahs.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">Tidak ada halaqah di tempat sampah.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Halaqah</TableHead>
                      <TableHead>Muhafidz</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletedHalaqahs.map((h) => (
                      <TableRow key={h.id_halaqah}>
                        <TableCell className="font-medium">{h.name_halaqah}</TableCell>
                        <TableCell>{h.muhafiz?.username}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleRestore(h.id_halaqah)} className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-2">
                            <FontAwesomeIcon icon={faTrashRestore} /> Pulihkan
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EditHalaqah 
        halaqah={selectedHalaqah} 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        onSuccess={fetchData} 
      />
      
      <DeleteHalaqah 
        halaqah={selectedHalaqah} 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
}

// Sub-components untuk kerapihan
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl opacity-60">
      <FontAwesomeIcon icon={faUsers} size="3x" className="mb-4 text-muted-foreground" />
      <p>{message}</p>
    </div>
  );
}

function HalaqahLoadingSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2"><Skeleton className="h-8 w-64" /><Skeleton className="h-4 w-48" /></div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    </div>
  );
}