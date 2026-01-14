import { type Halaqah } from "@/services/halaqahService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBook, 
  faEdit,
  faTrash,
  faUsers,
  faPlus,
  faEllipsisH,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";

interface DaftarHalaqahProps {
  halaqahList: Halaqah[];
  isLoading: boolean;
  onEditClick: (halaqah: Halaqah) => void;
  onDeleteClick: (halaqah: Halaqah) => void;
  onRefresh: () => void;
  onCreateClick: () => void;
}

export function DaftarHalaqah({ 
  halaqahList, 
  isLoading, 
  onEditClick, 
  onDeleteClick,
  onCreateClick
}: DaftarHalaqahProps) {
  
  if (isLoading) {
    return (
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nama Halaqah</TableHead>
              <TableHead>Muhafidz</TableHead>
              <TableHead>Total Santri</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (halaqahList.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FontAwesomeIcon icon={faBook} className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Belum ada halaqah</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Tambahkan unit halaqah baru untuk mulai mengelola santri.
        </p>
        <Button onClick={onCreateClick}>
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
          Tambah Halaqah Pertama
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[80px] font-bold">ID</TableHead>
            <TableHead className="font-bold">Nama Halaqah</TableHead>
            <TableHead className="font-bold">Muhafidz</TableHead>
            <TableHead className="font-bold">Total Santri</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-right font-bold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {halaqahList.map((halaqah) => (
            <TableRow key={halaqah.id_halaqah}>
              <TableCell>
                <Badge variant="outline" className="font-mono font-normal">
                  #{halaqah.id_halaqah}
                </Badge>
              </TableCell>
              
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBook} className="text-primary h-3 w-3" />
                  {halaqah.name_halaqah}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{halaqah.muhafiz.username}</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <FontAwesomeIcon icon={faEnvelope} className="h-2.5 w-2.5" />
                    {halaqah.muhafiz.email}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-normal">
                    <FontAwesomeIcon icon={faUsers} className="mr-1.5 h-2.5 w-2.5" />
                    {halaqah._count?.santri || 0} Santri
                  </Badge>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs">Aktif</span>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FontAwesomeIcon icon={faEllipsisH} className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Kelola Halaqah</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => onEditClick(halaqah)}>
                        <FontAwesomeIcon icon={faEdit} className="mr-2 h-3.5 w-3.5" />
                        <span>Edit Data</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDeleteClick(halaqah)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2 h-3.5 w-3.5" />
                        <span>Hapus Permanen</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}