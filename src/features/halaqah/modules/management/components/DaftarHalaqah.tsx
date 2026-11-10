import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserTie, faSearch } from "@fortawesome/free-solid-svg-icons"; // Import icon tambahan
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { MoreVertical, Edit2, Trash2, ArrowRightLeft, UserPlus, UserCheck } from "lucide-react"; 
import { Input } from "@/components/ui/input";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { PermissionGate } from "@/components/ui/PermissionGate";
import type { DaftarHalaqahProps } from "@/features/halaqah/types";
import { RoleBadge } from "@/features/halaqah/components";

// ---------------------------------------------------------------------------
// Sub-komponen: HalaqahItem (Mempunyai state pagination santri internal sendiri)
// ---------------------------------------------------------------------------

interface HalaqahItemProps {
  h: any;
  daftarSantri: any[];
  onAddSantri: (h: any) => void;
  onEdit: (h: any) => void;
  onDelete: (h: any) => void;
  onMoveSantri: (s: any) => void;
  onEditSantri: (s: any) => void;
  onDeleteSantri: (s: any) => void;
  onManageMuhafiz: (h: any) => void;
  formatWhatsApp: (phone: string | null | undefined) => string;
}

function HalaqahItem({
  h,
  daftarSantri,
  onAddSantri,
  onEdit,
  onDelete,
  onMoveSantri,
  onEditSantri,
  onDeleteSantri,
  onManageMuhafiz,
  formatWhatsApp,
}: HalaqahItemProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [daftarSantri.length]);

  const totalPages = Math.ceil(daftarSantri.length / 10);
  const displayedSantri = showAll
    ? daftarSantri
    : daftarSantri.slice((currentPage - 1) * 10, currentPage * 10);

  const muhafizList = (h.muhafiz_list && h.muhafiz_list.length > 0)
    ? h.muhafiz_list
    : h.muhafiz?.name
      ? [{ id_user: h.muhafiz.id_user, name: h.muhafiz.name, email: h.muhafiz.email, peran: "UTAMA" as const }]
      : [];

  return (
    <AccordionItem 
      key={h.id_halaqah} 
      value={h.id_halaqah.toString()} 
      className="border rounded-xl bg-card px-2 md:px-4 shadow-sm"
    >
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex flex-1 items-center justify-between pr-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg md:text-xl">
              {h.name_halaqah.charAt(0)}
            </div>
            <div className="text-left">
              <h3 className="font-bold text-base md:text-lg leading-tight">{h.name_halaqah}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs md:text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUserTie} className="text-[10px]" />
                  {muhafizList.length > 0 ? (
                    <>
                      <span>{muhafizList[0].name}</span>
                      <RoleBadge role={muhafizList[0].peran || "UTAMA"} />
                      {muhafizList.length > 1 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                          +{muhafizList.length - 1} lainnya
                        </Badge>
                      )}
                    </>
                  ) : (
                    <span>Tanpa Muhafiz</span>
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
                  {h.total_santri || 0} Santri
                </span>
              </div>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-0 pt-0 pb-4">
        {/* Section: Tim Muhafiz */}
        {/* <div className="mb-4 bg-muted/20 border rounded-lg p-3">
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUserTie} className="text-primary text-xs" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tim Muhafiz ({muhafizList.length})
              </h4>
            </div>
            <PermissionGate permission="halaqah.update">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onManageMuhafiz(h)}
                className="h-7 text-xs gap-1.5 px-2.5"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Kelola Muhafiz
              </Button>
            </PermissionGate>
          </div>
          {muhafizList.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Belum ada muhafiz yang ditugaskan</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {muhafizList.map((m: any, idx: number) => (
                <div
                  key={m.id_user || idx}
                  className="flex items-center justify-between p-2.5 rounded-md border bg-background text-xs shadow-2xs"
                >
                  <div className="truncate mr-2">
                    <p className="font-semibold text-foreground truncate">{m.name}</p>
                    {m.email && <p className="text-[11px] text-muted-foreground truncate">{m.email}</p>}
                  </div>
                  <RoleBadge role={m.peran || "UTAMA"} />
                </div>
              ))}
            </div>
          )}
        </div> */}

        <div className="flex justify-between items-center py-3 border-t border-dashed mb-2 px-1">
          <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Daftar Anggota
          </h4>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Aksi Halaqah</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <PermissionGate permission="halaqah.update">
                <DropdownMenuItem onClick={() => onManageMuhafiz(h)} className="cursor-pointer">
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Kelola Muhafiz</span>
                </DropdownMenuItem>
              </PermissionGate>
              <PermissionGate permission="santri.create">
                <DropdownMenuItem onClick={() => onAddSantri(h)} className="cursor-pointer">
                  <UserPlus className="mr-2 h-4 w-4" /> 
                  <span>Tambah Santri</span>
                </DropdownMenuItem>
              </PermissionGate>
              <PermissionGate permission="halaqah.update">
                <DropdownMenuItem onClick={() => onEdit(h)} className="cursor-pointer">
                  <Edit2 className="mr-2 h-4 w-4" />
                  <span>Edit Data</span>
                </DropdownMenuItem>
              </PermissionGate>
              <PermissionGate permission="halaqah.delete">
                <DropdownMenuItem 
                  onClick={() => onDelete(h)} 
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Hapus Halaqah</span>
                </DropdownMenuItem>
              </PermissionGate>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 px-2 text-xs font-bold">Nama Santri</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="text-right w-25">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedSantri.length > 0 ? (
                displayedSantri.map((s) => (
                  <TableRow key={s.id_santri}>
                    <TableCell className="font-medium">
                      {s.nama_santri}
                    </TableCell>
                    <TableCell>
                      <a 
                        href={formatWhatsApp(s.nomor_telepon)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark hover:underline transition-all"
                      >
                        <FontAwesomeIcon icon={faWhatsapp} />
                        {s.nomor_telepon}
                      </a>
                    </TableCell>
                    <TableCell className="py-2 px-2">
                      {s.target ? (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-900/50">
                          {s.target.nama_target}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground font-normal">
                          Bebas
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel>Aksi Santri</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <PermissionGate permission="santri.update">
                            <DropdownMenuItem 
                              onClick={() => onMoveSantri(s)} 
                              className="cursor-pointer text-blue-600 focus:text-blue-600"
                            >
                              <ArrowRightLeft className="mr-2 h-4 w-4" />
                              <span>Pindah Halaqah</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onEditSantri(s)} 
                              className="cursor-pointer"
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              <span>Edit Profil</span>
                            </DropdownMenuItem>
                          </PermissionGate>
                          <PermissionGate permission="santri.delete">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => onDeleteSantri(s)} 
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Hapus Santri</span>
                            </DropdownMenuItem>
                          </PermissionGate>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-xs italic opacity-50">
                    Tidak ada santri di kelompok ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section untuk Santri inside Halaqah */}
        {daftarSantri.length > 10 && (
          <div className="p-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/5 mt-3 rounded-lg">
            <div className="text-xs text-muted-foreground">
              {showAll ? (
                <span>Menampilkan semua <strong>{daftarSantri.length}</strong> santri</span>
              ) : (
                <span>
                  Menampilkan <strong>{Math.min((currentPage - 1) * 10 + 1, daftarSantri.length)}</strong> -{" "}
                  <strong>{Math.min(currentPage * 10, daftarSantri.length)}</strong> dari{" "}
                  <strong>{daftarSantri.length}</strong> santri
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => {
                  setShowAll(!showAll);
                  setCurrentPage(1);
                }}
              >
                {showAll ? "Batasi 10 per Halaman" : "Tampilkan Semua"}
              </Button>
              
              {!showAll && totalPages > 1 && (
                <div className="flex items-center gap-1.5 ml-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-xs text-muted-foreground min-w-[35px] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Selanjutnya
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

// ---------------------------------------------------------------------------
// Komponen Utama: DaftarHalaqah
// ---------------------------------------------------------------------------

export function DaftarHalaqah({ 
  halaqahs, 
  onEdit, 
  onDelete, 
  onMoveSantri, 
  onEditSantri, 
  onDeleteSantri, 
  onManageMuhafiz,
  isLoading, 
  santriMap,
  onAddSantri
}: DaftarHalaqahProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [halaqahs.length, searchTerm]);

  const formatWhatsApp = (phone: string | null | undefined) => {
    if (!phone) return "#"; 
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    }
    return `https://wa.me/${cleaned}`;
  };

  if (isLoading) return <HalaqahLoadingSkeleton />;

  const filteredHalaqahs = halaqahs.filter((h) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = h.name_halaqah.toLowerCase().includes(term);
    const muhafizMatch =
      (h.muhafiz?.name || "").toLowerCase().includes(term) ||
      (h.muhafiz_list || []).some((m) => m.name.toLowerCase().includes(term));
    return nameMatch || muhafizMatch;
  });

  const totalPages = Math.ceil(filteredHalaqahs.length / 10);
  const displayedHalaqahs = showAll
    ? filteredHalaqahs
    : filteredHalaqahs.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative w-full sm:w-72">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Cari halaqah atau muhafidz..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {displayedHalaqahs.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-3">
          {displayedHalaqahs.map((h) => (
            <HalaqahItem
              key={h.id_halaqah}
              h={h}
              daftarSantri={santriMap[h.id_halaqah] || []}
              onAddSantri={onAddSantri}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveSantri={onMoveSantri}
              onEditSantri={onEditSantri}
              onDeleteSantri={onDeleteSantri}
              onManageMuhafiz={onManageMuhafiz || onEdit}
              formatWhatsApp={formatWhatsApp}
            />
          ))}
        </Accordion>
      ) : (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center bg-card">
          <p className="text-sm text-muted-foreground">Tidak ada halaqah yang cocok dengan pencarian Anda.</p>
        </div>
      )}

      {/* Pagination Section untuk Daftar Halaqah */}
      {!isLoading && (filteredHalaqahs.length > 10 || showAll) && (
        <div className="p-4 border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10 shadow-sm">
          <div className="text-xs text-muted-foreground">
            {showAll ? (
              <span>Menampilkan semua <strong>{filteredHalaqahs.length}</strong> halaqah</span>
            ) : (
              <span>
                Menampilkan <strong>{Math.min((currentPage - 1) * 10 + 1, filteredHalaqahs.length)}</strong> -{" "}
                <strong>{Math.min(currentPage * 10, filteredHalaqahs.length)}</strong> dari{" "}
                <strong>{filteredHalaqahs.length}</strong> halaqah
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 px-3"
              onClick={() => {
                setShowAll(!showAll);
                setCurrentPage(1);
              }}
            >
              {showAll ? "Batasi 10 per Halaman" : "Tampilkan Semua"}
            </Button>
            
            {!showAll && totalPages > 1 && (
              <div className="flex items-center gap-2 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Sebelumnya
                </Button>
                <span className="text-xs text-muted-foreground min-w-[45px] text-center">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HalaqahLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}
