import { type Muhafiz } from "@/services/akunService";
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
  faUserTie, 
  faEnvelope,
  faEdit,
  faTrash,
  faPlus,
  faSignInAlt,
  faEllipsisH
} from "@fortawesome/free-solid-svg-icons";

interface DaftarAkunProps {
  muhafizList: Muhafiz[];
  isLoading: boolean;
  onEditClick: (muhafiz: Muhafiz) => void;
  onDeleteClick: (muhafiz: Muhafiz) => void;
  onImpersonateClick: (muhafiz: Muhafiz) => void;
  onRefresh: () => void;
  onCreateClick: () => void;
}

export function DaftarAkun({ 
  muhafizList, 
  isLoading, 
  onEditClick, 
  onDeleteClick, 
  onImpersonateClick,
  onCreateClick
}: DaftarAkunProps) {
  
  if (isLoading) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
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
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in duration-500">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FontAwesomeIcon icon={faUserTie} className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Belum ada muhafidz</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Tambahkan akun pengampu halaqah baru ke sistem.
        </p>
        <Button onClick={onCreateClick}>
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
          Tambah Muhafidz Pertama
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
            <TableHead className="font-bold">Username</TableHead>
            <TableHead className="font-bold">Email</TableHead>
            <TableHead className="font-bold">Role</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-right font-bold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {muhafizList.map((muhafiz) => (
            <TableRow key={muhafiz.id_user}>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  #{muhafiz.id_user}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {muhafiz.username || "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xs text-muted-foreground" />
                  <span>{muhafiz.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize font-normal">
                  {muhafiz.role.toLowerCase()}
                </Badge>
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
                    <DropdownMenuLabel>Kelola Akun</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => onImpersonateClick(muhafiz)}>
                        <FontAwesomeIcon icon={faSignInAlt} className="mr-2 h-3 w-3" />
                        <span>Login Sebagai</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditClick(muhafiz)}>
                        <FontAwesomeIcon icon={faEdit} className="mr-2 h-3 w-3" />
                        <span>Edit Profil</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDeleteClick(muhafiz)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2 h-3 w-3" />
                        <span>Hapus Akun</span>
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