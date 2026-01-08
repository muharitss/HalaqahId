import { type Muhafiz } from "@/services/akunService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserTie, 
  faEnvelope,
  faEdit,
  faTrash,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DaftarAkunProps {
  muhafizList: Muhafiz[];
  isLoading: boolean;
  onEditClick: (muhafiz: Muhafiz) => void;
  onDeleteClick: (muhafiz: Muhafiz) => void;
  onRefresh: () => void;
  onCreateClick: () => void;
}

export function DaftarAkun({ 
  muhafizList, 
  isLoading, 
  onEditClick, 
  onDeleteClick, 
  onCreateClick
}: DaftarAkunProps) {
  
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (muhafizList.length === 0) {
    return (
      <div className="p-12 text-center">
        <FontAwesomeIcon icon={faUserTie} className="text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4" />
        <h4 className="font-medium dark:text-white mb-2">Belum ada muhafidz</h4>
        <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
          Mulai dengan menambahkan akun muhafidz baru
        </p>
        <Button onClick={onCreateClick}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Tambah Muhafidz Pertama
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-accent/30 dark:bg-background-dark/50 text-muted-foreground font-medium">
          <tr>
            <th className="px-6 py-4 text-left">ID</th>
            <th className="px-6 py-4 text-left">Username</th>
            <th className="px-6 py-4 text-left">Email</th>
            <th className="px-6 py-4 text-left">Role</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border dark:divide-border-dark">
          {muhafizList.map((muhafiz) => (
            <tr key={muhafiz.id_user} className="hover:bg-accent/5 dark:hover:bg-background-dark/30 transition-colors">
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  #{muhafiz.id_user}
                </span>
              </td>
              <td className="px-6 py-4 dark:text-text-secondary-dark">
                {muhafiz.username || "Belum diisi"}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-sm text-text-secondary-light dark:text-text-secondary-dark" />
                  <span className="font-medium dark:text-white">{muhafiz.email}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                  {muhafiz.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300">
                  Aktif
                </span>
              </td>
              <td className="px-6 py-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => onEditClick(muhafiz)}>
                            <FontAwesomeIcon icon={faEdit} className="mr-2 h-3 w-3" />
                            <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                            onClick={() => onDeleteClick(muhafiz)}
                            className="text-destructive focus:text-destructive"
                            >
                            <FontAwesomeIcon icon={faTrash} className="mr-2 h-3 w-3" />
                            <span>Hapus</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}