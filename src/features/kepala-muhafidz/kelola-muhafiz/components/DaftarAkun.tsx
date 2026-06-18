import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserTie, 
  faEnvelope,
  faEdit,
  faTrash,
  faPlus,
  faSignInAlt,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import type { MuhafizTableProps, AbsensiStatus } from "../types";

export function DaftarAkun({ 
  muhafizList, 
  isLoading, 
  onEditClick, 
  onDeleteClick, 
  onImpersonateClick,
  onCreateClick,
}: MuhafizTableProps & { 
  activeMuhafizIds?: Set<number>;
  onAbsenMuhafiz: (userId: number, status: AbsensiStatus) => void;
}) {
  
  if (isLoading) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-20">Muhafiz</TableHead>
              <TableHead>Halaqah</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (muhafizList.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in duration-500">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FontAwesomeIcon icon={faUserTie} className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight">Belum ada muhafidz</h2>
        <p className="mb-6 mt-2 text-sm md:text-base text-muted-foreground max-w-sm mx-auto">
          Daftar pengampu halaqah akan muncul di sini setelah Anda menambahkannya melalui tombol di atas atau tombol di bawah ini.
        </p>
        <Button onClick={onCreateClick}>
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
          Tambah Muhafidz
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-bold text-xs md:text-sm py-4">Informasi Muhafidz</TableHead>
            <TableHead className="text-right font-bold text-xs md:text-sm py-4 pr-10">Halaqah</TableHead>
            <TableHead className="text-right font-bold text-xs md:text-sm py-4 pr-4">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {muhafizList.map((muhafiz) => {            
            return (
              <TableRow key={muhafiz.id_user} className="hover:bg-muted/10 transition-colors group">
                <TableCell className="py-5">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm md:text-base tracking-tight leading-none">
                      {muhafiz.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
                      <FontAwesomeIcon icon={faEnvelope} className="text-[10px] opacity-70" />
                      <span>{muhafiz.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right py-5">
                  <div className="flex flex-col items-end pr-4">
                    {muhafiz.halaqah ? (
                      <div className="text-primary text-xs md:text-sm font-bold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {muhafiz.halaqah.name_halaqah}
                      </div>
                    ) : (
                      <div className="text-destructive text-xs md:text-sm font-semibold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                        Belum Ada
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted group-hover:bg-muted/80">
                        <FontAwesomeIcon icon={faEllipsisH} className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2">

                      {/* --- SECTION KELOLA AKUN --- */}
                      <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider px-2 py-1.5">
                        Kelola Akun
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => onImpersonateClick(muhafiz)} className="cursor-pointer">
                          <FontAwesomeIcon icon={faSignInAlt} className="mr-3 h-3.5 w-3.5 text-primary" />
                          <span className="text-sm">Login Sebagai</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditClick(muhafiz)} className="cursor-pointer">
                          <FontAwesomeIcon icon={faEdit} className="mr-3 h-3.5 w-3.5 text-primary" />
                          <span className="text-sm">Edit Profil</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDeleteClick(muhafiz)}
                        className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-3 h-3.5 w-3.5" />
                        <span className="text-sm">Hapus Akun</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}