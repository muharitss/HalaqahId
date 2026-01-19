import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEdit, faTrash, faPhone } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

export function SantriTable({ data, searchTerm, isAdmin, halaqahList, onEdit, onDelete }: any) {
  
  const renderTargetBadge = (target: string) => {
    switch (target) {
      case "RINGAN":
        return <Badge variant="secondary" className="font-normal">RINGAN</Badge>;
      case "SEDANG":
        return <Badge variant="outline" className="font-normal">SEDANG</Badge>;
      case "INTENSE":
        return <Badge variant="default" className="font-normal">INTENS</Badge>;
      case "CUSTOM_KHUSUS":
        return <Badge variant="destructive" className="font-normal">KHUSUS</Badge>;
      default:
        return <Badge variant="outline" className="font-normal">{target}</Badge>;
    }
  };

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[80px] font-bold text-foreground">ID</TableHead>
            <TableHead className="font-bold text-foreground">Nama Santri</TableHead>
            <TableHead className="font-bold text-foreground">Nomor Telepon</TableHead>
            <TableHead className="font-bold text-foreground">Target</TableHead>
            {isAdmin && <TableHead className="font-bold text-foreground">Halaqah</TableHead>}
            <TableHead className="text-right font-bold text-foreground">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-muted-foreground">
                {searchTerm ? (
                  <p>Tidak ada santri yang sesuai dengan pencarian <span className="font-semibold">"{searchTerm}"</span></p>
                ) : (
                  <p>Belum ada data santri</p>
                )}
              </TableCell>
            </TableRow>
          ) : (
            data.map((santri: any) => (
              <TableRow key={santri.id_santri} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <Badge variant="outline" className="font-mono font-medium">
                    #{santri.id_santri}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {santri.nama_santri}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faPhone} className="text-[10px] text-muted-foreground" />
                    <span className="text-sm">{santri.nomor_telepon || "—"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {renderTargetBadge(santri.target)}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {halaqahList.find((h: any) => h.id_halaqah === santri.halaqah_id)?.name_halaqah || `Halaqah ${santri.halaqah_id}`}
                    </span>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FontAwesomeIcon icon={faEllipsisH} className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Opsi Santri</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => onEdit(santri)}>
                          <FontAwesomeIcon icon={faEdit} className="mr-2 h-3 w-3" /> 
                          <span>Edit Profil</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete(santri)} 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2 h-3 w-3" /> 
                          <span>Hapus Santri</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}