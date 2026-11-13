import { useState, useMemo, useEffect } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  Search,
  MoreVertical,
  ArrowRightLeft,
  Edit2,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermissionGate } from "@/components/ui/PermissionGate";
import { Term } from "@/components/ui/Term";
import { useTerminology } from "@/hooks/useTerminology";
import { RoleBadge } from "@/features/halaqah/components";
import type { Halaqah, Santri } from "@/features/halaqah/types";

export interface SantriListPanelProps {
  selectedHalaqah: Halaqah | null;
  santriList: Santri[];
  onAddSantri: (halaqah: Halaqah) => void;
  onManageMuhafiz?: (halaqah: Halaqah) => void;
  onMoveSantri: (santri: Santri) => void;
  onEditSantri: (santri: Santri) => void;
  onDeleteSantri: (santri: Santri) => void;
}

const PAGE_SIZE = 10;

function formatWhatsApp(phone: string | null | undefined): string {
  if (!phone) return "#";
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  return `https://wa.me/${cleaned}`;
}

export function SantriListPanel({
  selectedHalaqah,
  santriList,
  onAddSantri,
  onManageMuhafiz,
  onMoveSantri,
  onEditSantri,
  onDeleteSantri,
}: SantriListPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const labelSantri = useTerminology("SANTRI");
  const labelHalaqah = useTerminology("HALAQAH");

  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
  }, [selectedHalaqah?.id_halaqah]);

  const filteredSantri = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return santriList;
    return santriList.filter((s) => {
      const nameMatch = s.nama_santri.toLowerCase().includes(term);
      const phoneMatch = (s.nomor_telepon || "").includes(term);
      const targetMatch = (s.target?.nama_target || "").toLowerCase().includes(term);
      return nameMatch || phoneMatch || targetMatch;
    });
  }, [santriList, searchTerm]);

  const totalPages = Math.ceil(filteredSantri.length / PAGE_SIZE);
  const displayedSantri = showAll
    ? filteredSantri
    : filteredSantri.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (!selectedHalaqah) {
    return (
      <Card className="flex min-h-[380px] flex-col items-center justify-center border-dashed text-center p-8">
        <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <h4 className="font-semibold text-base">Tidak Ada {labelHalaqah} yang Dipilih</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Pilih salah satu {labelHalaqah.toLowerCase()} dari daftar di sebelah kiri untuk melihat dan mengelola daftar {labelSantri.toLowerCase()}.
        </p>
      </Card>
    );
  }

  const muhafizList = (selectedHalaqah.muhafiz_list && selectedHalaqah.muhafiz_list.length > 0)
    ? selectedHalaqah.muhafiz_list
    : selectedHalaqah.muhafiz?.name
      ? [{ id_user: selectedHalaqah.muhafiz.id_user, name: selectedHalaqah.muhafiz.name, peran: "UTAMA" as const }]
      : [];

  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold">
                {selectedHalaqah.name_halaqah}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {santriList.length} {labelSantri}
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2 mt-1.5 flex-wrap text-xs">
              <span>Pengampu:</span>
              {muhafizList.length > 0 ? (
                muhafizList.map((m, idx) => (
                  <span key={m.id_user || idx} className="inline-flex items-center gap-1 font-medium text-foreground">
                    {m.name}
                    <RoleBadge role={m.peran || "UTAMA"} />
                  </span>
                ))
              ) : (
                <span className="italic text-muted-foreground">Belum ada muhafiz penanggung jawab</span>
              )}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onManageMuhafiz && (
              <PermissionGate permission="halaqah.update">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onManageMuhafiz(selectedHalaqah)}
                  className="h-8 text-xs gap-1.5"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  Kelola <Term code="MUHAFIZ" />
                </Button>
              </PermissionGate>
            )}
            <PermissionGate permission="santri.create">
              <Button
                size="sm"
                onClick={() => onAddSantri(selectedHalaqah)}
                className="h-8 text-xs gap-1.5"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Tambah <Term code="SANTRI" />
              </Button>
            </PermissionGate>
          </div>
        </div>

        {santriList.length > 5 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={`Cari nama ${labelSantri.toLowerCase()} atau nomor telepon...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 h-8 text-xs bg-muted/20"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-center text-xs font-semibold">No</TableHead>
              <TableHead className="text-xs font-semibold">Nama {labelSantri}</TableHead>
              <TableHead className="text-xs font-semibold">Kontak</TableHead>
              <TableHead className="text-xs font-semibold">Target</TableHead>
              <TableHead className="text-right text-xs font-semibold w-20">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedSantri.length > 0 ? (
              displayedSantri.map((s, index) => {
                const rowNumber = showAll ? index + 1 : (currentPage - 1) * PAGE_SIZE + index + 1;
                return (
                  <TableRow key={s.id_santri}>
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {rowNumber}
                    </TableCell>
                    <TableCell className="font-medium text-xs sm:text-sm">
                      {s.nama_santri}
                    </TableCell>
                    <TableCell className="text-xs">
                      {s.nomor_telepon ? (
                        <a
                          href={formatWhatsApp(s.nomor_telepon)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary hover:underline"
                        >
                          <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{s.nomor_telepon}</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground italic">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {s.target ? (
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-900/50 text-[11px]"
                        >
                          {s.target.nama_target}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground font-normal text-[11px]">
                          Bebas
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel>Aksi {labelSantri}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <PermissionGate permission="santri.update">
                            <DropdownMenuItem
                              onClick={() => onMoveSantri(s)}
                              className="cursor-pointer text-blue-600 focus:text-blue-600"
                            >
                              <ArrowRightLeft className="mr-2 h-3.5 w-3.5" />
                              <span>Pindah {labelHalaqah}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onEditSantri(s)}
                              className="cursor-pointer"
                            >
                              <Edit2 className="mr-2 h-3.5 w-3.5" />
                              <span>Edit Profil</span>
                            </DropdownMenuItem>
                          </PermissionGate>
                          <PermissionGate permission="santri.delete">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDeleteSantri(s)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              <span>Hapus {labelSantri}</span>
                            </DropdownMenuItem>
                          </PermissionGate>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-xs text-muted-foreground italic">
                      {searchTerm
                        ? `Tidak ada ${labelSantri.toLowerCase()} yang sesuai dengan pencarian "${searchTerm}".`
                        : `Belum ada ${labelSantri.toLowerCase()} di ${labelHalaqah.toLowerCase()} ini.`}
                    </p>
                    {!searchTerm && (
                      <PermissionGate permission="santri.create">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddSantri(selectedHalaqah)}
                          className="h-7 text-xs gap-1 mt-2"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Tambah {labelSantri} Sekarang
                        </Button>
                      </PermissionGate>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {santriList.length > PAGE_SIZE && (
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t bg-muted/5">
          <div className="text-xs text-muted-foreground">
            {showAll ? (
              <span>
                Menampilkan semua <strong>{filteredSantri.length}</strong> {labelSantri.toLowerCase()}
              </span>
            ) : (
              <span>
                Menampilkan <strong>{Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredSantri.length)}</strong> -{" "}
                <strong>{Math.min(currentPage * PAGE_SIZE, filteredSantri.length)}</strong> dari{" "}
                <strong>{filteredSantri.length}</strong> {labelSantri.toLowerCase()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => {
                setShowAll(!showAll);
                setCurrentPage(1);
              }}
            >
              {showAll ? `Batasi ${PAGE_SIZE} per Halaman` : "Tampilkan Semua"}
            </Button>

            {!showAll && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Sebelumnya
                </Button>
                <span className="text-xs text-muted-foreground min-w-[35px] text-center">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}