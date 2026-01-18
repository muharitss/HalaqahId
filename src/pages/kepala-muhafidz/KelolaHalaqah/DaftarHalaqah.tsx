import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { MoreVertical, Edit2, Trash2, ArrowRightLeft, UserPlus } from "lucide-react"; 
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
import { type Halaqah } from "@/services/halaqahService";
import { type Santri } from "@/services/santriService";
import { Skeleton } from "@/components/ui/skeleton";
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)


interface DaftarHalaqahProps {
  halaqahs: Halaqah[];
  santriMap: Record<number, Santri[]>;
  onEdit: (h: Halaqah) => void;
  onDelete: (h: Halaqah) => void;
  onMoveSantri: (s: Santri) => void;
  onEditSantri: (s: Santri) => void; 
  onDeleteSantri: (s: Santri) => void; 
  isLoading?: boolean; 
  onAddSantri: (h: Halaqah) => void;
}

export function DaftarHalaqah({ 
  halaqahs, 
  onEdit, 
  onDelete, 
  onMoveSantri, 
  onEditSantri, 
  onDeleteSantri, 
  isLoading, 
  santriMap,
  onAddSantri
}: DaftarHalaqahProps) {

  const formatWhatsApp = (phone: string) => {
    let cleaned = phone.replace(/\D/g, "");
    
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    }
    
    return `https://wa.me/${cleaned}`;
  };
  
  if (isLoading) return <HalaqahLoadingSkeleton />;

  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {halaqahs.map((h) => {
        const daftarSantri = santriMap[h.id_halaqah] || [];

        return (
          <AccordionItem 
            key={h.id_halaqah} 
            value={h.id_halaqah.toString()} 
            className="border rounded-xl bg-card px-4 shadow-sm"
          >
            {/* Header Accordion tetap sama */}
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
                        {h.muhafiz?.username || "Tanpa Muhafiz"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
                        {h._count?.santri || 0} Santri
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="pt-0 pb-6">
              {/* Header Aksi Halaqah tetap sama */}
              <div className="flex justify-between items-center py-4 border-t border-dashed mb-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Daftar Anggota
                </h4>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuLabel>Aksi Halaqah</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onAddSantri(h)} className="cursor-pointer text-primary focus:text-primary">
                      <UserPlus className="mr-2 h-4 w-4" /> 
                      <span>Tambah Santri</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(h)} className="cursor-pointer">
                      <Edit2 className="mr-2 h-4 w-4" />
                      <span>Edit Data</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(h)} 
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Hapus Halaqah</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tabel Santri dengan Dropdown Menu Baru */}
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead>Nama Santri</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead className="text-right w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {daftarSantri.length > 0 ? (
                      daftarSantri.map((s) => (
                        <TableRow key={s.id_santri}>
                          <TableCell className="font-medium">{s.nama_santri}</TableCell>
                          <TableCell>
                            <a 
                              href={formatWhatsApp(s.nomor_telepon)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark hover:underline transition-all"
                            >
                              <FontAwesomeIcon icon="fa-brands fa-whatsapp" />
                              {s.nomor_telepon}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge variant={s.target === "INTENSE" ? "default" : "outline"}>
                              {s.target}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuLabel>Aksi Santri</DropdownMenuLabel>
                                <DropdownMenuSeparator />
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
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => onDeleteSantri(s)} 
                                  className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Hapus Santri</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 italic opacity-50">
                          Tidak ada santri di kelompok ini.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function HalaqahLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  );
}