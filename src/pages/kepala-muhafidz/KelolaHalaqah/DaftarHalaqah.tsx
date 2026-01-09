import { type Halaqah } from "@/services/halaqahService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBook, 
  faUserTie,
  faUsers,
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

  if (halaqahList.length === 0) {
    return (
      <div className="p-12 text-center">
        <FontAwesomeIcon icon={faBook} className="text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-4" />
        <h4 className="font-medium dark:text-white mb-2">Belum ada halaqah</h4>
        <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
          Mulai dengan membuat halaqah pertama
        </p>
        <Button onClick={onCreateClick}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Buat Halaqah Pertama
        </Button>
      </div>
    );
  }

  // Fungsi untuk menentukan warna berdasarkan jenis halaqah
  const getJenisColor = (jenis: string) => {
    switch (jenis) {
      case "BACAAN": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "HAFALAN": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "KHUSUS": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-accent/30 dark:bg-background-dark/50 text-muted-foreground font-medium">
          <tr>
            <th className="px-6 py-4 text-left">ID</th>
            <th className="px-6 py-4 text-left">Nama Halaqah</th>
            <th className="px-6 py-4 text-left">Jenis</th>
            <th className="px-6 py-4 text-left">Muhafidz</th>
            <th className="px-6 py-4 text-left">Jml. Santri</th>
            <th className="px-6 py-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border dark:divide-border-dark">
          {halaqahList.map((halaqah) => (
            <tr key={halaqah.id_halaqah} className="hover:bg-accent/5 dark:hover:bg-background-dark/30 transition-colors">
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  #{halaqah.id_halaqah}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBook} className="text-sm text-text-secondary-light dark:text-text-secondary-dark" />
                  <span className="font-medium dark:text-white">{halaqah.nama_halaqah}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getJenisColor(halaqah.jenis)}`}>
                  {halaqah.jenis}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserTie} className="text-sm text-text-secondary-light dark:text-text-secondary-dark" />
                  <div>
                    <p className="font-medium dark:text-white">{halaqah.muhafidz.username}</p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{halaqah.muhafidz.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-sm text-text-secondary-light dark:text-text-secondary-dark" />
                  <span className="font-medium dark:text-white">{halaqah.jumlah_santri || 0}</span>
                </div>
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
                      <DropdownMenuItem onClick={() => onEditClick(halaqah)}>
                        <FontAwesomeIcon icon={faEdit} className="mr-2 h-3 w-3" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteClick(halaqah)}
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