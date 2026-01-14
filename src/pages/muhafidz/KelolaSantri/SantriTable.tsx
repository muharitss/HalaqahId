import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import shadcn table
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserGraduate, 
  faEdit, 
  faTrash, 
  faUsers, 
  faPlus 
} from "@fortawesome/free-solid-svg-icons";

interface Santri {
  id_santri: number;
  nama: string;
  target: "RINGAN" | "SEDANG" | "INTENS" | "CUSTOM_KHUSUS";
  halaqah_id: number;
}

interface SantriTableProps {
  data: Santri[];
  totalData: number;
  searchTerm: string;
  onEdit: (s: Santri) => void;
  onDelete: (s: Santri) => void;
  onAddClick: () => void;
}

export function SantriTable({ 
  data, 
  totalData, 
  searchTerm, 
  onEdit, 
  onDelete, 
  onAddClick 
}: SantriTableProps) {
  
  const getTargetColor = (target: string) => {
    const colors: Record<string, string> = {
      RINGAN: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      SEDANG: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      INTENS: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      CUSTOM_KHUSUS: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    };
    return colors[target] || "bg-gray-100 text-gray-700";
  };

  if (data.length === 0) {
    return (
      <div className="p-12 text-center border rounded-xl bg-card">
        <FontAwesomeIcon icon={faUsers} className="text-5xl text-muted-foreground mb-4" />
        <h4 className="font-medium mb-2 dark:text-white">Tidak ada santri</h4>
        <p className="text-text-secondary mb-4">
          {searchTerm ? "Santri tidak ditemukan" : "Mulai dengan menambahkan santri"}
        </p>
        <Button onClick={onAddClick}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> 
          Tambah Santri Pertama
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="font-semibold text-lg dark:text-white">Daftar Santri</h3>
        <p className="text-sm text-muted-foreground">
          Menampilkan {data.length} dari {totalData} santri
        </p>
      </div>
      
      {/* Menggunakan Shadcn Table */}
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px] pl-6">ID</TableHead>
            <TableHead>Nama Santri</TableHead>
            <TableHead>Target</TableHead>
            <TableHead className="text-right pr-6">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((santri) => (
            <TableRow key={santri.id_santri} className="group">
              <TableCell className="pl-6 font-medium text-primary">
                #{santri.id_santri}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FontAwesomeIcon icon={faUserGraduate} className="text-primary text-xs" />
                  </div>
                  <span className="font-medium dark:text-white">{santri.nama}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTargetColor(santri.target)}`}>
                  {santri.target.replace('_', ' ')}
                </span>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(santri)}
                    className="h-8 hover:bg-primary/10 hover:text-primary"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(santri)}
                    className="h-8 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2 h-3 w-3" />
                    Hapus
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}